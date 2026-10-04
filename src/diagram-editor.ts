import { ArchiDiagram, ArchiDiagramChild, ArchiEntity, ArchimateProject, ArchiSourceConnection, ElementBounds, ElementPos, Relationship } from './archimate-model';
import { DiagramRenderer } from './diagram-renderer';
import { ChangeAction, ChangeFunctions, IDiagramChange, IXy } from './diagram-change';
import { v4 as uuidv4 } from 'uuid';
import { allowedRelationshipTypes, isConnectableConcept, relationshipTypeInfo } from './relationship-rules';

const XSI_TYPE = 'xsi:type';

function directChild(node: Element, name: string): Element {
  return Array.from(node.children).find(child => child.nodeName === name);
}

function writeBounds(child: ArchiDiagramChild) {
  if (!child.element)
    return;
  let bounds = directChild(child.element, 'bounds');
  if (!bounds) {
    bounds = child.element.ownerDocument.createElement('bounds');
    child.element.insertBefore(bounds, child.element.firstChild);
  }
  bounds.setAttribute('x', String(child.bounds.x));
  bounds.setAttribute('y', String(child.bounds.y));
  bounds.setAttribute('width', String(child.bounds.width));
  bounds.setAttribute('height', String(child.bounds.height));
}

function writeDiagramParent(child: ArchiDiagramChild, diagram: ArchiDiagram) {
  if (!child.element)
    return;
  const parentNode = child.parent?.element ?? diagram.element;
  if (child.element.parentElement !== parentNode)
    parentNode.appendChild(child.element);
}

function writeBendPoints(connection: ArchiSourceConnection) {
  const node = connection.element;
  if (!node)
    return;
  const existing = Array.from(node.children).filter(child => child.nodeName === 'bendpoint' || child.nodeName === 'bendpoints');
  connection.bendPoints.forEach((point, index) => {
    let bend = existing[index];
    if (!bend) {
      bend = node.ownerDocument.createElement('bendpoint');
      node.appendChild(bend);
    }
    bend.setAttribute('startX', String(point.x));
    bend.setAttribute('startY', String(point.y));
  });
  for (let index = connection.bendPoints.length; index < existing.length; index++)
    existing[index].remove();
}

function xsiType(entityType: string): string {
  if (!entityType)
    return 'archimate:DiagramObject';
  return entityType.includes(':') ? entityType : 'archimate:' + entityType;
}

function folderForType(project: ArchimateProject, type: string): Element {
  const elements = project.element.ownerDocument.getElementsByTagName('element');
  for (const element of Array.from(elements)) {
    if (element.getAttribute(XSI_TYPE) === type && element.parentElement)
      return element.parentElement;
  }
  if (type.endsWith('Relationship')) {
    const relationsFolder = Array.from(project.element.children)
      .find(child => child.localName === 'folder' && child.getAttribute('type') === 'relations');
    if (relationsFolder)
      return relationsFolder;
  }
  return project.element.getElementsByTagName('folder')[0];
}

function ensureConceptElement(entity: ArchiEntity, project: ArchimateProject) {
  const type = xsiType(entity.entityType);
  if (!entity.element) {
    const element = project.element.ownerDocument.createElement('element');
    element.setAttribute(XSI_TYPE, type);
    element.setAttribute('id', entity.id);
    element.setAttribute('name', entity.name ?? '');
    entity.element = element;
  }
  if (!entity.element.parentElement)
    folderForType(project, type).appendChild(entity.element);
  entity.element.setAttribute('name', entity.name ?? '');
}

function ensureDiagramObjectElement(child: ArchiDiagramChild, diagram: ArchiDiagram) {
  if (!child.element) {
    const element = diagram.element.ownerDocument.createElement('child');
    element.setAttribute(XSI_TYPE, xsiType(child.entityType));
    element.setAttribute('id', child.id);
    if (child.entityId)
      element.setAttribute('archimateElement', child.entityId);
    child.element = element;
  }
  writeBounds(child);
  writeDiagramParent(child, diagram);
}

function ensureConnectionElement(connection: ArchiSourceConnection) {
  if (!connection.element) {
    const element = connection.source.element.ownerDocument.createElement('sourceConnection');
    element.setAttribute(XSI_TYPE, 'archimate:Connection');
    element.setAttribute('id', connection.id);
    element.setAttribute('source', connection.source.id);
    element.setAttribute('target', connection.targetId);
    element.setAttribute('archimateRelationship', connection.relationShipId);
    connection.element = element;
  }
  if (connection.element.parentElement !== connection.source.element) {
    const firstChild = directChild(connection.source.element, 'child');
    if (firstChild)
      connection.source.element.insertBefore(connection.element, firstChild);
    else
      connection.source.element.appendChild(connection.element);
  }
}

function addTargetConnection(target: ArchiDiagramChild, id: string) {
  if (!target.element)
    return;
  const ids = (target.element.getAttribute('targetConnections') ?? '').split(/\s+/).filter(Boolean);
  if (!ids.includes(id))
    ids.push(id);
  target.element.setAttribute('targetConnections', ids.join(' '));
}

function removeTargetConnection(target: ArchiDiagramChild, id: string) {
  if (!target.element)
    return;
  const ids = (target.element.getAttribute('targetConnections') ?? '').split(/\s+/).filter(value => value && value !== id);
  if (ids.length)
    target.element.setAttribute('targetConnections', ids.join(' '));
  else
    target.element.removeAttribute('targetConnections');
}

export interface ConnectionRequest {
  sourceId: string;
  targetId: string;
  sourceName: string;
  targetName: string;
  relationshipTypes: string[];
  clientX: number;
  clientY: number;
}

