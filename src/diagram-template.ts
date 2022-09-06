import { ArchiEntity, ElementBounds } from './greeter';
import svgSource from './archimate.svg?raw';


export class DiagramTemplate {
  private elementByType: Map<string, Element>;
  private templateDoc: Document;
  public elementSelection: SVGGElement;

  public getEmptySvg(): Document {
    return this.templateDoc.cloneNode(true) as Document;
  }

  public getElementSelection(width: number, height: number): SVGGElement {
    const selection = this.elementSelection.cloneNode(true) as SVGGElement;
    selection.childNodes.forEach(cn => {
      if (cn instanceof SVGCircleElement) {
        if (cn.cx.baseVal.value === 168)
          cn.cx.baseVal.value = width;
        else if (cn.cx.baseVal.value === 168 / 2)
          cn.cx.baseVal.value = width / 2;
        if (cn.cy.baseVal.value === 60)
          cn.cy.baseVal.value = height;
        else if (cn.cy.baseVal.value === 60 / 2)
          cn.cy.baseVal.value = height / 2;
      }
    });
    return selection;
  }

  public getElementByType(archiElement: ArchiEntity, bounds: ElementBounds): Element {
    const typeName = archiElement.entityType.split(':').pop();

    let es = this.createCloneOfType(typeName);

    const { width, height } = bounds;
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
    return <Element>parser.parseFromString(es, 'text/xml').firstChild;
  }

  private createCloneOfType(typeName: string): string {
    const elementByType = this.elementByType;
    let t = cloneFromTemplate(typeName);
    if (t != null)
      return t;

    if (typeName.startsWith('Technology') || typeName.startsWith('Application')) {
      t = cloneFromTemplate(typeName.replace(/Technology|Application/, 'Business'));
      if (t != null)
        return t.replace('business', typeName.startsWith('Technology') ? 'technology' : 'application');
    }
    return cloneFromTemplate('todo');

    function cloneFromTemplate(name: string): string {
      const clone = elementByType.get(name)?.cloneNode(true) as Element;
      return clone?.outerHTML;
    }
  }

  public static getFromDrawing(): DiagramTemplate {
    const result = new DiagramTemplate();

    const parser = new DOMParser();

    result.templateDoc = parser.parseFromString(svgSource, 'application/xml');

    const content = result.templateDoc.getElementById('Content');
    result.elementSelection = content.querySelector('g#ElementSelected>g.selection');

    const archiElements = Array.from(content.querySelectorAll('g.element'));
    result.elementByType = new Map<string, Element>(archiElements.map(e => [e.id, e]));

    while (content.firstChild)
      content.removeChild(content.firstChild);

    return result;
  }
}
