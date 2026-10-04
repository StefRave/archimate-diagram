import { readFileSync } from 'fs';
import { join } from 'path';
import { ChangeAction, IDiagramChange } from './diagram-change';
import { ConnectionRequest, DiagramEditor } from './diagram-editor';
import { DiagramRenderer } from './diagram-renderer';
import { DiagramTemplate } from './diagram-template';
import { ArchiDiagram, ArchiDiagramChild, ArchiEntity, ArchimateProject, ArchimateProjectStorage, ElementBounds, Relationship } from './archimate-model';

function readRepoFile(name: string): ArrayBuffer {
  const buffer = readFileSync(join(__dirname, name));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function box(child: ArchiDiagramChild): [number, number, number, number] {
  return [child.bounds.x, child.bounds.y, child.bounds.width, child.bounds.height];
}

function nameText(group: Element): string {
  return group.querySelector(':scope>foreignObject>div>div')?.textContent;
}

function pointer(
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  target: Element,
  x: number,
  y: number,
  ctrlKey = false,
) {
  target.dispatchEvent(new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    ctrlKey,
  }));
}

function chord(target: Element, key: string) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey: true, bubbles: true }));
}

async function reload(project: ArchimateProject): Promise<ArchimateProject> {
  const xml = new XMLSerializer().serializeToString(project.element.ownerDocument);
  return ArchimateProjectStorage.GetProjectFromArrayBuffer(new TextEncoder().encode(xml));
}

function mount(project: ArchimateProject, diagramId = '3761') {
  const diagram = project.diagrams.find(d => d.id === diagramId);
  const renderer = new DiagramRenderer(project, diagram, DiagramTemplate.getFromDrawing());
  const svg = renderer.buildSvg().firstChild as SVGSVGElement;
  document.body.appendChild(svg);
  const editor = new DiagramEditor(svg, project, diagram, renderer);
  editor.makeDraggable();
  return { diagram, svg, editor };
}