export class DiagramEditor {
  private readonly contentElement: SVGGElement;
  private selectedElementId: string;
  private selectedElementIdDoubleClicked: boolean;
  private startDragMousePosition: {x: number, y: number};
  private startDragMouseOffset: {x: number, y: number};
  private activeDragging: boolean;
  private connectDrag: { sourceId: string };
  private pendingConnection: { sourceId: string; targetId: string; coords: ElementPos[] };
  private connectTargetId: string;
  private changeManager: ChangeManager;
  public onConnectionRequest: (request: ConnectionRequest | null) => void;
  private keyDownFunction = (evt: KeyboardEvent) => this.onKeyDown(evt);
  private pointerMoveFunction = (evt: PointerEvent) => this.onPointerMove(evt);
  private pointerUpFunction = (evt: PointerEvent) => this.onPointerUp(evt);

  private get selectedElement(): SVGGElement { return this.contentElement.ownerSVGElement.getElementById(this.selectedElementId) as SVGGElement; }

  constructor(private svg: SVGSVGElement, private project: ArchimateProject, private diagram: ArchiDiagram, private renderer: DiagramRenderer) {
    this.contentElement = svg.querySelector('svg>g');
    this.changeManager = new ChangeManager(project, new EditActionBuilder(renderer, project));
  }

  public makeDraggable() {
    this.svg.addEventListener('touchstart', (evt) => this.onTouchStart(evt));
    this.svg.addEventListener('pointerdown', (evt) => this.onPointerDown(evt));
    this.svg.addEventListener('focusout', (evt) => this.onFocusOut(evt));
    this.svg.addEventListener('input', (evt) => this.onInput(evt));

    this.svg.ownerDocument.addEventListener('keydown', this.keyDownFunction);
    this.svg.ownerDocument.addEventListener('pointermove', this.pointerMoveFunction);
    this.svg.ownerDocument.addEventListener('pointerup', this.pointerUpFunction);
  }

  dispose() {
    this.cancelConnection();
    this.svg.ownerDocument.removeEventListener('keydown', this.keyDownFunction);
    this.svg.ownerDocument.removeEventListener('pointermove', this.pointerMoveFunction);
    this.svg.ownerDocument.removeEventListener('pointerup', this.pointerUpFunction);
  }

  private onKeyDown(evt: KeyboardEvent) {
    if (evt.key === 'Escape' && (this.connectDrag || this.pendingConnection)) {
      evt.preventDefault();
      this.cancelConnection();
      return;
    }
    if (this.pendingConnection && evt.ctrlKey && (evt.key === 'z' || evt.key === 'y')) {
      evt.preventDefault();
      this.cancelConnection();
      return;
    }

    const target = evt.target as HTMLElement;
    const targetElement = target.closest('.element');
    if ((evt.key == 'Enter' && !targetElement.classList.contains('note')) || evt.key == 'Escape') {
      (evt.target as HTMLElement).blur();
      this.selectedElementId = null;
      this.renderer.highlightedElementId = null;
      this.renderer.selectedRelationId = null;
      this.renderer.removeElementSelections();
    }
    else if (evt.key == 'F2') {
      if (this.selectedElementId)
        this.editElementText(this.selectedElement);
    }
    else if (evt.key == 'z' && evt.ctrlKey) {
      this.changeManager.undo();
    }
    else if (evt.key == 'y' && evt.ctrlKey) {
      this.changeManager.redo();
    }
  }

  private onFocusOut(evt: FocusEvent) {
    if (this.changeManager.activeAction == ChangeAction.Edit) {
      const edit = this.changeManager.currentChange.edit;
      const target = evt.target as Element;
      const targetElement = target.closest('.element');
      if (targetElement?.id == edit.elementId) {
        const element = this.svg.getElementById(edit.elementId);
        edit.textNew = this.getTextFromElement(element);
        this.changeManager.finalizeChange();
      }
    }
  }

  private onInput(evt: Event) {
    if (this.changeManager.activeAction == ChangeAction.Edit) {
      const edit = this.changeManager.currentChange.edit;
      const element = this.svg.getElementById(edit.elementId);
      let newText = this.getTextFromElement(element);
      if ((newText.length == edit.textNew.length + 2) && newText.substring(0, newText.length - 2) == edit.textNew && newText[newText.length - 2] == '\n') {
        // fix firefox bug. (select all, arrow right, enter - adds extra enters before the last character)
        const toEdit = element.querySelector(':scope>foreignObject>div>div');
        toEdit.childNodes[toEdit.childNodes.length - 2].remove();// remove second last works mostly
        newText = newText.substring(0, newText.length);
      }
      edit.textNew = newText;
      this.changeManager.updateChange();
    }
  }

  private onTouchStart(evt: TouchEvent) {
    if (this.changeManager.activeAction || this.selectedElement || this.connectDrag) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
  }

  private onPointerDown(evt: PointerEvent) {
    if (this.changeManager.activeAction == ChangeAction.Edit)
      return;
    if (this.pendingConnection) {
      this.cancelConnection();
      evt.preventDefault();
      evt.stopImmediatePropagation();
      return;
    }
    const eventTarget = evt.target as Element;
    const connectorHandle = eventTarget.closest?.('g.connectorHandle');
    if (!this.changeManager.activeAction && connectorHandle) {
      this.connectStart(connectorHandle.getAttribute('data-element-id'), evt);
      return;
    }
    if (this.changeManager.activeAction) {
      this.changeManager.finalizeChange();
      return;
    }

    const target = evt.target as SVGElement;
    let clickedElementId = target.closest('.element')?.id;
    if (target.tagName === 'circle' && target.parentElement.classList.contains('selection'))
      clickedElementId = target.parentElement.getAttribute('data-element-id');

    this.selectedElementIdDoubleClicked = clickedElementId == this.selectedElementId; 
    this.selectedElementId = clickedElementId;
    this.renderer.highlightedElementId = clickedElementId;
    this.renderer.selectedRelationId = target.closest('.con')?.id;

    const controlKeyDown = evt.ctrlKey;
    this.activeDragging = false;

    evt.preventDefault();
    evt.stopImmediatePropagation();

    this.startDragMousePosition = this.getMousePosition(evt);

    if (target.tagName === 'circle' && target.parentElement.classList.contains('selection'))
      this.editResizeStart(target);
    else if (this.selectedElementId)
      this.editMoveStart();
    else if (target.tagName === 'circle' && target.parentElement.classList.contains('con') && !target.classList.contains('end')) {
        this.editConnectionStart(target);
    }
    this.doElementSelection(controlKeyDown);
  }

