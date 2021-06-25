import { ArchimateProjectStorage, ArchimateProject, ArchiDiagram, ArchiDiagramChild, ElementPos, ArchiDiagramObject, ArchiObject, ArchiSourceConnection } from 'greeter';

export class DiagramRenderer {

    public static async SetDiagramFromDefault(div: HTMLElement): Promise<SVGSVGElement> {
        var svg = await this.BuildDefaultDiagram();
        return this.SetDiagram(div, svg);
    }
    public static SetDiagram(div: HTMLElement, svg: Document): SVGSVGElement {
        div.innerHTML = '';
        return div.appendChild(svg.firstChild) as SVGSVGElement;
    }

    public static async BuildDefaultDiagram(): Promise<Document> {
        var project = await ArchimateProjectStorage.GetDefaultProject();

        var diagram = project.Diagrams.filter(d => d.Name === 'Business Function View')[0];

        return this.BuildDiagram(project, diagram);
    }

    public static async BuildDiagram(project: ArchimateProject, diagram: ArchiDiagram): Promise<Document> {
        var templateFile = require('archimate.svg');
        var a = await fetch(templateFile);
        var b = await a.text();
        // var c = await JSZip.loadAsync(b);

        const parser = new DOMParser();
        var templateDoc = parser.parseFromString(b, 'application/xml');

        var content = templateDoc.getElementById('Content');

        var archiElements = Array.from(content.querySelectorAll('g.element'));
        var elements = new Map<string, Element>(archiElements.map(e => [e.id, e]));

        while (content.firstChild)
            content.removeChild(content.firstChild);

        this.BuildSvg(project, diagram, templateDoc, elements);

        return templateDoc;
    }


