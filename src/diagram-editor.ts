import { ArchiDiagram, ArchiDiagramChild, ArchimateProject, ArchiSourceConnection, ElementBounds } from './greeter';
import { DiagramRenderer } from './diagram-renderer';

export class DiagramEditor {
  private readonly contentElement: SVGGElement;
  private selectedElement: SVGGElement;
  private startDragMousePosition: {x: number, y: number};
  private lastElementClicked: SVGElement;
  private selectedRelation: SVGElement;
  private selectedDropTarget: SVGGElement;
  private activeChange: IDiagramChange;
  private activeChangeAction: ChangeAction; 
  private activeChangeResizeCorner: string;

  constructor(private svg: SVGSVGElement, private project: ArchimateProject, private diagram: ArchiDiagram, private renderer: DiagramRenderer) {
    this.contentElement = svg.querySelector('svg>g');
  }

  public makeDraggable() {
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

  private onPointerDown(evt: PointerEvent) {
    const target = evt.target as SVGElement;

    this.selectedElement = target.closest('.element');
    const controlKeyDown = evt.ctrlKey;


    if (this.selectedElement !== null && this.selectedElement === this.lastElementClicked && !controlKeyDown && !target.parentElement.classList.contains('selection')) {
      this.editElementText(this.selectedElement);
      return;
    }
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
        this.activeChange = <IDiagramChange>{
          move: {
            elementId: this.selectedElement.id,
            positionNew: { x: diagramElement.AbsolutePosition.x, y: diagramElement.AbsolutePosition.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
            positionOld: { x: diagramElement.bounds.x, y: diagramElement.bounds.y, width: diagramElement.bounds.width, height: diagramElement.bounds.height },
            parentIdNew: this.diagram.Id, // during the move the element is positioned at the root so that the element is in front
            parentIdOld: diagramElement.parent?.Id ?? this.diagram.Id,
          }
        }
      }
    }
    this.doElementSelection(controlKeyDown);
    
    if (this.selectedElement != null) {
      if (target.parentElement.classList.contains('selection')) {
        // resize
      }
      this.startDragMousePosition = this.getMousePosition(evt);
    }
    else if (target.classList.contains('RelationshipDetect')) {
      this.doRelationShipSelection(target);
    }
  }

  private doRelationShipSelection(target: SVGElement) {
    if (this.selectedRelation)
      this.selectedRelation.classList.remove('selected');
    if (this.selectedRelation === (target.parentElement as unknown as SVGElement))
      this.selectedRelation = null;
    else {
      this.selectedRelation = target.parentElement as unknown as SVGElement;
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
    if (this.selectedElement) {
      this.lastElementClicked = null;
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      
      const coord = this.getMousePosition(evt);
      const delta = { x: coord.x - this.startDragMousePosition.x, y: coord.y - this.startDragMousePosition.y };
      const distanceFromStart = Math.sqrt(delta.x ** 2 + delta.y ** 2);
      const isDragging = this.selectedElement.classList.contains('dragging');
      let startDragging = false;
      if (!isDragging) {
        if (distanceFromStart >= 5)
          startDragging = true;
      }
      const diagramElement = this.diagram.GetDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;

      if (startDragging || isDragging) {
        if (this.activeChangeAction == ChangeAction.Move) {
          const absolutePosition = diagramElement.AbsolutePosition;
          const newPosition = { x: Math.round((absolutePosition.x + delta.x) / 12) * 12, y: Math.round((absolutePosition.y + delta.y) / 12) * 12};
          this.activeChange.move.positionNew.x = newPosition.x;
          this.activeChange.move.positionNew.y = newPosition.y;

          this.doSvgChange(this.activeChange);
          this.setDraggingAttributes();
          this.setDropTargerAttributes();
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
          this.doSvgChange(this.activeChange);
          this.setDraggingAttributes();
        }
      }
    }
  }

  private onPointerUp() {
    if (this.selectedElement && this.selectedElement.classList.contains('dragging')) {
      // if (this.selectedDropTarget) {

        if (this.activeChange.move) {
          if (this.selectedDropTarget) {
            this.activeChange.move.parentIdNew = this.selectedDropTarget.id;
            const parentOffset = this.getOffsetFromContent(this.selectedDropTarget);
            this.activeChange.move.positionNew.x -= parentOffset.x;
            this.activeChange.move.positionNew.y -= parentOffset.y;
          }
        }
        this.doSvgChange(this.activeChange);
        this.doDiagramChange(this.activeChange);

        this.renderer.clearRelations();
        this.renderer.addRelations();
      // } else {
      //   const firstConnector = this.contentElement.querySelector(':scope>.con');
      //   if (firstConnector)
      //     this.contentElement.insertBefore(this.selectedElement, firstConnector);
      //   else
      //     this.contentElement.appendChild(this.selectedElement);
      // }
      this.selectedElement.classList.remove('dragging');
      this.svg.classList.remove('dragging');
    }
    if (this.selectedDropTarget) {
      this.selectedDropTarget.classList.remove('drop');
    }
    this.selectedDropTarget = null;
    this.selectedElement = null;
    this.activeChange = null;
  }
  
  private setDraggingAttributes() {
    if (!this.selectedElement.classList.contains('dragging')) {
      this.selectedElement.classList.add('dragging');
      this.svg.classList.add('dragging');
    }
  }

  private setDropTargerAttributes() {
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

      const diagramElement = this.diagram.GetDiagramObjectById(move.elementId) as ArchiDiagramChild
      const connectionsToRerender = this.diagram.DescendantsWithSourceConnections.filter(o => o instanceof ArchiSourceConnection && (o.Source.Id == diagramElement.Id || o.TargetId == diagramElement.Id)) as ArchiSourceConnection[];
      connectionsToRerender.forEach(c => {
        const lineG = this.selectedElement.ownerDocument.getElementById(c.Id);
        if (lineG)
          lineG.classList.add('highlight');
      });
    }
    if (this.activeChangeAction == ChangeAction.Resize) {
      this.doDiagramChange(change);
      const resize = change.move;
      const element = this.svg.getElementById(resize.elementId) as SVGElement
      const parent = element.parentElement;
      const diagramElement = this.diagram.GetDiagramObjectById(resize.elementId) as ArchiDiagramChild
      element.remove();
      this.renderer.addElement(diagramElement, parent);
    }
  }

  private doDiagramChange(change: IDiagramChange) {
    const move = change.move;
    if (move) {
      const element = this.diagram.GetDiagramObjectById(move.elementId) as ArchiDiagramChild
      const parentElement = move.parentIdNew  == this.diagram.Id ? null : this.diagram.GetDiagramObjectById(move.parentIdNew) as ArchiDiagramChild

      if (element.parent != parentElement) {
        if (parentElement != null)
          element.changeElementParent(parentElement);
        else
          element.changeElementParentDiagram(this.diagram);
      }
      element.bounds = new ElementBounds(move.positionNew.x, move.positionNew.y, move.positionNew.width, move.positionNew.height);
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
}
interface IDiagramChange {
  move: IDiagramChangeMove;
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
