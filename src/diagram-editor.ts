export function makeDraggable(svg: SVGSVGElement) {
  const contentElement = svg.getElementById('Content') as SVGElement;
  let selectedElement: SVGGElement = null;
  let offset: any = false;
  let lastElementClicked: SVGElement = null;
  let selectedRelation: SVGElement = null;
  let selectedDropTarget: SVGGElement = null;
  svg.addEventListener('pointerdown', startDrag);
  svg.addEventListener('pointermove', drag);
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointerleave', endDrag);
  svg.addEventListener('focusout', (evt) => {
    const focusedElement = getElementFromChild(evt.target as Element);
    if (focusedElement && selectedElement == null)
      lastElementClicked = null;
    const sel = window.getSelection();
    sel.removeAllRanges();
  });
  svg.addEventListener('keydown', onkeydown);

  function onkeydown(evt: KeyboardEvent) {
    const target = evt.target as HTMLElement;
    const targetElement = target.closest('.element');
    if (evt.key === 'Enter' && targetElement.classList.contains('note')) {
      evt.preventDefault();
      const sel = window.getSelection();
      const textContentCount = sel.focusNode.parentNode.childNodes.length;
      document.execCommand('insertHTML', false, '\n');
      if (textContentCount < sel.focusNode.parentNode.childNodes.length) {
        // firefox seems to sometimes create a next text element, and not move the cursor
        // If this happens, move the cursor to the beginning of the next text element
        const range = document.createRange();
        
        range.setStart(window.getSelection().focusNode.nextSibling, 0);
        range.collapse(true);
        
        sel.removeAllRanges();
        sel.addRange(range);
      }
      return false; 
    }
    else if (evt.key == 'Enter' || evt.key == 'Escape') {
      (evt.target as HTMLElement).blur();
    }
  }

  function startDrag(evt: PointerEvent) {
    const target = evt.target as SVGElement;
    selectedElement = target.closest('.element');

    if (selectedElement !== null && selectedElement === lastElementClicked) {
      const toEdit: HTMLDivElement = selectedElement.querySelector(':scope>foreignObject div');
      const focusedElement = getElementFromChild(document.activeElement);
      if (focusedElement !== selectedElement) {
      setTimeout(function() {
          toEdit.focus();
          const range = document.createRange(); // select all text in div
          range.selectNodeContents(toEdit);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }, 100);
      }
      selectedElement = null;
      return;
    }
    lastElementClicked = selectedElement;

    if (selectedElement != null) {
      offset = getMousePosition(evt);
      const [elementOffsetX, elementOffsetY] = getOffsetFromContent(selectedElement);
      offset.x -= elementOffsetX;
      offset.y -= elementOffsetY;
    }
    else if (target.classList.contains('RelationshipDetect')) {
      if (selectedRelation)
        selectedRelation.classList.remove('selected');
      if (selectedRelation === (target.parentElement as any as SVGElement))
        selectedRelation = null;
      else {
        selectedRelation = target.parentElement as any as SVGElement;
        selectedRelation.classList.add('selected');
        const parent = selectedRelation.ownerSVGElement;
        parent.appendChild(selectedRelation);
      }
    }
  }
  function getElementFromChild(element: Element) {
    while (element != null && !(element instanceof SVGGElement))
      element = element.parentElement;
    return element;
  }
  function getOffsetFromContent(element: SVGGElement): [number, number] {
    let elementOffsetX = 0;
    let elementOffsetY = 0;
    while (element !== contentElement) {
      const transform = element.transform.baseVal.consolidate();
      elementOffsetX += transform.matrix.e;
      elementOffsetY += transform.matrix.f;
      element = element.parentElement as any as SVGGElement;
    }
    return [elementOffsetX, elementOffsetY];
  }

  function drag(evt: PointerEvent) {
    if (selectedElement) {
      lastElementClicked = null;
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      setDraggingAttributes(evt);
    }
  }

  function setDraggingAttributes(evt: PointerEvent) {
    const coord = getMousePosition(evt);

    if (selectedElement !== contentElement.lastElementChild) {
      selectedElement.remove();
      contentElement.appendChild(selectedElement);
    }
    if (!selectedElement.classList.contains('dragging')) {
      selectedElement.classList.add('dragging');
      svg.classList.add('dragging');
    }


    selectedElement.setAttributeNS(null, 'transform', `translate(${Math.round((coord.x - offset.x) / 12) * 12}, ${Math.round((coord.y - offset.y) / 12) * 12})`);

    const dropTargetCandidates = svg.querySelectorAll('g.element:hover');
    const dropTargetCandidate = !dropTargetCandidates ? null : dropTargetCandidates[dropTargetCandidates.length - 1] as SVGGElement;
    if (dropTargetCandidate) {
      if (selectedDropTarget !== dropTargetCandidate) {
        if (selectedDropTarget) {
          selectedDropTarget.classList.remove('drop');
        }
        selectedDropTarget = dropTargetCandidate;
        selectedDropTarget.classList.add('drop');
      }
    } else {
      if (selectedDropTarget) {
        selectedDropTarget.classList.remove('drop');
        selectedDropTarget = null;
      }
    }
  }

  function endDrag(evt: PointerEvent) {
    if (selectedElement && selectedElement.classList.contains('dragging')) {
      if (selectedDropTarget) {
        const [elementOffsetX, elementOffsetY] = getOffsetFromContent(selectedElement);
        const [parentOffsetX, parentOffsetY] = getOffsetFromContent(selectedDropTarget);
        selectedDropTarget.appendChild(selectedElement);
        selectedElement.setAttributeNS(null, 'transform', `translate(${elementOffsetX - parentOffsetX}, ${elementOffsetY - parentOffsetY})`);
      } else {
        const firstConnector = contentElement.querySelector(':scope>.con');
        if (firstConnector)
          contentElement.insertBefore(selectedElement, firstConnector);
        else
          contentElement.appendChild(selectedElement);
      }
      selectedElement.classList.remove('dragging');
      svg.classList.remove('dragging');
    }
    if (selectedDropTarget) {
      selectedDropTarget.classList.remove('drop');
    }
    selectedDropTarget = null;
    selectedElement = null;
  }
  function getMousePosition(evt: PointerEvent) {
    const CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
      f: CTM.f,
      d: CTM.d
    };
  }
}