  private onPointerMove(evt: PointerEvent) {
    if (this.connectDrag) {
      this.connectDragMove(evt);
      return;
    }
    if (!this.changeManager.isActive) {
      if (!this.pendingConnection)
        this.updateConnectorHandle(evt);
      return;
    }
    this.renderer.hideConnectorHandle();
    if (this.changeManager.activeAction == ChangeAction.Edit)
      return;

    const mouseCoords = this.getMousePosition(evt);
    const delta = { x: mouseCoords.x - this.startDragMousePosition.x, y: mouseCoords.y - this.startDragMousePosition.y };
    const distanceFromStart = Math.sqrt(delta.x ** 2 + delta.y ** 2);

    if (!this.activeDragging) {
      if (distanceFromStart >= 5)
        this.activeDragging = true;
    }
    if (!this.activeDragging)
      return;

    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    
    const snapToGrid = !evt.ctrlKey;
    if (this.changeManager.activeAction == ChangeAction.Move)
      this.editMoveMove(mouseCoords, snapToGrid);
    else if (this.changeManager.activeAction == ChangeAction.Resize)
      this.editResizeMove(delta, snapToGrid);
    else if (this.changeManager.activeAction == ChangeAction.Connection)
      this.editConnectionEdit(delta, mouseCoords, snapToGrid);
  }

  private onPointerUp(evt: PointerEvent) {
    if (this.connectDrag) {
      this.connectDragEnd(evt);
      return;
    }
    if (!this.changeManager.isActive)
      return;
    if (this.changeManager.activeAction == ChangeAction.Edit)
      return;

    if (!this.activeDragging) {
      const controlKeyDown = evt.ctrlKey;
      const target = evt.target as SVGElement;

      if (this.selectedElementId !== null && this.selectedElementIdDoubleClicked && !controlKeyDown && !target.parentElement.classList.contains('selection')) {
        this.editElementText(this.selectedElement);
        return;
      }
      this.changeManager.undoActive();
    } else {
      this.changeManager.finalizeChange();
    }
    this.activeDragging = false;
    if (!this.pendingConnection)
      this.updateConnectorHandle(evt);
  }

  private updateConnectorHandle(evt: PointerEvent) {
    const target = evt.target as Element;
    if (!target || typeof target.closest !== 'function')
      return;
    if (target.closest('g.connectorHandle'))
      return;

    const hoveredElement = target.closest('g.element');
    const hoveredChild = hoveredElement && this.connectableChild(hoveredElement.id);
    if (hoveredChild) {
      this.renderer.showConnectorHandle(hoveredChild);
      return;
    }

    const shownId = this.renderer.connectorHandleElementId;
    if (shownId) {
      const shownChild = this.connectableChild(shownId);
      if (shownChild) {
        const pos = this.getMousePosition(evt);
        const bounds = shownChild.bounds;
        const absolute = shownChild.AbsolutePosition;
        if (pos.x >= absolute.x - 24 && pos.x <= absolute.x + bounds.width + 24
          && pos.y >= absolute.y - 24 && pos.y <= absolute.y + bounds.height + 24)
          return;
      }
    }

    const selectedChild = this.selectedElementId && this.connectableChild(this.selectedElementId);
    if (selectedChild)
      this.renderer.showConnectorHandle(selectedChild);
    else
      this.renderer.hideConnectorHandle();
  }

  private connectableChild(id: string): ArchiDiagramChild {
    const child = this.diagram.getDiagramObjectById(id) as ArchiDiagramChild;
    const concept = child?.entityId && this.project.getById(child.entityId);
    return concept && isConnectableConcept(concept.entityType) ? child : null;
  }

  private relationshipTypesBetween(sourceId: string, targetId: string): string[] {
    if (!targetId || sourceId === targetId)
      return [];
    const source = this.connectableChild(sourceId);
    const target = this.connectableChild(targetId);
    if (!source || !target)
      return [];
    const sourceConcept = this.project.getById(source.entityId);
    const targetConcept = this.project.getById(target.entityId);
    return allowedRelationshipTypes(sourceConcept.entityType, targetConcept.entityType);
  }

  private setConnectTarget(id: string, valid: boolean) {
    if (this.connectTargetId && this.connectTargetId !== id)
      this.svg.getElementById(this.connectTargetId)?.classList.remove('connectTarget', 'connectInvalid');
    this.connectTargetId = id;
    if (!id)
      return;
    const target = this.svg.getElementById(id);
    if (target) {
      target.classList.toggle('connectTarget', valid);
      target.classList.toggle('connectInvalid', !valid);
    }
  }

  private clearConnectTarget() {
    if (this.connectTargetId)
      this.svg.getElementById(this.connectTargetId)?.classList.remove('connectTarget', 'connectInvalid');
    this.connectTargetId = null;
  }

  private connectionCoordinates(sourceId: string, targetId: string, mousePosition?: {x: number, y: number}): ElementPos[] {
    const source = this.connectableChild(sourceId);
    if (!source)
      return [];
    const [start, startBounds] = this.renderer.getAbsolutePositionAndBounds(source);
    let end: ElementPos;
    let endBounds: ElementPos;
    const target = targetId && this.connectableChild(targetId);
    if (target) {
      [end, endBounds] = this.renderer.getAbsolutePositionAndBounds(target);
    } else {
      end = mousePosition ? new ElementPos(mousePosition.x, mousePosition.y) : start.clone();
      endBounds = ElementPos.Zero;
    }
    return DiagramRenderer.calculateConnectionCoords(
      start,
      startBounds,
      end,
      endBounds,
      { bendPoints: [] } as ArchiSourceConnection,
    );
  }

