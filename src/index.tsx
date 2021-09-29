import { DiagramEditor } from './diagram-editor';
import { DiagramRenderer, DiagramTemplate } from './diagram-renderer';
import { ArchiDiagram, ArchimateProject, ArchimateProjectStorage } from './greeter';
import './index.scss';
import Split from 'split-grid'
import { render, Component, VNode, h, ComponentChild } from 'preact';

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

type ArchiEntityTreeProps = {
  views: Element;
  active: string;
}
class ArchiEntityTree extends Component<ArchiEntityTreeProps> {
  constructor(props: ArchiEntityTreeProps) {
    super(props);
  }

  toggleFolder(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    target.parentElement.querySelector(".nested").classList.toggle("active");
    target.classList.toggle('caret-down');
  }

  render():ComponentChild {
    return this.renderChildren(Array.from(this.props.views.children));
  }

  renderFolder(folder: Element): VNode {
    return <li><span onClick={this.toggleFolder} class="caret">{folder.getAttribute('name')}</span>
      <ul class="nested">{this.renderChildren(Array.from(folder.children))}</ul>
      </li>;
  }

  renderChildren(children: Element[]) {
    return children.map(el => el.nodeName == 'folder' ? this.renderFolder(el) : this.renderDiagramElement(el));
  }

  private makeActive(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    const diagramId = target.getAttribute('data-id');
    if (!diagramId)
      return;
    this.base.parentElement.querySelector('li.active')?.classList?.remove('active');
    target.classList.toggle('active');
    this.props.active = diagramId;
    (window as any).my.onSelectView(diagramId);
  }

  renderDiagramElement(element: Element): VNode {
    const diagramId:string = element.getAttribute('id');
    const classActive = (diagramId == this.props.active) ? 'active' : '';
    return <li data-id={diagramId} class={classActive} onClick={(e) => this.makeActive(e)}>{element.getAttribute('name')}</li>;
  }
}

async function activateLoadedProject(project: ArchimateProject, diagram: ArchiDiagram) {
  my.project = project;

  const leftThing = document.getElementById('diagramTree') as HTMLDivElement;
  const views = project.element.querySelector('folder[name="Views"]');
  render(<ArchiEntityTree views={views} active={diagram.Id}/>, leftThing, leftThing);

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
  const fileupload = document.getElementById('fileUpload') as HTMLInputElement;
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

onDocumentLoad();
