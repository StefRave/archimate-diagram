import { readFileSync } from 'fs';
import { join } from 'path';
import { ArchimateProject, ArchimateProjectStorage } from './archimate-model';
import { DiagramRenderer } from './diagram-renderer';
import { DiagramTemplate } from './diagram-template';

function readRepoFile(name: string): ArrayBuffer {
  const buffer = readFileSync(join(__dirname, name));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function renderedSvg(project: ArchimateProject, diagramId: string): Element {
  const diagram = project.diagrams.find(d => d.id === diagramId);
  const doc = new DiagramRenderer(project, diagram, DiagramTemplate.getFromDrawing()).buildSvg() as unknown as Document;
  const svg = doc.firstChild as Element;
  expect(svg).toBe(doc.documentElement);
  return svg;
}

function pathWithToken(group: Element, token: string): Element {
  return Array.from(group.querySelectorAll('path')).find(path =>
    (path.getAttribute('class') ?? '').split(/\s+/).includes(token));
}

describe('diagram render', () => {
  let project: ArchimateProject;

  beforeAll(async () => {
    project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(readRepoFile('Archisurance.archimate'));
  });

  it('draws Archimate View reference 3657 and the padded viewBox', () => {
    const svg = renderedSvg(project, '3641');
    const reference = svg.ownerDocument.getElementById('3657');
    expect(reference.getAttribute('transform')).toBe('translate(555, 304)');
    expect(reference.textContent).toContain('Application Structure View');
    expect(svg.getAttribute('viewBox')).toBe('2 2 889 532');
    expect(svg.getAttribute('width')).toBe('889');
    expect(svg.getAttribute('height')).toBe('532');
  });

  it('draws Business Process View nesting and connection classes', () => {
    const svg = renderedSvg(project, '3761');
    const doc = svg.ownerDocument;
    const customer = doc.getElementById('3788');
    const handleClaim = doc.getElementById('3776');
    const register = doc.getElementById('3779');
    const customerFile = doc.getElementById('3786');

    expect(customer.getAttribute('transform')).toBe('translate(200, 663)');
    expect(customer.textContent).toContain('Customer');
    expect(register.parentElement).toBe(handleClaim);
    expect(register.getAttribute('transform')).toBe('translate(20, 20)');
    expect(register.textContent).toContain('Register');
    expect(customerFile.getAttribute('transform')).toBe('translate(190, 310)');

    const assignment = pathWithToken(doc.getElementById('3812'), 'Assignment');
    expect(assignment.getAttribute('class')).toBe('Assignment Relationship');
    expect(assignment.getAttribute('d')).not.toBe('');

    const access = pathWithToken(doc.getElementById('3800'), 'Access');
    expect(access.getAttribute('class')).toBe('Access Relationship');
  });
});
