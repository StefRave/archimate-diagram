import { ArchiDiagram, ArchiDiagramChild, ArchimateProject, ArchiSourceConnection, ElementBounds } from './greeter';
import { DiagramTemplate } from './diagram-renderer';

export class DiagramEditor {
  private readonly contentElement: SVGGElement;
  private selectedElement: SVGGElement;
  private startDragMousePosition: {x: number, y: number};
  private lastElementClicked: SVGElement;
  private selectedRelation: SVGElement;
  private selectedDropTarget: SVGGElement;

  constructor(private svg: SVGSVGElement, private project: ArchimateProject, private diagram: ArchiDiagram, private diagramTemplate: DiagramTemplate) {
    this.contentElement = this.svg.querySelector('svg>g') as SVGGElement;
  }

  public makeDraggable() {

    this.svg.addEventListener('pointerdown', (evt) => this.onPointerDown(evt));
    this.svg.addEventListener('pointermove', (evt) => this.onPointerMove(evt));
    this.svg.addEventListener('pointerup', (evt) => this.onPointerUp(evt));
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

    if (this.selectedElement !== null && this.selectedElement === this.lastElementClicked && !controlKeyDown) {
      this.editElementText(this.selectedElement);
      return;
    }
    this.lastElementClicked = this.selectedElement;

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
    if (this.selectedRelation === (target.parentElement as any as SVGElement))
      this.selectedRelation = null;
    else {
      this.selectedRelation = target.parentElement as any as SVGElement;
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
        this.selectedElement.insertBefore(this.diagramTemplate.getElementSelection(selectedEntity.bounds.width, selectedEntity.bounds.height), before);
      else
        this.selectedElement.appendChild(this.diagramTemplate.getElementSelection(selectedEntity.bounds.width, selectedEntity.bounds.height));
      
      const connectionsToHighlight = this.diagram.DescendantsWithSourceConnections.filter(o => o instanceof ArchiSourceConnection && (o.Source.Id == selectedEntity.Id || o.TargetId == selectedEntity.Id)) as ArchiSourceConnection[];
      connectionsToHighlight.forEach(c => {
        const lineG = this.selectedElement.ownerDocument.getElementById(c.Id);
        if (lineG)
          lineG.classList.add('highlight');
      });
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
  private getOffsetFromContent(element: SVGGElement): [number, number] {
    let elementOffsetX = 0;
    let elementOffsetY = 0;
    while (element !== this.contentElement) {
      const transform = element.transform.baseVal.consolidate();
      elementOffsetX += transform.matrix.e;
      elementOffsetY += transform.matrix.f;
      element = element.parentElement as any as SVGGElement;
    }
    return [elementOffsetX, elementOffsetY];
  }

  private onPointerMove(evt: PointerEvent) {
    if (this.selectedElement) {
      this.lastElementClicked = null;
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      
      const coord = this.getMousePosition(evt);
      const delta = { x: coord.x - this.startDragMousePosition.x, y: coord.y - this.startDragMousePosition.y };

      const isDragging = this.selectedElement.classList.contains('dragging');
      let startDragging = false;
      if (!isDragging) {
        const distanceFromStart = Math.sqrt(delta.x ** 2 + delta.y ** 2);
        if (distanceFromStart >= 5)
          startDragging = true;
      }
      if (startDragging || isDragging) {
        const diagramElement = this.diagram.GetDiagramObjectById(this.selectedElement.id) as ArchiDiagramChild;
        const absolutePosition = diagramElement.AbsolutePosition;
        const change =
        <IDiagramChange>{
          move: {
            elementId: this.selectedElement.id,
            position: { x: absolutePosition.X + delta.x, y: absolutePosition.Y + delta.y} ,
            parentId: this.diagram.Id
          }
        }
        this.doSvgChange(change);
        this.setDraggingAttributes();
      }
    }
  }

  private setDraggingAttributes() {
    if (!this.selectedElement.classList.contains('dragging')) {
      this.selectedElement.classList.add('dragging');
      this.svg.classList.add('dragging');
    }

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
    const move = change.move;
    if (move) {
      const element = this.svg.getElementById(move.elementId) as SVGElement
      if (element.parentElement.id != move.parentId) {
        element.remove();
        const newParent = this.svg.getElementById(move.parentId ?? 'Content') as SVGElement;
        newParent.appendChild(element);
      }
      const newX = move.position.x; 
      const newY = move.position.y;
      this.selectedElement.setAttributeNS(null, 'transform', `translate(${Math.round(newX / 12) * 12}, ${Math.round(newY / 12) * 12})`);
    }
  }

  private doDiagramChange(change: IDiagramChange) {
    const move = change.move;
    if (move) {
      const element = this.diagram.GetDiagramObjectById(move.elementId) as ArchiDiagramChild
      const parentElement = move.parentId == this.diagram.Id ? null : this.diagram.GetDiagramObjectById(move.parentId) as ArchiDiagramChild

      if (element.parent != parentElement) {
        if (parentElement != null)
          element.changeElementParent(parentElement);
        else
          element.changeElementParentDiagram(this.diagram);
      }
      element.bounds = new ElementBounds(move.position.x, move.position.y, element.bounds.width, element.bounds.height);
    }
  }

  private onPointerUp(evt: PointerEvent) {
    if (this.selectedElement && this.selectedElement.classList.contains('dragging')) {
      // if (this.selectedDropTarget) {
        const [elementOffsetX, elementOffsetY] = this.getOffsetFromContent(this.selectedElement);
        const [parentOffsetX, parentOffsetY] = this.getOffsetFromContent(this.selectedDropTarget ?? this.contentElement);
  
        const change =
          <IDiagramChange>{
            move: {
              elementId: this.selectedElement.id,
              position: { x: elementOffsetX - parentOffsetX, y: elementOffsetY - parentOffsetY} ,
              parentId: (this.selectedDropTarget ?? this.contentElement).id
            }
          }
        this.doSvgChange(change);
        this.doDiagramChange(change);
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
  }
  
  private getMousePosition(evt: PointerEvent) {
    const CTM = this.svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  }
}

interface IDiagramChange {
  move: IDiagramChangeMove;
}

interface IDiagramChangeMove {
  elementId: string;
  position: IXY;
  parentId: string;
}

interface IXY {
  x: number,
  y: number,
}
