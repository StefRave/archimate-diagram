import { ArchiDiagramChild, ArchiEntity } from './greeter';
import svgSource from './archimate.svg?raw';


export class DiagramTemplate {
  private readonly elementByType: Map<string, Element>;
  private readonly elementSelection: SVGGElement;
  private readonly templateEditInfo: SVGGElement;

  constructor(private readonly templateDoc: SVGSVGElement) {
    const content = templateDoc.getElementById('content');
    this.elementSelection = content.querySelector('g#ElementSelected>g.selection');
    this.templateEditInfo = templateDoc.getElementById('editInfo') as SVGGElement;

    const archiElements = Array.from(content.querySelectorAll('g.element'));
    this.elementByType = new Map<string, Element>(archiElements.map(e => [e.id, e]));

    content.replaceChildren();
    templateDoc.getElementById('imageDefs').replaceChildren();
    templateDoc.getElementById("icons").remove();
  }

  public static getFromDrawing(): DiagramTemplate {
    const parser = new DOMParser();
    const templateDoc = parser.parseFromString(svgSource, 'application/xml') as unknown as SVGSVGElement;
    return new DiagramTemplate(templateDoc);
  }

  public getEmptySvg(): SVGSVGElement {
    return this.templateDoc.cloneNode(true) as SVGSVGElement;
  }

  public getElementByType(archiElement: ArchiEntity, child: ArchiDiagramChild): SVGElement {
    const typeName = archiElement.entityType.split(':').pop();

    let es = this.createCloneOfType(typeName);

    const { width, height } = child.bounds;
    es = es.replace(/\d{2,}/g, (sub => { 
      switch(sub)
      {
        case '168': return `${width}`; 
        case '156': return `${width - 12}`; 
        case '152': return `${width - 16}`; 
        case '160': return `${width - 8}`; 
        case '166': return `${width - 2}`; 
        case '84': return `${width / 2}`; 
        case '60': return `${height}`; 
        case '52': return `${height - 8}`; 
        case '44': return `${height - 16}`; 
        case '30': return `${height / 2}`; 

        default: return sub;
      }}));
    if (typeName === 'Junction') {
      if (archiElement.element.getAttribute('type') === 'or')
        es = es.replace('class=\'', 'class=\'or ');

      const ws = +(width / 2).toFixed(2);
      es = es.replace('cx="5" cy="5" rx="5" ry="5"', `cx='${ws}' cy='${ws}' rx='${ws}' ry='${ws}'`);
    }
    const parser = new DOMParser();
    const e = <Element>parser.parseFromString(es, 'text/xml').firstChild as SVGElement;
    const s = e.querySelector(':scope>path.symbol');
    if (s) {
        if (child.figureType == 1 || archiElement.entityType === 'Meaning') {
          e.removeChild(e.children[0]);
          e.removeChild(e.children[0]);
          const dNode = s.getAttributeNode('d');
          const dataSizeHintNode = s.getAttributeNode('data-size-hint');
          if (dataSizeHintNode) {
            s.removeAttributeNode(dataSizeHintNode);
            const dataSizeHint = dataSizeHintNode.value.split(' ');
            if (!isNaN(parseFloat(dataSizeHint[2]))) {
              const scaleY = height / parseFloat(dataSizeHint[1]);
              s.setAttribute('transform', `scale(${scaleY})`);
              const stretch = (width - (scaleY * parseFloat(dataSizeHint[0]))) / scaleY;
              dNode.value = dNode.value.replaceAll(dataSizeHint[2], `${stretch}`);
            } else {
              const scaleX = width / parseFloat(dataSizeHint[0]);
              const scaleY = height / parseFloat(dataSizeHint[1]);
              s.setAttribute('transform', `matrix(${scaleX},0,0,${scaleY},0,0)`);
            }
          }
        } else
        {
          e.removeChild(s);
        }
    } else if (archiElement.entityType == 'ApplicationComponent') {
      if (child.figureType == 1) {
        e.removeChild(e.children[2]);
        e.removeChild(e.children[2]);
        e.removeChild(e.children[2]);
      } else
      {
        e.removeChild(e.children[0]);
        e.removeChild(e.children[0]);
      }
    } else if (child.figureType == 1 || archiElement.entityType == 'SketchModelActor') {
      const s = e.querySelector(':scope>use');
      if (s) {
        while (e.children[0].tagName != 'use')
          e.removeChild(e.children[0]);
        s.classList.add('symbol');
        const scaleY = height / 14;
        s.setAttribute('transform', `matrix(${scaleY},0,0,${scaleY},${width/2},${height/2})`);
      }
    }

    return e;
  }

  private createCloneOfType(typeName: string): string {
    const elementByType = this.elementByType;
    let t = cloneFromTemplate(typeName);
    if (t != null)
      return t;

    const businessDefined = typeName.match(/^Technology|^Application|^Implementation/);
    if (businessDefined) {
      t = cloneFromTemplate(typeName.replace(businessDefined[0], 'Business'));
      if (t != null)
        return t.replace('business', businessDefined[0].toLowerCase());
    }
    if (typeName == 'SketchModelActor')
      return cloneFromTemplate('BusinessActor');
    if (typeName == 'SketchModelSticky')
      return cloneFromTemplate('CanvasModelSticky');
    
    return cloneFromTemplate('todo');

    function cloneFromTemplate(name: string): string {
      const clone = elementByType.get(name)?.cloneNode(true) as Element;
      return clone?.outerHTML;
    }
  }

  public createEditInfo(): EditInfoElement {
    return new EditInfoElement(this.templateEditInfo.cloneNode(true) as SVGGElement);
  }

  public createElementSelection(id: string): ElementSelectionElement {
    const element = this.elementSelection.cloneNode(true) as SVGGElement;
    element.setAttribute('data-element-id', id);
    return new ElementSelectionElement(id, element);
  }
}

export class EditInfoElement {
  private text: SVGTextElement;
  private rect: SVGRectElement;

  constructor(public readonly element: SVGGElement) {
    this.text = element.querySelector('text') as SVGTextElement;
    this.rect = element.querySelector('rect') as SVGRectElement;
  }

  public setText(constent: string, x: number, y: number) {
    this.text.textContent = constent;
    const bbox = this.text.getBBox();

    this.rect.setAttribute('width', `${bbox.width + 10}px`);
    this.rect.setAttribute('height', `${bbox.height + 4}px`);

    this.element.setAttribute('transform', `translate(${x},${y})`);
  }
}

export class ElementSelectionElement {
  private _lastSelected: boolean;

  get lastSelected(): boolean { return this._lastSelected; }
  set lastSelected(value: boolean) {
    if (value == this._lastSelected)
      return;
    this._lastSelected = value;
    if (value)
      this.element.classList.add('lastSelection');
    else
      this.element.classList.remove('lastSelection');
  }

  constructor(public id: string, public readonly element: SVGElement) {
  }

  public remove() {
    this.element.remove();
  }

  public setPosition(x: number, y: number, width: number, height: number) {
      this.element.setAttribute('transform', `translate(${x},${y})`);
      this.element.childNodes.forEach(cn => {
        if (cn instanceof SVGCircleElement) {
          const c = cn.classList[0];
          let w = width / 2;
          let h = height / 2;
          if (c.indexOf('e') >= 0)
            w = width;
          else if (c.indexOf('w') >= 0)
            w = 0;
          if (c.indexOf('s') >= 0)
            h = height;
          else if (c.indexOf('n') >= 0)
            h = 0;
          cn.cx.baseVal.value = w;
          cn.cy.baseVal.value = h;
        }
      });
  }
}
