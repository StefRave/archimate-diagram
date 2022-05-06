import { Component, VNode, h, ComponentChild } from 'preact';

export type ArchiEntityTreeProps = {
    views: Element; // archi folder structure
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
    return this.renderChildren(Array.from(this.props.views.children));
  }

  renderChildren(children: Element[]) {
    return children.map(el => el.nodeName == 'folder' ? this.renderFolder(el) : this.renderDiagramElement(el));
  }
  
  renderFolder(folder: Element): VNode {
    return <li><span onClick={this.toggleFolder} class="caret">{folder.getAttribute('name')}</span>
      <ul class="nested">{this.renderChildren(Array.from(folder.children))}</ul>
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
