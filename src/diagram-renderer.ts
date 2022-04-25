import { ArchimateProject, ArchiDiagram, ArchiDiagramChild, ElementPos, ArchiDiagramObject, ArchiEntity, ArchiSourceConnection } from './greeter';
import svgSource from './archimate.svg?raw';

export class DiagramRenderer {
  private readonly project: ArchimateProject;
  private readonly diagram: ArchiDiagram;
  private readonly modelTemplate: DiagramTemplate;
  private readonly svgDocument: Document;
  private readonly svgContent: Element;

  constructor(project: ArchimateProject, diagram: ArchiDiagram, modelTemplate: DiagramTemplate) {
    this.project = project;
    this.diagram = diagram;
    this.modelTemplate = modelTemplate;

    this.svgDocument = this.modelTemplate.getEmptySvg();
    this.svgContent = this.svgDocument.getElementById('Content');
  }

  public buildSvg(): Document {
    this.addElements(this.diagram.Children, this.svgContent);
    this.addRelations();

    this.setViewBoxSize();

    return this.svgDocument;
  }

  private setViewBoxSize() {
    const pos = this.diagram.Descendants[0].AbsolutePosition;
    let [minX, minY] = [pos.X, pos.Y];
    let [maxX, maxY] = [0.0, 0.0];
    this.diagram.Descendants.forEach(e => {
      minX = Math.min(minX, e.AbsolutePosition.X);
      minY = Math.min(minY, e.AbsolutePosition.Y);
      maxX = Math.max(maxX, e.AbsolutePosition.X + e.Bounds.Width);
      maxY = Math.max(maxY, e.AbsolutePosition.Y + e.Bounds.Height);
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
          .replace(/\uf0b7|\uf0a7/g, '•') // TODO: wingdings to unicode: http://www.alanwood.net/demos/wingdings.html
          .replace(/\r/g, '');
        archiElement.name = textContent;
      }
      archiElement.documentation = child.Element.getAttribute('documentation');
    }
    let es = this.modelTemplate.getElementByType(archiElement.entityType)?.outerHTML;
    if (es == null && (archiElement.entityType.startsWith('Technology') || archiElement.entityType.startsWith('Application'))) {
      es = this.modelTemplate.getElementByType(archiElement.entityType.replace(/Technology|Application/, 'Business'))?.outerHTML;
      if (es != null && archiElement.entityType.startsWith('Technology'))
        es = es.replace('business', 'technology');
      else if (es != null && archiElement.entityType.startsWith('Application'))
        es = es.replace('business', 'application');
    }
    if (!es)
      es = this.modelTemplate.getElementByType('todo').outerHTML;

    const { X, Y, Width, Height } = child.Bounds;
    if (child.Id === '3733')
      child.ElementId.toString();
    es = es.replace(/(?<!\d)168(?!\d)/g, `${Width}`);
    es = es.replace(/(?<!\d)152(?!\d)/g, `${Width - 16}`);
    es = es.replace(/(?<!\d)52(?!\d)/g, `${Height - 8}`);
    es = es.replace(/(?<!\d)44(?!\d)/g, `${Height - 16}`);
    es = es.replace(/(?<!\d)160(?!\d)/g, `${Width - 8}`);
    es = es.replace(/(?<!\d)60(?!\d)/g, `${Height}`);
    es = es.replace(/(?<!\d)84(?!\d)/g, `${Width / 2}`);
    if (archiElement.entityType === 'Grouping' || archiElement.entityType === 'Group')
      es = es.replace(/(?<!\d)156(?!\d)/g, `${Width - 12}`);
    if (archiElement.entityType === 'Junction') {
      if (archiElement.element.getAttribute('type') === 'or')
        es = es.replace('class=\'', 'class=\'or ');

      const ws = +(Width / 2).toFixed(2);
      es = es.replace('cx="5" cy="5" rx="5" ry="5"', `cx='${ws}' cy='${ws}' rx='${ws}' ry='${ws}'`);
    }
    const parser = new DOMParser();
    const e = <Element>parser.parseFromString(es, 'text/xml').firstChild;

    e.setAttribute('transform', `translate(${X}, ${Y})`);
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
    if (archiElement.documentation) {
      const d = e.ownerDocument.createElementNS(e.namespaceURI, 'title');
      d.textContent = archiElement.documentation;
      e.insertBefore(d, e.firstChild);
    }

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
  }

