import { Component, VNode, h, ComponentChild } from 'preact';
import { ArchiEntity, ArchiFolder, ArchimateProject } from './greeter';

export type ArchiEntityTreeProps = {
    project: ArchimateProject;
    active: string; // diagram id of the active diagram
    onDiagramSelected: (diagramId: string) => void; 
  }

export class ArchiEntityTree extends Component<ArchiEntityTreeProps> {
  constructor(props: ArchiEntityTreeProps) {
    super(props);
  }

  toggleFolder(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    target.parentElement.querySelector(".nested").classList.toggle("active");
    target.classList.toggle('caret-down');
  }

  render(): ComponentChild {
    const folder = this.props.project?.folders.find(f => f.type == 'diagrams');
    return this.renderChildren(folder);
  }

  renderChildren(folder: ArchiFolder) {
    if (folder == null || folder.diagrams.length + folder.folders.length == 0)
      return null;

    const folders = [...folder.folders];
    folders.sort((a, b) => a.name.localeCompare(b.name));
    const diagrams = [...folder.diagrams];
    diagrams.sort((a, b) => a.name.localeCompare(b.name));

    const a = folders.map(f => this.renderFolder(f));
    const b = diagrams.map(d => this.renderDiagramElement(d));
    return a.concat(b);
  }
  
  renderFolder(folder: ArchiFolder): VNode {
    return <li><span onClick={this.toggleFolder} class="caret caret-down">{folder.name}</span>
      <ul class="nested active">{this.renderChildren(folder)}</ul>
    </li>;
  }
 
  renderDiagramElement(element: ArchiEntity): VNode {
    const diagramId: string = element.id;
    const classActive = (diagramId == this.props.active) ? 'active' : '';
    return <li data-id={diagramId} class={classActive} onClick={(e) => this.onDiagramClick(e)}>{element.name}</li>;
  }

  private onDiagramClick(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    const diagramId = target.getAttribute('data-id');
    if (!diagramId)
      return;
    this.base.parentElement.querySelector('li.active')?.classList?.remove('active');
    target.classList.toggle('active');
    this.props.active = diagramId;
    this.props.onDiagramSelected(diagramId);
  }
}
