import './diagram-renderer';
import JSZip from 'jszip';

export class ArchimateProjectStorage {
    public static async GetDefaultProject(): Promise<ArchimateProject> {
        const archisuranceSource = require('./Archisurance.archimate');
        const enc = new TextEncoder();

        return ArchimateProjectStorage.GetProjectFromArrayBuffer(enc.encode(archisuranceSource));
    }

    public static async GetProjectFromArrayBuffer(file: ArrayBuffer): Promise<ArchimateProject> {
        const start = new Int8Array(file.slice(0, 2));
        let data = file;
        if (new TextDecoder().decode(start) === 'PK') {
            const zip = await JSZip.loadAsync(file);
            data = await zip.file('model.xml').async('arraybuffer');
        }
        const xmlString = new TextDecoder().decode(data);

        const parser = new DOMParser();
        const archiDoc = parser.parseFromString(xmlString, 'application/xml');

        return ArchimateProjectStorage.GetFromDocument(archiDoc);
    }

    public static GetFromDocument(archiDoc: Document): ArchimateProject {
        const result = archiDoc.evaluate('//element[@xsi:type]', archiDoc, this.resolver, XPathResult.ANY_TYPE, null);
        let n: Node;

        const objects: ArchiEntity[] = [];

        while ((n = result.iterateNext())) {
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

    private static ToArchiObject(e: Element): ArchiEntity {
        let type = e.getAttribute('xsi:type');
        if (type.startsWith('archimate:'))
            type = type.substring(10);
        if (type.startsWith('canvas:'))
            type = type.substring(7);

        let o: ArchiEntity;

        if (type.endsWith('Relationship')) {
            const r = new Relationship;
            r.Source = e.getAttribute('source') ?? archiId(e.getElementsByTagName('source')[0]);
            r.Target = e.getAttribute('target') ?? archiId(e.getElementsByTagName('target')[0]);
            o = r;
        }
        else if (type === 'ArchimateDiagramModel')
            o = new ArchiDiagram();
        else if (type === 'CanvasModel')
            o = new ArchiDiagram();
        else
            o = new ArchiEntity();

        o.EntityType = type;
        // o.FilePath = path;
        o.Id = e.getAttribute('id');
        o.Name = e.getAttribute('name');
        o.Documentation = e.getAttribute('documentation') ?? e.getElementsByTagName('documentation')[0]?.textContent;
        o.Element = e;

        return o;
    }
}

export class ArchimateProject {
    private entities: ArchiEntity[];
    public Element: Element;
    public Name: string;
    public Id: string;
    public Version: string;

    private readonly byId: Map<string, ArchiEntity>;
    private readonly relationships: Relationship[];

    constructor(entities: ArchiEntity[], element: Element) {
        this.Element = element;
        this.Name = element.getAttribute('name');
        this.Version = element.getAttribute('version');
        this.Id = element.getAttribute('id');
        this.entities = entities;
        this.byId = new Map<string, ArchiEntity>();
        entities.forEach(o => this.byId.set(o.Id, o));
        this.relationships = entities.filter(o => o instanceof Relationship).map(o => <Relationship>o);
    }

    public GetById = (id: string) => this.byId.get(id);

    public get Entities(): ArchiEntity[] {
        return this.entities;
    }
    public get Diagrams(): ArchiDiagram[] {
        return this.entities.filter(o => o instanceof ArchiDiagram).map(o => <ArchiDiagram>o);
    }
    public GetTargetRelationShips = (id: string, relaType?: string) => this.relationships.filter(r => r.Target === id && (!relaType || relaType == r.EntityType));
    public GetSourceRelationShips = (id: string, relaType?: string) => this.relationships.filter(r => r.Source === id && (!relaType || relaType == r.EntityType));
    public GetRelatedElementForTarget = (id: string, relaType?: string, type?: string) => this.GetTargetRelationShips(id, relaType).map(r => this.GetById(r.Source)).filter(r => !type || type == r.EntityType);
    public GetRelatedElementForSource = (id: string, relaType?: string, type?: string) => this.GetSourceRelationShips(id, relaType).map(r => this.GetById(r.Target)).filter(r => !type || type == r.EntityType);
    public GetDiagramsWithElementId = (id: string) => this.Diagrams.filter(e => e.GetElementIds().some(de => de === id));

    public GetUnused(): ArchiEntity[]{
      const usedIds = this.Diagrams.flatMap(d => d.DescendantsWithSourceConnections)
        .map(o => (<ArchiDiagramChild>o).ElementId ?? (<ArchiSourceConnection>o).RelationShipId).filter(o => o)
        .concat(this.Diagrams.map(d => d.Id));
      const usedIdsSet = new Set(usedIds);
      const unusedEntities = this.Entities.filter(e => !usedIdsSet.has(e.Id));
      return unusedEntities;
    }
}

export class ArchiEntity {
    public EntityType: string;
    public FilePath: string;
    public Name: string;
    public Id: string;
    public Documentation: string;
    public Element: Element;
}

export class Relationship extends ArchiEntity {
    public Source: string;
    public Target: string;
}

export class ArchiDiagram extends ArchiEntity {
    private children: ArchiDiagramChild[]; // cache
    private childById: Map<string, ArchiDiagramObject>;
    

    public GetElementIds(): string[] {
        return this.Descendants.map(c => c.ElementId);
    }

    public GetDiagramObjectById(id: string): ArchiDiagramObject {
      if (this.childById == null) {
        this.childById = new Map<string, ArchiDiagramObject>(this.DescendantsWithSourceConnections.map(d => [d.Id, d]));
      }
      return this.childById.get(id);
    }

    public get Children(): ArchiDiagramChild[] {
        if (this.children == null) {
            this.children = Array.from(this.Element.children)
                .filter(n => n.nodeName == 'children' || n.nodeName == 'child')
                .map(c => new ArchiDiagramChild(c));
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
            let result = this.FlattenWithSourceConnections(c.SourceConnections);
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
        const elements = Array.from(this.Element.children).filter(e => e.nodeName.startsWith('sourceConnection'));
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
        const pos = this.parent?.AbsolutePosition ?? ElementPos.Zero;
        return pos.Add(new ElementPos(this.Bounds.X, this.Bounds.Y));
    }

    public get Children(): ArchiDiagramChild[] {
        if (this.children == null) {
            this.children = Array.from(this.Element.children)
                .filter(n => n.nodeName == 'children' || n.nodeName == 'child')
                .map(c => new ArchiDiagramChild(c, this));
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

        const bounds = child.getElementsByTagName('bounds')[0];
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
        const bp = Array.from(element.children).filter(e => e.nodeName === 'bendpoints' || e.nodeName === 'bendpoint');
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
    const href = element.getAttribute('href');
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
