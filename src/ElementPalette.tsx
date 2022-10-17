import { Component, VNode, h, ComponentChild } from 'preact';
import { ArchimateElementInfo, DiagramTemplate, IArchimateElementInfo } from './diagram-template';
import { ElementBounds } from './greeter';
import styles from './component.module.css'

// eslint-disable-next-line @typescript-eslint/ban-types
export type ElementPaletteProps = {
  onDragging?: (elementType: string) => void; 
}
export type ElementPaletteState = {
  previewX: number;
  previewY: number;
  elementType: string;
}
export class ElementPalette extends Component<ElementPaletteProps, ElementPaletteState> {
  constructor(public props: ElementPaletteProps, public state: ElementPaletteState) {
    super(props, state);
    this.state.previewX = 10;
    this.state.previewY = 250;
  }

  private template = DiagramTemplate.getFromDrawing();

  renderIcon(element: IArchimateElementInfo) {
    const icon = this.template.getIcon(element.elementName.replaceAll(' ', ''));
    icon.classList.add(element.group);
    icon.classList.add(element.type);
    icon.classList.add('element');
    icon.id = '';
    return <svg data-element-name={element.elementName} width="20" height="20" viewBox="-10 -10 20 20" ref={(dom) => { dom?.replaceChildren(); dom?.appendChild(icon);} } xmlns="http://www.w3.org/2000/svg">
    </svg>
  }
  render(): ComponentChild {
    const elementInfo = ArchimateElementInfo.getElementInfo();

    return <div class={styles.palette}>
      {elementInfo.map(element => 
        <span onMouseEnter={(e) => this.onMouseEnter(e)}>{this.renderIcon(element)}
        </span>)}
        <div>
            <ElementPreview onDragging={() => this.onDragging()} 
              elementType={this.state.elementType} x={this.state.previewX} y={this.state.previewY} />
        </div>

    </div>;
  }
  onDragging(): void {
    this.setState({ elementType: null }); // close preview

    if (this.props.onDragging)
      this.props.onDragging(this.state.elementType);
  }

  onMouseEnter(e: h.JSX.TargetedMouseEvent<HTMLSpanElement>): void {
    if (e.buttons == 1)
      return;
    const d = (e.target as Element).closest('.' + styles.palette);
    const docBBox = document.body.getBoundingClientRect();
    const dRect = d.getBoundingClientRect();
    const span = (e.target as Element).closest('span');
    const svg = span.querySelector('svg');
    const elementName = svg.getAttribute('data-element-name');
    this.setState({
      previewX: dRect.x + dRect.width - docBBox.x,
      previewY: e.clientY - docBBox.y,
      elementType: elementName,
    });
  }
}

export type ElementPreviewProps = {
  elementType: string;
  x: number;
  y: number;
  onDragging?: (elementType: string) => void; 
};


export class ElementPreview extends Component<ElementPreviewProps> {
  private template = DiagramTemplate.getFromDrawing();
  constructor(public props: ElementPreviewProps) {
    super(props);
  }

  render(): ComponentChild {
    if (!this.props.elementType)
      return <div></div>;
    const e = this.template.getElementByType(
        {entityType: this.props.elementType.replaceAll(' ', ''), subType: ''},
        {bounds: new ElementBounds(1,1,120,50), figureType: 0});
    const div = e.querySelector(':scope>foreignObject>div>div');
    div.textContent = this.props.elementType;
    
    return <div onMouseMove={(evt) => this.onMouseMove(evt)} class={'content ' + styles.palettePreview} style={`position: absolute;  
      top: ${this.props.y - 26}px; left: ${this.props.x}px;
      width: 122px; height: 52px; background-color: #ff00;`}>
      <svg width="122" height="52" ref={(dom) => setElement(dom)}>
      </svg>
    </div>;

    function setElement(dom: SVGSVGElement): void {
      dom?.replaceChildren();
      dom?.appendChild(e);
    }
  }
  onMouseMove(evt: h.JSX.TargetedMouseEvent<HTMLDivElement>): void {
    if (evt.buttons != 1)
      return;
    const div = evt.currentTarget;
    const docBBox = document.body.getBoundingClientRect();
    div.style.top = `${evt.clientY - docBBox.y -26}px`;
    
    if (evt.clientX - docBBox.x > this.props.x)
      if (this.props.onDragging)
        this.props.onDragging(this.props.elementType);
  }
}
