import { Component, VNode, h, ComponentChild } from 'preact';
import { ArchimateProject } from './greeter';

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
    const views = this.props.project?.element?.querySelector('folder[name="Views"]');
    return this.renderChildren(Array.from(views?.children ?? []));
  }

  renderChildren(children: Element[]) {
    children.sort(ArchiEntityTree.compareElements)
    return children.map(el => el.nodeName == 'folder' ? this.renderFolder(el) : this.renderDiagramElement(el));
  }
  
  private static compareElements(a: Element, b: Element): number {
    const typeOrder = b.localName.localeCompare(a.localName);
    if (typeOrder != 0)
      return typeOrder;
    return a.getAttribute('name').localeCompare(b.getAttribute('name'));
  }

  renderFolder(folder: Element): VNode {
    return <li><span onClick={this.toggleFolder} class="caret caret-down">{folder.getAttribute('name')}</span>
      <ul class="nested active">{this.renderChildren(Array.from(folder.children))}</ul>
    </li>;
  }

  renderDiagramElement(element: Element): VNode {
    const diagramId: string = element.getAttribute('id');
    const classActive = (diagramId == this.props.active) ? 'active' : '';
    return <li data-id={diagramId} class={classActive} onClick={(e) => this.onDiagramClick(e)}>{element.getAttribute('name')}</li>;
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
