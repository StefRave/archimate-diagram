import { ArchiDiagram, ArchiDiagramChild, ArchimateProject, ArchiSourceConnection, ElementBounds, ElementPos } from './greeter';
import { DiagramRenderer } from './diagram-renderer';

export class DiagramEditor {
  private readonly contentElement: SVGGElement;
  private selectedElement: SVGGElement;
  private startDragMousePosition: {x: number, y: number};
  private startDragMouseOffset: {x: number, y: number};
  private lastElementClicked: SVGElement;
  private selectedRelation: SVGElement;
  private selectedDropTarget: SVGGElement;
  private activeChange: IDiagramChange;
  private activeChangeAction: ChangeAction; 
  private activeChangeResizeCorner: string;
  private activeDragging: boolean;

  constructor(private svg: SVGSVGElement, private project: ArchimateProject, private diagram: ArchiDiagram, private renderer: DiagramRenderer) {
    this.contentElement = svg.querySelector('svg>g');
  }

  public makeDraggable() {
    this.svg.addEventListener('touchstart', (evt) => this.onTouchStart(evt));
    this.svg.addEventListener('pointerdown', (evt) => this.onPointerDown(evt));
    this.svg.addEventListener('pointermove', (evt) => this.onPointerMove(evt));
    this.svg.addEventListener('pointerup', () => this.onPointerUp());
    // this.svg.addEventListener('pointerleave', (evt) => this.endDrag(evt));
    this.svg.addEventListener('focusout', (evt) => {
      const focusedElement = this.getElementFromChild(evt.target as Element);
      if (focusedElement && this.selectedElement == null)
        this.lastElementClicked = null;
      const sel = window.getSelection();
      sel.removeAllRanges();
    });
    this.svg.ownerDocument.addEventListener('keydown', (evt) => this.onKeyDown(evt));
  }

  private onKeyDown(evt: KeyboardEvent) {
    const target = evt.target as HTMLElement;
    const targetElement = target.closest('.element');
    if (evt.key === 'Enter' && targetElement.classList.contains('note')) {
      evt.preventDefault();
      const sel = window.getSelection();
      const atEnd = sel.focusOffset == sel.anchorNode.textContent.length;
      const textContentCount = sel.focusNode.parentNode.childNodes.length;
      document.execCommand('insertHTML', false, '\n');
      if (textContentCount < sel.focusNode.parentNode.childNodes.length) {
        // firefox seems to sometimes create a next text element, and not move the cursor
        // If this happens, move the cursor to the beginning of the next text element
        const range = document.createRange();
        
        range.setStart(window.getSelection().focusNode.nextSibling, 0);
        range.collapse(true);
        
        sel.removeAllRanges();
        sel.addRange(range);
      }
      else if(atEnd && sel.focusOffset != sel.anchorNode.textContent.length) {
        document.execCommand('insertHTML', false, '\n');
      }
      return false; 
    }
    else if (evt.key == 'Enter' || evt.key == 'Escape') {
      (evt.target as HTMLElement).blur();
    }
    else if (evt.key == 'F2') {
      const elmentToEdit = this.contentElement.querySelector(':scope g.lastSelection');
      this.editElementText(elmentToEdit);
    }
  }