  private connectStart(sourceId: string, evt: PointerEvent) {
    if (!this.connectableChild(sourceId))
      return;
    evt.preventDefault();
    evt.stopImmediatePropagation();
    this.connectDrag = { sourceId };
    this.renderer.hideConnectorHandle();
    this.svg.classList.add('connecting');
    this.renderer.setConnectionPreview(
      this.connectionCoordinates(sourceId, null, this.getMousePosition(evt)),
      'Relationship pending',
    );
  }

  private connectDragMove(evt: PointerEvent) {
    const target = evt.target as Element;
    const hoveredElement = target?.closest?.('g.element');
    const hoveredConnection = target?.closest?.('g.con');
    const targetId = hoveredElement?.id ?? null;
    const allowedTypes = this.relationshipTypesBetween(this.connectDrag.sourceId, targetId);
    this.setConnectTarget(targetId, allowedTypes.length > 0);
    const coords = this.connectionCoordinates(
      this.connectDrag.sourceId,
      allowedTypes.length > 0 ? targetId : null,
      allowedTypes.length > 0 ? undefined : this.getMousePosition(evt),
    );
    const invalidTarget = !!hoveredElement || !!hoveredConnection;
    this.renderer.setConnectionPreview(coords, allowedTypes.length > 0 || !invalidTarget ? 'Relationship pending' : 'Relationship invalid');
  }

  private connectDragEnd(evt: PointerEvent) {
    const target = evt.target as Element;
    const targetId = target?.closest?.('g.element')?.id ?? null;
    const relationshipTypes = this.relationshipTypesBetween(this.connectDrag.sourceId, targetId);
    if (!relationshipTypes.length) {
      this.cancelConnection();
      return;
    }

    const sourceId = this.connectDrag.sourceId;
    const coords = this.connectionCoordinates(sourceId, targetId);
    this.connectDrag = null;
    this.clearConnectTarget();
    this.svg.classList.remove('connecting');
    this.pendingConnection = { sourceId, targetId, coords };
    const source = this.connectableChild(sourceId);
    const targetChild = this.connectableChild(targetId);
    const sourceConcept = this.project.getById(source.entityId);
    const targetConcept = this.project.getById(targetChild.entityId);
    const [clientX, clientY] = this.connectionMidpointClientPosition(coords);
    this.onConnectionRequest?.({
      sourceId,
      targetId,
      sourceName: sourceConcept.name,
      targetName: targetConcept.name,
      relationshipTypes,
      clientX,
      clientY,
    });
  }

  private connectionMidpointClientPosition(coords: ElementPos[]): [number, number] {
    const middle = Math.floor((coords.length - 1) / 2);
    const point = coords.length % 2 === 1
      ? coords[middle]
      : coords[middle].add(coords[middle + 1]).multiply(0.5);
    const ctm = this.svg.getScreenCTM();
    return [point.x * ctm.a + ctm.e, point.y * ctm.d + ctm.f];
  }

  public cancelConnection(): void {
    const hadRequest = !!this.pendingConnection;
    this.connectDrag = null;
    this.pendingConnection = null;
    this.clearConnectTarget();
    this.svg.classList.remove('connecting');
    this.renderer.removeConnectionPreview();
    if (hadRequest)
      this.onConnectionRequest?.(null);
  }

  public previewConnectionType(type: string | null): void {
    if (!this.pendingConnection)
      return;
    const cssClass = type ? relationshipTypeInfo(type).previewClass : 'Relationship pending';
    this.renderer.setConnectionPreview(this.pendingConnection.coords, cssClass);
  }

  private doElementSelection(controlKeyDown: boolean) {
    const elementIsAlreadySelected = this.renderer.getElementSelection(this.selectedElementId);
    this.renderer.getElementSelections().forEach(s => {
      if (!controlKeyDown || s.id == this.selectedElementId)
        this.renderer.removeElementSelection(s.id);
      if (s.lastSelected)
        s.lastSelected = false;
    });
    if (this.selectedElement && (!controlKeyDown || !elementIsAlreadySelected)) {
      const selectedEntity = this.diagram.getDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;
      const elementSelection = this.renderer.addElementSelection(this.selectedElementId);
      elementSelection.setPosition(
        selectedEntity.AbsolutePosition.x, selectedEntity.AbsolutePosition.y,
        selectedEntity.bounds.width, selectedEntity.bounds.height);
      elementSelection.lastSelected = true;
    }
  }

  private getTextFromElement(element: Element) {
    if (!element.classList.contains('note'))
      return element.querySelector(':scope>foreignObject>div>div')?.textContent;

    const textElement: HTMLDivElement = element.querySelector(':scope>foreignObject>div>div');
    return Array.from(textElement.childNodes)
      .map(n => (n as HTMLElement).textContent)
      .reduce((a,b) => a + '\n' + b)
  }

  private editElementText(element: Element) {
    const toEdit: HTMLDivElement = element.querySelector(':scope>foreignObject>div>div');
    if (!toEdit)
      return;

    const text = this.getTextFromElement(element);
    this.changeManager.startChange(<IDiagramChange>{
      action: ChangeAction.Edit,
      diagramId: this.diagram.id,
      edit: {
        elementId: element.id,
        textNew: text,
        textOld: text,
      }
    });
    const focusedElement = this.getDiagramElement(document.activeElement);
    if (focusedElement !== element) {
      setTimeout(function () {
        toEdit.focus();
        const range = document.createRange(); // select all text in div
        range.selectNodeContents(toEdit);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }, 100);
    }
  }

