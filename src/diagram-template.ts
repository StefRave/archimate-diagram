import svgSource from './archimate.svg?raw';
import { ElementBounds } from './greeter';

export class DiagramTemplate {
  private readonly elementByType: Map<string, Element>;
  private readonly elementSelection: SVGGElement;
  private readonly templateEditInfo: SVGGElement;
  private readonly icons: SVGGElement[];
  private static instance: DiagramTemplate;

  constructor(private readonly templateDoc: SVGSVGElement) {
    const content = templateDoc.getElementById('content');
    this.elementSelection = content.querySelector('g#ElementSelected>g.selection');
    this.templateEditInfo = templateDoc.getElementById('editInfo') as SVGGElement;

    const archiElements = Array.from(content.querySelectorAll('g.element'));
    this.elementByType = new Map<string, Element>(archiElements.map(e => [e.id, e]));

    content.replaceChildren();
    templateDoc.getElementById('imageDefs').replaceChildren();
    const iconsGroup = templateDoc.getElementById("icons") as SVGGElement;
    this.icons = Array.from(iconsGroup.children).map(icon => {
      icon.querySelector('rect')?.remove();
      const transform = icon.getAttributeNode('transform');
      if (transform)
        icon.removeAttributeNode(transform);
      return icon as SVGGElement;
    });
    iconsGroup.remove();
  }

  public static getFromDrawing(): DiagramTemplate {
    if (!this.instance) {
      const parser = new DOMParser();
      const templateDoc = parser.parseFromString(svgSource, 'application/xml') as unknown as SVGSVGElement;
      this.instance = new DiagramTemplate(templateDoc);
    }
    return this.instance;
  }

  public getEmptySvg(): SVGSVGElement {
    return this.templateDoc.cloneNode(true) as SVGSVGElement;
  }

