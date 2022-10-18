import './diagram-renderer';
import JSZip from 'jszip';
import Sequence, { asSequence } from 'sequency';
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
    const folders = Array.from(archiDoc.children[0].children).map(e => this.ToFolder(e));

    return new ArchimateProject(folders, archiDoc.firstElementChild, zip);
  }

  private static ToFolder(e: Element): ArchiFolder {
    const o = new ArchiFolder();
    o.name = e.getAttribute('name');
    o.id = e.getAttribute('id');
    o.type = e.getAttribute('type');
    o.diagrams = [];
    o.folders = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let purpose: Element;
    Array.from(e.children).forEach(c => {
      if (c.localName == 'folder')
        o.folders.push(this.ToFolder(c));
      else if (c.localName == 'element')
        o.diagrams.push(this.ToArchiObject(c));
      else if (c.localName == 'purpose')
        purpose = c;
      else if (import.meta.env.MODE !== 'production')
        throw new Error('Unknown element ' + c.localName);
    });
    return o;
  }

  private static ToArchiObject(e: Element): ArchiEntity {
    let type = e.getAttribute('xsi:type');
    if (type.startsWith('archimate:'))
      type = type.substring(10);
    if (type.startsWith('canvas:'))
      type = type.substring(7);

    let o: ArchiEntity;

    if (type.endsWith('Relationship'))
      o = this.deserializeRelationShip(type, e);
    else if (type === 'ArchimateDiagramModel')
      o = this.deserializeDiagram(type, e);
    else if (type === 'CanvasModel')
      o = this.deserializeDiagram(type, e);
    else if (type == 'SketchModel')
      o = this.deserializeDiagram(type, e);
    else
      o = this.deserializeEntity(type, e);

    return o;
  }

  private static deserializeDiagram(type: string, e: Element): ArchiDiagram {
    const children = Array.from(e.children)
      .filter(n => n.nodeName == 'children' || n.nodeName == 'child')
      .map(c => this.deserializeDiagramChild(c, null));

      const o = new ArchiDiagram(children);
      this.deserializeEntity(type, e, o);
    return o;
  }

  private static deserializeRelationShip(type: string, e: Element): ArchiEntity {
    const o = new Relationship();
    o.source = e.getAttribute('source') ?? archiId(e.getElementsByTagName('source')[0]);
    o.target = e.getAttribute('target') ?? archiId(e.getElementsByTagName('target')[0]);
    this.deserializeEntity(type, e, o);
    return o;
  }

  private static deserializeEntity(type: string, e: Element, o: ArchiEntity = null): ArchiEntity {
    o = o ?? new ArchiEntity();
    o.entityType = type;
    o.id = e.getAttribute('id');
    o.name = e.getAttribute('name');
    o.documentation = e.getAttribute('documentation') ?? e.getElementsByTagName('documentation')[0]?.textContent;
    o.subType = e.getAttribute('type');
    o.element = e;
    return o;
  }

  private static deserializeArchiSourceConnection(e: Element, source: ArchiDiagramObject) {
    const o = new ArchiSourceConnection();
    o.source = source;
    o.targetId = e.getAttribute('target');
    o.name = e.getAttribute('name');
    o.relationShipId = e.getAttribute('archimateRelationship') ??
      archiId(e.getElementsByTagName('archimateRelationship')[0]);
    const bp = Array.from(e.children).filter(e => e.nodeName === 'bendpoints'/*git*/ || e.nodeName === 'bendpoint');
    o.bendPoints = bp.map(
      p => new ElementPos(
        parseFloat(p.getAttribute('startX') ?? '0'),
        parseFloat(p.getAttribute('startY') ?? '0')));
    o.lineWidth = e.getAttribute('lineWidth');
    o.lineColor = e.getAttribute('lineColor');
    const type = e.getAttribute('type');
    if (type)
      o.type = parseInt(type);
    this.deserializeDiagramObject(e, o);
    return o;
  }

  private static deserializeDiagramChild(e: Element, parent: ArchiDiagramChild): ArchiDiagramChild {
    const o = new ArchiDiagramChild();
    o.parent = parent;
    o.entityType = e.getAttribute('xsi:type');
    if (o.entityType.startsWith('archimate:'))
      o.entityType = o.entityType.substring(10);
    o.name = e.getAttribute('name');
    o.documentation = e.getAttribute('documentation');
    o.imagePath = e.getAttribute('imagePath');
    const imagePosition = e.getAttribute('imagePosition');
    if (imagePosition)
      o.imagePosition = parseInt(imagePosition)
    const opacity = e.getAttribute('opacity')
    if (opacity)
      o.opacity = Number(opacity);
    const outlineOpacity = e.getAttribute('outlineOpacity')
    if (outlineOpacity)
      o.outlineOpacity = Number(outlineOpacity);
    const alpha = e.getAttribute('alpha')
    if (alpha)
      o.alpha = Number(alpha);
    const textPosition = e.getAttribute('textPosition');
    if (textPosition)
      o.textPosition = parseInt(textPosition);
    const textAlignment = e.getAttribute('textAlignment');
    if (textAlignment)
      o.textAlignment = parseInt(textAlignment);
    o.borderColor = e.getAttribute('borderColor');

    o.entityId = e.getAttribute('archimateElement') ??
      e.getAttribute('model') ??
      archiId(e.getElementsByClassName('archimateElement')[0]);
    o.figureType = parseInt(e.getAttribute('type') ?? '0');

    const bounds = e.getElementsByTagName('bounds')[0];
    o.bounds = new ElementBounds(
      parseFloat(bounds.getAttribute('x') ?? '0'),
      parseFloat(bounds.getAttribute('y') ?? '0'),
      parseFloat(bounds.getAttribute('width') ?? '165'),
      parseFloat(bounds.getAttribute('height') ?? '58'));
    o.fillColor = e.getAttribute('fillColor');
    o.fontColor = e.getAttribute('fontColor');
    o.font = e.getAttribute('font');
    o.content = e.querySelector(':scope>content')?.textContent;

    o.children = Array.from(e.children)
      .filter(n => n.nodeName == 'children' || n.nodeName == 'child')
      .map(c => this.deserializeDiagramChild(c, o));
    this.deserializeDiagramObject(e, o);
    return o;

  }

  private static deserializeDiagramObject(e: Element, o: ArchiDiagramObject) {
    o.element = e;
    o.id = e.getAttribute('id');
    const elements = Array.from(e.children).filter(e => e.nodeName.startsWith('sourceConnection'));
    o.sourceConnections = elements.map(c => this.deserializeArchiSourceConnection(c, o));
  }
}

