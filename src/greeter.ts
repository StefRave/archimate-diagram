import './diagram-renderer';
import JSZip from 'jszip';

export class ArchimateProjectStorage {
    public static async GetDefaultProject(): Promise<ArchimateProject> {
        var archimateFilePath = require('Archisurance.archimate');
        var a = await fetch(archimateFilePath);
        var b = await a.arrayBuffer();

        return ArchimateProjectStorage.GetProjectFromArrayBuffer(b);
    }

    public static async GetProjectFromArrayBuffer(file: ArrayBuffer): Promise<ArchimateProject> {
        var start = new Int8Array(file.slice(0, 2));
        var data = file;
        if (new TextDecoder().decode(start) === 'PK') {
            var zip = await JSZip.loadAsync(file);
            data = await zip.file('model.xml').async('arraybuffer');
        }
        var xmlString = new TextDecoder().decode(data);

        const parser = new DOMParser();
        var archiDoc = parser.parseFromString(xmlString, 'application/xml');

        return ArchimateProjectStorage.GetFromDocument(archiDoc);
    }

    public static GetFromDocument(archiDoc: Document): ArchimateProject {
        var result = archiDoc.evaluate('//element[@xsi:type]', archiDoc, this.resolver, XPathResult.ANY_TYPE, null);
        var n: Node;

        var objects: ArchiObject[] = [];

        while (n = result.iterateNext()) {
            objects.push(this.ToArchiObject(<Element>n));
        }
        return new ArchimateProject(objects, archiDoc.firstElementChild);
    }

    private static resolver(prefix: string) {
        switch (prefix) {
            case 'archimate': return 'http://www.archimatetool.com/archimate';
            case 'xsi': return 'http://www.w3.org/2001/XMLSchema-instance';
        }
    }

    private static ToArchiObject(e: Element): ArchiObject {
        var type = e.getAttribute('xsi:type');
        if (type.startsWith('archimate:'))
            type = type.substring(10);

        var o: ArchiObject;

        if (type.endsWith('Relationship')) {
            var r = new Relationship;
            r.Source = e.getAttribute('source') ?? archiId(e.getElementsByTagName('source')[0]);
            r.Target = e.getAttribute('target') ?? archiId(e.getElementsByTagName('target')[0]);
            o = r;
        }
        else if (type === 'ArchimateDiagramModel')
            o = new ArchiDiagram();
        else
            o = new ArchiObject();

        o.EntityType = type;
        // o.FilePath = path;
        o.Id = e.getAttribute('id');
        o.Name = e.getAttribute('name');
        o.Documentation = e.getAttribute('documentation');
        o.Element = e;

        return o;
    }
}

export class ArchimateProject {
    private objects: ArchiObject[];
    public Element: Element;
    public Name: string;
    public Id: string;
    public Version: string;

    private readonly byId: Map<string, ArchiObject>;
    private readonly relationships: Relationship[];

    constructor(objects: ArchiObject[], element: Element) {
        this.Element = element;
        this.Name = element.getAttribute('name');
        this.Version = element.getAttribute('version');
        this.Id = element.getAttribute('id');
        this.objects = objects;
        this.byId = new Map<string, ArchiObject>();
        objects.forEach(o => this.byId.set(o.Id, o));
        this.relationships = objects.filter(o => o instanceof Relationship).map(o => <Relationship>o);
    }

    public GetById = (id: string) => this.byId.get(id);

    public get Objects(): ArchiObject[] {
        return this.objects;
    }
    public get Diagrams(): ArchiDiagram[] {
        return this.objects.filter(o => o instanceof ArchiDiagram).map(o => <ArchiDiagram>o);
    }
    public GetTargetRelationShips = (id: string) => this.relationships.filter(r => r.Target === id);
    public GetSourceRelationShips = (id: string) => this.relationships.filter(r => r.Source === id);
    public GetDiagramsWithElementId = (id: string) => this.Diagrams.filter(e => e.GetElementIds().some(de => de === id));
}

export class ArchiObject {
    public EntityType: string;
    public FilePath: string;
    public Name: string;
    public Id: string;
    public Documentation: string;
    public Element: Element;
}

export class Relationship extends ArchiObject {
    public Source: string;
    public Target: string;
}

export class ArchiDiagram extends ArchiObject {
    private children: ArchiDiagramChild[]; // cache
    public GetElementIds(): string[] {
        return this.Descendants.map(c => c.ElementId);
    }

    public get Children(): ArchiDiagramChild[] {
        if (this.children == null) {
            var elements = Array.from(this.Element.querySelectorAll(':scope>children'))
                .concat(Array.from(this.Element.querySelectorAll(':scope>child')));
            this.children = elements.map(c => new ArchiDiagramChild(c));
        }
        return this.children;
    }

