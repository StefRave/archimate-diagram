import { ArchiDiagram, ArchiDiagramChild, ArchimateProject, ArchiSourceConnection, ElementBounds, ElementPos } from './greeter';
import { DiagramRenderer } from './diagram-renderer';
import { ChangeAction, ChangeFunctions, IDiagramChange, IXy } from './diagram-change';

export class DiagramEditor {
  private readonly contentElement: SVGGElement;
  private selectedElementId: string;
  private selectedElementIdDoubleClicked: boolean;
  private startDragMousePosition: {x: number, y: number};
  private startDragMouseOffset: {x: number, y: number};
  private activeDragging: boolean;
  private changeManager: ChangeManager;
  private keyDownFunction = (evt: KeyboardEvent) => this.onKeyDown(evt);

  private get selectedElement(): SVGGElement { return this.contentElement.ownerSVGElement.getElementById(this.selectedElementId) as SVGGElement; }

  constructor(private svg: SVGSVGElement, private project: ArchimateProject, private diagram: ArchiDiagram, private renderer: DiagramRenderer) {
    this.contentElement = svg.querySelector('svg>g');
    this.changeManager = new ChangeManager(project, new EditActionBuilder(renderer, project));
  }

  public makeDraggable() {
    this.svg.addEventListener('touchstart', (evt) => this.onTouchStart(evt));
    this.svg.addEventListener('pointerdown', (evt) => this.onPointerDown(evt));
    this.svg.addEventListener('pointermove', (evt) => this.onPointerMove(evt));
    this.svg.addEventListener('pointerup', (evt) => this.onPointerUp(evt));
    this.svg.addEventListener('focusout', (evt) => this.onFocusOut(evt));
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
      this.selectedElementId = null;
      this.renderer.highlightedElementId = null;
      this.renderer.selectedRelationId = null;
      this.renderer.removeElementSelections();
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
    console.log('onTouchStart ' + this.changeManager.activeAction || this.selectedElement);
    if (this.changeManager.activeAction || this.selectedElement) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
  }

  private onPointerDown(evt: PointerEvent) {
    if (this.changeManager.activeAction == ChangeAction.Edit)
      return;
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

    console.log('select ' + this.selectedElementId);
    const controlKeyDown = evt.ctrlKey;
    this.activeDragging = false;

    evt.preventDefault();
    evt.stopImmediatePropagation();

    this.startDragMousePosition = this.getMousePosition(evt);
    this.startDragMouseOffset = {x: 0, y: 0}

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
    if (!this.changeManager.isActive)
      return;
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
  
  private editMoveStart() {
    const diagramElement = this.diagram.getDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;
    this.startDragMouseOffset = { x: this.startDragMousePosition.x - diagramElement.AbsolutePosition.x, y: this.startDragMousePosition.y - diagramElement.AbsolutePosition.y };

    this.changeManager.startChange(<IDiagramChange>{
      action: ChangeAction.Move,
      diagramId: this.diagram.id,
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

  private getMousePosition(evt: PointerEvent) {
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

    const element = renderer.diagram.getDiagramObjectById(change.elementId) as ArchiDiagramChild
    const parentElement = change.parentIdNew == renderer.diagram.id ? null : renderer.diagram.getDiagramObjectById(change.parentIdNew) as ArchiDiagramChild
    element.parent = parentElement;
    element.bounds = new ElementBounds(change.positionNew.x, change.positionNew.y, change.positionNew.width, change.positionNew.height);
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
    if (element.elementId) {
      const archiElement = project.getById(element.elementId)
      archiElement.name = change.textNew;
    } else {
      element.content = change.textNew;
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
    this.currentChange = null;
  }

  startChange(change: IDiagramChange) {
console.log(`startChange ${ChangeAction[change.action]}`);
    this.currentChange = change;
  }
  
  public updateChange(change: IDiagramChange = this.currentChange) {
    this.currentChange = change;
    this.changer.doDiagramChange(ChangeState.Active);
    this.changer.doSvgChange(ChangeState.Active);
  }


  public finalizeChange(change: IDiagramChange = this.currentChange) {
console.log(`finalizeChange ${ChangeAction[this.currentChange?.action]}`);
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
    if (this.changeHistoryIndex == 0)
      return;
    this.changeHistoryIndex--;
    this.currentChange = ChangeFunctions.undoChange(this.changeHistory[this.changeHistoryIndex]);
    this.changer.doDiagramChange();
    this.changer.doSvgChange();
    this.currentChange = null;
  }

  public redo() {
    if (this.isActive) {
      this.undoActive();
      return;
    }
    if (this.changeHistoryIndex >= this.changeHistory.length)
      return;
    this.currentChange = this.changeHistory[this.changeHistoryIndex];
    this.changeHistoryIndex++;
    this.changer.doDiagramChange();
    this.changer.doSvgChange();
    this.currentChange = null;
  }
}
