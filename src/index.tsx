import { DiagramEditor } from './diagram-editor';
import { DiagramTemplate } from './diagram-template';
import { DiagramRenderer } from './diagram-renderer';
import { ArchiDiagram, ArchimateProject, ArchimateProjectStorage } from './greeter';
import './index.scss';
import Split from 'split-grid'
import { render, h } from 'preact';
import { ArchiEntityTree } from './ArchiEntityTree';

const my: any = (window as any).my = {
  uploadFile: uploadFile,
  save: save,
  downloadSvg: downloadSvg,
  downloadPng: downloadPng,
};

Split({
	columnGutters: [{
    track: 1,
    element: document.querySelector('.vertical-gutter'),
  }]
})

const svgTarget = document.getElementById('svgTarget');
const diagramTemplate = DiagramTemplate.getFromDrawing();

async function onDocumentLoad() {
  const project = await ArchimateProjectStorage.GetDefaultProject();
  const hash = window.location.hash.slice(1);
  const diagram = parseInt(hash) ? project.diagrams[parseInt(hash)] :
    project.diagrams.filter(d => d.name === hash)[0] ?? project.diagrams[0];

  activateLoadedProject(project, diagram);
}

export async function changeView(viewId: string) {
  const project: ArchimateProject = my.project;
  const diagram = project.diagrams.filter(d => d.Id === viewId)[0] ?? project.diagrams[0];
  displayDiagram(project, diagram);
}

function save() {
  const project = my.project as ArchimateProject;
  const file = new Blob([new XMLSerializer().serializeToString(project.element.ownerDocument)], {type: "text/xml;charset=utf-8"});
  const a = document.createElement("a"),
  url = URL.createObjectURL(file);
  a.href = url;
  a.download = "test.xml";
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);  
  }, 0); 
}

async function activateLoadedProject(project: ArchimateProject, diagram: ArchiDiagram) {
  my.project = project;

  const leftThing = document.getElementById('diagramTree') as HTMLDivElement;
  const views = project.element.querySelector('folder[name="Views"]');
  render(<ArchiEntityTree views={views} active={diagram.Id} onDiagramSelected={changeView} />, leftThing, leftThing);

  displayDiagram(project, diagram);
}

async function displayDiagram(project: ArchimateProject, diagram: ArchiDiagram) {
  const renderer = new DiagramRenderer(project, diagram, diagramTemplate)
  const svg = renderer.buildSvg();
  svgTarget.innerHTML = '';

  const s = svgTarget.appendChild(svg.firstChild) as SVGSVGElement;
  const diagramEditor = new DiagramEditor(s, project, diagram, renderer);
  diagramEditor.makeDraggable();
}


async function uploadFile() {
  const fileupload = document.createElement('input');
  fileupload.type = 'file';
  fileupload.name = 'fileUpload';
  fileupload.click();
  fileupload.onchange = function() { 
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileupload.files[0]);
    reader.onload = async function () {
      const project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(reader.result as ArrayBuffer);
      activateLoadedProject(project, project.diagrams[0]);
    };
    reader.onerror = function () {
    console.log(reader.error);
    };
  }
}


function getCleanedSvgForExport(): SVGSVGElement {
  const svg = svgTarget.childNodes[0] as SVGSVGElement;
  const svgC = svg.cloneNode(true) as SVGSVGElement;
  svgC.querySelector(':scope>rect').setAttribute('fill', '#fff');
  return svgC;
}

async function downloadSvg() {
  const svg = getCleanedSvgForExport();
  const svgBlob = new Blob([svg.outerHTML], {type:"image/svg+xml;charset=utf-8"});
  const svgUrl = URL.createObjectURL(svgBlob);

  const link = document.createElement('a');
  link.download = 'archi.svg';
  link.href = svgUrl;
  link.click();
}

async function downloadPng() {
  const svg = getCleanedSvgForExport();

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const loader = new Image;                        
  loader.width = canvas.width = svg.width.baseVal.value;
  loader.height = canvas.height = svg.height.baseVal.value;
  loader.onload = function(){
    ctx.drawImage( loader, 0, 0, loader.width, loader.height );

    const link = document.createElement('a');
    link.download = 'archi.png';
    link.href = canvas.toDataURL();
    link.click();
  };
  const svgAsXML = svg.outerHTML;
  loader.src = 'data:image/svg+xml,' + encodeURIComponent( svgAsXML );
}

onDocumentLoad();
