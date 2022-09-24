import { Component, VNode, h, ComponentChild, render } from 'preact';
import Split from 'split-grid';
import { ArchiEntityTree } from './ArchiEntityTree';
import { DiagramEditor } from './diagram-editor';
import { DiagramRenderer } from './diagram-renderer';
import { DiagramTemplate } from './diagram-template';
import { ArchiDiagram, ArchimateProject, ArchimateProjectStorage } from './greeter';
import { Base64 } from './util/base64';

export type ArchiEditorProps = {
  dummy: string
}
export type ArchiEditorState = {
  project: ArchimateProject;
  diagram: ArchiDiagram;
}
export class ArchiEditor extends Component<ArchiEditorProps, ArchiEditorState> {

  private diagramEditor: DiagramEditor;
  private svgTarget: HTMLElement;
  private diagramTemplate = DiagramTemplate.getFromDrawing();

  async componentWillMount() {
    Split({
      columnGutters: [{
        track: 1,
        element: document.querySelector('.vertical-gutter'),
      }]
    })
    
    let projectData: ArrayBuffer;
    const lastProjectBase64 = window.localStorage.getItem('lastProject');
    if (lastProjectBase64)
      projectData = Base64.toArrayBuffer(lastProjectBase64);
    else
      projectData = await ArchimateProjectStorage.GetDefaultProjectData();

    const project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(projectData);

    const hash = window.location.hash.slice(1);
    const diagram = parseInt(hash) ? project.diagrams[parseInt(hash)] :
    project.diagrams.filter(d => d.name === hash)[0] ?? project.diagrams[0];

    this.activateLoadedProject(project, diagram);
  }


  private async changeView(viewId: string) {
    const diagram = this.state.project.diagrams.filter(d => d.Id === viewId)[0] ?? this.state.project.diagrams[0];
    this.displayDiagram(this.state.project, diagram);
  }

  private save() {
    const file = new Blob([new XMLSerializer().serializeToString(this.state.project.element.ownerDocument)], { type: "text/xml;charset=utf-8" });
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "test.xml";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  private async activateLoadedProject(project: ArchimateProject, diagram: ArchiDiagram) {
    this.setState({project: project, diagram: diagram});
    this.displayDiagram(project, diagram);
  }

  private async displayDiagram(project: ArchimateProject, diagram: ArchiDiagram) {
    this.diagramEditor?.dispose();

    const renderer = new DiagramRenderer(project, diagram, this.diagramTemplate)
    const svg = renderer.buildSvg();
    this.svgTarget = document.getElementById('svgTarget');
    this.svgTarget.innerHTML = '';

    const s = this.svgTarget.appendChild(svg.firstChild) as SVGSVGElement;
    this.diagramEditor = new DiagramEditor(s, project, diagram, renderer);
    this.diagramEditor.makeDraggable();
  }

  private async uploadFile() {
    const fileupload = document.createElement('input');
    fileupload.type = 'file';
    fileupload.name = 'fileUpload';
    fileupload.click();
    fileupload.onchange = () => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(fileupload.files[0]);
      reader.onload = async () => {
        const project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(reader.result as ArrayBuffer);
        this.activateLoadedProject(project, project.diagrams[0]);

        const isDev = import.meta.env.MODE === 'development';
        if (isDev)
          window.localStorage.setItem('lastProject', Base64.fromUint8Array(new Uint8Array(reader.result as ArrayBuffer)));
      };
      reader.onerror = function () {
        console.log(reader.error);
      };
    }
  }


  private getCleanedSvgForExport(): SVGSVGElement {
    const svg = this.svgTarget.childNodes[0] as SVGSVGElement;
    const svgC = svg.cloneNode(true) as SVGSVGElement;
    svgC.querySelector(':scope>rect').setAttribute('fill', '#fff');
    return svgC;
  }

  private async downloadSvg() {
    const svg = this.getCleanedSvgForExport();
    const svgBlob = new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.download = 'archi.svg';
    link.href = svgUrl;
    link.click();
  }

  private async downloadPng() {
    const svg = this.getCleanedSvgForExport();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const loader = new Image;
    loader.width = canvas.width = svg.width.baseVal.value;
    loader.height = canvas.height = svg.height.baseVal.value;
    loader.onload = function () {
      ctx.drawImage(loader, 0, 0, loader.width, loader.height);

      const link = document.createElement('a');
      link.download = 'archi.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    const svgAsXML = svg.outerHTML;
    loader.src = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);
  }


  render(): ComponentChild {
    return <div><p>
      <button onClick={() => this.uploadFile()}>Open Achi File</button>
      &nbsp;
      <button onClick={() => this.downloadSvg()}>Download SVG</button>
      <button onClick={() => this.downloadPng()}>Download PNG</button>
      {/* &nbsp;
      <button>&#8630;</button>
      <button>&#8631;</button> */}

    </p>
      <div class="grid">
        <div id="leftThing" class="split split-horizontal">
          <ul id="diagramTree">
            <ArchiEntityTree project={this.state.project} active={this.state.diagram?.Id} onDiagramSelected={(viewId) => this.changeView(viewId)} />
          </ul>
        </div>
        <div class="vertical-gutter"></div>
        <div id="svgTarget" class="split split-horizontal">
        </div>
      </div>
    </div>;
  }
}
