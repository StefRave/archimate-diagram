import './diagram-renderer';
import JSZip from 'jszip';
import Sequence, {asSequence} from 'sequency';
import archisuranceSource from './Archisurance.archimate'
export class ArchimateProjectStorage {
    public static async GetDefaultProjectData(): Promise<ArrayBuffer> {
        const response = await fetch(archisuranceSource);
        return response.arrayBuffer();
    }

    public static async GetProjectFromArrayBuffer(file: ArrayBuffer): Promise<ArchimateProject> {
        const start = new Int8Array(file.slice(0, 2));
        let data = file;
        let zip: JSZip = null;
        if (new TextDecoder().decode(start) === 'PK') {
            zip = await JSZip.loadAsync(file);
            data = await zip.file('model.xml').async('arraybuffer');
        }
        const xmlString = new TextDecoder().decode(data);

        const parser = new DOMParser();
        const archiDoc = parser.parseFromString(xmlString, 'application/xml');

        return ArchimateProjectStorage.GetFromDocument(archiDoc, zip);
    }

    public static GetFromDocument(archiDoc: Document, zip: JSZip): ArchimateProject {
        const result = archiDoc.evaluate('//element[@xsi:type]', archiDoc, this.resolver, XPathResult.ANY_TYPE, null);
        let n: Node;

        const objects: ArchiEntity[] = [];

        while ((n = result.iterateNext())) {
            objects.push(this.ToArchiObject(<Element>n));
        }
        return new ArchimateProject(objects, archiDoc.firstElementChild, zip);
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
            r.source = e.getAttribute('source') ?? archiId(e.getElementsByTagName('source')[0]);
            r.target = e.getAttribute('target') ?? archiId(e.getElementsByTagName('target')[0]);
            o = r;
        }
        else if (type === 'ArchimateDiagramModel')
            o = new ArchiDiagram();
        else if (type === 'CanvasModel')
            o = new ArchiDiagram();
        else if (type == 'SketchModel')
            o = new ArchiDiagram();
        else
            o = new ArchiEntity();

        o.entityType = type;
        o.Id = e.getAttribute('id');
        o.name = e.getAttribute('name');
        o.documentation = e.getAttribute('documentation') ?? e.getElementsByTagName('documentation')[0]?.textContent;
        o.element = e;

        return o;
    }
}

export class ArchimateProject {
    public element: Element;
    public name: string;
    public id: string;
    public version: string;

    private readonly entitiesById: Map<string, ArchiEntity>;
    private readonly relationshipsById: Map<string, Relationship>;

    constructor(entities: ArchiEntity[], element: Element, private zip: JSZip) {
        this.element = element;
        this.name = element.getAttribute('name');
        this.version = element.getAttribute('version');
        this.id = element.getAttribute('id');
        this.entitiesById = new Map<string, ArchiEntity>();
        entities.forEach(o => this.entitiesById.set(o.Id, o));
        this.relationshipsById = new Map<string, Relationship>();
        entities.filter(o => o instanceof Relationship).forEach(o => this.relationshipsById.set(o.Id, <Relationship>o));
    }

    public getById = (id: string) => this.entitiesById.get(id);

    public get diagrams(): ArchiDiagram[] {
      return asSequence(this.entitiesById.values()).filter(o => o instanceof ArchiDiagram).map(o => <ArchiDiagram>o).toArray();
    }
    public get relationships(): Sequence<Relationship> {
      return asSequence(this.relationshipsById.values());
    }
    public get entities(): Sequence<ArchiEntity> {
      return asSequence(this.entitiesById.values()).filter(o => !(o instanceof Relationship));
    }

