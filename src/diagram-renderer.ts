import { ArchimateProject, ArchiDiagram, ArchiDiagramChild, ElementPos, ArchiDiagramObject, ArchiEntity, ArchiSourceConnection, ImagePosition, TextPosition, TextAlignment, SourceConnectionType } from './greeter';
import { DiagramTemplate, EditInfoElement, ElementSelectionElement } from './diagram-template';
import { DiagramImageCache } from './diagram-image-cache';

/**
 *  
 */
export class DiagramRenderer {
  private readonly svgDocument: SVGSVGElement;
  public readonly svgContent: SVGGElement;
  public readonly groupEditInfo: SVGGElement;
  public readonly groupElementSelection: SVGGElement;
  private readonly sourceConnectionMiddlePoints: Map<string, ElementPos>;
  private readonly imageCache: DiagramImageCache;
  private readonly elementSelections = new Map<string, ElementSelectionElement>();
  private _editInfo: EditInfoElement;
  private _highlightedElementId: string;
  private _selectedRelationId: string;
 
  constructor(public readonly project: ArchimateProject, public readonly diagram: ArchiDiagram, public readonly template: DiagramTemplate) {
    this.svgDocument = this.template.getEmptySvg();
    this.svgContent = this.svgDocument.getElementById('content') as SVGGElement;
    this.groupEditInfo = this.createSvgGElement();
    this.svgContent.parentElement.appendChild(this.groupEditInfo);
    this.groupElementSelection = this.createSvgGElement()
    this.svgContent.parentElement.appendChild(this.groupElementSelection);

    this.sourceConnectionMiddlePoints = new Map<string, ElementPos>();
    this.imageCache = new DiagramImageCache(project, this.svgDocument.getElementById('imageDefs') as SVGGElement);
  }

  public get svg(): SVGSVGElement { return this.svgContent.ownerSVGElement; }

  public buildSvg(): SVGSVGElement {
    const diagramGroup = this.createSvgGElement();
    diagramGroup.id = this.diagram.id;
    this.svgContent.appendChild(diagramGroup);

    this.addElements(this.diagram.children, diagramGroup);
    this.addRelations();

    this.setViewBoxSize();

    return this.svgDocument;
  }

  private createSvgGElement() { return this.svgContent.ownerDocument.createElementNS(this.svgContent.namespaceURI, 'g') as SVGGElement; }

  private setViewBoxSize() {
    const pos = this.diagram.descendants[0].AbsolutePosition;
    let [minX, minY] = [pos.x, pos.y];
    let [maxX, maxY] = [0.0, 0.0];
    this.diagram.descendants.forEach(e => {
      minX = Math.min(minX, e.AbsolutePosition.x);
      minY = Math.min(minY, e.AbsolutePosition.y);
      maxX = Math.max(maxX, e.AbsolutePosition.x + e.bounds.width);
      maxY = Math.max(maxY, e.AbsolutePosition.y + e.bounds.height);
    });
    this.svgDocument.firstElementChild.setAttribute('viewBox', `${(minX - 10).toFixed(0)} ${(minY - 10).toFixed(0)} ${(maxX - minX + 20).toFixed(0)} ${(maxY - minY + 20).toFixed(0)}`);
    this.svgDocument.firstElementChild.setAttribute('width', `${(maxX - minX + 20).toFixed(0)}`);
    this.svgDocument.firstElementChild.setAttribute('height', `${(maxY - minY + 20).toFixed(0)}`);
  }

  private addElements(children: ReadonlyArray<ArchiDiagramChild>, parent: SVGElement) {
    children.forEach(child => this.addElement(child, parent));
  }

