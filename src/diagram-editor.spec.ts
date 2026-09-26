import { readFileSync } from 'fs';
import { join } from 'path';
import { ChangeAction, IDiagramChange } from './diagram-change';
import { DiagramEditor } from './diagram-editor';
import { DiagramRenderer } from './diagram-renderer';
import { DiagramTemplate } from './diagram-template';
import { ArchiDiagram, ArchiDiagramChild, ArchiEntity, ArchimateProject, ArchimateProjectStorage, ElementBounds } from './archimate-model';

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

function mount(project: ArchimateProject) {
  const diagram = project.diagrams.find(d => d.id === '3761');
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

  it('moves Customer on the grid and clears the position readout', () => {
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
  });

  it('lifts Register onto the diagram and undo nests it again', () => {
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

    chord(svg.getElementById('3779'), 'z');

    expect(register.parent.id).toBe('3776');
    expect(box(register)).toEqual([20, 20, 120, 60]);
    expect(svg.getElementById('3779').getAttribute('transform')).toBe('translate(20, 20)');
    expect(svg.getElementById('3779').parentElement).toBe(svg.getElementById('3776'));
  });

  it('resizes Customer from the east handle and floors the width at 12', () => {
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
  });

  it('inserts a bend on connection 3812 and undo restores the single point', () => {
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
    expect(connection.source.id).toBe('3788');
    expect(connection.targetId).toBe('3783');
    const line = svg.getElementById('3812');
    expect(line).not.toBeNull();
    expect(diagram.getDiagramObjectById('3812')).toBe(connection);
    expect(line.querySelector('path').getAttribute('d')).not.toBe('');

    chord(svg.getElementById('3788'), 'z');
    expect(connection.bendPoints.map(p => [p.x, p.y])).toEqual([[-180, -1]]);
  });

  it('renames Customer from a double-click and undoes and redoes the name', () => {
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

      chord(svg.getElementById('3788'), 'z');
      expect(project.getById('521').name).toBe('Customer');
      expect(nameText(svg.getElementById('3788'))).toBe('Customer');

      chord(svg.getElementById('3788'), 'y');
      expect(project.getById('521').name).toBe('Client');
      expect(nameText(svg.getElementById('3788'))).toBe('Client');
      expect(box(customer)).toEqual([200, 663, 120, 60]);
    } finally {
      jest.useRealTimers();
    }
  });

  it('adds a Business Actor at the pointer and undo and redo that placement', () => {
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

    chord(svg.getElementById('3788'), 'z');
    expect(svg.getElementById('id-element-test')).toBeNull();
    expect(project.getById('id-entity-test')).toBeUndefined();

    chord(svg.getElementById('3788'), 'y');
    const restored = diagram.getDiagramObjectById('id-element-test') as ArchiDiagramChild;
    expect(box(restored)).toEqual([156, 156, 168, 60]);
    expect(svg.getElementById('id-element-test').getAttribute('transform')).toBe('translate(156, 156)');
    expect(project.getById('id-entity-test')).toBeTruthy();
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