  private onTouchStart(evt: TouchEvent) {
    if (this.activeChangeAction != null || this.selectedElement) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }
  }

  private onPointerDown(evt: PointerEvent) {
    const target = evt.target as SVGElement;
    evt.preventDefault();
    evt.stopImmediatePropagation();
    this.selectedElement = target.closest('.element');
    const controlKeyDown = evt.ctrlKey;
    this.activeDragging = false;

    if (this.selectedElement !== null && this.selectedElement === this.lastElementClicked && !controlKeyDown && !target.parentElement.classList.contains('selection')) {
      this.editElementText(this.selectedElement);
      return;
    }
    this.startDragMousePosition = this.getMousePosition(evt);
    this.startDragMouseOffset = {x: 0, y: 0}

    this.lastElementClicked = this.selectedElement;
    if (this.selectedElement != null) {
      const diagramElement = this.diagram.GetDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;
      if (target.tagName === 'circle' && target.parentElement.classList.contains('selection')) {
        this.activeChangeResizeCorner = target.classList.item(0);
        this.activeChangeAction = ChangeAction.Resize;
        this.activeChange = <IDiagramChange>{
          move: {
            elementId: this.selectedElement.id,
            positionNew: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
            positionOld: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
            parentIdNew: diagramElement.parent?.Id ?? this.diagram.Id,
            parentIdOld: diagramElement.parent?.Id ?? this.diagram.Id,
          }
        }
      }
      else {
        this.activeChangeAction = ChangeAction.Move;
        this.startDragMouseOffset = { x: this.startDragMousePosition.x - diagramElement.AbsolutePosition.x, y: this.startDragMousePosition.y - diagramElement.AbsolutePosition.y }
        this.activeChange = <IDiagramChange>{
          move: {
            elementId: this.selectedElement.id,
            positionNew: { x: diagramElement.AbsolutePosition.x, y: diagramElement.AbsolutePosition.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
            positionOld: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
            parentIdNew: this.diagram.Id, // during the move the element is positioned at the root so that the element is in front
            parentIdOld: diagramElement.parent?.Id ?? this.diagram.Id,
          }
        }
        this.selectedDropTarget = this.selectedElement.parentElement as unknown as SVGGElement;
      }
    }
    else if (target.tagName === 'circle' && target.parentElement.classList.contains('con')) {
      if (!target.classList.contains('end')) {
        this.activeChangeAction = ChangeAction.Connection;
        let index = 0;
        let sibling = target.previousElementSibling;
        while (sibling.tagName == 'circle') {
          index++;
          sibling = sibling.previousElementSibling;
        }
        const sourceConnection = this.diagram.GetDiagramObjectById(target.parentElement.id) as ArchiSourceConnection;
        const bendPointsOld = sourceConnection.BendPoints.map(bp => <IXy>{ x: bp.x, y: bp.y});
        this.activeChange = <IDiagramChange>{
          connection: {
            index: index,
            sourceConnectionId: sourceConnection.Id,
            bendPointsOld: bendPointsOld,
            bendPointsNew: bendPointsOld
          }
        }
      }
    }
    this.doElementSelection(controlKeyDown);
    
    if (target.classList.contains('RelationshipDetect')) {
      this.doRelationShipSelection(target.parentElement);
    }
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

  private editElementText(element: Element) {
    const toEdit: HTMLDivElement = element.querySelector(':scope>foreignObject>div>div');
    const focusedElement = this.getElementFromChild(document.activeElement);
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
    this.selectedElement = null;
  }

  private getElementFromChild(element: Element) {
    while (element != null && !(element instanceof SVGGElement))
      element = element.parentElement;
    return element;
  }
  private getOffsetFromContent(element: SVGGElement): {x: number, y: number} {
    let elementOffsetX = 0;
    let elementOffsetY = 0;
    while (element !== this.contentElement) {
      const transform = element.transform.baseVal.consolidate();
      elementOffsetX += transform.matrix.e;
      elementOffsetY += transform.matrix.f;
      element = element.parentElement as unknown as SVGGElement;
    }
    return { x: elementOffsetX, y: elementOffsetY };
  }

  private onPointerMove(evt: PointerEvent) {
    if (this.activeChangeAction == null)
      return;

    this.lastElementClicked = null;
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    
    const mouseCoords = this.getMousePosition(evt);
    const delta = { x: mouseCoords.x - this.startDragMousePosition.x, y: mouseCoords.y - this.startDragMousePosition.y };
    const distanceFromStart = Math.sqrt(delta.x ** 2 + delta.y ** 2);

    if (!this.activeDragging) {
      if (distanceFromStart >= 5)
        this.activeDragging = true;
    }
    if (!this.activeDragging)
      return;

    if (this.activeChangeAction == ChangeAction.Move) {
      const newPosition = { x: Math.round((mouseCoords.x - this.startDragMouseOffset.x) / 12) * 12, y: Math.round((mouseCoords.y - this.startDragMouseOffset.y) / 12) * 12};
      this.activeChange.move.positionNew.x = newPosition.x;
      this.activeChange.move.positionNew.y = newPosition.y;

      this.doDiagramChange(this.activeChange);
      this.doSvgChange(this.activeChange);
      this.setDraggingAttributes();
      this.setDropTargetAttributes();
    }
    else if (this.activeChangeAction == ChangeAction.Resize) {
      if (this.activeChangeResizeCorner.indexOf('w') >= 0) {
        this.activeChange.move.positionNew.x = this.activeChange.move.positionOld.x + delta.x;
        this.activeChange.move.positionNew.width = this.activeChange.move.positionOld.width - delta.x;
      }
      if (this.activeChangeResizeCorner.indexOf('e') >= 0) {
        this.activeChange.move.positionNew.width = this.activeChange.move.positionOld.width + delta.x;
      }
      if (this.activeChangeResizeCorner.indexOf('n') >= 0) {
        this.activeChange.move.positionNew.y = this.activeChange.move.positionOld.y + delta.y;
        this.activeChange.move.positionNew.height = this.activeChange.move.positionOld.height - delta.y;
      }
      if (this.activeChangeResizeCorner.indexOf('s') >= 0) {
        this.activeChange.move.positionNew.height = this.activeChange.move.positionOld.height + delta.y;
      }
      this.doDiagramChange(this.activeChange);
      this.doSvgChange(this.activeChange);
      this.setDraggingAttributes();
    }
    else if (this.activeChangeAction == ChangeAction.Connection) {
      const change = this.activeChange.connection;
      change.bendPointsNew = change.bendPointsOld.map(xy => <IXy>{ x: xy.x, y: xy.y});
      let bendPointIndex = -1;

      const sourceConnection = this.diagram.GetDiagramObjectById(change.sourceConnectionId) as ArchiSourceConnection;
      const [start, startBounds] = this.renderer.getAbsolutePositionAndBounds(sourceConnection.Source);
      const [end, endBounds] = this.renderer.getAbsolutePositionAndBounds(this.diagram.GetDiagramObjectById(sourceConnection.TargetId));
      const connectionCoords = DiagramRenderer.calculateConnectionCoords(start, startBounds, end, endBounds, sourceConnection);

      if (change.index % 2 == 1) /* intermediate point */ {
        const position = { x: this.startDragMousePosition.x - start.x, y: this.startDragMousePosition.y - start.y };
        bendPointIndex = (change.index - 1) / 2;
        change.bendPointsNew = [...change.bendPointsNew.slice(0, bendPointIndex), {x: position.x, y: position.y}, ...change.bendPointsNew.slice(bendPointIndex)]
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
              change.bendPointsNew = [...change.bendPointsNew.slice(0, i + 1), ...change.bendPointsNew.slice(bendPointIndex + 1)]
            else
              change.bendPointsNew = [...change.bendPointsNew.slice(0, bendPointIndex), ...change.bendPointsNew.slice(i)]
            break;
          }
        }
      }

      this.doDiagramChange(this.activeChange);
      this.doSvgChange(this.activeChange);
      this.doRelationShipSelection(this.svg.getElementById(this.activeChange.connection.sourceConnectionId));
    }
  }

  private onPointerUp() {
    if (this.activeChangeAction == null)
      return;

    if (this.activeChange.move) {
      if (this.selectedDropTarget) {
        this.activeChange.move.parentIdNew = this.selectedDropTarget.id;
        const parentOffset = this.getOffsetFromContent(this.selectedDropTarget);
        this.activeChange.move.positionNew.x -= parentOffset.x;
        this.activeChange.move.positionNew.y -= parentOffset.y;
      }
    }
    this.doDiagramChange(this.activeChange);
    this.doSvgChange(this.activeChange);
    if (this.activeChangeAction == ChangeAction.Connection) {
      this.doRelationShipSelection(this.svg.getElementById(this.activeChange.connection.sourceConnectionId));
    }
    
    if (this.selectedElement)
      this.selectedElement.classList.remove('dragging');
    this.svg.classList.remove('dragging');

    if (this.selectedDropTarget)
      this.selectedDropTarget.classList.remove('drop');

    this.selectedDropTarget = null;
    this.selectedElement = null;
    this.activeChange = null;
    this.activeChangeAction = null;
    this.activeDragging = false;
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

  private doSvgChange(change: IDiagramChange) {
    if (this.activeChangeAction == ChangeAction.Move) {
      const move = change.move;
      const element = this.svg.getElementById(move.elementId) as SVGElement
      if (element.parentElement.id != move.parentIdNew) {
        element.remove();
        const newParent = this.svg.getElementById(move.parentIdNew ?? 'Content') as SVGElement;
        newParent.appendChild(element);
      }
      this.selectedElement.setAttributeNS(null, 'transform', `translate(${move.positionNew.x}, ${move.positionNew.y})`);

      this.renderer.clearRelations();
      this.renderer.addRelations();

      const diagramElement = this.diagram.GetDiagramObjectById(move.elementId) as ArchiDiagramChild
      const connectionsToRerender = this.diagram.DescendantsWithSourceConnections.filter(o => o instanceof ArchiSourceConnection && (o.Source.Id == diagramElement.Id || o.TargetId == diagramElement.Id)) as ArchiSourceConnection[];
      connectionsToRerender.forEach(c => {
        const lineG = this.selectedElement.ownerDocument.getElementById(c.Id);
        if (lineG)
          lineG.classList.add('highlight');
      });
    }
    else if (this.activeChangeAction == ChangeAction.Resize) {
      const resize = change.move;
      const element = this.svg.getElementById(resize.elementId) as SVGElement
      const parent = element.parentElement;
      const diagramElement = this.diagram.GetDiagramObjectById(resize.elementId) as ArchiDiagramChild
      element.remove();
      this.renderer.addElement(diagramElement, parent);
      this.renderer.clearRelations();
      this.renderer.addRelations();
    }
    else if (this.activeChangeAction == ChangeAction.Connection) {
      this.renderer.clearRelations();
      this.renderer.addRelations();
    }
  }

  private doDiagramChange(diagramChange: IDiagramChange) {
    if (diagramChange.move) {
      const change = diagramChange.move;
      const element = this.diagram.GetDiagramObjectById(change.elementId) as ArchiDiagramChild
      const parentElement = change.parentIdNew  == this.diagram.Id ? null : this.diagram.GetDiagramObjectById(change.parentIdNew) as ArchiDiagramChild

      if (element.parent != parentElement) {
        if (parentElement != null)
          element.changeElementParent(parentElement);
        else
          element.changeElementParentDiagram(this.diagram);
      }
      element.bounds = new ElementBounds(change.positionNew.x, change.positionNew.y, change.positionNew.width, change.positionNew.height);
    }
    if (diagramChange.connection) {
      const change = diagramChange.connection;
      const sourceConnection = this.diagram.GetDiagramObjectById(change.sourceConnectionId) as ArchiSourceConnection;
      sourceConnection.BendPoints = change.bendPointsNew.map(xy => <ElementPos>{ x: xy.x, y: xy.y});
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

enum ChangeAction {
  Move,
  Resize,
  Connection,
}
interface IDiagramChange {
  move: IDiagramChangeMove;
  connection: IDiagramChangeConnection;
}

interface IDiagramChangeMove {
  elementId: string;
  positionNew: IPosSize;
  positionOld: IPosSize;
  parentIdNew: string;
  parentIdOld: string;
}

interface IPosSize {
  x: number,
  y: number,
  width: number,
  height: number,
}

interface IDiagramChangeConnection {
  sourceConnectionId: string;
  index: number;
  bendPointsNew: IXy[];
  bendPointsOld: IXy[];
}

interface IXy {
  x: number,
  y: number,
}