    public getTargetRelationShips = (id: string, relaType?: string) => this.relationships.filter(r => r.target === id && (!relaType || relaType == r.entityType));
    public getSourceRelationShips = (id: string, relaType?: string) => this.relationships.filter(r => r.source === id && (!relaType || relaType == r.entityType));
    public getRelatedElementForTarget = (id: string, relaType?: string, type?: string) => this.getTargetRelationShips(id, relaType).map(r => this.getById(r.source)).filter(r => !type || type == r.entityType);
    public getRelatedElementForSource = (id: string, relaType?: string, type?: string) => this.getSourceRelationShips(id, relaType).map(r => this.getById(r.target)).filter(r => !type || type == r.entityType);
    public getDiagramsWithElementId = (id: string) => this.diagrams.filter(e => e.GetElementIds().some(de => de === id));

    getImage(imagePath: string): Promise<Uint8Array> {
      if (!this.zip)
        return null;
      return this.zip.file(imagePath).async('uint8array');
    }

    public getUnused(): ArchiEntity[] {
      const usedIds = this.diagrams.flatMap(d => d.DescendantsWithSourceConnections)
        .map(o => (<ArchiDiagramChild>o).ElementId ?? (<ArchiSourceConnection>o).RelationShipId).filter(o => o)
        .concat(this.diagrams.map(d => d.Id));
      const usedIdsSet = new Set(usedIds);
      const unusedEntities = asSequence(this.entitiesById.values()).filter(e => !usedIdsSet.has(e.Id));
      return unusedEntities.toArray();
    }

    public removeEntity(entity: ArchiEntity) {
      this.entitiesById.delete(entity.Id);
      if (entity instanceof Relationship)
        this.relationshipsById.delete(entity.Id);
      entity.element.remove();
    }
}

export class ArchiEntity {
    public entityType: string;
    public filePath: string;
    public name: string;
    public Id: string;
    public documentation: string;
    public element: Element;
}

export class Relationship extends ArchiEntity {
    public source: string;
    public target: string;

    public setSource(newId: string) {
      this.source = newId;
      if (this.element.getAttribute('source') == null)
        throw new Error("source attribute expected");
      this.element.setAttribute('source', newId);
    }
    public setTarget(newId: string) {
      this.source = newId;
      if (this.element.getAttribute('target') == null)
        throw new Error("source attribute expected");
      this.element.setAttribute('target', newId);
    }
}

export class ArchiDiagram extends ArchiEntity {

    private children: ArchiDiagramChild[]; // cache
    private childById: Map<string, ArchiDiagramObject>;
    
    resetCache() {
      this.children = null;
      this.childById = null;
    }
    
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
            this.children = Array.from(this.element.children)
                .filter(n => n.nodeName == 'children' || n.nodeName == 'child')
                .map(c => new ArchiDiagramChild(c, this));
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
    private _parent: ArchiDiagramChild;
    private children: ArchiDiagramChild[]; // cache

    public EntityType: string;
    public ElementId: string;
    private _bounds: ElementBounds;
    public fillColor: string;
    public fontColor: string;
    public font: string; // see eclipse/swt/graphics/FontData.java toString
    public figureType: FigureType;

    public get parent(): ArchiDiagramChild {
      return this._parent;
    }

    public setElementId(newId: string) {
      this.ElementId = newId;
      if (this.Element.getAttribute('archimateElement') == null)
        throw new Error("archimateElement attribute exprected");
      this.Element.setAttribute('archimateElement', newId); 
    }

    public get content(): string { return this.Element.querySelector(':scope>content')?.textContent; }
    public set content(value) {
      const contentNode = this.Element.querySelector(':scope>content');
      if (!contentNode)
        throw new Error('Content child element missing. Does this element entityType support content?')
      contentNode.textContent = value;
    }

    resetCache() {
      this.children = null;
    }
    public get AbsolutePosition(): ElementPos {
        const pos = this._parent?.AbsolutePosition ?? ElementPos.Zero;
        return pos.add(new ElementPos(this.bounds.x, this.bounds.y));
    }

    public get Children(): ArchiDiagramChild[] {
        if (this.children == null) {
            this.children = Array.from(this.Element.children)
                .filter(n => n.nodeName == 'children' || n.nodeName == 'child')
                .map(c => new ArchiDiagramChild(c, this.diagram, this));
        }
        return this.children;
    }