  private addRelations() {
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
        const pos = item.AbsolutePosition.Add(new ElementPos(item.Bounds.Width / 2, item.Bounds.Height / 2));
        const bounds = new ElementPos(item.Bounds.Width / 2, item.Bounds.Height / 2);
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
        coords[coords.length / 2 - 1].Add(coords[coords.length / 2]).Multiply(0.5));
  }

  static addDragPoints(group: Element, coords: ElementPos[]) {
    for (let i = 0; i < coords.length; i++) {
      const curr = coords[i];
      let circle = group.ownerDocument.createElementNS(group.namespaceURI, 'circle');
      circle.setAttribute('cx', curr.X.toString());
      circle.setAttribute('cy', curr.Y.toString());
      circle.setAttribute('r', '3');

      group.appendChild(circle);
      if (i > 0) {
        const prev = coords[i - 1];
        circle = group.ownerDocument.createElementNS(group.namespaceURI, 'circle');
        circle.setAttribute('cx', ((curr.X + prev.X) / 2).toString());
        circle.setAttribute('cy', ((curr.Y + prev.Y) / 2).toString());
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
    d += `M ${+coords[0].X.toFixed(2)} ${+coords[0].Y.toFixed(2)} `;
    const cornerRadius = 12;
    for (let i = 1; i < coords.length - 1; i++) {
      let prev = coords[i - 1];
      const curr = coords[i];
      let next = coords[i + 1];

      const length1 = Math.sqrt(Math.pow(curr.X - prev.X, 2) + Math.pow(curr.Y - prev.Y, 2));
      const length2 = Math.sqrt(Math.pow(curr.X - next.X, 2) + Math.pow(curr.Y - next.Y, 2));
      if (length1 < cornerRadius * 2 || length2 < cornerRadius * 2) {
        d += `L ${curr.X} ${curr.Y} `;
        continue;
      }
      prev = prev.Add(curr.Subtract(prev).Multiply((length1 - cornerRadius) * (1 / length1)));
      next = curr.Add(next.Subtract(curr).Multiply(cornerRadius * (1 / length2)));

      d += `L ${+prev.X.toFixed(2)} ${+prev.Y.toFixed(2)} Q ${+curr.X.toFixed(2)} ${+curr.Y.toFixed(2)} ${+next.X.toFixed(2)} ${+next.Y.toFixed(2)} `;
    }
    d += `L ${+coords.slice(-1)[0].X.toFixed(2)} ${+coords.slice(-1)[0].Y.toFixed(2)} `;
    return d;
  }

  private static calculateConnectionCoords(start: ElementPos, startBounds: ElementPos, end: ElementPos, endBounds: ElementPos, sourceConnection: ArchiSourceConnection) {
    const bendPoints = sourceConnection.BendPoints.map(bp => start.Add(new ElementPos(bp.X, bp.Y)));

    if (sourceConnection.Id === '3752')
      sourceConnection.Id.toString();

    const coords: ElementPos[] = [];
    bendPoints.forEach(nextPoint => {
      DiagramRenderer.determineStartAndEnd(start, startBounds, nextPoint, ElementPos.Zero);
      coords.push(start);

      startBounds = ElementPos.Zero;
      start = nextPoint;
    });
    DiagramRenderer.determineStartAndEnd(start, startBounds, end, endBounds);
    coords.push(start);
    if (start.X !== end.X || start.Y !== end.Y)
      coords.push(end);
    return coords;
  }

  private static determineStartAndEnd(start: ElementPos, startDev: ElementPos, end: ElementPos, endDev: ElementPos) {
    if (start.Y - startDev.Y > end.Y + endDev.Y) {
      start.Y = start.Y - startDev.Y;
      end.Y = end.Y + endDev.Y;
    }
    else if (start.Y + startDev.Y < end.Y - endDev.Y) {
      start.Y = start.Y + startDev.Y;
      end.Y = end.Y - endDev.Y;
    }
    else {
      const minY = Math.max(start.Y - startDev.Y, end.Y - endDev.Y);
      const maxY = Math.min(start.Y + startDev.Y, end.Y + endDev.Y);
      const y = (minY + maxY) / 2;
      start.Y = y;
      end.Y = y;
    }

    if (start.X - startDev.X > end.X + endDev.X) {
      start.X = start.X - startDev.X;
      end.X = end.X + endDev.X;
    }
    else if (start.X + startDev.X < end.X - endDev.X) {
      start.X = start.X + startDev.X;
      end.X = end.X - endDev.X;
    }
    else {
      const minY = Math.max(start.X - startDev.X, end.X - endDev.X);
      const maxY = Math.min(start.X + startDev.X, end.X + endDev.X);
      const x = (minY + maxY) / 2;
      start.X = x;
      end.X = x;
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
  public getElementByType(typeName: string): Element {
    return this.elementByType.get(typeName)?.cloneNode(true) as Element;
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
