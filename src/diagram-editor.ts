import { ArchiDiagram, ArchiDiagramChild, ArchimateProject, ArchiSourceConnection, ElementBounds, ElementPos } from './greeter';
import { DiagramRenderer } from './diagram-renderer';
import { ChangeAction, ChangeFunctions, IDiagramChange, IXy } from './diagram-change';

export class DiagramEditor {
  private readonly contentElement: SVGGElement;
  private selectedElement: SVGGElement;
  private startDragMousePosition: {x: number, y: number};
  private startDragMouseOffset: {x: number, y: number};
  private lastElementClicked: SVGElement;
  private selectedRelation: SVGElement;
  private selectedDropTarget: SVGGElement;
  private activeChangeResizeCorner: string;
  private activeDragging: boolean;
  private changeManager: ChangeManager;
  private keyDownFunction = (evt: KeyboardEvent) => this.onKeyDown(evt);

  constructor(private svg: SVGSVGElement, private project: ArchimateProject, private diagram: ArchiDiagram, private renderer: DiagramRenderer) {
    this.contentElement = svg.querySelector('svg>g');
    this.changeManager = new ChangeManager(project, new DiagramChanger(renderer, project));
  }

  public makeDraggable() {
    this.svg.addEventListener('touchstart', (evt) => this.onTouchStart(evt));
    this.svg.addEventListener('pointerdown', (evt) => this.onPointerDown(evt));
    this.svg.addEventListener('pointermove', (evt) => this.onPointerMove(evt));
    this.svg.addEventListener('pointerup', (evt) => this.onPointerUp(evt));
    this.svg.addEventListener('focusout', (evt) => this.onFocusOut(evt));
    this.svg.addEventListener('focusin', (evt) => this.onFocusIn(evt));
    this.svg.addEventListener('input', (evt) => this.onInput(evt));

    this.svg.ownerDocument.addEventListener('keydown', this.keyDownFunction);
  }

  dispose() {
    this.svg.ownerDocument.removeEventListener('keydown', this.keyDownFunction);
  }

  private onKeyDown(evt: KeyboardEvent) {
    const target = evt.target as HTMLElement;
    const targetElement = target.closest('.element');
    if ((evt.key == 'Enter' && !targetElement.classList.contains('note')) || evt.key == 'Escape') {
      (evt.target as HTMLElement).blur();
      this.changeManager.undoActive();
    }
    else if (evt.key == 'F2') {
      const elmentToEdit = this.contentElement.querySelector(':scope g.lastSelection');
      this.editElementText(elmentToEdit);
    }
    else if (evt.key == 'z' && evt.ctrlKey) {
      this.changeManager.undo();
    }
    else if (evt.key == 'y' && evt.ctrlKey) {
      this.changeManager.redo();
    }
  }

  private onFocusIn(evt: FocusEvent) {
    console.log('onFocusIn');
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
    if (this.changeManager.activeAction || this.selectedElement) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
  }

  private onPointerDown(evt: PointerEvent) {
    if (this.changeManager.activeAction == ChangeAction.Edit)
      return;

    const target = evt.target as SVGElement;
    this.selectedElement = target.closest('.element');
    console.log('select ' + this.selectedElement?.id);
    const controlKeyDown = evt.ctrlKey;
    this.activeDragging = false;

    evt.preventDefault();
    evt.stopImmediatePropagation();

    this.startDragMousePosition = this.getMousePosition(evt);
    this.startDragMouseOffset = {x: 0, y: 0}

    if (this.selectedElement != null) {
      if (target.tagName === 'circle' && target.parentElement.classList.contains('selection'))
        this.editResizeStart(target);
      else
        this.editMoveStart();
    }
    else if (target.tagName === 'circle' && target.parentElement.classList.contains('con') && !target.classList.contains('end')) {
        this.editConnectionStart(target);
    }
    this.doElementSelection(controlKeyDown);
    
    if (target.classList.contains('RelationshipDetect')) {
      this.doRelationShipSelection(target.parentElement);
    }
  }

  private onPointerMove(evt: PointerEvent) {
    if (!this.changeManager.isActive)
      return;
    if (this.changeManager.activeAction == ChangeAction.Edit)
      return;

    this.lastElementClicked = null;
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
    
    if (this.changeManager.activeAction == ChangeAction.Move)
      this.editMoveMove(mouseCoords);
    else if (this.changeManager.activeAction == ChangeAction.Resize)
      this.editResizeMove(delta);
    else if (this.changeManager.activeAction == ChangeAction.Connection)
      this.editConnectionEdit(delta, mouseCoords);
  }