    constructor(child: Element, readonly diagram: ArchiDiagram, parent: ArchiDiagramChild = null) {
        super(child);
        this._parent = parent;
        this.EntityType = child.getAttribute('xsi:type');
        if (this.EntityType.startsWith('archimate:'))
            this.EntityType = this.EntityType.substring(10);
        this.ElementId = child.getAttribute('archimateElement') ??
            child.getAttribute('model') ??
            archiId(child.getElementsByClassName('archimateElement')[0]);
        this.figureType = parseInt(child.getAttribute('type') ?? '0');

        const bounds = child.getElementsByTagName('bounds')[0];
        this._bounds = new ElementBounds(
            parseFloat(bounds.getAttribute('x') ?? '0'),
            parseFloat(bounds.getAttribute('y') ?? '0'),
            parseFloat(bounds.getAttribute('width') ?? '165'),
            parseFloat(bounds.getAttribute('height') ?? '58'));
        this.fillColor = child.getAttribute('fillColor');
        this.fontColor = child.getAttribute('fontColor');
        this.font = child.getAttribute('font');
    }

    changeElementParent(parentElement: ArchiDiagramChild) {
      if (this.parent)
        this.parent.resetCache();
      else
        this.diagram.resetCache();
      if (parentElement)
        parentElement.resetCache();
      else
        this.diagram.resetCache();
        
      this.Element.remove();
      this._parent = parentElement;
      parentElement.Element.appendChild(this.Element);
    }
    changeElementParentDiagram(diagram: ArchiDiagram) {
      this.parent.resetCache();
      this.Element.remove();
      this._parent = null;
      diagram.resetCache();
      diagram.element.appendChild(this.Element);
    }

    public get bounds() {
      return this._bounds;
    }

    public set bounds(value: ElementBounds) {
      this._bounds = value;
      const b = this.Element.getElementsByTagName('bounds')[0];
          b.setAttribute('x', value.x.toFixed(2));
          b.setAttribute('y', value.y.toFixed(2));
          b.setAttribute('width', value.width.toFixed(2));
          b.setAttribute('height', value.height.toFixed(2));
    }
}

export enum FigureType {
  Square = 0,
  Figure = 1,
}
export class ArchiSourceConnection extends ArchiDiagramObject {
    TargetId: string;
    RelationShipId: string;
    BendPoints: ElementPos[];
    LineWidth: string;
    LineColor: string;
    fillColor: string;
    name: string;
    Source: ArchiDiagramObject;

    public setRelationShipId(id: string) {
      this.RelationShipId = id;
      if (this.Element.getAttribute('archimateRelationship') == null)
        throw new Error("archimateRelationship attribute expected");
      this.Element.setAttribute('archimateRelationship', id);
    }

    constructor(element: Element, source: ArchiDiagramObject) {
        super(element);
        this.Source = source;
        this.TargetId = element.getAttribute('target');
        this.name = element.getAttribute('name');
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
    constructor(public x: number, public y: number) { }

    public static Zero: ElementPos = new ElementPos(0, 0);

    public clone = () => new ElementPos(this.x, this.y);
    public add = (b: ElementPos) => new ElementPos(this.x + b.x, this.y + b.y);
    public subtract = (b: ElementPos) => new ElementPos(this.x - b.x, this.y - b.y);
    public multiply = (b: number) => new ElementPos(this.x * b, this.y * b);

    public static IsInsideBounds(pos: {x: number, y: number}, center: {x: number, y: number}, bounds = {x: 0, y: 0}, minBounds = 4): boolean {
      return pos.x >= center.x - Math.max(bounds.x, minBounds)
        &&   pos.x <= center.x + Math.max(bounds.x, minBounds)
        &&   pos.y >= center.y - Math.max(bounds.y, minBounds)
        &&   pos.y <= center.y + Math.max(bounds.y, minBounds);
    }

}

export class ElementBounds {

    constructor(public readonly x: number, public readonly y: number, public readonly width: number, public readonly height: number) {}

    public static Zero: ElementBounds = new ElementBounds(0, 0, 0, 0);
}
