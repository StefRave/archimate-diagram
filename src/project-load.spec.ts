import { readFileSync } from 'fs';
import { join } from 'path';
import JSZip from 'jszip';
import { ArchiDiagramChild, ArchimateProjectStorage, Relationship } from './archimate-model';

function readRepoFile(name: string): ArrayBuffer {
  const buffer = readFileSync(join(__dirname, name));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

const diagramOrder: ReadonlyArray<readonly [string, string]> = [
  ['Archimate View', '3641'],
  ['Layered View', '4056'],
  ['Application Structure View', '3944'],
  ['Technical Infrastructure View', '3893'],
  ['Service Realisation View', '4025'],
  ['Business Process View', '3761'],
  ['Organisation Structure View', '3698'],
  ['Business Function View', '3722'],
  ['Information Structure View', '3821'],
  ['Application Behaviour View', '3865'],
  ['Organisation Tree View', '3965'],
  ['Business Product View', '3999'],
  ['Actor Cooperation view', '4165'],
  ['Business Cooperation View', '4224'],
  ['Application Cooperation View', '4279'],
  ['Implementation and Installation View', '4318'],
  ['Goal and Principle View', '16fe3cf9'],
];

describe('Archisurance load', () => {
  let project: Awaited<ReturnType<typeof ArchimateProjectStorage.GetProjectFromArrayBuffer>>;

  beforeAll(async () => {
    project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(readRepoFile('Archisurance.archimate'));
  });

  it('reads the model name, version, and id', () => {
    expect(project.name).toBe('Archisurance');
    expect(project.version).toBe('4.0.0');
    expect(project.id).toBe('11f5304f');
  });

  it('lists the 17 views in document order', () => {
    expect(project.diagrams.map(d => [d.name, d.id])).toEqual(diagramOrder);
    expect(project.diagrams[0].name).toBe('Archimate View');
    expect(project.diagrams[0].id).toBe('3641');
  });

  it('loads AccessRelationship 693 from Register to Customer File', () => {
    const relationship = project.getById('693') as Relationship;
    expect(relationship.entityType).toBe('AccessRelationship');
    expect(relationship.name).toBe('create/ update');
    expect(relationship.source).toBe('564');
    expect(relationship.target).toBe('674');
    expect(project.getById('564').name).toBe('Register');
    expect(project.getById('674').name).toBe('Customer File');
  });

  it('loads Business Process View nesting and default bounds', () => {
    const diagram = project.diagrams.find(d => d.id === '3761');
    const customer = diagram.getDiagramObjectById('3788') as ArchiDiagramChild;
    expect(customer.entityId).toBe('521');
    expect(project.getById('521').name).toBe('Customer');
    expect([customer.bounds.x, customer.bounds.y, customer.bounds.width, customer.bounds.height])
      .toEqual([200, 663, 120, 60]);

    const register = diagram.getDiagramObjectById('3779') as ArchiDiagramChild;
    const handleClaim = diagram.getDiagramObjectById('3776') as ArchiDiagramChild;
    expect(register.entityId).toBe('564');
    expect(register.parent).toBe(handleClaim);
    expect(handleClaim.entityId).toBe('556');
    expect(project.getById('556').name).toBe('Handle Claim');

    const customerFile = diagram.getDiagramObjectById('3786') as ArchiDiagramChild;
    expect([customerFile.bounds.x, customerFile.bounds.y, customerFile.bounds.width, customerFile.bounds.height])
      .toEqual([190, 310, 165, 58]);
  });

  it('loads source connection 3812 with one bend point', () => {
    const diagram = project.diagrams.find(d => d.id === '3761');
    const customer = diagram.getDiagramObjectById('3788') as ArchiDiagramChild;
    const connection = customer.sourceConnections.find(c => c.id === '3812');
    expect(connection.targetId).toBe('3783');
    expect(connection.relationShipId).toBe('770');
    expect(connection.bendPoints.map(p => [p.x, p.y])).toEqual([[-180, -1]]);
  });
});

describe('zip model.xml', () => {
  it('returns the diagram stored in the archive', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<archimate:model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:archimate="http://www.archimatetool.com/archimate" name="Zip Sample" id="zip-model" version="1.0.0">
  <folder name="Views" id="views" type="diagrams">
    <element xsi:type="archimate:ArchimateDiagramModel" id="diag-1" name="Only Diagram">
      <child xsi:type="archimate:DiagramObject" id="child-1" archimateElement="ent-1">
        <bounds x="10" y="20" width="30" height="40"/>
      </child>
    </element>
  </folder>
</archimate:model>`;
    const zip = new JSZip();
    zip.file('model.xml', xml);
    const bytes = await zip.generateAsync({ type: 'arraybuffer' });

    const project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(bytes);
    expect(project.diagrams).toHaveLength(1);
    expect(project.diagrams[0].id).toBe('diag-1');
    expect(project.diagrams[0].name).toBe('Only Diagram');
    expect(project.diagrams[0].children.map(c => c.id)).toEqual(['child-1']);
  });
});