  private getDiagramElement(element: Element) {
    while (element != null && !(element instanceof SVGGElement))
      element = element.parentElement;
    return element;
  }
  
  finalizeAction(change: IDiagramChange) {
    this.changeManager.finalizeChange(change);
  }

  public startDragging(elementId: string, mousePosition: {x: number, y: number}, chainedToParent = false) {
    this.startDragMousePosition = mousePosition;
    this.activeDragging = false;
    this.selectedElementId = elementId;
    this.renderer.highlightedElementId = elementId;
    this.renderer.removeElementSelections();
    this.renderer.addElementSelection(this.selectedElementId);
    this.editMoveStart(chainedToParent);
  }

  public createConnection(
    sourceId: string,
    targetId: string,
    relationshipType: string,
    ids = { relationshipId: 'id-' + uuidv4(), connectionId: 'id-' + uuidv4() },
  ): void {
    const source = this.diagram.getDiagramObjectById(sourceId) as ArchiDiagramChild;
    const target = this.diagram.getDiagramObjectById(targetId) as ArchiDiagramChild;
    const sourceConcept = source && this.project.getById(source.entityId);
    const targetConcept = target && this.project.getById(target.entityId);
    if (!sourceConcept || !targetConcept || !isConnectableConcept(sourceConcept.entityType)
      || !isConnectableConcept(targetConcept.entityType) || sourceId === targetId ||
      !allowedRelationshipTypes(sourceConcept.entityType, targetConcept.entityType).includes(relationshipType))
      throw new Error(`Invalid ${relationshipType} connection from ${sourceId} to ${targetId}`);
    if (this.connectDrag || this.pendingConnection)
      this.cancelConnection();

    const relationship = new Relationship();
    relationship.id = ids.relationshipId;
    relationship.entityType = relationshipType;
    relationship.source = sourceConcept.id;
    relationship.target = targetConcept.id;

    const connection = new ArchiSourceConnection();
    connection.id = ids.connectionId;
    connection.source = source;
    connection.targetId = target.id;
    connection.relationShipId = relationship.id;
    connection.bendPoints = [];
    connection.sourceConnections = [];

    this.changeManager.finalizeChange({
      action: ChangeAction.AddRemoveConnection,
      diagramId: this.diagram.id,
      chainedToParent: false,
      addRemoveConnection: { relationship, connection, adding: true },
    } as IDiagramChange);
  }

