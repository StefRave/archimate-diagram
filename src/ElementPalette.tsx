import { Component, VNode, h, ComponentChild, createRef, RefObject } from 'preact';
import { ArchimateElementInfo, DiagramTemplate, IArchimateElementInfo } from './diagram-template';
import { ElementBounds } from './greeter';
import styles from './component.module.css'

// eslint-disable-next-line @typescript-eslint/ban-types
export type ElementPaletteProps = {
  onDragging?: (elementType: string, evt: {clientX: number, clientY: number}) => void; 
}
export type ElementPaletteState = {
  previewX: number;
  previewY: number;
  elementType: string;
}
export class ElementPalette extends Component<ElementPaletteProps, ElementPaletteState> {
  private pointerMoveFunction = (evt: PointerEvent) => this.onPointerMove(evt);
  ref: RefObject<HTMLDivElement>;
  active: boolean;

  constructor(public props: ElementPaletteProps, public state: ElementPaletteState) {
    super(props, state);
    this.state.previewX = 10;
    this.state.previewY = 250;
    this.ref = createRef();
  }

  private template = DiagramTemplate.getFromDrawing();

  componentDidMount(): void {
    document.addEventListener("pointermove", this.pointerMoveFunction);
  }
	
  componentWillUnmount(): void {
    document.removeEventListener("pointermove", this.pointerMoveFunction);
  }

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

    return <div class={styles.palette} ref={this.ref} onPointerDown={(evt) => this.onPointerDown(evt)} onPointerUp={(evt) => this.onPointerUp(evt)} >
      {elementInfo.map(element => 
        <span onMouseEnter={(e) => this.onMouseEnter(e)}>{this.renderIcon(element)}
        </span>)}
        <div>
            <ElementPreview elementType={this.state.elementType} x={this.state.previewX} y={this.state.previewY} />
        </div>
    </div>;
  }

  onPointerDown(evt: h.JSX.TargetedPointerEvent<HTMLDivElement>): void {
    if (evt.buttons == 1) {
      this.placeElement(evt);
      this.active = true;
    }
  }

  onPointerUp(evt: h.JSX.TargetedPointerEvent<HTMLDivElement>): void {
    this.setState({ elementType: null }); // close preview
    this.active = false;
  }

  onPointerMove(evt: MouseEvent): void {
    if (evt.buttons != 1 || !this.active)
      return;

    evt.preventDefault();
    evt.stopImmediatePropagation();
    this.placeElement(evt);
  }
  
  private placeElement(evt: {clientX: number, clientY: number}) {
    const div = this.ref.current.querySelector('div.' + styles.palettePreview) as HTMLDivElement;
    const docBBox = document.body.getBoundingClientRect();
    div.style.top = `${evt.clientY - docBBox.y - 52 / 2}px`;
    div.style.left = `${evt.clientX - docBBox.y - 122 / 2}px`;
    window.getSelection()?.removeAllRanges();

    if (evt.clientX - docBBox.x > this.state.previewX) {
      if (this.props.onDragging) {
        this.setState({ elementType: null }); // close preview
        this.active = false;
        
        if (this.props.onDragging)
          this.props.onDragging(this.state.elementType, evt);
      }
    }
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
    
    return <div class={'content ' + styles.palettePreview} style={`position: absolute;  
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
}