export class ArchimateProject {
  public element: Element;
  public name: string;
  public id: string;
  public version: string;

  private readonly entitiesById: Map<string, ArchiEntity>;
  private readonly relationshipsById: Map<string, Relationship>;

  constructor(public folders: ArchiFolder[], element: Element, private zip: JSZip) {
    this.element = element;
    this.name = element.getAttribute('name');
    this.version = element.getAttribute('version');
    this.id = element.getAttribute('id');
    const entities = ArchimateProject.getEntitiesFromFolders(folders);
    this.entitiesById = new Map<string, ArchiEntity>();
    entities.forEach(o => this.entitiesById.set(o.id, o));
    this.relationshipsById = new Map<string, Relationship>();
    entities.filter(o => o instanceof Relationship).forEach(o => this.relationshipsById.set(o.id, <Relationship>o));
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

  private static getEntitiesFromFolders(folders: ArchiFolder[]) {
    const objects: ArchiEntity[] = [];
    folders.forEach(f => this.getArchiEntities(f, objects));
    return objects;
  }

  private static getArchiEntities(folder: ArchiFolder, entities: ArchiEntity[]) {
    folder.folders.forEach(f => this.getArchiEntities(f, entities));
    folder.diagrams.forEach(e => entities.push(e));
  }


  public getTargetRelationShips = (id: string, relaType?: string) => this.relationships.filter(r => r.target === id && (!relaType || relaType == r.entityType));
  public getSourceRelationShips = (id: string, relaType?: string) => this.relationships.filter(r => r.source === id && (!relaType || relaType == r.entityType));
  public getRelatedElementForTarget = (id: string, relaType?: string, type?: string) => this.getTargetRelationShips(id, relaType).map(r => this.getById(r.source)).filter(r => !type || type == r.entityType);
  public getRelatedElementForSource = (id: string, relaType?: string, type?: string) => this.getSourceRelationShips(id, relaType).map(r => this.getById(r.target)).filter(r => !type || type == r.entityType);
  public getDiagramsWithElementId = (id: string) => this.diagrams.filter(e => e.descendants.some(de => de.id === id));

  getImage(imagePath: string): Promise<Uint8Array> {
    if (!this.zip)
      return null;
    return this.zip.file(imagePath).async('uint8array');
  }

  public getUnused(): ArchiEntity[] {
    const usedIds = this.diagrams.flatMap(d => d.descendantsWithSourceConnections)
      .map(o => (<ArchiDiagramChild>o).entityId ?? (<ArchiSourceConnection>o).relationShipId).filter(o => o)
      .concat(this.diagrams.map(d => d.id));
    const usedIdsSet = new Set(usedIds);
    const unusedEntities = asSequence(this.entitiesById.values()).filter(e => !usedIdsSet.has(e.id));
    return unusedEntities.toArray();
  }

  public removeEntity(entity: ArchiEntity) {
    this.entitiesById.delete(entity.id);
    if (entity instanceof Relationship)
      this.relationshipsById.delete(entity.id);
  }

  addEntity(entity: ArchiEntity) {
    this.entitiesById.set(entity.id, entity);
  }
}

export class ArchiFolder {
  name: string;
  id: string;
  type: string;
  diagrams: ArchiEntity[];
  folders: ArchiFolder[];
}

export class ArchiEntity {
  public element: Element;
  public entityType: string;
  public filePath: string;
  public name: string;
  public id: string;
  public documentation: string;
  public subType: string;
}

export class Relationship extends ArchiEntity {
  public source: string;
  public target: string;
}

export class ArchiDiagram extends ArchiEntity {
  public children: ReadonlyArray<ArchiDiagramChild>;
  private childById: Map<string, ArchiDiagramObject>;