  public addElement(child: ArchiDiagramChild, parent: Element):SVGElement {
    let archiElement = this.project.getById(child.elementId);
    if (archiElement == null) {
      archiElement = new ArchiEntity();
      archiElement.entityType = child.entityType;
      archiElement.name = child.name;
    }
    const e = this.template.getElementByType(archiElement, child);
    const div = e.querySelector(':scope>foreignObject>div>div');

    if (e.classList.contains('note')) {
      let textContent = child.content ?? "";
      textContent = textContent
        .replace(/[\uf0b7\uf0a7]/g, '•') // TODO: wingdings to unicode: http://www.alanwood.net/demos/wingdings.html
        .replace(/\r/g, '');
      archiElement.name = textContent;
    }
    archiElement.documentation = child.documentation;

    const imageUse = e.querySelector(':scope>use.img');
    if (imageUse) {
      const imagePath = child.imagePath;
      imageUse.setAttribute('href', '');
      if (imagePath) {
        this.imageCache.getImage(imagePath).then(imageInfo => {
  
          imageUse.setAttribute('href', '#' + imageInfo.defsId);

          const imagePosition = (child.imagePosition != null) ? child.imagePosition :
            (child.entityType.endsWith('CanvasModelImage') ? ImagePosition.Fill : ImagePosition.TopRight);
          
          if (imagePosition === ImagePosition.Fill)
            imageUse.setAttribute('transform', `matrix(${child.bounds.width/imageInfo.width},0,0,${child.bounds.height/imageInfo.height},0,0)`);
          else
          {
            // TOP_LEFT = 0, TOP_CENTRE = 1, TOP_RIGHT = 2, MIDDLE_LEFT = 3, MIDDLE_CENTRE = 4, MIDDLE_RIGHT = 5, BOTTOM_LEFT = 6, BOTTOM_CENTRE = 7, BOTTOM_RIGHT = 8
            let imageX = (child.bounds.width - imageInfo.width); 
            let imageY = (child.bounds.height - imageInfo.height); 
            switch(imagePosition % 3)
            {
              case 0: imageX = 0; break;
              case 1: imageX /= 2; break;
              default: break;
            }
            switch(Math.floor(imagePosition / 3))
            {
              case 0: imageY = 0; break;
              case 1: imageY /= 2; break;
              default: break;
            }
            imageUse.setAttribute('transform', `matrix(1,0,0,1,${imageX},${imageY})`);
          }
        });
      }
    }
    if (child.alpha != null)
      e.firstElementChild.setAttribute('fill-opacity', `${child.alpha / 255}`);

    if (child.textPosition != null) {
      switch (child.textPosition) {
        case TextPosition.Top: div.classList.add('top'); break;
        case TextPosition.Middle: div.classList.add('middle'); break;
        case TextPosition.Bottom: div.classList.add('bottom'); break;
      }
    }
    if (child.textAlignment != null) {
      switch (child.textAlignment) {
        case TextAlignment.Left: div.classList.add('left'); break;
        case TextAlignment.Centre: div.classList.add('center'); break;
        case TextAlignment.Right: div.classList.add('right'); break;
      }
    }
    const rect = e.querySelector(':scope>rect');
    if (child.borderColor) {
      rect.setAttribute('stroke', child.borderColor);
    }

    e.setAttribute('id', child.id.toString());
    if (div != null) {
      div.setAttribute('contenteditable', 'true');

      if (!e.classList.contains('grouping') && !e.classList.contains('note')) {
        div.textContent = archiElement.name;
        const d = e.ownerDocument.createElementNS(div.namespaceURI, 'div');
        d.textContent = archiElement.entityType;
        d.setAttribute('class', 'elementType');
        div.parentNode.appendChild(d);
      } else {
        div.textContent = '';
        archiElement.name.split('\n').forEach(t => {
          const d = e.ownerDocument.createElementNS(div.namespaceURI, 'div');
          if (t != '')
            d.textContent = t;
          div.appendChild(d);
        });
      }
    }
    addDocumentation();

    let style = '';
    if (child.fillColor)
      style += 'fill: ' + child.fillColor + ' ';
    if (style !== '') {
      const toStyle = Array.from(e.children)
        .filter(n => n.nodeName == 'rect' || n.nodeName == 'path');
      toStyle.forEach(se => se.setAttribute('style', style.trimEnd()));
    }
    style = '';
    if (child.font) {
      const fontData = child.font.split('|');
      const fontName = fontData[1];
      const fontSize = fontData[2];
      const fontStyle = parseInt(fontData[3]);  //1=bold,2=italic, 4=underline, 8=strikeout

      style = 'font: '
      if (fontStyle & 1)
        style += 'bold ';
      if (fontStyle & 2)
        style += 'italic ';
      style += `${fontSize}pt ${fontName} `;

      const decoration = []
      if (fontStyle & 4)
        decoration.push('underline');
      if (fontStyle & 8)
        decoration.push('line-through');
      if (decoration.length > 1)
        style += `font-decoration: ${decoration.join(' ')} `;
      style = style.trimEnd() + ';';
    }
    if (child.fontColor) 
      style += `color: ${child.fontColor} `;
    if (div && style != '')
      div.setAttribute('style', style.trimEnd());

    const selection = this.getElementSelection(child.id);
    if (selection) {
      selection.setPosition(child.AbsolutePosition.x, child.AbsolutePosition.y, child.bounds.width, child.bounds.height);
      selection.lastSelected = true;
    }
    parent.append(e);
    this.addElements(child.children, e);
    
    return e;

    
    function addDocumentation() {
      if (archiElement.documentation) {
        const d = e.ownerDocument.createElementNS(e.namespaceURI, 'title');
        d.textContent = archiElement.documentation;
        e.insertBefore(d, e.firstChild);
      }
    }
  }