describe('diagram editor gestures', () => {
  let project: ArchimateProject;
  let diagram: ArchiDiagram;
  let svg: SVGSVGElement;
  let editor: DiagramEditor;

  beforeEach(async () => {
    project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(readRepoFile('Archisurance.archimate'));
    ({ diagram, svg, editor } = mount(project));
  });

  afterEach(() => {
    editor.dispose();
    svg.remove();
  });

  it('moves Customer on the grid and clears the position readout', async () => {
    const customer = diagram.getDiagramObjectById('3788') as ArchiDiagramChild;
    expect(box(customer)).toEqual([200, 663, 120, 60]);

    const group = svg.getElementById('3788');
    pointer('pointerdown', group, 200, 663);
    pointer('pointermove', group, 236, 680);

    const dragging = svg.getElementById('3788');
    expect(dragging.classList.contains('dragging')).toBe(true);
    expect(svg.querySelector('#editInfo text').textContent).toBe('240, 684');

    pointer('pointerup', dragging, 236, 680);

    expect(box(customer)).toEqual([240, 684, 120, 60]);
    expect(customer.parent).toBeNull();
    expect(svg.getElementById('3788').getAttribute('transform')).toBe('translate(240, 684)');
    expect(nameText(svg.getElementById('3788'))).toBe('Customer');
    expect(svg.querySelector('#editInfo')).toBeNull();

    const reloaded = (await reload(project)).diagrams.find(d => d.id === '3761');
    const saved = reloaded.getDiagramObjectById('3788') as ArchiDiagramChild;
    expect(box(saved)).toEqual([240, 684, 120, 60]);
    expect(saved.parent).toBeNull();
  });

  it('lifts Register onto the diagram and undo nests it again', async () => {
    const register = diagram.getDiagramObjectById('3779') as ArchiDiagramChild;
    expect([register.AbsolutePosition.x, register.AbsolutePosition.y]).toEqual([190, 174]);
    expect(box(register)).toEqual([20, 20, 120, 60]);
    expect(register.parent.id).toBe('3776');

    const group = svg.getElementById('3779');
    pointer('pointerdown', group, 190, 174);
    pointer('pointermove', group, 220, 192);
    pointer('pointerup', svg.getElementById('3779'), 220, 192);

    expect(register.parent).toBeNull();
    expect(box(register)).toEqual([216, 192, 120, 60]);
    expect(svg.getElementById('3779').parentElement).toBe(svg.getElementById('3761'));
    expect(svg.getElementById('3779').getAttribute('transform')).toBe('translate(216, 192)');

    const lifted = (await reload(project)).diagrams.find(d => d.id === '3761');
    const liftedRegister = lifted.getDiagramObjectById('3779') as ArchiDiagramChild;
    expect(liftedRegister.parent).toBeNull();
    expect(box(liftedRegister)).toEqual([216, 192, 120, 60]);

    chord(svg.getElementById('3779'), 'z');

    expect(register.parent.id).toBe('3776');
    expect(box(register)).toEqual([20, 20, 120, 60]);
    expect(svg.getElementById('3779').getAttribute('transform')).toBe('translate(20, 20)');
    expect(svg.getElementById('3779').parentElement).toBe(svg.getElementById('3776'));

    const restored = (await reload(project)).diagrams.find(d => d.id === '3761');
    const nested = restored.getDiagramObjectById('3779') as ArchiDiagramChild;
    expect(nested.parent.id).toBe('3776');
    expect(box(nested)).toEqual([20, 20, 120, 60]);
  });

  it('resizes Customer from the east handle and floors the width at 12', async () => {
    const customer = diagram.getDiagramObjectById('3788') as ArchiDiagramChild;
    const group = svg.getElementById('3788');
    pointer('pointerdown', group, 200, 663);
    pointer('pointerup', group, 200, 663);

    const east = svg.querySelector('g.selection[data-element-id="3788"] circle.re');
    expect(east).not.toBeNull();
    pointer('pointerdown', east, 400, 700);
    // pointerdown rebuilds the selection, so later events go to the new circle.
    const handle = svg.querySelector('g.selection[data-element-id="3788"] circle.re');
    pointer('pointermove', handle, 436, 700, true);

    expect(box(customer)).toEqual([200, 663, 156, 60]);
    const widened = svg.getElementById('3788');
    expect(widened.getAttribute('transform')).toBe('translate(200, 663)');
    expect(widened.querySelector('rect').getAttribute('width')).toBe('156');
    expect(widened.querySelector('rect').getAttribute('height')).toBe('60');

    pointer('pointermove', handle, 200, 700, true);
    pointer('pointerup', handle, 200, 700, true);

    expect(box(customer)).toEqual([200, 663, 12, 60]);
    const narrowed = svg.getElementById('3788');
    expect(narrowed.getAttribute('transform')).toBe('translate(200, 663)');
    expect(narrowed.querySelector('rect').getAttribute('width')).toBe('12');
    expect(narrowed.querySelector('rect').getAttribute('height')).toBe('60');

    const saved = (await reload(project)).diagrams.find(d => d.id === '3761').getDiagramObjectById('3788') as ArchiDiagramChild;
    expect(box(saved)).toEqual([200, 663, 12, 60]);
  });

  it('inserts a bend on connection 3812 and undo restores the single point', async () => {
    const customer = diagram.getDiagramObjectById('3788') as ArchiDiagramChild;
    const connection = customer.sourceConnections.find(c => c.id === '3812');
    expect(connection.bendPoints.map(p => [p.x, p.y])).toEqual([[-180, -1]]);

    const midpoint = Array.from(svg.getElementById('3812').querySelectorAll('circle'))
      .find(circle => !circle.classList.contains('end'));
    expect(midpoint).toBeTruthy();
    pointer('pointerdown', midpoint, 140, 692);
    pointer('pointermove', midpoint, 140, 640);
    pointer('pointerup', svg, 140, 640);

    expect(connection.bendPoints.map(p => [p.x, p.y])).toEqual([[-116, -57], [-180, -1]]);
    const savedBend = (await reload(project)).diagrams.find(d => d.id === '3761')
      .getDiagramObjectById('3788') as ArchiDiagramChild;
    expect(savedBend.sourceConnections.find(c => c.id === '3812').bendPoints.map(p => [p.x, p.y]))
      .toEqual([[-116, -57], [-180, -1]]);
    expect(connection.source.id).toBe('3788');
    expect(connection.targetId).toBe('3783');
    const line = svg.getElementById('3812');
    expect(line).not.toBeNull();
    expect(diagram.getDiagramObjectById('3812')).toBe(connection);
    expect(line.querySelector('path').getAttribute('d')).not.toBe('');

    chord(svg.getElementById('3788'), 'z');
    expect(connection.bendPoints.map(p => [p.x, p.y])).toEqual([[-180, -1]]);
    const undone = (await reload(project)).diagrams.find(d => d.id === '3761')
      .getDiagramObjectById('3788') as ArchiDiagramChild;
    expect(undone.sourceConnections.find(c => c.id === '3812').bendPoints.map(p => [p.x, p.y]))
      .toEqual([[-180, -1]]);
  });

  it('renames Customer from a double-click and undoes and redoes the name', async () => {
    jest.useFakeTimers();
    try {
      const customer = diagram.getDiagramObjectById('3788') as ArchiDiagramChild;
      let group = svg.getElementById('3788');
      pointer('pointerdown', group, 200, 663);
      pointer('pointerup', group, 200, 663);
      group = svg.getElementById('3788');
      pointer('pointerdown', group, 200, 663);
      pointer('pointerup', group, 200, 663);
      expect(box(customer)).toEqual([200, 663, 120, 60]);

      jest.runOnlyPendingTimers();

      const label = svg.getElementById('3788').querySelector(':scope>foreignObject>div>div') as HTMLElement;
      label.textContent = 'Client';
      svg.dispatchEvent(new Event('input', { bubbles: true }));
      expect(project.getById('521').name).toBe('Client');

      const previous = svg.getElementById('3788');
      label.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));

      expect(previous.isConnected).toBe(false);
      expect(nameText(svg.getElementById('3788'))).toBe('Client');
      expect(box(customer)).toEqual([200, 663, 120, 60]);
      expect((await reload(project)).getById('521').name).toBe('Client');

      chord(svg.getElementById('3788'), 'z');
      expect(project.getById('521').name).toBe('Customer');
      expect(nameText(svg.getElementById('3788'))).toBe('Customer');

      expect((await reload(project)).getById('521').name).toBe('Customer');

      chord(svg.getElementById('3788'), 'y');
      expect(project.getById('521').name).toBe('Client');
      expect(nameText(svg.getElementById('3788'))).toBe('Client');
      expect(box(customer)).toEqual([200, 663, 120, 60]);
      expect((await reload(project)).getById('521').name).toBe('Client');
    } finally {
      jest.useRealTimers();
    }
  });

  it('adds a Business Actor at the pointer and undo and redo that placement', async () => {
    const entity = new ArchiEntity();
    entity.id = 'id-entity-test';
    entity.name = 'Business Actor';
    entity.entityType = 'archimate:BusinessActor';

    const element = new ArchiDiagramChild();
    element.id = 'id-element-test';
    element.entityType = 'archimate:DiagramObject';
    element.entityId = entity.id;
    element.children = [];
    element.sourceConnections = [];
    element.bounds = new ElementBounds(120, 120, 168, 60);

    editor.finalizeAction({
      action: ChangeAction.AddRemoveElement,
      diagramId: '3761',
      addRemoveElement: {
        adding: true,
        entity,
        element,
      },
    } as IDiagramChange);
    editor.startDragging('id-element-test', { x: 204, y: 150 }, true);

    const placed = svg.getElementById('id-element-test');
    pointer('pointermove', placed, 240, 186);
    pointer('pointerup', svg.getElementById('id-element-test'), 240, 186);

    const added = diagram.getDiagramObjectById('id-element-test') as ArchiDiagramChild;
    expect(box(added)).toEqual([156, 156, 168, 60]);
    expect(svg.getElementById('id-element-test').getAttribute('transform')).toBe('translate(156, 156)');
    expect(nameText(svg.getElementById('id-element-test'))).toBe('Business Actor');
    expect(project.getById('id-entity-test')).toBeTruthy();
    const placedProject = await reload(project);
    const placedDiagram = placedProject.diagrams.find(d => d.id === '3761');
    expect(box(placedDiagram.getDiagramObjectById('id-element-test') as ArchiDiagramChild)).toEqual([156, 156, 168, 60]);
    expect(placedProject.getById('id-entity-test').name).toBe('Business Actor');

    chord(svg.getElementById('3788'), 'z');
    expect(svg.getElementById('id-element-test')).toBeNull();
    expect(project.getById('id-entity-test')).toBeUndefined();
    const removed = await reload(project);
    expect(removed.diagrams.find(d => d.id === '3761').getDiagramObjectById('id-element-test')).toBeUndefined();
    expect(removed.getById('id-entity-test')).toBeUndefined();

    chord(svg.getElementById('3788'), 'y');
    const restored = diagram.getDiagramObjectById('id-element-test') as ArchiDiagramChild;
    expect(box(restored)).toEqual([156, 156, 168, 60]);
    expect(svg.getElementById('id-element-test').getAttribute('transform')).toBe('translate(156, 156)');
    expect(project.getById('id-entity-test')).toBeTruthy();
    const redone = await reload(project);
    expect(box(redone.diagrams.find(d => d.id === '3761').getDiagramObjectById('id-element-test') as ArchiDiagramChild))
      .toEqual([156, 156, 168, 60]);
    expect(redone.getById('id-entity-test').name).toBe('Business Actor');
  });

  it('adds a Serving relationship from Customer to Handle Claim as one undoable change', async () => {
    editor.createConnection('3788', '3776', 'ServingRelationship', {
      relationshipId: 'id-rel-test',
      connectionId: 'id-con-test',
    });

    const relationship = project.getById('id-rel-test') as Relationship;
    expect(relationship).toBeInstanceOf(Relationship);
    expect(relationship.entityType).toBe('ServingRelationship');
    expect(relationship.source).toBe('521');
    expect(relationship.target).toBe('556');
    expect(project.relationships.toArray()).toContain(relationship);

    const connection = diagram.getDiagramObjectById('id-con-test') as ArchiDiagramChild['sourceConnections'][number];
    expect(connection.source.id).toBe('3788');
    expect(connection.targetId).toBe('3776');
    const svgConnection = svg.getElementById('id-con-test');
    expect(svgConnection.classList.contains('con')).toBe(true);
    expect(svgConnection.getAttribute('data-rel')).toBe('id-rel-test');
    expect(svgConnection.querySelector('path').getAttribute('class')).toBe('Serving Relationship');

    const reloaded = await reload(project);
    const savedRelationship = reloaded.getById('id-rel-test') as Relationship;
    expect(savedRelationship.source).toBe('521');
    expect(savedRelationship.target).toBe('556');
    expect(savedRelationship.element.closest('folder[type="relations"]')).not.toBeNull();
    const savedDiagram = reloaded.diagrams.find(d => d.id === '3761');
    const savedSource = savedDiagram.getDiagramObjectById('3788') as ArchiDiagramChild;
    expect(savedSource.sourceConnections.find(c => c.id === 'id-con-test').relationShipId).toBe('id-rel-test');
    const savedTarget = savedDiagram.getDiagramObjectById('3776') as ArchiDiagramChild;
    expect(savedTarget.element.getAttribute('targetConnections').split(/\s+/)).toContain('id-con-test');

    chord(svg, 'z');

    expect(project.getById('id-rel-test')).toBeUndefined();
    expect(diagram.getDiagramObjectById('id-con-test')).toBeUndefined();
    expect(svg.getElementById('id-con-test')).toBeNull();
    expect(diagram.getDiagramObjectById('3812')).toBeTruthy();
    const undone = await reload(project);
    expect(undone.getById('id-rel-test')).toBeUndefined();
    expect(undone.diagrams.find(d => d.id === '3761').getDiagramObjectById('id-con-test')).toBeUndefined();
    expect((undone.diagrams.find(d => d.id === '3761').getDiagramObjectById('3776') as ArchiDiagramChild)
      .element.hasAttribute('targetConnections')).toBe(false);

    chord(svg, 'y');

    expect(project.getById('id-rel-test')).toBeTruthy();
    expect(diagram.getDiagramObjectById('id-con-test')).toBeTruthy();
    expect(svg.getElementById('id-con-test')).toBeTruthy();
    const redone = await reload(project);
    expect(redone.getById('id-rel-test')).toBeTruthy();
    expect(redone.diagrams.find(d => d.id === '3761').getDiagramObjectById('id-con-test')).toBeTruthy();
  });

  it('preserves other target connections when adding and undoing a relationship', async () => {
    const customer = diagram.getDiagramObjectById('3788') as ArchiDiagramChild;
    const originalTargetConnections = customer.element.getAttribute('targetConnections').split(/\s+/);
    editor.createConnection('3785', '3788', 'AssociationRelationship', {
      relationshipId: 'id-association-rel',
      connectionId: 'id-association-con',
    });

    expect(customer.element.getAttribute('targetConnections').split(/\s+/))
      .toEqual([...originalTargetConnections, 'id-association-con']);
    chord(svg, 'z');
    expect(customer.element.getAttribute('targetConnections').split(/\s+/)).toEqual(originalTargetConnections);
    const undone = await reload(project);
    expect((undone.diagrams.find(d => d.id === '3761').getDiagramObjectById('3788') as ArchiDiagramChild)
      .element.getAttribute('targetConnections').split(/\s+/)).toEqual(originalTargetConnections);
  });

  it('shows the connector handle next to a hovered element and hides it away from it', () => {
    pointer('pointermove', svg.getElementById('3788'), 260, 693);
    expect(svg.querySelector('g.connectorHandle[data-element-id="3788"]').getAttribute('transform'))
      .toBe('translate(330, 693)');

    pointer('pointermove', svg, 1000, 20);
    expect(svg.querySelector('g.connectorHandle')).toBeNull();
  });

  it('keeps the connector handle on the selected element', () => {
    const customer = svg.getElementById('3788');
    pointer('pointerdown', customer, 200, 663);
    pointer('pointerup', customer, 200, 663);
    pointer('pointermove', svg, 1000, 20);

    expect(svg.querySelector('g.connectorHandle[data-element-id="3788"]')).not.toBeNull();
  });

  it('does not show a handle for a group without a concept', () => {
    const other = mount(project, '4056');
    try {
      pointer('pointermove', other.svg.getElementById('4096'), 30, 520);
      expect(other.svg.querySelector('g.connectorHandle')).toBeNull();
    } finally {
      other.editor.dispose();
      other.svg.remove();
    }
  });

  it('offers the allowed types when Customer is dropped on Handle Claim and changes nothing yet', () => {
    const requests: (ConnectionRequest | null)[] = [];
    editor.onConnectionRequest = request => requests.push(request);
    const customer = diagram.getDiagramObjectById('3788') as ArchiDiagramChild;
    const initialConnectionIds = customer.sourceConnections.map(connection => connection.id);
    const initialRelationshipCount = project.relationships.toArray().length;
    const handle = (source = '3788') => svg.querySelector(`g.connectorHandle[data-element-id="${source}"] circle`);
    const beginConnectionDrag = () => {
      pointer('pointermove', svg.getElementById('3788'), 260, 693);
      pointer('pointerdown', handle(), 330, 693);
    };
    const moveConnectionToHandleClaim = () => {
      pointer('pointermove', svg.getElementById('3776'), 500, 199);
    };
    const releaseConnectionOnHandleClaim = () => {
      pointer('pointerup', svg.getElementById('3776'), 500, 199);
    };

    beginConnectionDrag();
    moveConnectionToHandleClaim();
    expect(svg.querySelector('g.connectPreview path').getAttribute('class')).toBe('Relationship pending');
    expect(svg.getElementById('3776').classList.contains('connectTarget')).toBe(true);
    releaseConnectionOnHandleClaim();

    const request = requests[0] as ConnectionRequest;
    expect(request).toMatchObject({
      sourceId: '3788',
      targetId: '3776',
      sourceName: 'Customer',
      targetName: 'Handle Claim',
      relationshipTypes: [
        'AssignmentRelationship',
        'ServingRelationship',
        'AssociationRelationship',
        'TriggeringRelationship',
        'FlowRelationship',
      ],
    });
    expect(Number.isFinite(request.clientX)).toBe(true);
    expect(Number.isFinite(request.clientY)).toBe(true);
    expect(svg.getElementById('3776').classList.contains('connectTarget')).toBe(false);
    expect(project.relationships.toArray()).toHaveLength(initialRelationshipCount);
    expect(customer.sourceConnections.map(connection => connection.id)).toEqual(initialConnectionIds);

    chord(svg, 'z');
    expect(requests[1]).toBeNull();
    expect(customer.sourceConnections.map(connection => connection.id)).toEqual(initialConnectionIds);
    expect(svg.querySelector('g.connectPreview')).toBeNull();

    beginConnectionDrag();
    moveConnectionToHandleClaim();
    releaseConnectionOnHandleClaim();
    editor.previewConnectionType('FlowRelationship');
    expect(svg.querySelector('g.connectPreview path').getAttribute('class')).toBe('Flow Relationship');
    editor.createConnection('3788', '3776', 'FlowRelationship', {
      relationshipId: 'id-preview-rel',
      connectionId: 'id-preview-con',
    });

    expect(requests[requests.length - 1]).toBeNull();
    expect(svg.querySelector('g.connectPreview')).toBeNull();
    expect(svg.getElementById('id-preview-con').querySelector('path').classList.contains('Flow')).toBe(true);
  });

  it('offers only Association from Insurance Policy to Customer', () => {
    const requests: (ConnectionRequest | null)[] = [];
    editor.onConnectionRequest = request => requests.push(request);
    pointer('pointermove', svg.getElementById('3785'), 490, 339);
    const handle = svg.querySelector('g.connectorHandle[data-element-id="3785"] circle');
    pointer('pointerdown', handle, 583, 339);
    pointer('pointermove', svg.getElementById('3788'), 260, 693);
    pointer('pointerup', svg.getElementById('3788'), 260, 693);

    expect(requests[0].relationshipTypes).toEqual(['AssociationRelationship']);
  });

  it('Escape cancels a connection drag and leaves the model unchanged', () => {
    const requests: (ConnectionRequest | null)[] = [];
    editor.onConnectionRequest = request => requests.push(request);
    const initialConnectionIds = (diagram.getDiagramObjectById('3788') as ArchiDiagramChild)
      .sourceConnections.map(connection => connection.id);
    pointer('pointermove', svg.getElementById('3788'), 260, 693);
    pointer('pointerdown', svg.querySelector('g.connectorHandle circle'), 330, 693);
    pointer('pointermove', svg.getElementById('3776'), 500, 199);

    svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(svg.querySelector('g.connectPreview')).toBeNull();
    expect(svg.getElementById('3776').classList.contains('connectTarget')).toBe(false);
    pointer('pointerup', svg.getElementById('3776'), 500, 199);

    expect(requests).toEqual([]);
    expect((diagram.getDiagramObjectById('3788') as ArchiDiagramChild).sourceConnections.map(connection => connection.id))
      .toEqual(initialConnectionIds);
  });

  it('Escape closes an open relationship request', () => {
    const requests: (ConnectionRequest | null)[] = [];
    editor.onConnectionRequest = request => requests.push(request);
    pointer('pointermove', svg.getElementById('3788'), 260, 693);
    pointer('pointerdown', svg.querySelector('g.connectorHandle circle'), 330, 693);
    pointer('pointermove', svg.getElementById('3776'), 500, 199);
    pointer('pointerup', svg.getElementById('3776'), 500, 199);
    expect(requests[0]).not.toBeNull();

    svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(requests[1]).toBeNull();
    expect(svg.querySelector('g.connectPreview')).toBeNull();
  });

  it('does not accept the source, a group, or a connection as the target', () => {
    const requests: (ConnectionRequest | null)[] = [];
    editor.onConnectionRequest = request => requests.push(request);
    pointer('pointermove', svg.getElementById('3788'), 260, 693);
    pointer('pointerdown', svg.querySelector('g.connectorHandle circle'), 330, 693);
    pointer('pointermove', svg.getElementById('3788'), 260, 693);
    expect(svg.querySelector('g.connectPreview path').getAttribute('class')).toBe('Relationship invalid');
    expect(svg.getElementById('3788').classList.contains('connectInvalid')).toBe(true);
    pointer('pointerup', svg.getElementById('3788'), 260, 693);
    expect(requests).toEqual([]);
    expect(svg.querySelector('g.connectPreview')).toBeNull();

    pointer('pointermove', svg.getElementById('3788'), 260, 693);
    pointer('pointerdown', svg.querySelector('g.connectorHandle circle'), 330, 693);
    pointer('pointermove', svg.getElementById('3812'), 140, 692);
    expect(svg.querySelector('g.connectPreview path').getAttribute('class')).toBe('Relationship invalid');
    pointer('pointerup', svg.getElementById('3812'), 140, 692);
    expect(requests).toEqual([]);

    const other = mount(project, '4056');
    try {
      const otherRequests: (ConnectionRequest | null)[] = [];
      other.editor.onConnectionRequest = request => otherRequests.push(request);
      pointer('pointermove', other.svg.getElementById('4103'), 310, 550);
      pointer('pointerdown', other.svg.querySelector('g.connectorHandle circle'), 404, 555);
      pointer('pointermove', other.svg.getElementById('4096'), 50, 520);
      expect(other.svg.getElementById('4096').classList.contains('connectInvalid')).toBe(true);
      pointer('pointerup', other.svg.getElementById('4096'), 50, 520);
      expect(otherRequests).toEqual([]);
    } finally {
      other.editor.dispose();
      other.svg.remove();
    }
  });

  it('rejects a relationship type the matrix does not allow', () => {
    expect(() => editor.createConnection('3785', '3788', 'ServingRelationship', {
      relationshipId: 'id-invalid-rel',
      connectionId: 'id-invalid-con',
    })).toThrow();
    expect(project.getById('id-invalid-rel')).toBeUndefined();
  });

  it('does not move an element when the pointer travels less than 5', () => {
    const customer = diagram.getDiagramObjectById('3788') as ArchiDiagramChild;
    const group = svg.getElementById('3788');
    pointer('pointerdown', group, 200, 663);
    pointer('pointermove', group, 203, 666);
    pointer('pointerup', group, 203, 666);

    expect(box(customer)).toEqual([200, 663, 120, 60]);
    expect(svg.getElementById('3788').getAttribute('transform')).toBe('translate(200, 663)');
  });
});

