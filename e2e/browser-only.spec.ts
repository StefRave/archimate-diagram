import { expect, Locator, Page, test } from '@playwright/test';

// Layered View (#1): object 4079 (Claim Registration Service) onto group 4065
// (External Roles and Actors). Their boxes do not contain each other.
const objectId = '4079';
const groupId = '4065';

function snap(v: number): number {
  return Math.round(v / 12) * 12;
}

function toDiagram(ctm: { a: number; d: number; e: number; f: number }, x: number, y: number) {
  return { x: (x - ctm.e) / ctm.a, y: (y - ctm.f) / ctm.d };
}

function contains(outer: { x: number; y: number; width: number; height: number }, inner: { x: number; y: number; width: number; height: number }) {
  return inner.x >= outer.x && inner.y >= outer.y
    && inner.x + inner.width <= outer.x + outer.width
    && inner.y + inner.height <= outer.y + outer.height;
}

async function readElement(page: Page, id: string) {
  return page.evaluate((elementId) => {
    const svg = document.querySelector('#svgTarget svg') as SVGSVGElement;
    const el = svg.getElementById(elementId) as SVGGElement;
    const rect = el.getBoundingClientRect();
    const bbox = el.getBBox();
    let x = 0;
    let y = 0;
    let node: Element | null = el;
    while (node && node !== svg) {
      const match = /translate\(\s*([-\d.]+)[,\s]+([-\d.]+)\s*\)/.exec(node.getAttribute('transform') || '');
      if (match) {
        x += Number(match[1]);
        y += Number(match[2]);
      }
      node = node.parentElement;
    }
    const matrix = svg.getScreenCTM();
    return {
      parentId: el.parentElement?.id ?? null,
      className: el.getAttribute('class') ?? '',
      transform: el.getAttribute('transform'),
      diagram: { x, y, width: bbox.width, height: bbox.height },
      screen: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      ctm: { a: matrix.a, d: matrix.d, e: matrix.e, f: matrix.f },
    };
  }, id);
}

function center(box: { x: number; y: number; width: number; height: number }) {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y);
}

async function dragCustomerToHandleClaim(page: Page) {
  const customer = page.locator('#svgTarget svg [id="3788"]');
  await customer.hover();
  const handle = page.locator('#svgTarget svg g.connectorHandle circle');
  await handle.waitFor();
  const handleBox = await handle.boundingBox();
  const targetBox = await page.locator('#svgTarget svg [id="3776"]').boundingBox();
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + 20, targetBox.y + 8, { steps: 5 });
  await page.mouse.up();
  await page.locator('.relation-picker').waitFor();
}

test('drops 4079 onto group 4065 and nests it', async ({ page }) => {
  await page.goto('/#1');
  await page.waitForSelector('#svgTarget svg [id="4065"]');

  const object = await readElement(page, objectId);
  const group = await readElement(page, groupId);
  expect(object.className.split(/\s+/)).not.toContain('grouping');
  expect(group.className.split(/\s+/)).toContain('grouping');
  expect(contains(object.screen, group.screen)).toBe(false);
  expect(contains(group.screen, object.screen)).toBe(false);
  expect(object.parentId).not.toBe(groupId);

  const from = center(object.screen);
  const to = center(group.screen);
  const dropDiagram = toDiagram(group.ctm, to.x, to.y);
  expect(contains(group.diagram, { x: dropDiagram.x, y: dropDiagram.y, width: 0, height: 0 })).toBe(true);

  await drag(page, from, to);
  expect(await page.evaluate(() => document.querySelector('#svgTarget svg g.drop')?.id ?? null)).toBe(groupId);
  await page.mouse.up();

  const start = toDiagram(object.ctm, from.x, from.y);
  const end = toDiagram(object.ctm, to.x, to.y);
  const relative = {
    x: snap(end.x - (start.x - object.diagram.x)) - group.diagram.x,
    y: snap(end.y - (start.y - object.diagram.y)) - group.diagram.y,
  };
  const nested = await readElement(page, objectId);
  expect(nested.parentId).toBe(groupId);
  expect(nested.transform).toBe(`translate(${relative.x}, ${relative.y})`);
  expect(nested.diagram.width).toBe(object.diagram.width);
  expect(nested.diagram.height).toBe(object.diagram.height);
});