    private static BuildSvg(project: ArchimateProject, diagram: ArchiDiagram, document: Document, elements: Map<string, Element>) {
        var content = document.getElementById('Content');
        AddElements(diagram.Children, content);

        var childById = new Map<string, ArchiDiagramObject>(diagram.DescendantsWithSourceConnections.map(d => [d.Id, d]));
        addRelations();

        SetViewBoxSize();

        function SetViewBoxSize() {
            var pos = diagram.Descendants[0].AbsolutePosition;
            var [minX, minY] = [pos.X, pos.Y];
            var [maxX, maxY] = [0.0, 0.0];
            diagram.Descendants.forEach(e => {
                minX = Math.min(minX, e.AbsolutePosition.X);
                minY = Math.min(minY, e.AbsolutePosition.Y);
                maxX = Math.max(maxX, e.AbsolutePosition.X + e.Bounds.Width);
                maxY = Math.max(maxY, e.AbsolutePosition.Y + e.Bounds.Height);
            });
            document.firstElementChild.setAttribute('viewBox', `${(minX - 10).toFixed(0)} ${(minY - 10).toFixed(0)} ${(maxX - minX + 20).toFixed(0)} ${(maxY - minY + 20).toFixed(0)}`);
            document.firstElementChild.setAttribute('width', `${(maxX - minX + 20).toFixed(0)}`);
            document.firstElementChild.setAttribute('height', `${(maxY - minY + 20).toFixed(0)}`);
        }

        function AddElements(children: ArchiDiagramChild[], parent: Element) {
            children.forEach(child => AddElement(child, parent));
        }

        function AddElement(child: ArchiDiagramChild, parent: Element) {
            var archiElement = project.GetById(child.ElementId);
            if (archiElement == null) {
                archiElement = new ArchiObject();
                archiElement.EntityType = child.EntityType;
                archiElement.Name = child.Element.getAttribute('name');
                if (archiElement.EntityType === 'Note')
                    archiElement.Name = Array.from(child.Element.childNodes).filter(n => n.nodeName === 'content')[0]?.textContent;
                archiElement.Documentation = child.Element.getAttribute('documentation');
            }
            var es = elements.get(archiElement.EntityType)?.outerHTML;
            if (es == null && (archiElement.EntityType.startsWith('Technology') || archiElement.EntityType.startsWith('Application'))) {
                es = elements.get(archiElement.EntityType.replace(/Technology|Application/, 'Business'))?.outerHTML;
                if (es != null && archiElement.EntityType.startsWith('Technology'))
                    es = es.replace('business', 'technology');
                else if (es != null && archiElement.EntityType.startsWith('Application'))
                    es = es.replace('business', 'application');
            }
            if (!es)
                es = elements.get('todo').outerHTML;

            var { X, Y, Width, Height } = child.Bounds;
            if (child.Id === '3733')
                child.ElementId.toString();
            es = es.replace(/(?<!\d)168(?!\d)/g, `${Width}`);
            es = es.replace(/(?<!\d)152(?!\d)/g, `${Width - 16}`);
            es = es.replace(/(?<!\d)52(?!\d)/g, `${Height - 8}`);
            es = es.replace(/(?<!\d)44(?!\d)/g, `${Height - 16}`);
            es = es.replace(/(?<!\d)160(?!\d)/g, `${Width - 8}`);
            es = es.replace(/(?<!\d)60(?!\d)/g, `${Height}`);
            es = es.replace(/(?<!\d)84(?!\d)/g, `${Width / 2}`);
            if (archiElement.EntityType === 'Grouping' || archiElement.EntityType === 'Group')
                es = es.replace(/(?<!\d)156(?!\d)/g, `${Width - 12}`);
            if (archiElement.EntityType === 'Junction') {
                if (archiElement.Element.getAttribute('type') === 'or')
                    es = es.replace('class=\'', 'class=\'or ');

                const ws = +(Width / 2).toFixed(2);
                es = es.replace('cx="5" cy="5" rx="5" ry="5"', `cx='${ws}' cy='${ws}' rx='${ws}' ry='${ws}'`);
            }
            const parser = new DOMParser();
            var e = <Element>parser.parseFromString(es, 'text/xml').firstChild;

            e.setAttribute('transform', `translate(${X}, ${Y})`);
            e.setAttribute('id', child.Id.toString());
            var div = e.querySelector('foreignObject>div>div');
            if (div != null) {
                div.textContent = archiElement.Name;
                div.setAttribute('contenteditable', 'true');
            }
            if (archiElement.Documentation) {
                var d = e.ownerDocument.createElementNS(parent.namespaceURI, 'title');
                d.textContent = archiElement.Documentation;
                e.insertBefore(d, e.firstChild);
            }

            var style: string = '';
            if (child.FillColor)
                style += 'fill: ' + child.FillColor + ' ';
            if (style !== '') {
                var toStyle = e.querySelectorAll(':scope>rect, :scope>path');
                toStyle.forEach(se => se.setAttribute('style', style));
            }

            parent.append(e);

            AddElements(child.Children, e);
        }

        function addRelations() {
            var connectionsNext: ArchiSourceConnection[] =
                diagram.Descendants.flatMap(child => child.SourceConnections);
            var connections: ArchiSourceConnection[] = [];

            var sourceConnectionMiddlePoints = new Map<string, ElementPos>();

            while (connectionsNext.length > 0) {
                connections = connectionsNext;
                connectionsNext = [];

                for (var sourceConnection of connections) {
                    var [end, endBounds] = getPositionAndBounds(childById.get(sourceConnection.TargetId));
                    if (end != null) {
                        var [start, startBounds] = getPositionAndBounds(sourceConnection.Source);
                        var coords = DiagramRenderer.calculateConnectionCoords(start, startBounds, end, endBounds, sourceConnection);
                        if (coords.length > 1) {
                            var relationEntity = project.GetById(sourceConnection.RelationShipId);
                            DiagramRenderer.addRelation(content, coords, sourceConnection, relationEntity, sourceConnectionMiddlePoints);
                        }
                    }
                    else
                        connectionsNext.push(sourceConnection);
                }
            }

            function getPositionAndBounds(item: ArchiDiagramObject): [ElementPos, ElementPos] {
                if (item instanceof ArchiDiagramChild) {
                    pos = item.AbsolutePosition.Add(new ElementPos(item.Bounds.Width / 2, item.Bounds.Height / 2));
                    var bounds = new ElementPos(item.Bounds.Width / 2, item.Bounds.Height / 2);
                    return [pos, bounds];
                }
                var pos = sourceConnectionMiddlePoints.get(item.Id);
                if (pos != null)
                    return [pos, ElementPos.Zero];
                return [null, null];
            }
        }
    }

    static addRelation(group: Element, coords: ElementPos[], sourceConnection: ArchiSourceConnection, relationEntity: ArchiObject,
        sourceConnectionMiddlePoints: Map<string, ElementPos>) {
        var d = DiagramRenderer.coordsToPathD(coords);

        var editPointGroup = DiagramRenderer.addEditPointGroup(group, sourceConnection);
        DiagramRenderer.addConnectionPath(editPointGroup, relationEntity, d, sourceConnection);
        DiagramRenderer.addConnectionPathDetectLine(editPointGroup, d);
        DiagramRenderer.addDragPoints(editPointGroup, coords);

        sourceConnectionMiddlePoints.set(sourceConnection.Id,
            coords.length % 2 === 1 ? coords[(coords.length - 1) / 2] :
                coords[coords.length / 2 - 1].Add(coords[coords.length / 2]).Multiply(0.5));
    }