  private editMoveStart(chainedToParent = false) {
    const diagramElement = this.diagram.getDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;
    this.startDragMouseOffset = { x: this.startDragMousePosition.x - diagramElement.AbsolutePosition.x, y: this.startDragMousePosition.y - diagramElement.AbsolutePosition.y };

    this.changeManager.startChange(<IDiagramChange>{
      action: ChangeAction.Move,
      diagramId: this.diagram.id,
      chainedToParent: chainedToParent,
      move: {
        elementId: this.selectedElement.id,
        positionNew: { x: diagramElement.AbsolutePosition.x, y: diagramElement.AbsolutePosition.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
        positionOld: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
        parentIdNew: this.diagram.id,
        parentIdOld: diagramElement.parent?.id ?? this.diagram.id,
      }
    });
  }
  private static toGrid(xory: number, snapToGrid: boolean) {
    if (snapToGrid)
      return Math.round(xory / 12) * 12;
    return xory;
  }

  private editMoveMove(mouseCoords: { x: number; y: number; }, snapToGrid: boolean) {
    const newPosition = { x: DiagramEditor.toGrid(mouseCoords.x - this.startDragMouseOffset.x, snapToGrid), y: DiagramEditor.toGrid(mouseCoords.y - this.startDragMouseOffset.y, snapToGrid) };
    const move = this.changeManager.currentChange.move;
    move.positionNew.x = newPosition.x;
    move.positionNew.y = newPosition.y;
    this.changeManager.updateChange();
  }

  private editResizeStart(target: SVGElement) {
    const diagramElement = this.diagram.getDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;
    this.changeManager.startChange(<IDiagramChange>{
      action: ChangeAction.Resize,
      diagramId: this.diagram.id,
      move: {
        elementId: this.selectedElement.id,
        positionNew: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
        positionOld: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
        parentIdNew: diagramElement.parent?.id ?? this.diagram.id,
        parentIdOld: diagramElement.parent?.id ?? this.diagram.id,
        dragCorner: target.classList.item(0)
      }
    });
  }

  private editResizeMove(delta: { x: number; y: number; }, snapToGrid: boolean) {
    const move = this.changeManager.currentChange.move;
    if (move.dragCorner.indexOf('w') >= 0) {
      const newX = move.positionOld.x + delta.x;
      move.positionNew.x = DiagramEditor.toGrid(newX, snapToGrid);
      delta.x += move.positionNew.x - newX;
      move.positionNew.width = move.positionOld.width - delta.x;
      if (move.positionNew.width < 12) {
        move.positionNew.x -= 12 - move.positionNew.width;
        move.positionNew.width = 12;
      }
    }
    if (move.dragCorner.indexOf('e') >= 0) {
      move.positionNew.width = DiagramEditor.toGrid(move.positionOld.width + delta.x, snapToGrid);
      if (move.positionNew.width < 12)
        move.positionNew.width = 12;
    }
    if (move.dragCorner.indexOf('n') >= 0) {
      const newY = move.positionOld.y + delta.y;
      move.positionNew.y = DiagramEditor.toGrid(newY, snapToGrid);
      delta.y += move.positionNew.y - newY;
      move.positionNew.height = move.positionOld.height - delta.y;
      if (move.positionNew.height < 12) {
        move.positionNew.y -= 12 - move.positionNew.height;
        move.positionNew.height = 12;
      }    }
    if (move.dragCorner.indexOf('s') >= 0) {
      move.positionNew.height = DiagramEditor.toGrid(move.positionOld.height + delta.y, snapToGrid);
      if (move.positionNew.height < 12)
        move.positionNew.height = 12;
    }
    this.changeManager.updateChange();
  }

  private editConnectionStart(target: SVGElement) {
    let index = 0;
    let sibling = target.previousElementSibling;
    while (sibling.tagName == 'circle') {
      index++;
      sibling = sibling.previousElementSibling;
    }
    const sourceConnection = this.diagram.getDiagramObjectById(target.parentElement.id) as ArchiSourceConnection;
    const bendPointsOld = sourceConnection.bendPoints.map(bp => <IXy>{ x: bp.x, y: bp.y });
    const [start] = this.renderer.getAbsolutePositionAndBounds(sourceConnection.source);
    const [end] = this.renderer.getAbsolutePositionAndBounds(this.diagram.getDiagramObjectById(sourceConnection.targetId));

    this.changeManager.startChange(<IDiagramChange>{
      action: ChangeAction.Connection,
      diagramId: this.diagram.id,
      connection: {
        index: index,
        sourceConnectionId: sourceConnection.id,
        bendPointsOld: bendPointsOld,
        bendPointsNew: bendPointsOld,
        targetOffset: { x: end.x - start.x, y: end.y - start.y } 
      }
    });
  }

  private editConnectionEdit(delta: { x: number; y: number; }, mouseCoords: { x: number; y: number; }, snapToGrid: boolean) {
    const change = this.changeManager.currentChange.connection;
    change.bendPointsNew = change.bendPointsOld.map(xy => <IXy>{ x: xy.x, y: xy.y });
    let bendPointIndex = -1;

    const sourceConnection = this.diagram.getDiagramObjectById(change.sourceConnectionId) as ArchiSourceConnection;
    const [start, startBounds] = this.renderer.getAbsolutePositionAndBounds(sourceConnection.source);
    const [end, endBounds] = this.renderer.getAbsolutePositionAndBounds(this.diagram.getDiagramObjectById(sourceConnection.targetId));
    const connectionCoords = DiagramRenderer.calculateConnectionCoords(start, startBounds, end, endBounds, sourceConnection);

    if (change.index % 2 == 1) /* intermediate point */ {
      const position = { x: this.startDragMousePosition.x - start.x, y: this.startDragMousePosition.y - start.y };
      bendPointIndex = (change.index - 1) / 2;
      change.bendPointsNew = [...change.bendPointsNew.slice(0, bendPointIndex), { x: position.x, y: position.y }, ...change.bendPointsNew.slice(bendPointIndex)];
    }
    else if (change.index > 0 && (change.index / 2 - 1) < change.bendPointsNew.length)
      bendPointIndex = change.index / 2 - 1;
    if (bendPointIndex >= 0) {
      change.bendPointsNew[bendPointIndex].x = DiagramEditor.toGrid(start.x + change.bendPointsNew[bendPointIndex].x + delta.x, snapToGrid) - start.x;
      change.bendPointsNew[bendPointIndex].y = DiagramEditor.toGrid(start.y + change.bendPointsNew[bendPointIndex].y + delta.y, snapToGrid) - start.y;
    }
    if (ElementPos.IsInsideBounds(mouseCoords, start, startBounds))
      change.bendPointsNew = change.bendPointsNew.slice(bendPointIndex + 1);
    else if (ElementPos.IsInsideBounds(mouseCoords, end, endBounds))
      change.bendPointsNew = change.bendPointsNew.slice(0, bendPointIndex);
    else {
      // remove bendpoints if mouse overlaps with an existing bendpoint
      for (let i = 0; i < connectionCoords.length - 2; i++) { // -2 to skip start and end
        if (i != bendPointIndex && ElementPos.IsInsideBounds(mouseCoords, connectionCoords[i + 1])) {
          if (i < bendPointIndex)
            change.bendPointsNew = [...change.bendPointsNew.slice(0, i + 1), ...change.bendPointsNew.slice(bendPointIndex + 1)];

          else
            change.bendPointsNew = [...change.bendPointsNew.slice(0, bendPointIndex), ...change.bendPointsNew.slice(i)];
          break;
        }
      }
    }
    this.changeManager.updateChange();
  }

  public getMousePosition(evt: {clientX: number, clientY: number}) {
    const CTM = this.svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  }
}

class EditActionBuilder {
  private _change: IDiagramChange;
  private _action: EditAction;

  get action() { return this._action }
  get change() { return this._change }
  set change(value: IDiagramChange) {
    this._change = value;
    this._action = value ? EditActionBuilder.getAction(value.action) : null;
  }

  constructor(private renderer: DiagramRenderer, private project: ArchimateProject) {
  }

  private static getAction(action: ChangeAction): EditAction {
    switch(action) {
      case ChangeAction.Move:
        return new EditMoveAction();
      case ChangeAction.Resize:
        return new EditMoveAction();
      case ChangeAction.Connection:
        return new EditConnectionAction();
      case ChangeAction.Edit:
        return new EditEditAction();
      case ChangeAction.AddRemoveElement:
        return new EditAddRemoveElement();
      case ChangeAction.AddRemoveConnection:
        return new EditAddRemoveConnection();
      default:
        throw new Error(`Unimplemented action for ${ChangeAction[action]}`);
    }
  }

  public doDiagramChange(changeState = ChangeState.Final) {
    this.action.doDiagramChange(this.change, this.renderer, this.project, changeState);
  }
  public doSvgChange(changeState = ChangeState.Final) {
    this.action.doSvgChange(this.change, this.renderer, changeState);
  }
}

abstract class EditAction {
  public abstract doSvgChange(change: IDiagramChange, renderer: DiagramRenderer, changeState: ChangeState): void;
  public abstract doDiagramChange(change: IDiagramChange, renderer: DiagramRenderer, project: ArchimateProject, changeState: ChangeState): void;
}

class EditMoveAction extends EditAction {
  private selectedDropTarget: SVGGElement;

