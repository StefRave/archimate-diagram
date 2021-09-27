import { DiagramEditor } from './diagram-editor';
import { DiagramRenderer, DiagramTemplate } from './diagram-renderer';
import { ArchiDiagram, ArchimateProject, ArchimateProjectStorage } from './greeter';
import './index.scss';
import Split from 'split-grid'
import { render, Component, VNode, h, ComponentChild } from 'preact';
import { html } from 'htm/preact';

const my: any = (window as any).my = {
  uploadFile: uploadFile,
  onSelectView: changeView,
  save: save,
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
  const project: ArchimateProject = (window as any).my.project;
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

type ArchiEntityTreeProps = {
  views: Element;
}
class ArchiEntityTree extends Component<ArchiEntityTreeProps> {
  constructor(props: ArchiEntityTreeProps) {
    super(props);
  }

  toggle(obj:any):void {
    obj.target.parentElement.querySelector(".nested").classList.toggle("active");
    obj.target.classList.toggle('caret-down');
  }

  render():ComponentChild {
    return this.renderChildren(Array.from(this.props.views.children));
  }

  renderFolder(folder: Element): VNode {
    return html`<li><span onClick=${(o:any) => this.toggle(o)} class="caret"> ${folder.getAttribute('name')}</span><ul class="nested">${
      this.renderChildren(Array.from(folder.children))
    }</ul></li>`;
  }

  renderChildren(children: Element[]) {
    return children.map(el => el.nodeName == 'folder' ? this.renderFolder(el) : this.renderDiagramElement(el));
  }
  renderDiagramElement(element: Element): VNode {
    return html`<li>${element.getAttribute('name')}</li>`;
  }

}

async function activateLoadedProject(project: ArchimateProject, diagram: ArchiDiagram) {
  (window as any).my.project = project;

  const projectView = <HTMLSelectElement>document.getElementById('projectView');
  projectView.innerHTML = '';
  project.diagrams.forEach(d => {
    const newOption = document.createElement('option');
    newOption.text = d.name;
    newOption.value = d.Id;
    newOption.selected = d === diagram;
    projectView.add(newOption);
  });

  const leftThing = <HTMLDivElement>document.getElementById('diagramTree');
  const views = project.element.querySelector('folder[name="Views"]');

  const App = h(ArchiEntityTree, {views: views});
  render(App, leftThing);

  displayDiagram(project, diagram);
}

async function displayDiagram(project: ArchimateProject, diagram: ArchiDiagram) {
  const renderer = new DiagramRenderer(project, diagram, diagramTemplate)
  const svg = renderer.buildSvg();
  svgTarget.innerHTML = '';

  const s = svgTarget.appendChild(svg.firstChild) as SVGSVGElement;
  const diagramEditor = new DiagramEditor(s, project, diagram, diagramTemplate);
  diagramEditor.makeDraggable();
}

async function uploadFile() {
  const fileupload = <HTMLInputElement>document.getElementById('fileUpload');
  const reader = new FileReader();
  reader.readAsArrayBuffer(fileupload.files[0]);
  reader.onload = async function () {
    const project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(<ArrayBuffer>reader.result);
    activateLoadedProject(project, project.diagrams[0]);
  };
  reader.onerror = function () {
   console.log(reader.error);
  };
}

onDocumentLoad();
