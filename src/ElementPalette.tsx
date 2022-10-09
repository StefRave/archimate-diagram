import { Component, VNode, h, ComponentChild, hydrate } from 'preact';
import { ArchimateElementInfo, DiagramTemplate, IArchimateElementInfo } from './diagram-template';
import { ElementBounds } from './greeter';
import styles from './component.module.css'

// eslint-disable-next-line @typescript-eslint/ban-types
export type ElementPaletteProps = {
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
            <ElementPreview elementInfo={this.state.elementType} x={this.state.previewX} y={this.state.previewY} />
        </div>

    </div>;
  }
  onMouseEnter(e: h.JSX.TargetedMouseEvent<HTMLSpanElement>): void {
    const d = (e.target as Element).closest('.' + styles.palette);
    const dRect = d.getBoundingClientRect();
    const span = (e.target as Element).closest('span');
    const svg = span.querySelector('svg');
    const elementName = svg.getAttribute('data-element-name');
    this.setState({
      previewX: dRect.x + dRect.width,
      previewY: dRect.y,
      elementType: elementName,
    });
  }
}

export type ElementPreviewProps = {
  elementInfo: string;
  x: number;
  y: number;
};


export class ElementPreview extends Component<ElementPreviewProps> {
  private template = DiagramTemplate.getFromDrawing();
  constructor(public props: ElementPreviewProps) {
    super(props);
  }

  render(): ComponentChild {
    if (!this.props.elementInfo)
      return <div></div>;
    const e = this.template.getElementByType(
        {entityType: this.props.elementInfo.replaceAll(' ', ''), subType: ''},
        {bounds: new ElementBounds(1,1,120,50), figureType: 0});
    const div = e.querySelector(':scope>foreignObject>div>div');
    div.textContent = this.props.elementInfo;
    
    return <div class={'content ' + styles.palettePreview} style={`position: absolute;  
      top: ${this.props.y}px; left: ${this.props.x}px;
      width: 122px; height: 52px; background-color: white;`}>
      <svg width="122" height="52" ref={(dom) => setElement(dom)}>
      </svg>
    </div>;

    function setElement(dom: SVGSVGElement): void {
      dom?.replaceChildren();
      dom?.appendChild(e);
    }
  }
}
