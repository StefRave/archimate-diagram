import { ArchimateProject, ArchiDiagram, ArchiDiagramChild, ElementPos, ArchiDiagramObject, ArchiEntity, ArchiSourceConnection, ElementBounds } from './greeter';
import svgSource from './archimate.svg?raw';

export class DiagramRenderer {
  public readonly svgDocument: Document;
  public readonly svgContent: Element;

  constructor(public readonly project: ArchimateProject, public readonly diagram: ArchiDiagram, public readonly template: DiagramTemplate) {

    this.svgDocument = this.template.getEmptySvg();
    this.svgContent = this.svgDocument.getElementById('Content');
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

  private addElement(child: ArchiDiagramChild, parent: Element) {
    let archiElement = this.project.getById(child.ElementId);
    if (archiElement == null) {
      archiElement = new ArchiEntity();
      archiElement.entityType = child.EntityType;
      archiElement.name = child.Element.getAttribute('name');
      if (archiElement.entityType === 'Note') {
        let textContent = Array.from(child.Element.childNodes).filter(n => n.nodeName === 'content')[0]?.textContent ?? "";
        textContent = textContent
          .replace(/[\uf0b7\uf0a7]/g, '•') // TODO: wingdings to unicode: http://www.alanwood.net/demos/wingdings.html
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
  }
  
  public addRelations() {
    let connectionsNext: ArchiSourceConnection[] =
      this.diagram.Descendants.flatMap(child => child.SourceConnections);
    let connections: ArchiSourceConnection[] = [];

    const sourceConnectionMiddlePoints = new Map<string, ElementPos>();

    while (connectionsNext.length > 0) {
      connections = connectionsNext;
      connectionsNext = [];

      for (const sourceConnection of connections) {
        const [end, endBounds] = getPositionAndBounds(this.diagram.GetDiagramObjectById(sourceConnection.TargetId));
        if (end != null) {
          const [start, startBounds] = getPositionAndBounds(sourceConnection.Source);
          const coords = DiagramRenderer.calculateConnectionCoords(start, startBounds, end, endBounds, sourceConnection);
          if (coords.length > 1) {
            const relationEntity = this.project.getById(sourceConnection.RelationShipId);
            DiagramRenderer.addRelation(this.svgContent, coords, sourceConnection, relationEntity, sourceConnectionMiddlePoints);
          }
        }
        else
          connectionsNext.push(sourceConnection);
      }
    }

    function getPositionAndBounds(item: ArchiDiagramObject): [ElementPos, ElementPos] {
      if (item instanceof ArchiDiagramChild) {
        const pos = item.AbsolutePosition.add(new ElementPos(item.bounds.width / 2, item.bounds.height / 2));
        const bounds = new ElementPos(item.bounds.width / 2, item.bounds.height / 2);
        return [pos, bounds];
      }
      else {
        const pos = sourceConnectionMiddlePoints.get(item.Id);
        if (pos != null)
          return [pos, ElementPos.Zero];
        return [null, null];
      }
    }
  }

  static addRelation(group: Element, coords: ElementPos[], sourceConnection: ArchiSourceConnection, relationEntity: ArchiEntity,
    sourceConnectionMiddlePoints: Map<string, ElementPos>) {
    const d = DiagramRenderer.coordsToPathD(coords);

    const editPointGroup = DiagramRenderer.addEditPointGroup(group, sourceConnection, relationEntity);
    DiagramRenderer.addConnectionPath(editPointGroup, relationEntity, d, sourceConnection);
    DiagramRenderer.addConnectionPathDetectLine(editPointGroup, d);
    DiagramRenderer.addDragPoints(editPointGroup, coords);

    sourceConnectionMiddlePoints.set(sourceConnection.Id,
      coords.length % 2 === 1 ? coords[(coords.length - 1) / 2] :
        coords[coords.length / 2 - 1].add(coords[coords.length / 2]).multiply(0.5));
  }

  static addDragPoints(group: Element, coords: ElementPos[]) {
    for (let i = 0; i < coords.length; i++) {
      const curr = coords[i];
      let circle = group.ownerDocument.createElementNS(group.namespaceURI, 'circle');
      circle.setAttribute('cx', curr.x.toString());
      circle.setAttribute('cy', curr.y.toString());
      circle.setAttribute('r', '3');

      group.appendChild(circle);
      if (i > 0) {
        const prev = coords[i - 1];
        circle = group.ownerDocument.createElementNS(group.namespaceURI, 'circle');
        circle.setAttribute('cx', ((curr.x + prev.x) / 2).toString());
        circle.setAttribute('cy', ((curr.y + prev.y) / 2).toString());
        circle.setAttribute('r', '2');
        group.appendChild(circle);
      }
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

  private static calculateConnectionCoords(start: ElementPos, startBounds: ElementPos, end: ElementPos, endBounds: ElementPos, sourceConnection: ArchiSourceConnection) {
    const bendPoints = sourceConnection.BendPoints.map(bp => start.add(new ElementPos(bp.x, bp.y)));

    const coords: ElementPos[] = [];
    bendPoints.forEach(nextPoint => {
      DiagramRenderer.determineStartAndEnd(start, startBounds, nextPoint, ElementPos.Zero);
      coords.push(start);

      startBounds = ElementPos.Zero;
      start = nextPoint;
    });
    DiagramRenderer.determineStartAndEnd(start, startBounds, end, endBounds);
    coords.push(start);
    if (start.x !== end.x || start.y !== end.y)
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

export class DiagramTemplate {
  private elementByType: Map<string, Element>;
  private templateDoc: Document;
  public elementSelection: SVGGElement;

  public getEmptySvg(): Document {
    return this.templateDoc.cloneNode(true) as Document;
  }

  public getElementSelection(width: number, height: number): SVGGElement {
    const selection = this.elementSelection.cloneNode(true) as SVGGElement;
    selection.childNodes.forEach(cn => {
      if (cn instanceof SVGCircleElement) {
        if (cn.cx.baseVal.value === 168)
          cn.cx.baseVal.value = width;
        else if (cn.cx.baseVal.value === 168 / 2)
          cn.cx.baseVal.value = width / 2;
        if (cn.cy.baseVal.value === 60)
          cn.cy.baseVal.value = height;
        else if (cn.cy.baseVal.value === 60 / 2)
          cn.cy.baseVal.value = height / 2;
      }
    });
    return selection;
  }

  public getElementByType(archiElement: ArchiEntity, bounds: ElementBounds): Element {
    const typeName = archiElement.entityType;
    
    let es = this.createCloneOfType(typeName);

    const { width, height } = bounds;
    if (typeName == 'Value')
      es = es.replace('ellipse cx="84" cy="30" rx="84" ry="30"', `ellipse cx="${width / 2}" cy="${height / 2}" rx="${width / 2}" ry="${height / 2}"`);
    es = es.replace(/(?<!\d)168(?!\d)/g, `${width}`);
    es = es.replace(/(?<!\d)152(?!\d)/g, `${width - 16}`);
    es = es.replace(/(?<!\d)52(?!\d)/g, `${height - 8}`);
    es = es.replace(/(?<!\d)44(?!\d)/g, `${height - 16}`);
    es = es.replace(/(?<!\d)160(?!\d)/g, `${width - 8}`);
    es = es.replace(/(?<!\d)60(?!\d)/g, `${height}`);
    es = es.replace(/(?<!\d)84(?!\d)/g, `${width / 2}`);
    if (typeName === 'Grouping' || typeName === 'Group')
      es = es.replace(/(?<!\d)156(?!\d)/g, `${width - 12}`);
    if (typeName === 'Junction') {
      if (archiElement.element.getAttribute('type') === 'or')
        es = es.replace('class=\'', 'class=\'or ');

      const ws = +(width / 2).toFixed(2);
      es = es.replace('cx="5" cy="5" rx="5" ry="5"', `cx='${ws}' cy='${ws}' rx='${ws}' ry='${ws}'`);
    }
    const parser = new DOMParser();
    return <Element>parser.parseFromString(es, 'text/xml').firstChild;
  }

  private createCloneOfType(typeName: string) : string {
    const elementByType = this.elementByType;
    let t = cloneFromTemplate(typeName);
    if (t != null)
      return t;
    
    if (typeName.startsWith('Technology') || typeName.startsWith('Application')) {
      t = cloneFromTemplate(typeName.replace(/Technology|Application/, 'Business'));
      if (t != null)
        return t.replace('business', typeName.startsWith('Technology') ? 'technology' : 'application');
    }
    return cloneFromTemplate('todo');

    function cloneFromTemplate(name: string): string {
      const clone = elementByType.get(name)?.cloneNode(true) as Element;
      return clone?.outerHTML;
    }
  }

  public static getFromDrawing(): DiagramTemplate {
    const result = new DiagramTemplate();

    const parser = new DOMParser();

    result.templateDoc = parser.parseFromString(svgSource, 'application/xml');

    const content = result.templateDoc.getElementById('Content');
    result.elementSelection = content.querySelector('g#ElementSelected>g.selection')

    const archiElements = Array.from(content.querySelectorAll('g.element'));
    result.elementByType = new Map<string, Element>(archiElements.map(e => [e.id, e]));

    while (content.firstChild)
      content.removeChild(content.firstChild);

    return result;
  }
}