test('drags Customer by the diagram delta under scale(2)', async ({ page }) => {
  await page.goto('/#5');
  await page.waitForSelector('#svgTarget svg [id="3788"]');
  await page.evaluate(() => {
    const svg = document.querySelector('#svgTarget svg') as SVGSVGElement;
    svg.style.transformOrigin = '0 0';
    svg.style.transform = 'scale(2)';
  });

  const before = await readElement(page, '3788');
  expect(before.ctm.a).toBe(2);
  expect(before.ctm.d).toBe(2);
  expect(before.transform).toBe('translate(200, 663)');

  const screenDelta = { x: 80, y: 42 };
  const from = center(before.screen);
  const to = { x: from.x + screenDelta.x, y: from.y + screenDelta.y };
  await drag(page, from, to);
  await page.mouse.up();

  const start = toDiagram(before.ctm, from.x, from.y);
  const end = toDiagram(before.ctm, to.x, to.y);
  const diagramDelta = { x: screenDelta.x / before.ctm.a, y: screenDelta.y / before.ctm.d };
  expect(end.x - start.x).toBeCloseTo(diagramDelta.x);
  expect(end.y - start.y).toBeCloseTo(diagramDelta.y);

  const after = await readElement(page, '3788');
  expect(after.parentId).toBe('3761');
  expect(after.diagram.x).toBe(snap(before.diagram.x + diagramDelta.x));
  expect(after.diagram.y).toBe(snap(before.diagram.y + diagramDelta.y));
  expect(after.diagram.width).toBe(before.diagram.width);
  expect(after.diagram.height).toBe(before.diagram.height);
  expect(after.transform).toBe(`translate(${after.diagram.x}, ${after.diagram.y})`);
  expect(after.diagram.x).not.toBe(snap(before.diagram.x + screenDelta.x));
  expect(after.diagram.y).not.toBe(snap(before.diagram.y + screenDelta.y));
});

test('types a new Customer label from a double-click', async ({ page }) => {
  await page.goto('/#5');
  const customer: Locator = page.locator('#svgTarget svg [id="3788"]');
  await customer.waitFor();

  const label = () => page.evaluate(() => {
    const el = document.querySelector('#svgTarget svg [id="3788"] foreignObject div div') as HTMLElement;
    return { text: el?.textContent ?? '', visible: el?.innerText ?? '' };
  });
  expect(await label()).toEqual({ text: 'Customer', visible: 'Customer' });

  await customer.dblclick();
  // editElementText focuses and selects the label after 100ms.
  await page.waitForFunction(() => {
    const el = document.querySelector('#svgTarget svg [id="3788"] foreignObject div div');
    return document.activeElement === el && window.getSelection()?.toString() === 'Customer';
  });
  await page.keyboard.type('Acme');
  await page.locator('h1').click();

  expect(await label()).toEqual({ text: 'Acme', visible: 'Acme' });
});

test('connects Customer to Handle Claim from the connector handle', async ({ page }) => {
  await page.goto('/#5');
  await page.waitForSelector('#svgTarget svg [id="3776"]');
  const connectionCount = () => page.locator('#svgTarget svg g.con path.Serving.Relationship').count();
  const before = await connectionCount();

  await dragCustomerToHandleClaim(page);
  await page.keyboard.type('f');
  await expect(page.locator('.relation-picker [role="option"]')).toHaveCount(1);
  await expect(page.locator('.relation-picker [role="option"]').first()).toHaveAttribute('data-type', 'FlowRelationship');
  await page.getByRole('textbox', { name: 'Search relationships' }).fill('serv');
  await page.keyboard.press('Enter');

  await expect(page.locator('.relation-picker')).toHaveCount(0);
  await expect.poll(connectionCount).toBe(before + 1);
  await page.keyboard.press('Control+z');
  await expect.poll(connectionCount).toBe(before);
});

test('Escape closes the relationship picker without adding a connection', async ({ page }) => {
  await page.goto('/#5');
  await page.waitForSelector('#svgTarget svg [id="3776"]');
  const before = await page.locator('#svgTarget svg g.con path.Serving.Relationship').count();

  await dragCustomerToHandleClaim(page);
  await page.keyboard.press('Escape');

  await expect(page.locator('.relation-picker')).toHaveCount(0);
  await expect(page.locator('#svgTarget svg g.con path.Serving.Relationship')).toHaveCount(before);
  await expect(page.locator('#svgTarget svg g.connectPreview')).toHaveCount(0);
});