  public getElementByType(archiElement: { entityType: string, subType: string}, child: {bounds: ElementBounds, figureType: number}): SVGElement {
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
        case '56': return `${height - 4}`; 
        case '44': return `${height - 16}`; 
        case '30': return `${height / 2}`; 

        default: return sub;
      }}));
    if (typeName === 'Junction') {
      if (archiElement.subType === 'or')
        es = es.replace('class=\'', 'class=\'or ');

      const ws = +(width / 2).toFixed(2);
      es = es.replace('cx="5" cy="5" rx="5" ry="5"', `cx='${ws}' cy='${ws}' rx='${ws}' ry='${ws}'`);
    }
    const parser = new DOMParser();
    const e = <Element>parser.parseFromString(es, 'text/xml').firstChild as SVGElement;
    e.setAttribute('transform', `translate(${child.bounds.x}, ${child.bounds.y})`);
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

  public getIcon(elementName: string): SVGGElement {
    let iconName = elementName.replace(/^Business|^Technology|^Application|^Implementation|^Data/, '');
    if (iconName == 'Stakeholder')
      iconName = 'Role';

    const g = this.templateDoc.getElementById(iconName + 'Icon');
    return g.cloneNode(true) as SVGGElement;
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

export class ArchimateElementInfo
{
  public static getElementInfo(): IArchimateElementInfo[] {
    const toc = `4          Generic Metamodel
    4.1      Behavior and Structure Elements
    4.1.1        Active Structure Elements
    4.1.2        Behavior Elements
    4.1.3        Passive Structure Elements
    4.2      Specializations of Structure and Behavior Elements
    4.3      Summary of Structure and Behavior Elements
    4.4      Motivation Elements
    4.5      Composite Elements
    4.5.1        Grouping
    4.5.2        Location
    5          Relationships
    5.1      Structural Relationships
    5.1.1        Composition Relationship
    5.1.2        Aggregation Relationship
    5.1.3        Assignment Relationship
    5.1.4        Realization Relationship
    5.1.5        Semantics of Structural Relationships
    5.2      Dependency Relationships
    5.2.1        Serving Relationship
    5.2.2        Access Relationship
    5.2.3        Influence Relationship
    5.2.4        Association Relationship
    5.2.5        Semantics of Dependency Relationships
    5.3      Dynamic Relationships
    5.3.1        Triggering Relationship
    5.3.2        Flow Relationship
    5.3.3        Semantics of Dynamic Relationships
    5.4      Other Relationships
    5.4.1        Specialization Relationship
    5.4.2        Semantics of Other Relationships
    5.5      Relationship Connectors
    5.5.1        Junction
    5.6      Summary of Relationships
    5.7      Derivation of Relationships
    6          Motivation Elements
    6.1      Motivation Elements Metamodel
    6.2      Stakeholder, Driver, and Assessment
    6.2.1        Stakeholder
    6.2.2        Driver
    6.2.3        Assessment
    6.2.4        Example
    6.3      Goal, Outcome, Principle, Requirement, and Constraint
    6.3.1        Goal
    6.3.2        Outcome
    6.3.3        Principle
    6.3.4        Requirement
    6.3.5        Constraint
    6.3.6        Example
    6.4      Meaning and Value
    6.4.1        Meaning
    6.4.2        Value
    6.4.3        Example
    6.5      Summary of Motivation Elements
    6.6      Relationships with Core Elements
    7          Strategy Elements
    7.1      Strategy Elements Metamodel
    7.2      Structure Elements
    7.2.1        Resource
    7.3      Behavior Elements
    7.3.1        Capability
    7.3.2        Value Stream
    7.3.3        Course of Action
    7.4      Example
    7.5      Summary of Strategy Elements
    7.6      Relationships with Motivation and Core Elements
    8          Business Layer
    8.1      Business Layer Metamodel
    8.2      Active Structure Elements
    8.2.1        Business Actor
    8.2.2        Business Role
    8.2.3        Business Collaboration
    8.2.4        Business Interface
    8.2.5        Example
    8.3      Behavior Elements
    8.3.1        Business Process
    8.3.2        Business Function
    8.3.3        Business Interaction
    8.3.4        Business Event
    8.3.5        Business Service
    8.3.6        Example
    8.4      Passive Structure Elements
    8.4.1        Business Object
    8.4.2        Contract
    8.4.3        Representation
    8.4.4        Example
    8.5      Composite Elements
    8.5.1        Product
    8.5.2        Example
    8.6      Summary of Business Layer Elements
    9          Application Layer
    9.1      Application Layer Metamodel
    9.2      Active Structure Elements
    9.2.1        Application Component
    9.2.2        Application Collaboration
    9.2.3        Application Interface
    9.2.4        Example
    9.3      Behavior Elements
    9.3.1        Application Function
    9.3.2        Application Interaction
    9.3.3        Application Process
    9.3.4        Application Event
    9.3.5        Application Service
    9.3.6        Example
    9.4      Passive Structure Elements
    9.4.1        Data Object
    9.4.2        Example
    9.5      Summary of Application Layer Elements
    10       Technology Layer
    10.1   Technology Layer Metamodel
    10.2   Active Structure Elements
    10.2.1      Node
    10.2.2      Device
    10.2.3      System Software
    10.2.4      Technology Collaboration
    10.2.5      Technology Interface
    10.2.6      Path
    10.2.7      Communication Network
    10.2.8      Example
    10.3   Behavior Elements
    10.3.1      Technology Function
    10.3.2      Technology Process
    10.3.3      Technology Interaction
    10.3.4      Technology Event
    10.3.5      Technology Service
    10.3.6      Example
    10.4   Passive Structure Elements
    10.4.1      Artifact
    10.4.2      Example
    10.5   Summary of Technology Layer Elements
    11       Physical Elements
    11.1   Physical Elements Metamodel
    11.2   Active Structure Elements
    11.2.1      Equipment
    11.2.2      Facility
    11.2.3      Distribution Network
    11.3   Behavior Elements
    11.4   Passive Structure Elements
    11.4.1      Material
    11.5   Example
    11.6   Summary of Physical Elements
    12       Relationships Between Core Layers
    12.1   Alignment of the Business Layer and Lower Layers
    12.2   Alignment of the Application and Technology Layers
    12.3   Example
    13       Implementation and Migration Elements
    13.1   Implementation and Migration Elements Metamodel
    13.2   Implementation and Migration Elements
    13.2.1      Work Package
    13.2.2      Deliverable
    13.2.3      Implementation Event
    13.2.4      Plateau
    13.2.5      Gap
    13.2.6      Example
    13.2.7      Summary of Implementation and Migration Elements
    13.3   Relationships
    13.4   Relationships with Other Aspects and Layers
    14       Stakeholders, Architecture Views, and Viewpoints
    14.1   Introduction
    14.2   Stakeholders and Concerns
    14.3   Architecture Views and Viewpoints
    14.4   Viewpoint Mechanism
    14.4.1      Defining and Classifying Viewpoints
    14.4.2      Creating the View
    14.5   Example Viewpoints
    `;
    const pattern = /((?:\.?\d+)+) *(.*)/g
    const matches = toc.matchAll(pattern);

    const result:IArchimateElementInfo[] = [];

    let chapter = '';
    let level2: string = null;
    let isElementChapter = false;
    [...matches].forEach(m => {
      const par = m[1].split('.');
      const parLine = m[2];
      const words = parLine.toLowerCase().split(' ');
      if (par.length == 1) {
        chapter = words[0];
        level2 = null;
        isElementChapter = ['elements', 'layer', 'metamodel'].includes(words.pop());
      }
      if (!isElementChapter)
        return;
      if (par.length == 2 && words[words.length - 1] == 'elements')
        level2 = words[0];
      if (par.length == 3 && words[0] != 'example' && words[0] != 'summary') {
        const elementName = words.map(w => w[0].toUpperCase() + w.substring(1)).join(' ');
        let type = level2;
        if (chapter == 'generic') {
          if (level2 != 'composite')
            return;
          type = elementName.toLowerCase(); // grouping, location
        }
        if (elementName == 'Plateau')
          level2 = type = elementName.toLowerCase();
        result.push(<IArchimateElementInfo>{
          elementName:  elementName,
          group: chapter,
          type: type,
        })
      }

    });

    return result;
  }
}

export interface IArchimateElementInfo {
  elementName: string;
  group: string;
  type: string;
}
