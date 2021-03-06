import { ArchimateProject, ArchiDiagram, ArchiDiagramChild, ElementPos, ArchiDiagramObject, ArchiEntity, ArchiSourceConnection } from './greeter';
import { DiagramTemplate } from './diagram-template';

export class DiagramRenderer {
  public readonly svgDocument: Document;
  public readonly svgContent: Element;
  private readonly sourceConnectionMiddlePoints: Map<string, ElementPos>;
  constructor(public readonly project: ArchimateProject, public readonly diagram: ArchiDiagram, public readonly template: DiagramTemplate) {
    this.svgDocument = this.template.getEmptySvg();
    this.svgContent = this.svgDocument.getElementById('Content');

    this.sourceConnectionMiddlePoints = new Map<string, ElementPos>();
  }

  public buildSvg(): Document {
    this.svgContent.id = this.diagram.Id;
    this.addElements(this.diagram.Children, this.svgContent);
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

  public addElement(child: ArchiDiagramChild, parent: Element) {
    let archiElement = this.project.getById(child.ElementId);
    if (archiElement == null) {
      archiElement = new ArchiEntity();
      archiElement.entityType = child.EntityType;
      archiElement.name = child.Element.getAttribute('name');
      if (archiElement.entityType === 'Note') {
        let textContent = Array.from(child.Element.childNodes).filter(n => n.nodeName === 'content')[0]?.textContent ?? "";
        textContent = textContent
          .replace(/[\uf0b7\uf0a7]/g, '???') // TODO: wingdings to unicode: http://www.alanwood.net/demos/wingdings.html
          .replace(/\r/g, '');
        archiElement.name = textContent;
      }
      archiElement.documentation = child.Element.getAttribute('documentation');
    }
    const e = this.template.getElementByType(archiElement, child.bounds);

    e.setAttribute('transform', `translate(${child.bounds.x}, ${child.bounds.y})`);
    e.setAttribute('id', child.Id.toString());
    const div = e.querySelector('foreignObject>div>div');
    if (div != null) {
      div.textContent = archiElement.name;
      div.setAttribute('contenteditable', 'true');

      if (!e.classList.contains('group') && !e.classList.contains('note')) {
        const d = e.ownerDocument.createElementNS(div.namespaceURI, 'div');
        d.textContent = archiElement.entityType;
        d.setAttribute('class', 'elementType');
        div.parentNode.appendChild(d);
      }
    }
    addDocumentation();

    let style = '';
    if (child.FillColor)
      style += 'fill: ' + child.FillColor + ' ';
    if (style !== '') {
      const toStyle = Array.from(e.children)
        .filter(n => n.nodeName == 'rect' || n.nodeName == 'path');
      toStyle.forEach(se => se.setAttribute('style', style));
    }

    parent.append(e);

    this.addElements(child.Children, e);

    
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
        const [end, endBounds] = this.getAbsolutePositionAndBounds(this.diagram.GetDiagramObjectById(sourceConnection.TargetId));
        if (end != null) {
          const [start, startBounds] = this.getAbsolutePositionAndBounds(sourceConnection.Source);
          const coords = DiagramRenderer.calculateConnectionCoords(start, startBounds, end, endBounds, sourceConnection);
          if (coords.length > 1) {
            const relationEntity = this.project.getById(sourceConnection.RelationShipId);
            this.addRelation(coords, sourceConnection, relationEntity);
          }
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
      const pos = this.sourceConnectionMiddlePoints.get(item.Id);
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
    DiagramRenderer.addDragPoints(editPointGroup, coords);

    this.sourceConnectionMiddlePoints.set(sourceConnection.Id,
      coords.length % 2 === 1 ? coords[(coords.length - 1) / 2] :
        coords[coords.length / 2 - 1].add(coords[coords.length / 2]).multiply(0.5));
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

  static addEditPointGroup(group: Element, sourceConnection: ArchiSourceConnection, relationEntity: ArchiEntity) {
    const editPointGroup = group.ownerDocument.createElementNS(group.namespaceURI, 'g');
    editPointGroup.setAttribute('id', sourceConnection.Id);
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

    // https://stackoverflow.com/questions/47088409/svg-attributes-beaten-by-cssstyle-in-priority
    let style = '';
    if (sourceConnection.LineWidth != null)
      style += 'stroke-width:' + sourceConnection.LineWidth + ';';
    if (sourceConnection.LineColor != null)
      style += 'stroke:' + sourceConnection.LineColor + ';';
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
    
    const bendPoints = sourceConnection.BendPoints.map(bp => start.add(new ElementPos(bp.x, bp.y)));
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


