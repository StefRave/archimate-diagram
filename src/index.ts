import './index.scss';
import { ArchimateProjectStorage, ArchimateProject, ArchiDiagram } from './greeter';
import { DiagramRenderer } from './diagram-renderer';
import { makeDraggable} from './diagram-editor';

module.exports = {
    ArchimateProjectStorage, DiagramRenderer,
    makeDraggable, onDocumentLoad, uploadFile, onSelectView: changeView
};

const svgTarget = document.getElementById('svgTarget');
let project: ArchimateProject = null;

async function onDocumentLoad() {

    project = await ArchimateProjectStorage.GetDefaultProject();
    const hash = window.location.hash.slice(1);
    const diagram = parseInt(hash) ? project.Diagrams[parseInt(hash)] :
        project.Diagrams.filter(d => d.Name === hash)[0] ?? project.Diagrams[0];

    activateLoadedProject(diagram);
}

async function changeView(viewId: string) {
    const diagram = project.Diagrams.filter(d => d.Id === viewId)[0] ?? project.Diagrams[0];
    displayDiagram(diagram);
}

async function activateLoadedProject(diagram: ArchiDiagram) {
    const projectView = <HTMLSelectElement>document.getElementById('projectView');
    projectView.innerHTML = '';
    project.Diagrams.forEach(d => {
        const newOption = document.createElement('option');
        newOption.text = d.Name;
        newOption.value = d.Id;
        newOption.selected = d === diagram;
        projectView.add(newOption);
    });
    displayDiagram(diagram);
}
async function displayDiagram(diagram: ArchiDiagram) {
    const svg = await DiagramRenderer.BuildDiagram(project, diagram);
    const s = DiagramRenderer.SetDiagram(svgTarget, svg);
    makeDraggable(s);
}
async function uploadFile() {
    const fileupload = <HTMLInputElement>document.getElementById('fileUpload');
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileupload.files[0]);
    reader.onload = async function () {
        project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(<ArrayBuffer>reader.result);
        activateLoadedProject(project.Diagrams[0]);
    };
    reader.onerror = function () {
        console.log(reader.error);
    };
}

onDocumentLoad();