    static addDragPoints(group: Element, coords: ElementPos[]) {
        for (var i = 0; i < coords.length; i++) {
            var curr = coords[i];
            var circle = group.ownerDocument.createElementNS(group.namespaceURI, 'circle');
            circle.setAttribute('cx', curr.X.toString());
            circle.setAttribute('cy', curr.Y.toString());
            circle.setAttribute('r', '3');

            group.appendChild(circle);
            if (i > 0) {
                var prev = coords[i - 1];
                circle = group.ownerDocument.createElementNS(group.namespaceURI, 'circle');
                circle.setAttribute('cx', ((curr.X + prev.X) / 2).toString());
                circle.setAttribute('cy', ((curr.Y + prev.Y) / 2).toString());
                circle.setAttribute('r', '2');
                group.appendChild(circle);
            }
        }
    }

    static addConnectionPathDetectLine(group: Element, d: string) {
        var path = group.ownerDocument.createElementNS(group.namespaceURI, 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', 'RelationshipDetect');

        group.appendChild(path);
    }

    static addEditPointGroup(group: Element, sourceConnection: ArchiSourceConnection) {
        var editPointGroup = group.ownerDocument.createElementNS(group.namespaceURI, 'g');
        editPointGroup.setAttribute('id', sourceConnection.Id);
        editPointGroup.setAttribute('class', 'con');

        group.appendChild(editPointGroup);
        return editPointGroup;
    }

    static addConnectionPath(group: Element, relationEntity: ArchiObject, d: string, sourceConnection: ArchiSourceConnection) {
        var relationShipType = relationEntity?.EntityType;
        var cssClass: string = relationShipType?.replace('Relationship', ' Relationship') ?? 'Relationship';
        if (relationShipType === 'AccessRelationShip') {
            var accessClass: string;
            switch (relationEntity.Element.getAttribute('accessType')) {
                case '1': accessClass = 'Read'; break;
                case '2': accessClass = 'Access'; break;
                case '3': accessClass = 'Read Write'; break;
                default: accessClass = 'Write'; break;
            }
            cssClass += cssClass + ' ' + accessClass;
        }
        var path = group.ownerDocument.createElementNS(group.namespaceURI, 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', cssClass);

        // https://stackoverflow.com/questions/47088409/svg-attributes-beaten-by-cssstyle-in-priority
        var style = '';
        if (sourceConnection.LineWidth != null)
            style += 'stroke-width:' + sourceConnection.LineWidth + ';';
        if (sourceConnection.LineColor != null)
            style += 'stroke:' + sourceConnection.LineColor + ';';
        if (style !== '')
            path.setAttribute('style', style);

        group.appendChild(path);
    }

    static coordsToPathD(coords: ElementPos[]): string {
        var d: string = '';
        d += `M ${+coords[0].X.toFixed(2)} ${+coords[0].Y.toFixed(2)} `;
        const cornerRadius = 12;
        for (var i = 1; i < coords.length - 1; i++) {
            var prev = coords[i - 1];
            var curr = coords[i];
            var next = coords[i + 1];

            var length1 = Math.sqrt(Math.pow(curr.X - prev.X, 2) + Math.pow(curr.Y - prev.Y, 2));
            var length2 = Math.sqrt(Math.pow(curr.X - next.X, 2) + Math.pow(curr.Y - next.Y, 2));
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
        var bendPoints = sourceConnection.BendPoints.map(bp => start.Add(new ElementPos(bp.X, bp.Y)));

        if (sourceConnection.Id === '3752')
            sourceConnection.Id.toString();

        var coords: ElementPos[] = [];
        bendPoints.forEach(nextPoint => {
            DiagramRenderer.DetermineStartAndEnd(start, startBounds, nextPoint, ElementPos.Zero);
            coords.push(start);

            startBounds = ElementPos.Zero;
            start = nextPoint;
        });
        DiagramRenderer.DetermineStartAndEnd(start, startBounds, end, endBounds);
        coords.push(start);
        if (start.X !== end.X || start.Y !== end.Y)
            coords.push(end);
        return coords;
    }

    private static DetermineStartAndEnd(start: ElementPos, startDev: ElementPos, end: ElementPos, endDev: ElementPos) {
        if (start.Y - startDev.Y > end.Y + endDev.Y) {
            start.Y = start.Y - startDev.Y;
            end.Y = end.Y + endDev.Y;
        }
        else if (start.Y + startDev.Y < end.Y - endDev.Y) {
            start.Y = start.Y + startDev.Y;
            end.Y = end.Y - endDev.Y;
        }
        else {
            var minY = Math.max(start.Y - startDev.Y, end.Y - endDev.Y);
            var maxY = Math.min(start.Y + startDev.Y, end.Y + endDev.Y);
            var y = (minY + maxY) / 2;
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
            var minY = Math.max(start.X - startDev.X, end.X - endDev.X);
            var maxY = Math.min(start.X + startDev.X, end.X + endDev.X);
            var x = (minY + maxY) / 2;
            start.X = x;
            end.X = x;
        }
    }
}