    public get Descendants(): ArchiDiagramChild[] {
        return this.Flatten(this.Children);
    }
    public get DescendantsWithSourceConnections(): ArchiDiagramObject[] {
        return this.FlattenWithSourceConnections(this.Children);
    }
    Flatten(e: ArchiDiagramChild[]): ArchiDiagramChild[] {
        return e.concat(e.flatMap(c => this.Flatten(c.Children)));
    }

    FlattenWithSourceConnections(e: ArchiDiagramObject[]): ArchiDiagramObject[] {
        return e.concat(e.flatMap(c => {
            var result = this.FlattenWithSourceConnections(c.SourceConnections);
            if (c instanceof ArchiDiagramChild)
                result = result.concat(this.FlattenWithSourceConnections(c.Children));
            return result;
        }));
    }
}

export class ArchiDiagramObject {
    public Element: Element;
    public Id: string;
    private sourceConnections: ArchiSourceConnection[]; // cache

    public get SourceConnections(): ArchiSourceConnection[] {
        if (this.sourceConnections == null)
            this.sourceConnections = this.sourceConnectionsFromElement();
        return this.sourceConnections;
    }

    sourceConnectionsFromElement() {
        var elements = Array.from(this.Element.children).filter(e => e.nodeName.startsWith('sourceConnection'));
        return elements.map(c => new ArchiSourceConnection(c, this));
    }

    constructor(element: Element) {
        this.Element = element;
        this.Id = element.getAttribute('id');
    }
}

export class ArchiDiagramChild extends ArchiDiagramObject {
    private parent: ArchiDiagramChild;
    private children: ArchiDiagramChild[]; // cache

    public EntityType: string;
    public ElementId: string;
    public Bounds: ElementBounds;
    public FillColor: string;

    public get AbsolutePosition(): ElementPos {
        var pos = this.parent?.AbsolutePosition ?? ElementPos.Zero;
        return pos.Add(new ElementPos(this.Bounds.X, this.Bounds.Y));
    }

    public get Children(): ArchiDiagramChild[] {
        if (this.children == null) {
            var elements = Array.from(this.Element.querySelectorAll(':scope>children'))
                .concat(Array.from(this.Element.querySelectorAll(':scope>child')));
            this.children = elements.map(c => new ArchiDiagramChild(c, this));
        }
        return this.children;
    }



    constructor(child: Element, parent: ArchiDiagramChild = null) {
        super(child);
        this.parent = parent;
        this.EntityType = child.getAttribute('xsi:type');
        if (this.EntityType.startsWith('archimate:'))
            this.EntityType = this.EntityType.substring(10);
        this.ElementId = child.getAttribute('archimateElement') ??
            child.getAttribute('model') ??
            archiId(child.getElementsByClassName('archimateElement')[0]);

        var bounds = child.getElementsByTagName('bounds')[0];
        if (this.Id === '3785')
            this.Id.toString();

        this.Bounds = new ElementBounds(
            parseFloat(bounds.getAttribute('x') ?? '0'),
            parseFloat(bounds.getAttribute('y') ?? '0'),
            parseFloat(bounds.getAttribute('width') ?? '165'),
            parseFloat(bounds.getAttribute('height') ?? '58'));
        this.FillColor = child.getAttribute('fillColor');
    }
}

export class ArchiSourceConnection extends ArchiDiagramObject {
    TargetId: string;
    RelationShipId: string;
    BendPoints: ElementPos[];
    LineWidth: string;
    LineColor: string;
    FillColor: string;
    Source: ArchiDiagramObject;

    constructor(element: Element, source: ArchiDiagramObject) {
        super(element);
        this.Source = source;
        this.TargetId = element.getAttribute('target');
        this.RelationShipId = element.getAttribute('archimateRelationship') ??
            archiId(element.getElementsByTagName('archimateRelationship')[0]);
        var bp = Array.from(element.children).filter(e => e.nodeName === 'bendpoints' || e.nodeName === 'bendpoint');
        this.BendPoints = bp.map(
            p => new ElementPos(
                parseFloat(p.getAttribute('startX') ?? '0'),
                parseFloat(p.getAttribute('startY') ?? '0')));
        this.LineWidth = element.getAttribute('lineWidth');
        this.LineColor = element.getAttribute('lineColor');
    }
}

export function archiId(element: Element): string {
    if (element == null)
        return null;
    var href = element.getAttribute('href');
    return href.split('#')[1];
}

export class ElementPos {
    constructor(public X: number, public Y: number) { }

    public static Zero: ElementPos = new ElementPos(0, 0);

    public Clone = () => new ElementPos(this.X, this.Y);
    public Add = (b: ElementPos) => new ElementPos(this.X + b.X, this.Y + b.Y);
    public Subtract = (b: ElementPos) => new ElementPos(this.X - b.X, this.Y - b.Y);
    public Multiply = (b: number) => new ElementPos(this.X * b, this.Y * b);
}

export class ElementBounds {
    constructor(public X: number, public Y: number, public Width: number, public Height: number) { }

    public static Zero: ElementBounds = new ElementBounds(0, 0, 0, 0);
}