  private onPointerUp(evt: PointerEvent) {
    if (!this.changeManager.isActive)
      return;
    if (this.changeManager.activeAction == ChangeAction.Edit)
      return;

    if (!this.activeDragging) {
      const controlKeyDown = evt.ctrlKey;
      const target = evt.target as SVGElement;

      if (this.selectedElement !== null && this.selectedElement === this.lastElementClicked && !controlKeyDown && !target.parentElement.classList.contains('selection')) {
        this.editElementText(this.selectedElement);
        return;
      }
      this.lastElementClicked = this.selectedElement;
      this.changeManager.cancelChange();
    } else {
      if (this.changeManager.activeAction == ChangeAction.Move)
        this.editMoveEnd();
      const currentChange = this.changeManager.currentChange;
      
      this.changeManager.finalizeChange();

      if (currentChange.action == ChangeAction.Connection) {
        this.doRelationShipSelection(this.svg.getElementById(currentChange.connection.sourceConnectionId));
      }
    }
    this.selectedDropTarget = null;
    this.activeDragging = false;
  }
  
  private doRelationShipSelection(target: Element) {
    if (this.selectedRelation)
      this.selectedRelation.classList.remove('selected');
    if (this.selectedRelation === (target as unknown as SVGElement))
      this.selectedRelation = null;
    else {
      this.selectedRelation = target as unknown as SVGElement;
      this.selectedRelation.classList.add('selected');
      const parent = this.selectedRelation.ownerSVGElement;
      parent.appendChild(this.selectedRelation);
    }
  }

  private doElementSelection(controlKeyDown: boolean) {
    const elementIsAlreadySelected = this.selectedElement && this.selectedElement.classList.contains('selected');
    this.contentElement.querySelectorAll('g.element>g.selection').forEach(e => {
      e.parentElement.classList.remove('lastSelection');
      if (!controlKeyDown || this.selectedElement === (e.parentElement as Element as SVGGElement)) {
        e.parentElement.classList.remove('selected');
        e.remove();
      }
    });
    this.contentElement.querySelectorAll('g.con.highlight').forEach(e => {
      if (!controlKeyDown || this.selectedElement === (e.parentElement as Element as SVGGElement)) {
        e.classList.remove('highlight');
      }
    });
    if (this.selectedElement && (!controlKeyDown || !elementIsAlreadySelected)) {
      this.selectedElement.classList.add('lastSelection');
      this.selectedElement.classList.add('selected');
      const selectedEntity = this.diagram.GetDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;
      const before = this.selectedElement.querySelector(':scope>foreignObject');
      if (before)
        this.selectedElement.insertBefore(this.renderer.template.getElementSelection(selectedEntity.bounds.width, selectedEntity.bounds.height), before);
      else
        this.selectedElement.appendChild(this.renderer.template.getElementSelection(selectedEntity.bounds.width, selectedEntity.bounds.height));
    }
  }

  private getTextFromElement(element: Element) {
    if (!element.classList.contains('note'))
      return element.querySelector(':scope>foreignObject>div>div')?.textContent;

    const textElement: HTMLDivElement = element.querySelector(':scope>foreignObject>div>div');
  
    // return Array.from(textElement.childNodes)
    //   .map(n => (n as HTMLElement).innerText)
    //   .reduce((a,b) => a+b);

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
      diagramId: this.diagram.Id,
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
    console.log('deselect ' + this.selectedElement?.id);
    this.selectedElement = null;
  }

  private getDiagramElement(element: Element) {
    while (element != null && !(element instanceof SVGGElement))
      element = element.parentElement;
    return element;
  }
  private getOffsetFromContent(element: SVGGElement): {x: number, y: number} {
    let elementOffsetX = 0;
    let elementOffsetY = 0;
    for (;;) {
      const transform = element.transform.baseVal.consolidate();
      if (!transform)
        break;
      elementOffsetX += transform.matrix.e;
      elementOffsetY += transform.matrix.f;
      element = element.parentElement as unknown as SVGGElement;
    }
    return { x: elementOffsetX, y: elementOffsetY };
  }
  