  public clearRelations() {
    const allConnections = this.svgContent.parentElement.querySelectorAll('g.con');
    allConnections.forEach(c => c.remove());
    this.sourceConnectionMiddlePoints.clear();
  }
  
  public addRelations() {
    let connectionsNext: ArchiSourceConnection[] =
      this.diagram.descendants.flatMap(child => child.sourceConnections);
    let connections: ArchiSourceConnection[] = [];
    this.sourceConnectionMiddlePoints.clear();

    while (connectionsNext.length > 0) {
      connections = connectionsNext;
      connectionsNext = [];

      for (const sourceConnection of connections) {
        const [end, endBounds] = this.getAbsolutePositionAndBounds(this.diagram.getDiagramObjectById(sourceConnection.targetId));
        if (end != null) {
          const [start, startBounds] = this.getAbsolutePositionAndBounds(sourceConnection.source);
          const coords = DiagramRenderer.calculateConnectionCoords(start, startBounds, end, endBounds, sourceConnection);
          if (coords.length > 1) {
            const relationEntity = this.project.getById(sourceConnection.relationShipId);
            this.addRelation(coords, sourceConnection, relationEntity);
          }
          this.sourceConnectionMiddlePoints.set(sourceConnection.id,
            coords.length % 2 === 1 ? coords[(coords.length - 1) / 2] :
              coords[coords.length / 2 - 1].add(coords[coords.length / 2]).multiply(0.5));
      }
        else
          connectionsNext.push(sourceConnection);
      }
    }
  }

  public getAbsolutePositionAndBounds(item: ArchiDiagramObject): [ElementPos, ElementPos] {
    if (item instanceof ArchiDiagramChild) {
      const pos = item.AbsolutePosition.add(new ElementPos(item.bounds.width / 2, item.bounds.height / 2));
      const bounds = new ElementPos(item.bounds.width / 2, item.bounds.height / 2);
      return [pos, bounds];
    }
    else {
      const pos = this.sourceConnectionMiddlePoints.get(item.id);
      if (pos != null)
        return [pos, ElementPos.Zero];
      return [null, null];
    }
  }

