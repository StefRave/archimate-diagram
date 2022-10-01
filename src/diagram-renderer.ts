import { ArchimateProject, ArchiDiagram, ArchiDiagramChild, ElementPos, ArchiDiagramObject, ArchiEntity, ArchiSourceConnection } from './greeter';
import { DiagramTemplate } from './diagram-template';
import { DiagramImageCache } from './diagram-image-cache';

/**
 *  
 */
export class DiagramRenderer {
  private readonly svgDocument: SVGSVGElement;
  public readonly svgContent: SVGGElement;
  private readonly sourceConnectionMiddlePoints: Map<string, ElementPos>;
  private imageCache: DiagramImageCache;
 
  constructor(public readonly project: ArchimateProject, public readonly diagram: ArchiDiagram, public readonly template: DiagramTemplate) {
    this.svgDocument = this.template.getEmptySvg();
    this.svgContent = this.svgDocument.getElementById('content') as SVGGElement;

    this.sourceConnectionMiddlePoints = new Map<string, ElementPos>();
    this.imageCache = new DiagramImageCache(project, this.svgDocument.getElementById('imageDefs') as SVGGElement);
  }

  public get svg(): SVGSVGElement { return this.svgContent.ownerSVGElement; }

  public buildSvg(): SVGSVGElement {
    const diagramGroup = this.svgContent.ownerDocument.createElementNS(this.svgContent.namespaceURI, 'g');
    diagramGroup.id = this.diagram.Id;
    this.svgContent.appendChild(diagramGroup);

    this.addElements(this.diagram.Children, diagramGroup);
    this.addRelations();

    this.setViewBoxSize();

    return this.svgDocument;
  }

  private setViewBoxSize() {
    const pos = this.diagram.Descendants[0].AbsolutePosition;
    let [minX, minY] = [pos.x, pos.y];
    let [maxX, maxY] = [0.0, 0.0];
    this.diagram.Descendants.forEach(e => {
      minX = Math.min(minX, e.AbsolutePosition.x);
      minY = Math.min(minY, e.AbsolutePosition.y);
      maxX = Math.max(maxX, e.AbsolutePosition.x + e.bounds.width);
      maxY = Math.max(maxY, e.AbsolutePosition.y + e.bounds.height);
    });
    this.svgDocument.firstElementChild.setAttribute('viewBox', `${(minX - 10).toFixed(0)} ${(minY - 10).toFixed(0)} ${(maxX - minX + 20).toFixed(0)} ${(maxY - minY + 20).toFixed(0)}`);
    this.svgDocument.firstElementChild.setAttribute('width', `${(maxX - minX + 20).toFixed(0)}`);
    this.svgDocument.firstElementChild.setAttribute('height', `${(maxY - minY + 20).toFixed(0)}`);
  }

  private addElements(children: ArchiDiagramChild[], parent: Element) {
    children.forEach(child => this.addElement(child, parent));
  }

  public addElement(child: ArchiDiagramChild, parent: Element):Element {
    let archiElement = this.project.getById(child.ElementId);
    if (archiElement == null) {
      archiElement = new ArchiEntity();
      archiElement.entityType = child.EntityType;
      archiElement.name = child.element.getAttribute('name');
    }
    const e = this.template.getElementByType(archiElement, child);
    const div = e.querySelector(':scope>foreignObject>div>div');
    const entiyTypeCleaned = child.EntityType.split(':').pop();

    if (e.classList.contains('note')) {
      let textContent = child.content ?? "";
      textContent = textContent
        .replace(/[\uf0b7\uf0a7]/g, '•') // TODO: wingdings to unicode: http://www.alanwood.net/demos/wingdings.html
        .replace(/\r/g, '');
      archiElement.name = textContent;
    }
    archiElement.documentation = child.element.getAttribute('documentation');

    const imageUse = e.querySelector(':scope>use.img');
    if (imageUse) {
      const imagePath = child.element.getAttribute('imagePath');
      imageUse.setAttribute('href', '');
      if (imagePath) {
        this.imageCache.getImage(imagePath).then(imageInfo => {
  
          imageUse.setAttribute('href', '#' + imageInfo.defsId);

          const imagePosition = parseInt(child.element.getAttribute('imagePosition') ??
            (entiyTypeCleaned === 'CanvasModelImage' ? '9' : '2'));
          
          if (imagePosition === 9) // FILL
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
          const alpha = child.element.getAttribute('alpha');
          if (alpha) {
            imageUse.setAttribute('opacity', `${Number(alpha) / 255}`);
          }
        });
      }
    }
    
    const textPosition = child.element.getAttribute('textPosition');
    switch (textPosition) {
      case '0': div.classList.add('top'); break;
      case '1': div.classList.add('middle'); break;
      case '2': div.classList.add('bottom'); break;
    }
    const textAlignment = child.element.getAttribute('textAlignment');
    switch (textAlignment) {
      case '1': div.classList.add('left'); break;
      case '2': div.classList.add('center'); break;
      case '4': div.classList.add('right'); break;
    }
    const rect = e.querySelector(':scope>rect');
    const borderColor = child.element.getAttribute('borderColor');
    if (borderColor) {
      rect.setAttribute('stroke', borderColor);
    }

    e.setAttribute('transform', `translate(${child.bounds.x}, ${child.bounds.y})`);
    e.setAttribute('id', child.id.toString());
    if (div != null) {
      div.setAttribute('contenteditable', 'true');

      if (!e.classList.contains('group') && !e.classList.contains('note')) {
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
          // d.appendChild(e.ownerDocument.createElementNS(div.namespaceURI, 'br'));
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

    parent.append(e);
    this.addElements(child.Children, e);
    
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
      this.diagram.Descendants.flatMap(child => child.SourceConnections);
    let connections: ArchiSourceConnection[] = [];
    this.sourceConnectionMiddlePoints.clear();

    while (connectionsNext.length > 0) {
      connections = connectionsNext;
      connectionsNext = [];

      for (const sourceConnection of connections) {
        const [end, endBounds] = this.getAbsolutePositionAndBounds(this.diagram.GetDiagramObjectById(sourceConnection.targetId));
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
      editPointGroup.setAttribute('data-rel', relationEntity.Id);

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
      const type = Number(sourceConnection.element.getAttribute('type'));
      let markerStart = null;
      let markerEnd = null;
      let dashArray = null;
      if (type & 1)
        markerEnd = 'Closed';
      if (type & 16)
        markerEnd = 'Hollow'
      if (type & 64)
        markerEnd = 'Open';
      if (type & 8)
        markerStart = 'Closed';
      if (type & 32)
        markerStart = 'Hollow'
      if (type & 128)
        markerStart = 'Open';
      if (type & 2)
        dashArray = '6 4';
      if (type & 4)
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
    if (sourceConnection.tineWidth != null)
      style += 'stroke-width:' + sourceConnection.tineWidth + ';';
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
}