  private editMoveStart() {
    const diagramElement = this.diagram.GetDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;
    this.startDragMouseOffset = { x: this.startDragMousePosition.x - diagramElement.AbsolutePosition.x, y: this.startDragMousePosition.y - diagramElement.AbsolutePosition.y };

    this.changeManager.startChange(<IDiagramChange>{
      action: ChangeAction.Move,
      diagramId: this.diagram.Id,
      move: {
        elementId: this.selectedElement.id,
        positionNew: { x: diagramElement.AbsolutePosition.x, y: diagramElement.AbsolutePosition.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
        positionOld: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
        parentIdNew: this.diagram.Id,
        parentIdOld: diagramElement.parent?.Id ?? this.diagram.Id,
      }
    });
    this.selectedDropTarget = this.selectedElement.parentElement as unknown as SVGGElement;
  }
  
  private editMoveMove(mouseCoords: { x: number; y: number; }) {
    const newPosition = { x: Math.round((mouseCoords.x - this.startDragMouseOffset.x) / 12) * 12, y: Math.round((mouseCoords.y - this.startDragMouseOffset.y) / 12) * 12 };
    const move = this.changeManager.currentChange.move;
    move.positionNew.x = newPosition.x;
    move.positionNew.y = newPosition.y;
    this.changeManager.updateChange();
    this.setDraggingAttributes();
    this.setDropTargetAttributes();
  }

  private editMoveEnd() {
    const move = this.changeManager.currentChange.move;
    if (move) {
      if (this.selectedDropTarget) {
        move.parentIdNew = this.selectedDropTarget.id;
        const parentOffset = this.getOffsetFromContent(this.selectedDropTarget);
        move.positionNew.x -= parentOffset.x;
        move.positionNew.y -= parentOffset.y;
      }
    }
  }

  private editResizeStart(target: SVGElement) {
    const diagramElement = this.diagram.GetDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;
    this.activeChangeResizeCorner = target.classList.item(0);
    this.changeManager.startChange(<IDiagramChange>{
      action: ChangeAction.Resize,
      diagramId: this.diagram.Id,
      move: {
        elementId: this.selectedElement.id,
        positionNew: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
        positionOld: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
        parentIdNew: diagramElement.parent?.Id ?? this.diagram.Id,
        parentIdOld: diagramElement.parent?.Id ?? this.diagram.Id,
      }
    });
  }

  private editResizeMove(delta: { x: number; y: number; }) {
    const move = this.changeManager.currentChange.move;
    if (this.activeChangeResizeCorner.indexOf('w') >= 0) {
      move.positionNew.x = move.positionOld.x + delta.x;
      move.positionNew.width = move.positionOld.width - delta.x;
    }
    if (this.activeChangeResizeCorner.indexOf('e') >= 0) {
      move.positionNew.width = move.positionOld.width + delta.x;
    }
    if (this.activeChangeResizeCorner.indexOf('n') >= 0) {
      move.positionNew.y = move.positionOld.y + delta.y;
      move.positionNew.height = move.positionOld.height - delta.y;
    }
    if (this.activeChangeResizeCorner.indexOf('s') >= 0) {
      move.positionNew.height = move.positionOld.height + delta.y;
    }
    this.changeManager.updateChange();
    this.selectedElement = this.contentElement.ownerSVGElement.getElementById(this.selectedElement.id) as SVGGElement;
    this.selectedElement.classList.add('lastSelection');
    this.selectedElement.classList.add('selected');
    this.setDraggingAttributes();
  }

  private editConnectionStart(target: SVGElement) {
    let index = 0;
    let sibling = target.previousElementSibling;
    while (sibling.tagName == 'circle') {
      index++;
      sibling = sibling.previousElementSibling;
    }
    const sourceConnection = this.diagram.GetDiagramObjectById(target.parentElement.id) as ArchiSourceConnection;
    const bendPointsOld = sourceConnection.BendPoints.map(bp => <IXy>{ x: bp.x, y: bp.y });
    this.changeManager.startChange(<IDiagramChange>{
      action: ChangeAction.Connection,
      diagramId: this.diagram.Id,
      connection: {
        index: index,
        sourceConnectionId: sourceConnection.Id,
        bendPointsOld: bendPointsOld,
        bendPointsNew: bendPointsOld
      }
    });
  }

  private editConnectionEdit(delta: { x: number; y: number; }, mouseCoords: { x: number; y: number; }) {
    const change = this.changeManager.currentChange.connection;
    change.bendPointsNew = change.bendPointsOld.map(xy => <IXy>{ x: xy.x, y: xy.y });
    let bendPointIndex = -1;

    const sourceConnection = this.diagram.GetDiagramObjectById(change.sourceConnectionId) as ArchiSourceConnection;
    const [start, startBounds] = this.renderer.getAbsolutePositionAndBounds(sourceConnection.Source);
    const [end, endBounds] = this.renderer.getAbsolutePositionAndBounds(this.diagram.GetDiagramObjectById(sourceConnection.TargetId));
    const connectionCoords = DiagramRenderer.calculateConnectionCoords(start, startBounds, end, endBounds, sourceConnection);

    if (change.index % 2 == 1) /* intermediate point */ {
      const position = { x: this.startDragMousePosition.x - start.x, y: this.startDragMousePosition.y - start.y };
      bendPointIndex = (change.index - 1) / 2;
      change.bendPointsNew = [...change.bendPointsNew.slice(0, bendPointIndex), { x: position.x, y: position.y }, ...change.bendPointsNew.slice(bendPointIndex)];
    }
    else if (change.index > 0 && (change.index / 2 - 1) < change.bendPointsNew.length)
      bendPointIndex = change.index / 2 - 1;
    if (bendPointIndex >= 0) {
      change.bendPointsNew[bendPointIndex].x = change.bendPointsNew[bendPointIndex].x + delta.x;
      change.bendPointsNew[bendPointIndex].y = change.bendPointsNew[bendPointIndex].y + delta.y;
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
    this.doRelationShipSelection(this.svg.getElementById(change.sourceConnectionId));
  }

  private setDraggingAttributes() {
    if (!this.selectedElement.classList.contains('dragging')) {
      this.selectedElement.classList.add('dragging');
      this.svg.classList.add('dragging');
    }
  }

  private setDropTargetAttributes() {
    const dropTargetCandidates = this.svg.querySelectorAll('g.element:hover');
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

  private getMousePosition(evt: PointerEvent) {
    const CTM = this.svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  }
}

class DiagramChanger
{
  constructor(private renderer: DiagramRenderer, private project: ArchimateProject) {
  }

  public doSvgChange(change: IDiagramChange, finalize = true) {
    const svg = this.renderer.svgContent.ownerSVGElement;
    const diagram = this.renderer.diagram;

    if (change.action == ChangeAction.Move) {
      const move = change.move;
      const element = svg.getElementById(move.elementId) as SVGElement
      if (element.parentElement.id != move.parentIdNew) {
        element.remove();
        const newParent = svg.getElementById(move.parentIdNew ?? 'content') as SVGElement;
        newParent.appendChild(element);
      }
      const selectedElement = svg.getElementById(move.elementId);
      selectedElement.setAttributeNS(null, 'transform', `translate(${move.positionNew.x}, ${move.positionNew.y})`);

      this.renderer.clearRelations();
      this.renderer.addRelations();

      const diagramElement = diagram.GetDiagramObjectById(move.elementId) as ArchiDiagramChild
      const connectionsToRerender = diagram.DescendantsWithSourceConnections.filter(o => o instanceof ArchiSourceConnection && (o.Source.Id == diagramElement.Id || o.TargetId == diagramElement.Id)) as ArchiSourceConnection[];
      connectionsToRerender.forEach(c => {
        const lineG = selectedElement.ownerDocument.getElementById(c.Id);
        if (lineG)
          lineG.classList.add('highlight');
      });

      if (finalize) {
        selectedElement.classList.remove('dragging');
          svg.classList.remove('dragging');
        svg.querySelectorAll('g.drop').forEach(g => g.classList.remove('drop'));
      }
    }
    else if (change.action == ChangeAction.Resize) {
      const resize = change.move;
      const element = svg.getElementById(resize.elementId) as SVGElement
      const parent = element.parentElement;
      const diagramElement = diagram.GetDiagramObjectById(resize.elementId) as ArchiDiagramChild
      element.remove();
      this.renderer.addElement(diagramElement, parent);
      this.renderer.clearRelations();
      this.renderer.addRelations();
    }
    else if (change.action == ChangeAction.Connection) {
      this.renderer.clearRelations();
      this.renderer.addRelations();
    }
    else if (change.action == ChangeAction.Edit) {
      const edit = change.edit;
      if (finalize) { // don't render in case editing is performed by the
        const element = svg.getElementById(edit.elementId) as SVGElement
        const parent = element.parentElement;
        const diagramElement = diagram.GetDiagramObjectById(edit.elementId) as ArchiDiagramChild
        element.remove();
        this.renderer.addElement(diagramElement, parent);
      }
    }
  }
}


class ChangeManager {
  private changeHistory: IDiagramChange[] = [];
  private changeHistoryIndex = 0;
  private _currentChange: IDiagramChange;
  public get currentChange(): IDiagramChange { return this._currentChange; }
  public get isActive(): boolean { return !!this._currentChange; }

  constructor(public project: ArchimateProject, private diagramChanger: DiagramChanger) {
  }

  public get activeAction(): ChangeAction {
     return this._currentChange?.action;
 }

  public undoActive() {
    if (!this.isActive)
      return;
    const undoed = ChangeFunctions.undoChange(this._currentChange);
    this.doDiagramChange(undoed);
    this._currentChange = null;
    this.diagramChanger.doSvgChange(undoed);
  }

  startChange(change: IDiagramChange) {
console.log(`startChange ${ChangeAction[change.action]}`);
    this._currentChange = change;
  }
  
  public updateChange(change: IDiagramChange = this.currentChange) {
    this.doDiagramChange(change, false);
    this._currentChange = change;
    this.diagramChanger.doSvgChange(change, false);
  }

  cancelChange() {
console.log(`cancelChange ${ChangeAction[this._currentChange?.action]}`);
    this._currentChange = null;
  }

  public finalizeChange(change: IDiagramChange = this.currentChange) {
console.log(`finalizeChange ${ChangeAction[this._currentChange?.action]}`);
    this.doDiagramChange(change);
    this._currentChange = null;
    this.diagramChanger.doSvgChange(change);
    
    if (ChangeFunctions.isChanged(change)) {
      this.changeHistory = this.changeHistory.slice(0, this.changeHistoryIndex);
      this.changeHistory.push(change);
      this.changeHistoryIndex++;
    }
  }

  public undo() {
    if (this.isActive) {
      this.undoActive();
      return;
    }
    if (this.changeHistoryIndex == 0)
      return;
    this.changeHistoryIndex--;
    const undoed = ChangeFunctions.undoChange(this.changeHistory[this.changeHistoryIndex]);
    this.doDiagramChange(undoed);
    this._currentChange = null;
    this.diagramChanger.doSvgChange(undoed);
  }

  public redo() {
    if (this.isActive) {
      this.undoActive();
      return;
    }
    if (this.changeHistoryIndex >= this.changeHistory.length)
      return;
    const redo = this.changeHistory[this.changeHistoryIndex];
    this.changeHistoryIndex++;
    this.doDiagramChange(redo);
    this._currentChange = null;
    this.diagramChanger.doSvgChange(redo);
  }

  private doDiagramChange(diagramChange: IDiagramChange, finalize = true) {
    const diagram = this.project.getById(diagramChange.diagramId) as ArchiDiagram;
    if (diagramChange.move) {
      const change = diagramChange.move;
      const element = diagram.GetDiagramObjectById(change.elementId) as ArchiDiagramChild
      const parentElement = change.parentIdNew  == diagram.Id ? null : diagram.GetDiagramObjectById(change.parentIdNew) as ArchiDiagramChild

      if (element.parent != parentElement) {
        if (parentElement != null)
          element.changeElementParent(parentElement);
        else
          element.changeElementParentDiagram(diagram);
      }
      element.bounds = new ElementBounds(change.positionNew.x, change.positionNew.y, change.positionNew.width, change.positionNew.height);
    }
    if (diagramChange.connection) {
      const change = diagramChange.connection;
      const sourceConnection = diagram.GetDiagramObjectById(change.sourceConnectionId) as ArchiSourceConnection;
      sourceConnection.BendPoints = change.bendPointsNew.map(xy => <ElementPos>{ x: xy.x, y: xy.y});
    }
    if (diagramChange.edit) {
      const change = diagramChange.edit;
      const element = diagram.GetDiagramObjectById(change.elementId) as ArchiDiagramChild
      if (element.ElementId) {
        const archiElement = this.project.getById(element.ElementId)
        archiElement.name = change.textNew;
      } else {
        element.content = change.textNew;
      }
    }
  }
}