  private addRelation(coords: ElementPos[], sourceConnection: ArchiSourceConnection, relationEntity: ArchiEntity) {
    const d = DiagramRenderer.coordsToPathD(coords);

    const editPointGroup = DiagramRenderer.addEditPointGroup(this.svgContent, sourceConnection, relationEntity);
    DiagramRenderer.addConnectionPath(editPointGroup, relationEntity, d, sourceConnection);
    DiagramRenderer.addConnectionPathDetectLine(editPointGroup, d);
    DiagramRenderer.addConnectionText(editPointGroup, sourceConnection, coords);
    DiagramRenderer.addDragPoints(editPointGroup, coords);

    if (sourceConnection.source.id == this.highlightedElementId || sourceConnection.targetId == this.highlightedElementId)
      editPointGroup.classList.add('highlight');
    if (this.selectedRelationId == sourceConnection.id)
      editPointGroup.classList.add('selected');
  }

  static addDragPoints(group: Element, coords: ElementPos[]) {
    for (let i = 0; i < coords.length; i++) {
      const curr = coords[i];
      let circle: Element;
      if (i > 0) {
        const prev = coords[i - 1];
        circle = group.ownerDocument.createElementNS(group.namespaceURI, 'circle');
        circle.setAttribute('cx', ((curr.x + prev.x) / 2).toString());
        circle.setAttribute('cy', ((curr.y + prev.y) / 2).toString());
        circle.setAttribute('r', '2');
        group.appendChild(circle);
      }
      circle = group.ownerDocument.createElementNS(group.namespaceURI, 'circle');
      circle.setAttribute('cx', curr.x.toString());
      circle.setAttribute('cy', curr.y.toString());
      circle.setAttribute('r', '3');
      if (i === 0 || i === coords.length - 1)
        circle.classList.add('end');
      group.appendChild(circle);
    }
  }

  static addConnectionPathDetectLine(group: Element, d: string) {
    const path = group.ownerDocument.createElementNS(group.namespaceURI, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'RelationshipDetect');

    group.appendChild(path);
  }

  static addConnectionText(group:Element, sourceConnection: ArchiSourceConnection, coords: ElementPos[]) {
        // render 'name' according to 'textPosition' 
      if (!sourceConnection.name)
        return;

      let center: ElementPos;
      const index = Math.floor((coords.length - 1) / 2);
      if (coords.length & 1)
        center = coords[index];
      else
        center = coords[index].add(coords[index + 1]).multiply(0.5); 
      
      const text = group.ownerDocument.createElementNS(group.namespaceURI, 'text') as SVGTextElement;

      text.setAttribute('x', `${center.x}`);
      text.setAttribute('y', `${center.y}`);
      text.textContent = sourceConnection.name;
      
      group.appendChild(text);
  }

  static addEditPointGroup(group: Element, sourceConnection: ArchiSourceConnection, relationEntity: ArchiEntity) {
    const editPointGroup = group.ownerDocument.createElementNS(group.namespaceURI, 'g');
    editPointGroup.setAttribute('id', sourceConnection.id);
    editPointGroup.setAttribute('class', 'con');
    if (relationEntity)
      editPointGroup.setAttribute('data-rel', relationEntity.id);

    group.appendChild(editPointGroup);
    return editPointGroup;
  }