describe('group label', () => {
  it('renames a group and keeps the label after the file is parsed again', async () => {
    jest.useFakeTimers();
    const project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(readRepoFile('Archisurance.archimate'));
    const { diagram, svg, editor } = mount(project, '4056');
    try {
      const group = diagram.getDiagramObjectById('4096') as ArchiDiagramChild;
      expect(group.entityId).toBeFalsy();
      expect(group.name).toBe('External Application Services');

      let node = svg.getElementById('4096');
      pointer('pointerdown', node, 20, 510);
      pointer('pointerup', node, 20, 510);
      node = svg.getElementById('4096');
      pointer('pointerdown', node, 20, 510);
      pointer('pointerup', node, 20, 510);
      jest.runOnlyPendingTimers();

      const label = svg.getElementById('4096').querySelector(':scope>foreignObject>div>div') as HTMLElement;
      label.textContent = 'Renamed Group';
      svg.dispatchEvent(new Event('input', { bubbles: true }));
      label.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));

      expect(group.name).toBe('Renamed Group');
      expect(nameText(svg.getElementById('4096'))).toBe('Renamed Group');

      const reloaded = await reload(project);
      const saved = reloaded.diagrams.find(d => d.id === '4056').getDiagramObjectById('4096') as ArchiDiagramChild;
      expect(saved.name).toBe('Renamed Group');
      const again = mount(reloaded, '4056');
      expect(nameText(again.svg.getElementById('4096'))).toBe('Renamed Group');
      again.editor.dispose();
      again.svg.remove();
    } finally {
      editor.dispose();
      svg.remove();
      jest.useRealTimers();
    }
  });
});
