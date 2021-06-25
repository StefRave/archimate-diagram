export function makeDraggable(svg: SVGSVGElement) {
  var contentElement = svg.getElementById('Content') as SVGElement;
  var selectedElement: SVGElement = null;
  var offset: any = false;
  var selectedRelation: SVGElement = null;
  svg.addEventListener('pointerdown', startDrag);
  svg.addEventListener('pointermove', drag);
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointerleave', endDrag);

  function startDrag(evt: MouseEvent) {
    var target = evt.target as SVGElement;
    selectedElement = target.closest('.element');
    if (selectedElement != null) {
      selectedElement.classList.add('dragging');
      svg.classList.add('dragging');
      offset = getMousePosition(evt);
      var e = selectedElement as SVGGElement;
      var elementOffsetX = 0;
      var elementOffsetY = 0;
      while (e !== contentElement) {
        var transform = e.transform.baseVal.consolidate();
        elementOffsetX += transform.matrix.e;
        elementOffsetY += transform.matrix.f;
        e = e.parentElement as any as SVGGElement;
      }
      offset.x -= elementOffsetX;
      offset.y -= elementOffsetY;
      contentElement.appendChild(selectedElement);
      selectedElement.setAttributeNS(null, 'transform', `translate(${elementOffsetX}, ${elementOffsetY})`);
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
  function drag(evt: MouseEvent) {
    if (selectedElement) {
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      pauseEvent(evt);
      var coord = getMousePosition(evt);
      selectedElement.setAttributeNS(null, 'transform', `translate(${Math.round((coord.x - offset.x) / 12) * 12}, ${Math.round((coord.y - offset.y) / 12) * 12})`);
    }
  }
  function endDrag(evt: MouseEvent) {
    if (selectedElement) {
      selectedElement.classList.remove('dragging');
      selectedElement = null;
      svg.classList.remove('dragging');
    }
  }
  function getMousePosition(evt: MouseEvent) {
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
      f: CTM.f,
      d: CTM.d
    };
  }
  function pauseEvent(e: Event) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }

}
