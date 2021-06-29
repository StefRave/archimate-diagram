export function makeDraggable(svg: SVGSVGElement) {
  var contentElement = svg.getElementById('Content') as SVGElement;
  var selectedElement: SVGGElement = null;
  var offset: any = false;
  var lastElementClicked: SVGElement = null;
  var selectedRelation: SVGElement = null;
  var selectedDropTarget: SVGGElement = null;
  svg.addEventListener('pointerdown', startDrag);
  svg.addEventListener('pointermove', drag);
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointerleave', endDrag);
  svg.addEventListener('focusout', (evt) => {
    var focusedElement = getElementFromChild(evt.target as Element);
    if (focusedElement && selectedElement == null)
      lastElementClicked = null;
  });

  function startDrag(evt: PointerEvent) {
    var target = evt.target as SVGElement;
    selectedElement = target.closest('.element');

    if (selectedElement !== null && selectedElement === lastElementClicked) {
      var toEdit: HTMLDivElement = selectedElement.querySelector(':scope>foreignObject div');
      var focusedElement = getElementFromChild(document.activeElement);
      if (focusedElement !== selectedElement) {
      setTimeout(function() {
          toEdit.focus();
          var range = document.createRange(); // select all text in div
          range.selectNodeContents(toEdit);
          var sel = window.getSelection();
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
      var [elementOffsetX, elementOffsetY] = getOffsetFromContent(selectedElement);
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
        let parent = selectedRelation.ownerSVGElement;
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
    var elementOffsetX = 0;
    var elementOffsetY = 0;
    while (element !== contentElement) {
      var transform = element.transform.baseVal.consolidate();
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
    var coord = getMousePosition(evt);

    if (selectedElement !== contentElement.lastElementChild) {
      selectedElement.remove();
      contentElement.appendChild(selectedElement);
    }
    if (!selectedElement.classList.contains('dragging')) {
      selectedElement.classList.add('dragging');
      svg.classList.add('dragging');
    }


    selectedElement.setAttributeNS(null, 'transform', `translate(${Math.round((coord.x - offset.x) / 12) * 12}, ${Math.round((coord.y - offset.y) / 12) * 12})`);

    var dropTargetCandidates = svg.querySelectorAll('g.element:hover');
    var dropTargetCandidate = !dropTargetCandidates ? null : dropTargetCandidates[dropTargetCandidates.length - 1] as SVGGElement;
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
        var [elementOffsetX, elementOffsetY] = getOffsetFromContent(selectedElement);
        var [parentOffsetX, parentOffsetY] = getOffsetFromContent(selectedDropTarget);
        selectedDropTarget.appendChild(selectedElement);
        selectedElement.setAttributeNS(null, 'transform', `translate(${elementOffsetX - parentOffsetX}, ${elementOffsetY - parentOffsetY})`);
      } else {
        var firstConnector = contentElement.querySelector(':scope>.con');
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
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
      f: CTM.f,
      d: CTM.d
    };
  }
}