  public doDiagramChange(diagramChange: IDiagramChange, renderer: DiagramRenderer, project: ArchimateProject, changeState: ChangeState): void {
    const change = diagramChange.move;

    if (diagramChange.action == ChangeAction.Move && changeState == ChangeState.Final) {
      if (this.selectedDropTarget) {
        const dropElement = renderer.diagram.getDiagramObjectById(this.selectedDropTarget.id) as ArchiDiagramChild;
        change.parentIdNew = this.selectedDropTarget.id;
        change.positionNew.x -= dropElement.AbsolutePosition.x;
        change.positionNew.y -= dropElement.AbsolutePosition.y;
      }
    }

    const element = renderer.diagram.getDiagramObjectById(change.elementId) as ArchiDiagramChild;
    const parentElement = change.parentIdNew == renderer.diagram.id ? null : renderer.diagram.getDiagramObjectById(change.parentIdNew) as ArchiDiagramChild;
    const diagram = project.diagrams.find(d => d.id == diagramChange.diagramId);
    if (element.parent != parentElement)
      diagram.setElement(element, parentElement);
    element.bounds = new ElementBounds(change.positionNew.x, change.positionNew.y, change.positionNew.width, change.positionNew.height);
    writeBounds(element);
    writeDiagramParent(element, diagram);
  }

  public doSvgChange(change: IDiagramChange, renderer: DiagramRenderer, changeState: ChangeState): void {
    const move = change.move;
    let element = renderer.svg.getElementById(move.elementId) as SVGElement
    const parent = renderer.svg.getElementById(move.parentIdNew) as SVGGElement;
    const diagramElement = renderer.diagram.getDiagramObjectById(move.elementId) as ArchiDiagramChild
    element.remove();
    element = renderer.addElement(diagramElement, parent);

    renderer.clearRelations();
    renderer.addRelations();

    if (changeState == ChangeState.Active) {
      if (change.action == ChangeAction.Move)
        this.setDropTargetAttributes(renderer);

      const infoText = change.action == ChangeAction.Move ?
        `${move.positionNew.x}, ${move.positionNew.y}` :
        `${move.positionNew.width} x ${move.positionNew.height}`;
      renderer.editInfo.setText(infoText, diagramElement.AbsolutePosition.x + 10, diagramElement.AbsolutePosition.y + move.positionNew.height + 5);

      element.classList.add('dragging');
      renderer.svg.classList.add('dragging');
    }
    else if (changeState == ChangeState.Final) {
      renderer.removeEditInfo();

      element.classList.remove('dragging');
      renderer.svg.classList.remove('dragging');
      renderer.svg.querySelectorAll('g.drop').forEach(g => g.classList.remove('drop'));
    }
  }

  private setDropTargetAttributes(renderer: DiagramRenderer) {
    const dropTargetCandidates = renderer.svg.querySelectorAll('g.element:hover');
    const dropTargetCandidate = !dropTargetCandidates ? null : dropTargetCandidates[dropTargetCandidates.length - 1] as SVGGElement;
    if (dropTargetCandidate) {
      if (this.selectedDropTarget !== dropTargetCandidate) {
        if (this.selectedDropTarget) {
          this.selectedDropTarget.classList.remove('drop');
        }
        this.selectedDropTarget = dropTargetCandidate;
        this.selectedDropTarget.classList.add('drop');
      }
    } else {
      if (this.selectedDropTarget) {
        this.selectedDropTarget.classList.remove('drop');
        this.selectedDropTarget = null;
      }
    }
  }
}

class EditConnectionAction extends EditAction {
  public doDiagramChange(diagramChange: IDiagramChange, renderer: DiagramRenderer, project: ArchimateProject, changeState: ChangeState): void {
    const change = diagramChange.connection;
    const sourceConnection = renderer.diagram.getDiagramObjectById(change.sourceConnectionId) as ArchiSourceConnection;
    const bendPoints = change.bendPointsNew.map(xy => <ElementPos>{ x: xy.x, y: xy.y});
    sourceConnection.bendPoints = bendPoints;
    writeBendPoints(sourceConnection);
  }

  public doSvgChange(change: IDiagramChange, renderer: DiagramRenderer): void {
    renderer.clearRelations();
    renderer.addRelations();
  }
}

class EditEditAction extends EditAction {
  public doDiagramChange(diagramChange: IDiagramChange, renderer: DiagramRenderer, project: ArchimateProject, changeState: ChangeState): void {
    const change = diagramChange.edit;
    const element = renderer.diagram.getDiagramObjectById(change.elementId) as ArchiDiagramChild
    if (element.entityId) {
      const archiElement = project.getById(element.entityId)
      archiElement.name = change.textNew;
      archiElement.element?.setAttribute('name', change.textNew);
    } else if (element.entityType === 'Group') {
      element.name = change.textNew;
      element.element?.setAttribute('name', change.textNew);
    } else {
      element.content = change.textNew;
      if (element.element) {
        let content = directChild(element.element, 'content');
        if (!content) {
          content = element.element.ownerDocument.createElement('content');
          element.element.appendChild(content);
        }
        content.textContent = change.textNew;
      }
    }
  }