  static addConnectionPath(group: Element, relationEntity: ArchiEntity, d: string, sourceConnection: ArchiSourceConnection) {
    const relationShipType = relationEntity?.entityType;
    let cssClass: string = relationShipType?.replace('Relationship', ' Relationship') ?? 'Relationship';
    if (relationShipType === 'AccessRelationShip') {
      let accessClass: string;
      switch (relationEntity.element.getAttribute('accessType')) {
        case '1': accessClass = 'Read'; break;
        case '2': accessClass = 'Access'; break;
        case '3': accessClass = 'Read Write'; break;
        default: accessClass = 'Write'; break;
      }
      cssClass += cssClass + ' ' + accessClass;
    }
    const path = group.ownerDocument.createElementNS(group.namespaceURI, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', cssClass);

    if (!relationShipType) {
      const type = Number(sourceConnection.type);
      let markerStart = null;
      let markerEnd = null;
      let dashArray = null;
      if (type & SourceConnectionType.ArrowFillTarget)
        markerEnd = 'Closed';
      if (type & SourceConnectionType.ArrowHollowTarget)
        markerEnd = 'Hollow'
      if (type & SourceConnectionType.ArrowLineTarget)
        markerEnd = 'Open';
      if (type & SourceConnectionType.ArrowFillSource)
        markerStart = 'Closed';
      if (type & SourceConnectionType.ArrowHollowSource)
        markerStart = 'Hollow'
      if (type & SourceConnectionType.ArrowLineSource)
        markerStart = 'Open';
      if (type & SourceConnectionType.LineDashed)
        dashArray = '6 4';
      if (type & SourceConnectionType.LineDotted)
        dashArray = '2 4';
      if (markerStart)
        path.setAttribute('marker-start', `url(#arrow${markerStart}Start)`);
      if (markerEnd)
        path.setAttribute('marker-end', `url(#arrow${markerEnd})`);
      if (dashArray)
        path.setAttribute('stroke-dasharray', dashArray);
    }

    // https://stackoverflow.com/questions/47088409/svg-attributes-beaten-by-cssstyle-in-priority
    let style = '';
    if (sourceConnection.lineWidth != null)
      style += 'stroke-width:' + sourceConnection.lineWidth + ';';
    if (sourceConnection.lineColor != null)
      style += 'stroke:' + sourceConnection.lineColor + ';';
    if (style !== '')
      path.setAttribute('style', style);

    group.appendChild(path);
  }

  static coordsToPathD(coords: ElementPos[]): string {
    let d = '';
    d += `M ${+coords[0].x.toFixed(2)} ${+coords[0].y.toFixed(2)} `;
    const cornerRadius = 12;
    for (let i = 1; i < coords.length - 1; i++) {
      let prev = coords[i - 1];
      const curr = coords[i];
      let next = coords[i + 1];

      const length1 = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
      const length2 = Math.sqrt(Math.pow(curr.x - next.x, 2) + Math.pow(curr.y - next.y, 2));
      if (length1 < cornerRadius * 2 || length2 < cornerRadius * 2) {
        d += `L ${curr.x} ${curr.y} `;
        continue;
      }
      prev = prev.add(curr.subtract(prev).multiply((length1 - cornerRadius) * (1 / length1)));
      next = curr.add(next.subtract(curr).multiply(cornerRadius * (1 / length2)));

      d += `L ${+prev.x.toFixed(2)} ${+prev.y.toFixed(2)} Q ${+curr.x.toFixed(2)} ${+curr.y.toFixed(2)} ${+next.x.toFixed(2)} ${+next.y.toFixed(2)} `;
    }
    d += `L ${+coords.slice(-1)[0].x.toFixed(2)} ${+coords.slice(-1)[0].y.toFixed(2)} `;
    return d;
  }

  public static calculateConnectionCoords(start: ElementPos, startBounds: ElementPos, end: ElementPos, endBounds: ElementPos, sourceConnection: ArchiSourceConnection) {
    start = new ElementPos(start.x, start.y);
    end = new ElementPos(end.x, end.y);
    
    const bendPoints = sourceConnection.bendPoints.map(bp => start.add(new ElementPos(bp.x, bp.y)));
    const coords: ElementPos[] = [];
    let currentStart = start;
    bendPoints.forEach(nextPoint => {
      DiagramRenderer.determineStartAndEnd(currentStart, startBounds, nextPoint, ElementPos.Zero);
      coords.push(currentStart);

      startBounds = ElementPos.Zero;
      currentStart = nextPoint;
    });
    DiagramRenderer.determineStartAndEnd(currentStart, startBounds, end, endBounds);
    coords.push(currentStart);
    if (currentStart.x !== end.x || currentStart.y !== end.y)
      coords.push(end);
    return coords;
  }

  private static determineStartAndEnd(start: ElementPos, startDev: ElementPos, end: ElementPos, endDev: ElementPos) {
    if (start.y - startDev.y > end.y + endDev.y) {
      start.y = start.y - startDev.y;
      end.y = end.y + endDev.y;
    }
    else if (start.y + startDev.y < end.y - endDev.y) {
      start.y = start.y + startDev.y;
      end.y = end.y - endDev.y;
    }
    else {
      const minY = Math.max(start.y - startDev.y, end.y - endDev.y);
      const maxY = Math.min(start.y + startDev.y, end.y + endDev.y);
      const y = (minY + maxY) / 2;
      start.y = y;
      end.y = y;
    }

    if (start.x - startDev.x > end.x + endDev.x) {
      start.x = start.x - startDev.x;
      end.x = end.x + endDev.x;
    }
    else if (start.x + startDev.x < end.x - endDev.x) {
      start.x = start.x + startDev.x;
      end.x = end.x - endDev.x;
    }
    else {
      const minY = Math.max(start.x - startDev.x, end.x - endDev.x);
      const maxY = Math.min(start.x + startDev.x, end.x + endDev.x);
      const x = (minY + maxY) / 2;
      start.x = x;
      end.x = x;
    }
  }

  public get editInfo(): EditInfoElement {
    if (!this._editInfo) {
      this._editInfo = this.template.createEditInfo();
      this.groupEditInfo.appendChild(this._editInfo.element);
    }
    return this._editInfo;
  }

  public removeEditInfo() {
    this._editInfo = null;
    this.groupEditInfo.replaceChildren();
  }

  public getElementSelections(): ElementSelectionElement[] { return Array.from(this.elementSelections.values()); }
  public getElementSelection(id: string): ElementSelectionElement {
     return this.elementSelections.get(id);
  }

  removeElementSelection(id: string) {
    const s = this.elementSelections.get(id);
    if (s) {
      s.element.remove();
      this.elementSelections.delete(id);
    }
  }
  removeElementSelections() {
    this.elementSelections.forEach(s => s.element.remove());
    this.elementSelections.clear();
  }

  public addElementSelection(id: string): ElementSelectionElement {
    let result = this.elementSelections.get(id);

    result = this.template.createElementSelection(id);
    this.elementSelections.set(id, result);
    this.svgContent.appendChild(result.element);
    return result;
  }

  public get highlightedElementId() { return this._highlightedElementId; }
  public set highlightedElementId(value: string) {
    if (value == this._highlightedElementId)
      return;
    if (this._highlightedElementId != null)
      this.svgContent.querySelectorAll('g.con.highlight').forEach(e => e.classList.remove('highlight'));

    this._highlightedElementId = value;
    
    if (value) {
      const connectionsToRerender = this.diagram.descendantsWithSourceConnections.filter(o => o instanceof ArchiSourceConnection && (o.source.id == value || o.targetId == value)) as ArchiSourceConnection[];
      connectionsToRerender.forEach(c => {
      const lineG = this.svg.getElementById(c.id);
      if (lineG)
        lineG.classList.add('highlight');
      });
    }
  }

  public get selectedRelationId() { return this._selectedRelationId; }
  public set selectedRelationId(value: string) {
    if (value == this._selectedRelationId)
      return;
    if (this._selectedRelationId)
      this.svg.getElementById(this._selectedRelationId)?.classList.remove('selected');
    this._selectedRelationId = value;
    if (value) {
      const con = this.svg.getElementById(this._selectedRelationId);
      if (con) {
        con.classList.add('selected');
        const parent = con.parentElement;
        con.remove();
        parent.appendChild(con);
      }
    }
  }
}