  constructor(children: ReadonlyArray<ArchiDiagramChild>) {
    super();
    this.children = children;
    this.childById = new Map<string, ArchiDiagramObject>(this.descendantsWithSourceConnections.map(d => [d.id, d]));
  }

  public getDiagramObjectById(id: string): ArchiDiagramObject {
    return this.childById.get(id);
  }

  public get descendants(): ArchiDiagramChild[] {
    return this.Flatten(this.children);
  }
  public get descendantsWithSourceConnections(): ArchiDiagramObject[] {
    return this.flattenWithSourceConnections(this.children);
  }
  Flatten(e: ReadonlyArray<ArchiDiagramChild>): ArchiDiagramChild[] {
    return e.concat(e.flatMap(c => this.Flatten(c.children)));
  }

  flattenWithSourceConnections(e: ReadonlyArray<ArchiDiagramObject>): ArchiDiagramObject[] {
    return e.concat(e.flatMap(c => {
      let result = this.flattenWithSourceConnections(c.sourceConnections);
      if (c instanceof ArchiDiagramChild)
        result = result.concat(this.flattenWithSourceConnections(c.children));
      return result;
    }));
  }
  
  setElement(element: ArchiDiagramChild, parent: ArchiDiagramChild) {
    if (element.parent)
      element.parent.children = element.parent.children.filter(e => e.id != element.id); 
    else
      this.children = this.children.filter(e => e.id != element.id); 
    
    this.childById.set(element.id, element);
    if (parent)
      parent.children = [...parent.children, element];
    else
      this.children = [...this.children, element];
    element.parent = parent;
  }

  removeElement(element: ArchiDiagramChild) {
    this.childById.delete(element.id);

    if (element.parent)
      element.parent.children = element.parent.children.filter(e => e.id != element.id);
    else
      this.children = this.children.filter(e => e.id != element.id);
    element.parent = null;
  }
}

export class ArchiDiagramObject {
  public element: Element;
  public id: string;
  public sourceConnections: ReadonlyArray<ArchiSourceConnection>;
}

export class ArchiDiagramChild extends ArchiDiagramObject {
  parent: ArchiDiagramChild;
  children: ReadonlyArray<ArchiDiagramChild>;
  name: string;
  documentation: string;
  entityType: string;
  entityId: string;
  bounds: ElementBounds;
  fillColor: string;
  fontColor: string;
  font: string; // see eclipse/swt/graphics/FontData.java toString
  figureType: FigureType;
  content: string;
  imagePath: string;
  imagePosition?: ImagePosition;
  alpha?: number;
  textPosition?: TextPosition;
  textAlignment?: TextAlignment;
  borderColor?: string;
  outlineOpacity?: number;
  opacity?: number;

  public get AbsolutePosition(): ElementPos {
    const pos = this.parent?.AbsolutePosition ?? ElementPos.Zero;
    return pos.add(new ElementPos(this.bounds.x, this.bounds.y));
  }
}

export enum ImagePosition {
  TopLeft = 0,
  TopCentre = 1,
  TopRight = 2,
  MiddleLeft = 3,
  MiddleCentre = 4,
  MiddleRight = 5,
  BottomLeft = 6,
  BottomCentre = 7,
  BottomRight = 8,
  Fill = 9,
}

export enum TextPosition {
  Top = 0,
  Middle = 1,
  Bottom = 2,
}

export enum TextAlignment {
  Left = 0,
  Centre = 2,
  Right = 4,
}

export enum FigureType {
  Square = 0,
  Figure = 1,
}
export class ArchiSourceConnection extends ArchiDiagramObject {
  bendPoints: ElementPos[];
  targetId: string;
  relationShipId: string;
  lineWidth: string;
  lineColor: string;
  fillColor: string;
  name: string;
  source: ArchiDiagramObject;
  type?: SourceConnectionType;
}

export enum SourceConnectionType {
  LineSolid = 0,
  ArrowFillTarget = 1 << 0,
  LineDashed = 1 << 1,
  LineDotted = 1 << 2,
  ArrowFillSource = 1 << 3,
  ArrowHollowTarget = 1 << 4,
  ArrowHollowSource = 1 << 5,
  ArrowLineTarget = 1 << 6,
  ArrowLineSource = 1 << 7,
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

  public static IsInsideBounds(pos: { x: number, y: number }, center: { x: number, y: number }, bounds = { x: 0, y: 0 }, minBounds = 4): boolean {
    return pos.x >= center.x - Math.max(bounds.x, minBounds)
      && pos.x <= center.x + Math.max(bounds.x, minBounds)
      && pos.y >= center.y - Math.max(bounds.y, minBounds)
      && pos.y <= center.y + Math.max(bounds.y, minBounds);
  }
}

export class ElementBounds {
  constructor(public readonly x: number, public readonly y: number, public readonly width: number, public readonly height: number) { }

  public static Zero: ElementBounds = new ElementBounds(0, 0, 0, 0);
}