  public doSvgChange(change: IDiagramChange, renderer: DiagramRenderer, changeState: ChangeState): void {
    const edit = change.edit;
    if (changeState == ChangeState.Final) { // don't render in case editing is performed by the
      const element = renderer.svg.getElementById(edit.elementId) as SVGElement
      const parent = element.parentElement;
      const diagramElement = renderer.diagram.getDiagramObjectById(edit.elementId) as ArchiDiagramChild
      element.remove();
      renderer.addElement(diagramElement, parent);
    }
  }
}

class EditAddRemoveElement extends EditAction {
  public doDiagramChange(diagramChange: IDiagramChange, renderer: DiagramRenderer, project: ArchimateProject, changeState: ChangeState): void {
    if (changeState != ChangeState.Final)
      return;
    const change = diagramChange.addRemoveElement;
    if (change.adding) {
      if (change.entity) {
        ensureConceptElement(change.entity, project);
        let entity = project.getById(change.entity.id);
        if (!entity) {
          entity = {...change.entity}; // shallow clone. Is this a good idea?
          project.addEntity(entity);
        }
      }
      renderer.diagram.setElement(change.element, null);
      ensureDiagramObjectElement(change.element, renderer.diagram);
    }
    else {
      change.element.element?.remove();
      if (change.entity) {
        change.entity.element?.remove();
        project.removeEntity(change.entity);
      }
      renderer.diagram.removeElement(change.element);
    }
  }

  public doSvgChange(diagramChange: IDiagramChange, renderer: DiagramRenderer, changeState: ChangeState): void {
    if (changeState != ChangeState.Final)
      return;
    
    const change = diagramChange.addRemoveElement;

    const element = renderer.svg.getElementById(change.element.id) as SVGElement;
    if (element)
      element.remove();
    if (change.adding) {
      const diagramElement = renderer.diagram.getDiagramObjectById(change.element.id) as ArchiDiagramChild
      const parentSvgElement = renderer.svg.getElementById(diagramElement.parent != null ? diagramElement.parent.id : renderer.diagram.id);
      renderer.addElement(diagramElement, parentSvgElement);
    }
  }
}

class EditAddRemoveConnection extends EditAction {
  public doDiagramChange(diagramChange: IDiagramChange, renderer: DiagramRenderer, project: ArchimateProject, changeState: ChangeState): void {
    if (changeState != ChangeState.Final)
      return;
    const { relationship, connection, adding } = diagramChange.addRemoveConnection;
    const target = renderer.diagram.getDiagramObjectById(connection.targetId) as ArchiDiagramChild;
    if (adding) {
      ensureConceptElement(relationship, project);
      relationship.element.setAttribute('source', relationship.source);
      relationship.element.setAttribute('target', relationship.target);
      if (!project.getById(relationship.id))
        project.addEntity(relationship);
      renderer.diagram.addSourceConnection(connection);
      ensureConnectionElement(connection);
      addTargetConnection(target, connection.id);
    }
    else {
      connection.element?.remove();
      removeTargetConnection(target, connection.id);
      renderer.diagram.removeSourceConnection(connection);
      relationship.element?.remove();
      project.removeEntity(relationship);
    }
  }

  public doSvgChange(change: IDiagramChange, renderer: DiagramRenderer, changeState: ChangeState): void {
    if (changeState != ChangeState.Final)
      return;
    renderer.clearRelations();
    renderer.addRelations();
  }
}

enum ChangeState {
  Init,
  Active,
  Final,
}
class ChangeManager {
  private changeHistory: IDiagramChange[] = [];
  private changeHistoryIndex = 0;

  public set currentChange(value: IDiagramChange) {
    if (this.changer.change != value)
      this.changer.change = value;
  }
  public get currentChange(): IDiagramChange { return this.changer.change; }

  public get isActive(): boolean { return !!this.currentChange; }

  constructor(public project: ArchimateProject, private changer: EditActionBuilder) {
  }

  public get activeAction(): ChangeAction {
     return this.currentChange?.action;
  }

  public undoActive() {
    if (!this.isActive)
      return;
    this.currentChange = ChangeFunctions.undoChange(this.currentChange);
    this.changer.doDiagramChange();
    this.changer.doSvgChange();
    while (this.currentChange.chainedToParent) {
      this.currentChange = this.changeHistory.pop();
      this.changeHistoryIndex--;
      this.currentChange = ChangeFunctions.undoChange(this.currentChange);
      this.changer.doDiagramChange();
      this.changer.doSvgChange();
    }
    this.currentChange = null;
  }

  startChange(change: IDiagramChange) {
    this.currentChange = change;
  }
  
  public updateChange(change: IDiagramChange = this.currentChange) {
    this.currentChange = change;
    this.changer.doDiagramChange(ChangeState.Active);
    this.changer.doSvgChange(ChangeState.Active);
  }


  public finalizeChange(change: IDiagramChange = this.currentChange) {
    this.currentChange = change;
    this.changer.doDiagramChange();
    this.changer.doSvgChange();
    
    if (ChangeFunctions.isChanged(change)) {
      this.changeHistory = this.changeHistory.slice(0, this.changeHistoryIndex);
      this.changeHistory.push(change);
      this.changeHistoryIndex++;
    }
    this.currentChange = null;
  }

  public undo() {
    if (this.isActive) {
      this.undoActive();
      return;
    }
    // eslint-disable-next-line no-constant-condition
    for (;;) {
      if (this.changeHistoryIndex == 0)
        break;
      this.changeHistoryIndex--;
      
      this.currentChange = ChangeFunctions.undoChange(this.changeHistory[this.changeHistoryIndex]);
      this.changer.doDiagramChange();
      this.changer.doSvgChange();
      if (!this.currentChange.chainedToParent)
        break;
    }
    this.currentChange = null;
  }

  public redo() {
    if (this.isActive) {
      this.undoActive();
      return;
    }
    for (;;) {
      if (this.changeHistoryIndex >= this.changeHistory.length)
        return;
      this.currentChange = this.changeHistory[this.changeHistoryIndex];
      this.changeHistoryIndex++;
      this.changer.doDiagramChange();
      this.changer.doSvgChange();
      if (this.changeHistoryIndex >= this.changeHistory.length || !this.changeHistory[this.changeHistoryIndex].chainedToParent)
        break;
    }
    this.currentChange = null;
  }
}
