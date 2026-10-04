global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
process.env.MODE = 'development';

// jsdom 26 has no SVG geometry. Identity CTM keeps client coordinates in diagram space.
SVGSVGElement.prototype.getScreenCTM = function () {
  return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
};
SVGElement.prototype.getBBox = function () {
  return { width: 10, height: 10 };
};
if (typeof SVGCircleElement === 'undefined')
  global.SVGCircleElement = function SVGCircleElement() {};
if (typeof SVGGElement === 'undefined')
  global.SVGGElement = function SVGGElement() {};
