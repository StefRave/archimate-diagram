# Plan: drag-to-connect with a relationship picker

Status: ready to implement. This plan is written for an implementer who has not seen the code. Follow the phases in order. Every phase ends with `npm test` green. Do not skip the tests. Do not start a later phase early.

## Goal

1. When an element is hovered or selected, show a small connector handle beside it.
2. The user drags from the handle to another element and sees a preview line.
3. On release over a valid target, a compact picker opens near the new line. The user picks the ArchiMate relationship type. The picker has search, groups, a short description, and a direction/arrowhead preview.
4. Escape cancels at any point. Invalid targets do not accept the connection.
5. Creating the connection is **one** undoable action. It updates the model (`archimate-model.ts` objects and the XML document) and the diagram (SVG).

## Read first (mandatory)

- `AGENTS.md` and `wiki/index.md`. Rules that apply here:
  - Run `npm test`. A behavior change updates the wiki page and the test **in the same change**.
  - Do not add an abstraction the current code can already express. Do not document class structure in the wiki. Do not mock private methods.
  - Do not rewrite `componentWillMount`. Do not delete `ProjectTools`. Do not wire `save()`.
  - `src/archimate-model.ts` is the model.
- `wiki/schema.md`: a wiki behavior page is Given / When / Then plus the exact `it(...)` name. It must not restate functions or list methods.

## Baseline (verified on 2026-10-04)

- `npm ci` is needed once in a fresh worktree (`jest` is not found otherwise).
- `npm test`: 3 suites, 16 tests, all pass.
- `npm run build`: passes. `npm run lint`: clean.
- Playwright: `npx playwright test` (starts `npm run dev` on port 4000). Run `npx playwright install chromium` first if the browser is missing.

## Decisions already made (do not re-decide)

| Topic | Decision |
| --- | --- |
| Valid relationship types | Use Archi's ArchiMate 3.2 relationship matrix (`relationships.xml`, MIT license), vendored into `src/`. Upper- and lower-case keys both count as allowed. |
| Invalid target | Empty canvas, the source itself, a diagram object with no ArchiMate concept (Archi `Group`, `Note`, diagram reference, canvas/sketch objects), a connection, or a pair with no allowed type in the matrix. |
| Who can have a handle | Diagram objects whose concept type is a source concept in the matrix (not `Relationship`). |
| Gesture vs. model | The drag and the open picker do **not** touch the model. Only the final pick creates a change. Cancel therefore needs no undo. |
| Undo unit | New `ChangeAction.AddRemoveConnection` with one history entry (`chainedToParent: false`). One Ctrl+Z removes the relationship and the diagram connection. Ctrl+Y restores both. |
| Picker technology | React function component `src/RelationPicker.tsx`, rendered by `ArchiEditor`. The editor talks to it through one callback and three public methods (below). |
| Picker shows | Only the types allowed for the pair, grouped Structural / Dependency / Dynamic / Other (ArchiMate §5.1–5.4), in catalog order. The first visible type is highlighted. The description of the highlighted type is shown in a footer. |
| Preview class | Same CSS class rule as `DiagramRenderer.addConnectionPath`: `type.replace('Relationship', ' Relationship')` (for example `Serving Relationship`). Access therefore previews as dotted with no arrowhead. That matches the known `AccessRelationShip` renderer defect in `wiki/behavior/render-diagram.md`. Do **not** fix that defect here. |
| New XML | Relationship `<element xsi:type="archimate:XRelationship" id source target/>` in the folder that already holds that type, else the top-level `folder[type="relations"]`. Diagram `<sourceConnection xsi:type="archimate:Connection" id source target archimateRelationship/>` inside the source `child`, before its first nested `child`. The target `child` gets the connection id added to its space-separated `targetConnections` attribute. |
| Ids | `'id-' + uuidv4()` (as `ArchiEditor.onDragging` does). Tests pass fixed ids. |
| Out of scope | Connections to or from connections, bend points while creating, Junction same-type checks, editing the type of an existing relationship, deleting connections, Access `accessType` choice, fixing the Access class defect, mobile long-press. |

## Fixtures (all in `src/Archisurance.archimate`, verified)

Business Process View, diagram `3761` (`/#5` in the browser):

| Diagram object | Concept | Type | Bounds (absolute) |
| --- | --- | --- | --- |
| `3788` Customer | `521` | BusinessRole | (200, 663, 120, 60) |
| `3776` Handle Claim | `556` | BusinessProcess | (170, 154, 660, 90). Has nested children starting at relative (20, 20). |
| `3785` Insurance Policy | `675` | BusinessObject | (408, 310, 165, 58) (default size) |

Layered View, diagram `4056`: `4096` is an Archi `Group` with no concept at (20, 510, 710, 120). `4103` (BusinessService `1220`) is inside it at relative (264, 25).

Matrix answers (checked against Archi's file):

| Source → target | Keys | Types in catalog order |
| --- | --- | --- |
| BusinessRole → BusinessProcess | `fiotv` | Assignment, Serving, Association, Triggering, Flow |
| BusinessRole → BusinessObject | `ao` | Access, Association |
| BusinessObject → BusinessRole | `o` | Association |

Handle position rule: centre at `(abs.x + width + 10, abs.y + height / 2)`. For Customer that is `translate(330, 693)`. For Insurance Policy it is `translate(583, 339)`.

---

## Phase 1: relationship catalog and rules

### 1.1 Vendor the matrix

1. Download `https://raw.githubusercontent.com/archimatetool/archi/master/com.archimatetool.model/model/relationships.xml` to `src/relationships.xml` unchanged.
2. Directly after the `<?xml ...?>` line, insert an XML comment with the source URL and the full MIT notice from `https://raw.githubusercontent.com/archimatetool/archi/master/License.txt` (copyright line: `Copyright (c) 2013-2026 Phillip Beauvoir, Jean-Baptiste Sarrodie, The Open Group`).
3. Key letters (from Archi's `relationships-keys.xml`): `a` Access, `c` Composition, `f` Flow, `g` Aggregation, `i` Assignment, `n` Influence, `o` Association, `r` Realization, `s` Specialization, `t` Triggering, `v` Serving.

### 1.2 Compact runtime matrix

Keep the licensed upstream XML as `src/relationships.xml`. Generate `src/relationship-matrix.ts` from it and import that compact representation at runtime. Archi's XML contains 230 KB of indentation; importing it as a raw string pushed the built JavaScript over 700 KB. The generated file uses a concept list, a codebook of unique lowercase key sets, and one base-62 code per source/target pair. Verify the generator keeps the target concept order identical to the source order and regenerate it if the XML source changes. Do not import the full XML into application code.

### 1.3 New file `src/relationship-rules.ts`

```ts
import {
  relationshipConcepts,
  relationshipKeyAlphabet,
  relationshipKeySets,
  relationshipRows,
} from './relationship-matrix';

export type RelationshipGroup = 'Structural' | 'Dependency' | 'Dynamic' | 'Other';

export interface RelationshipTypeInfo {
  type: string;          // entityType as stored by the loader, e.g. 'ServingRelationship'
  label: string;         // 'Serving'
  group: RelationshipGroup;
  description: string;
  previewClass: string;  // 'Serving Relationship'
}

// Catalog order is the display order everywhere.
export const relationshipTypes: RelationshipTypeInfo[] = [ /* table below */ ];

export function conceptType(entityType: string): string { /* strip leading 'archimate:' */ }
export function isConnectableConcept(entityType: string): boolean { /* in matrix as a source, and not 'Relationship' */ }
export function allowedRelationshipTypes(sourceType: string, targetType: string): string[] { /* catalog-ordered type names */ }
export function relationshipTypeInfo(type: string): RelationshipTypeInfo { /* lookup */ }
```

Implementation notes:
- Parse the compact row strings lazily once into `Map<sourceConcept, Map<targetConcept, keys>>`, resolving each base-62 code through `relationshipKeySets`.
- `allowedRelationshipTypes` lower-cases the keys, maps letters to types, and returns `relationshipTypes.filter(allowed).map(t => t.type)`. An unknown pair returns `[]`.
- Always normalise with `conceptType`, because loaded entities have `BusinessRole` but palette-created entities have `archimate:BusinessRole` (see `ArchiEditor.onDragging`).
- `previewClass` is `type.replace('Relationship', ' Relationship')` for every row.

Catalog (copy verbatim; tests depend on the words, and no description may contain `serv` or `flow`):

| type | label | group | description |
| --- | --- | --- | --- |
| CompositionRelationship | Composition | Structural | The target is an integral part of the source and does not exist without it. |
| AggregationRelationship | Aggregation | Structural | The source groups the target; the target can also exist on its own. |
| AssignmentRelationship | Assignment | Structural | The source is responsible for, performs, or carries out the target. |
| RealizationRelationship | Realization | Structural | The source implements or brings about the more abstract target. |
| ServingRelationship | Serving | Dependency | The source provides its functionality to the target. |
| AccessRelationship | Access | Dependency | The source reads or writes the passive target. |
| InfluenceRelationship | Influence | Dependency | The source affects the target motivation element, positively or negatively. |
| AssociationRelationship | Association | Dependency | An unspecified relationship between source and target. |
| TriggeringRelationship | Triggering | Dynamic | The source causes the target to start; a temporal or causal order. |
| FlowRelationship | Flow | Dynamic | Information, goods, or value moves from the source to the target. |
| SpecializationRelationship | Specialization | Other | The source is a particular kind of the target. |

### 1.4 Tests: new `src/relationship-rules.spec.ts`

- `allows Assignment, Serving, Association, Triggering, and Flow from BusinessRole to BusinessProcess`: `toEqual(['AssignmentRelationship','ServingRelationship','AssociationRelationship','TriggeringRelationship','FlowRelationship'])`.
- `allows only Association from BusinessObject to BusinessRole`.
- `reads the archimate: prefix the palette writes`: `allowedRelationshipTypes('archimate:BusinessRole', 'archimate:BusinessObject')` equals `['AccessRelationship','AssociationRelationship']`.
- `treats groups, notes, and unknown types as not connectable`: `isConnectableConcept` is false for `Group`, `Note`, `DiagramModelReference`, `Relationship`, `undefined`; true for `BusinessRole` and `Junction`. `allowedRelationshipTypes('Group', 'BusinessRole')` is `[]`.
- `lists eleven relationship types in four groups`.

Done when: `npm test` passes (16 old + 5 new).

---

## Phase 2: the undoable "add connection" change (no UI yet)

### 2.1 `src/archimate-model.ts`

- `ArchimateProject.addEntity`: also put the entity in `relationshipsById` when it is a `Relationship`. (`removeEntity` already removes from both. Without this, `project.relationships` misses new relationships.)
- `ArchiDiagram`, next to `setElement`/`removeElement`:
  - `addSourceConnection(connection: ArchiSourceConnection)`: `connection.source.sourceConnections = [...connection.source.sourceConnections, connection]` and `this.childById.set(connection.id, connection)`.
  - `removeSourceConnection(connection)`: filter it out of `connection.source.sourceConnections` and `this.childById.delete(connection.id)`.

### 2.2 `src/diagram-change.ts`

- Append `AddRemoveConnection` as the **last** `ChangeAction` value (value 6; do not renumber).
- Add `IDiagramChangeAddRemoveConnection { relationship: Relationship; connection: ArchiSourceConnection; adding: boolean; }` and the field `addRemoveConnection` on `IDiagramChange`.
- `undoChange`: return `addRemoveConnection` with `adding` flipped (same object references), next to the other fields.
- `isChanged`: `if (change.addRemoveConnection) return true;` before the `throw`.

### 2.3 `src/diagram-editor.ts` (XML helpers and action)

Helpers next to `ensureDiagramObjectElement`:
- `folderForType`: when no element of that `xsi:type` exists and the type ends with `Relationship`, return the direct child `folder` of `project.element` whose `type` is `relations`. Keep the current fallback otherwise.
- `ensureConnectionElement(connection: ArchiSourceConnection)`: create `sourceConnection` once (attributes in this order: `xsi:type="archimate:Connection"`, `id`, `source` = source diagram object id, `target` = target diagram object id, `archimateRelationship`). If it is not attached to `connection.source.element`, insert it before the first direct child named `child`, else append. (Archi's order is `bounds`, `sourceConnection`*, `child`*.)
- `addTargetConnection(target: ArchiDiagramChild, id)` / `removeTargetConnection(target, id)`: edit the space-separated `targetConnections` attribute. Remove the attribute when it becomes empty. Do not add duplicates.

New action class (the existing four stay as they are):

```ts
class EditAddRemoveConnection extends EditAction {
  public doDiagramChange(diagramChange: IDiagramChange, renderer: DiagramRenderer, project: ArchimateProject, changeState: ChangeState): void {
    if (changeState != ChangeState.Final)
      return;
    const { relationship, connection, adding } = diagramChange.addRemoveConnection;
    const target = renderer.diagram.getDiagramObjectById(connection.targetId) as ArchiDiagramChild;
    if (adding) {
      ensureConceptElement(relationship, project);
      relationship.element.setAttribute('source', relationship.source);
      relationship.element.setAttribute('target', relationship.target);
      if (!project.getById(relationship.id))
        project.addEntity(relationship);   // the same instance; do NOT shallow-clone like EditAddRemoveElement does
      renderer.diagram.addSourceConnection(connection);
      ensureConnectionElement(connection);
      addTargetConnection(target, connection.id);
    } else {
      connection.element?.remove();
      removeTargetConnection(target, connection.id);
      renderer.diagram.removeSourceConnection(connection);
      relationship.element?.remove();
      project.removeEntity(relationship);
    }
  }

  public doSvgChange(change: IDiagramChange, renderer: DiagramRenderer, changeState: ChangeState): void {
    if (changeState != ChangeState.Final)
      return;
    renderer.clearRelations();
    renderer.addRelations();
  }
}
```

Register it in `EditActionBuilder.getAction` for `ChangeAction.AddRemoveConnection`.

### 2.4 `DiagramEditor.createConnection`

```ts
public createConnection(sourceId: string, targetId: string, relationshipType: string,
  ids = { relationshipId: 'id-' + uuidv4(), connectionId: 'id-' + uuidv4() }): void
```
- Look up both diagram children and their concepts. Throw an `Error` if `relationshipType` is not in `allowedRelationshipTypes(sourceConcept.entityType, targetConcept.entityType)` or if `sourceId === targetId`.
- Build `new Relationship()` with `id`, `entityType = relationshipType` (no prefix, like loaded ones), `source = sourceConcept.id`, `target = targetConcept.id`. Leave `name` unset.
- Build `new ArchiSourceConnection()` with `id`, `source = sourceChild`, `targetId`, `relationShipId`, `bendPoints = []`, `sourceConnections = []`. (`sourceConnections` must be an array: `flattenWithSourceConnections` walks it.)
- Clear any connect gesture state (Phase 3), then `this.changeManager.finalizeChange({ action: ChangeAction.AddRemoveConnection, diagramId: this.diagram.id, chainedToParent: false, addRemoveConnection: { relationship, connection, adding: true } } as IDiagramChange)`.
- `import { v4 as uuidv4 } from 'uuid'` works under Jest (uuid 11 has a `cjs-browser` build).

### 2.5 Test in `src/diagram-editor.spec.ts`

Add `describe('connect elements', ...)` reusing `mount`, `reload`, `chord` and the existing `beforeEach` pattern.

- `adds a Serving relationship from Customer to Handle Claim as one undoable change`:
  1. `editor.createConnection('3788', '3776', 'ServingRelationship', { relationshipId: 'id-rel-test', connectionId: 'id-con-test' })`.
  2. Model: `project.getById('id-rel-test')` is a `Relationship` with type `ServingRelationship`, source `521`, target `556`. `project.relationships` contains it. `diagram.getDiagramObjectById('id-con-test')` has `source.id` `3788` and `targetId` `3776`.
  3. SVG: `svg.getElementById('id-con-test')` is a `g.con` with `data-rel="id-rel-test"`. Its first `path` has class `Serving Relationship`.
  4. Reload: the relationship exists with source `521`, target `556`, and its XML element is inside `folder[type="relations"]` (`project.getById('id-rel-test').element.closest('folder[type="relations"]')` is not null). Object `3788` has a source connection `id-con-test` with `relationShipId` `id-rel-test`. The XML for child `3776` has `targetConnections` that includes `id-con-test`.
  5. One `chord(svg, 'z')`: the relationship, the diagram object, the SVG group and the `targetConnections` entry are gone, in memory and after reload. Existing connection `3812` is still there.
  6. `chord(svg, 'y')`: everything from steps 2–4 is back.
- `preserves other target connections when adding and undoing a relationship`: add an Association from Insurance Policy to Customer, whose target already has incoming connections. Undo restores the exact prior `targetConnections` list.
- `rejects a relationship type the matrix does not allow`: `expect(() => editor.createConnection('3785', '3788', 'ServingRelationship', ids)).toThrow()`, and `project.getById(ids.relationshipId)` is undefined.

Done when: `npm test` passes.

---

## Phase 3: handle, drag preview, validation, request, cancel

### 3.1 Renderer (`src/diagram-renderer.ts`)

Use the existing, currently unused `groupElementSelection` overlay group (it is drawn on top of `content` and uses diagram coordinates). Add:
- `showConnectorHandle(child: ArchiDiagramChild)`: replace any handle with `<g class="connectorHandle" data-element-id="{id}" transform="translate(x, y)">` containing `<circle r="6"/>` and `<path d="M -3 0 H 3 M 0 -3 L 3 0 L 0 3"/>`, at the handle position rule above.
- `hideConnectorHandle()`, and a getter for the element id of the shown handle (or `null`).
- `setConnectionPreview(coords: ElementPos[], cssClass: string)`: create or update `<g class="connectPreview"><path d="..." class="..."/></g>` using `DiagramRenderer.coordsToPathD(coords)`.
- `removeConnectionPreview()`.

### 3.2 Styles (`src/archimate.svg`, inside the existing `<style>`, near the `g.selection` rules)

```css
g.connectorHandle circle { fill: #fff; stroke: #44a; stroke-width: 1.5; cursor: crosshair; }
g.connectorHandle path { fill: none; stroke: #44a; pointer-events: none; }
g.connectPreview path { pointer-events: none; }
g.connectPreview path.pending { stroke: #44a; stroke-dasharray: 4 3; }
g.connectPreview path.invalid { stroke: #c00; stroke-dasharray: 4 3; }
svg.connecting { cursor: crosshair; }
svg.connecting g.connectorHandle { pointer-events: none; }
g.element.connectTarget { filter: drop-shadow(0px 0px 4px #4a4); }
g.element.connectInvalid { filter: drop-shadow(0px 0px 4px #c44); cursor: not-allowed; }
```

### 3.3 Editor state and API (`src/diagram-editor.ts`)

Export:
```ts
export interface ConnectionRequest {
  sourceId: string;            // diagram object ids
  targetId: string;
  sourceName: string;          // concept names, for the picker header
  targetName: string;
  relationshipTypes: string[]; // allowedRelationshipTypes(...) result, never empty
  clientX: number;             // midpoint of the pending line, in client (screen) coordinates
  clientY: number;
}
```
On `DiagramEditor`:
- `public onConnectionRequest: (request: ConnectionRequest | null) => void;` Called with a request when the picker should open, and with `null` when it must close.
- `public cancelConnection(): void`: end the drag or the pending request, remove the preview and the `connectTarget`/`connectInvalid` classes, remove `connecting` from the svg. If a request was open, call `onConnectionRequest?.(null)`. Must be idempotent.
- `public previewConnectionType(type: string | null): void`: while a request is open, redraw the pending line with `relationshipTypeInfo(type).previewClass`, or `Relationship pending` for `null`.
- `createConnection` (Phase 2) also clears the gesture and, if a request was open, calls `onConnectionRequest?.(null)`.

Private state: `connectDrag: { sourceId }`, `pendingConnection: { sourceId, targetId, coords }`, and the id of the element that currently has a target class.

Private helpers:
- `connectableChild(id)`: the `ArchiDiagramChild` if it has an `entityId` whose concept passes `isConnectableConcept`, else `null`.
- `relationshipTypesBetween(sourceId, targetId)`: `[]` when equal or either side is not connectable; else `allowedRelationshipTypes(...)`.
- Coordinates: from the source to a point, use `DiagramRenderer.calculateConnectionCoords(start, startBounds, mouse, ElementPos.Zero, { bendPoints: [] } as ArchiSourceConnection)`. From the source to a valid target, use the target's `getAbsolutePositionAndBounds` instead of the mouse, so the preview equals the final line.
- Client midpoint: odd coords count → middle point; even → average of the two middle points. Then `x * ctm.a + ctm.e`, `y * ctm.d + ctm.f` with `this.svg.getScreenCTM()`.

### 3.4 Event changes (keep existing behavior intact)

`onPointerMove` becomes:
```ts
if (this.connectDrag) { this.connectDragMove(evt); return; }
if (!this.changeManager.isActive) {
  if (!this.pendingConnection)
    this.updateConnectorHandle(evt);
  return;
}
this.renderer.hideConnectorHandle();
// ...existing body unchanged from `if (this.changeManager.activeAction == ChangeAction.Edit)` on
```

`updateConnectorHandle(evt)` (hover and selection):
1. If `evt.target` is not an `Element`, do nothing. If it is inside `g.connectorHandle`, keep the handle.
2. If `closest('g.element')` is connectable, show the handle for it.
3. Else, if a handle is shown and the pointer (diagram coords) is within 24 units of that element's bounds, keep it. (This lets the pointer cross the 10-unit gap to the handle.)
4. Else, if `selectedElementId` is connectable, show the handle for the selected element.
5. Else hide it.

`onPointerDown`, inserted right after the existing `Edit` early return:
```ts
if (this.pendingConnection) { this.cancelConnection(); evt.preventDefault(); evt.stopImmediatePropagation(); return; }
const handle = (evt.target as Element).closest('g.connectorHandle');
if (!this.changeManager.activeAction && handle) { this.connectStart(handle.getAttribute('data-element-id'), evt); return; }
```
`connectStart`: set `connectDrag`, hide the handle, add `connecting` to the svg, draw a `Relationship pending` preview to the pointer, `preventDefault` and `stopImmediatePropagation`.

`connectDragMove(evt)`: `hoveredId = (evt.target as Element).closest?.('g.element')?.id ?? null`. Types = `relationshipTypesBetween(source, hoveredId)`. Move the target class to the hovered element: `connectTarget` if types is not empty, else `connectInvalid`. Preview: snapped to the target with class `Relationship pending` if valid; to the pointer with `Relationship invalid` if over an invalid element; to the pointer with `Relationship pending` over empty canvas.

`onPointerUp`, first line: `if (this.connectDrag) { this.connectDragEnd(evt); return; }`. `connectDragEnd`: compute the target as in the move. If valid: clear `connectDrag`, remove the target class and `connecting`, store `pendingConnection` with the snapped coords, keep the preview, and call `onConnectionRequest({...})`. Otherwise `cancelConnection()` (no request, no change, no history entry).

`onKeyDown`, at the top:
```ts
if (evt.key == 'Escape' && (this.connectDrag || this.pendingConnection)) { this.cancelConnection(); return; }
if (this.pendingConnection && evt.ctrlKey && (evt.key == 'z' || evt.key == 'y')) { this.cancelConnection(); return; }
```

`onTouchStart`: also prevent default when `this.connectDrag` is set.

`dispose()`: call `cancelConnection()` before removing the listeners.

### 3.5 Tests in `describe('connect elements')`

Collect requests with `const requests: (ConnectionRequest | null)[] = []; editor.onConnectionRequest = r => requests.push(r);`. Drive gestures with the existing `pointer` and `chord` helpers. Dispatch key events on `svg`, never on `document`: `onKeyDown` calls `target.closest(...)`, and `document` has no `closest`. jsdom's CTM is identity, so client coords equal diagram coords. Dispatch on the specific `g` so `evt.target` is the element.

- `shows the connector handle next to a hovered element and hides it away from it`: `pointer('pointermove', svg.getElementById('3788'), 260, 693)` → `svg.querySelector('g.connectorHandle[data-element-id="3788"]')` has transform `translate(330, 693)`. Then `pointer('pointermove', svg, 1000, 20)` → no `g.connectorHandle`.
- `keeps the connector handle on the selected element`: click Customer (`pointerdown` and `pointerup` on `3788` at (200, 663)), then `pointer('pointermove', svg, 1000, 20)` → handle for `3788` is still shown.
- `does not show a handle for a group without a concept`: mount diagram `4056`, `pointer('pointermove', svg.getElementById('4096'), 30, 520)` → no handle.
- `offers the allowed types when Customer is dropped on Handle Claim and changes nothing yet`: hover `3788`, `pointerdown` on `g.connectorHandle circle` at (330, 693), `pointermove` on `3776` at (500, 199) → `g.connectPreview path` exists with class `pending`, and `3776` has class `connectTarget`. `pointerup` on `3776` → one request with `sourceId '3788'`, `targetId '3776'`, `sourceName 'Customer'`, `targetName 'Handle Claim'`, the five types from the fixture table, and finite `clientX`/`clientY`. The count of `project.relationships` is unchanged and `chord(svg, 'z')` does not change Customer's connections (no history entry). The preview is still shown. Then `editor.previewConnectionType('FlowRelationship')` → the preview path class is `Flow Relationship`. Then `editor.createConnection('3788', '3776', 'FlowRelationship', ids)` → the preview is gone, the last request is `null`, and a `g.con` with `path.Flow.Relationship` exists for the new connection id.
  - Note: the `chord(svg, 'z')` in this test cancels the pending request (3.4). Open a new request before the `previewConnectionType` step, or move the undo check to the end.
- `offers only Association from Insurance Policy to Customer`: hover `3785`, drag from its handle (583, 339), release on `3788` → request types `['AssociationRelationship']`.
- `Escape cancels a connection drag and leaves the model unchanged`: start a drag from Customer, move over `3776`, `svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))` → no preview, no `connectTarget` class. `pointerup` on `3776` → no request. Relationship count unchanged.
- `Escape closes an open relationship request`: open a request (Customer → Handle Claim), press Escape → the last request is `null`, there is no preview, and the relationship count is unchanged.
- `does not accept the source, a group, or a connection as the target`: release Customer's drag on `3788` → while moving over it, the preview path has class `invalid` and `3788` has `connectInvalid`; after release there is no request. Repeat over the existing connection `3812`, then in diagram `4056` hover `4103`, drag from its handle, release on `4096` → no request.

Done when: `npm test` passes. All earlier tests still pass unchanged.

---

## Phase 4: `src/RelationPicker.tsx`

Props:
```ts
export type RelationPickerProps = {
  sourceName: string;
  targetName: string;
  relationshipTypes: string[];
  x: number; y: number;                       // client coords of the line midpoint
  onPreview: (type: string | null) => void;
  onPick: (type: string) => void;
  onCancel: () => void;
};
```
Behavior:
- Root `<div className="relation-picker" role="dialog" aria-label="Relationship type">`, `position: fixed`, `left = clamp(x + 8, 8, window.innerWidth - 268)`, `top = clamp(y + 8, 8, window.innerHeight - 328)`.
- Header `.relation-picker-header`: `{sourceName} → {targetName}`.
- `<input autoFocus aria-label="Search relationships" placeholder="Search relationships">`. The filter is a case-insensitive substring match on `label` and `group` after one character; descriptions are included after two characters so a single common letter does not match most descriptions.
- List `.relation-picker-list`: for each non-empty group in the order Structural, Dependency, Dynamic, Other: `<div role="group" aria-label={group}>` with a heading `.relation-picker-group`, then one `<div role="option" data-type={type} aria-selected={...}>` per type. Each option contains a 44×14 inline SVG with an arrow marker definition local to that preview and a horizontal line; catalog metadata supplies the start/end arrow and dash style so the preview also works outside the diagram SVG.
- No match: show `No matching relationship`. Enter does nothing.
- Footer `.relation-picker-description`: the description of the highlighted type.
- Highlight: index into the flat visible list. It resets to 0 when the query changes. ArrowDown and ArrowUp wrap. Hovering an option highlights it. Call `onPreview(highlighted?.type ?? null)` whenever the highlighted type changes (`useEffect`).
- Root `onKeyDown`: always `e.stopPropagation()`, so the editor's document `keydown` (undo, Enter, Escape) never sees picker keys. Enter → `onPick(highlighted)`. Escape → `onCancel()`.
- Option `onMouseDown={e => e.preventDefault()}` keeps focus in the input. `onClick` → `onPick(type)`.
- A `useEffect` adds a **bubble-phase** `pointerdown` listener on `document` that calls `onCancel()` when the target is outside the root. Remove it on unmount.

Styles in `src/index.scss` (plain global class names, so tests can query them):
```scss
.relation-picker { position: fixed; z-index: 1000; width: 260px; max-height: 320px; display: flex; flex-direction: column;
  background: #fff; border: 1px solid #bbb; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,.2); font-size: 12px; }
.relation-picker-header { padding: 4px 8px; color: #555; }
.relation-picker input { margin: 0 8px 4px; }
.relation-picker-list { overflow-y: auto; }
.relation-picker-group { padding: 4px 8px 2px; font-size: 10px; font-weight: 600; color: #777; text-transform: uppercase; }
.relation-picker [role=option] { display: flex; align-items: center; gap: 6px; padding: 2px 8px; cursor: pointer; }
.relation-picker [role=option][aria-selected=true] { background: #ccf; }
.relation-picker-description { border-top: 1px solid #eee; padding: 4px 8px; min-height: 2.5em; color: #444; }
```

### Tests: new `src/RelationPicker.spec.tsx`

Setup: `(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;`. Render with `createRoot` from `react-dom/client` inside `act` from `react`, into a `div` appended to `document.body`. Use `jest.fn()` for the callbacks. To type into a controlled input:
```ts
const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
act(() => { setValue.call(input, 'serv'); input.dispatchEvent(new Event('input', { bubbles: true })); });
```
Send keys with `input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))` inside `act`. Use the five Customer → Handle Claim types.

- `groups the Customer to Handle Claim types under Structural, Dependency, and Dynamic`: the group labels are `['Structural','Dependency','Dynamic']`. The option `data-type` order is the input order. The first option is selected. `onPreview` was last called with `AssignmentRelationship`. The footer shows Assignment's description. The header is `Customer → Handle Claim`.
- `filters by search text and hides empty groups`: `serv` → only `ServingRelationship`, groups `['Dependency']`. `zzz` → no options, text `No matching relationship`, and Enter does not call `onPick`.
- `arrow keys move the highlight and Enter picks it`: ArrowDown → `ServingRelationship` selected and previewed. ArrowUp twice → wraps to `FlowRelationship`. Enter → `onPick('FlowRelationship')`.
- `Escape cancels and the key does not reach the document`: a `document` keydown spy is not called. `onCancel` is called once.
- `clicking an option picks it and a pointerdown outside cancels`.

Done when: `npm test` passes.

---

## Phase 5: wire the shell, export, browser test

### 5.1 `src/ArchiEditor.tsx`

- Add `connectionRequest?: ConnectionRequest` to `ArchiEditorState`. Do not touch `componentWillMount`.
- In `displayDiagram`, right after `new DiagramEditor(...)`: `this.diagramEditor.onConnectionRequest = request => this.setState({ connectionRequest: request });`. The existing `this.diagramEditor?.dispose()` already cancels, which sets it to `null`.
- In `render()`, after the grid:
```tsx
{this.state.connectionRequest && <RelationPicker
  key={this.state.connectionRequest.sourceId + '>' + this.state.connectionRequest.targetId}
  sourceName={...} targetName={...} relationshipTypes={...}
  x={this.state.connectionRequest.clientX} y={this.state.connectionRequest.clientY}
  onPreview={type => this.diagramEditor.previewConnectionType(type)}
  onPick={type => this.diagramEditor.createConnection(this.state.connectionRequest.sourceId, this.state.connectionRequest.targetId, type)}
  onCancel={() => this.diagramEditor.cancelConnection()} />}
```
  The shell never sets `connectionRequest` to `null` itself. The editor's callback does it, so there is one source of truth.
- `getCleanedSvgForExport`: also remove `g.connectorHandle` and `g.connectPreview` from the clone.

### 5.2 Browser tests in `e2e/browser-only.spec.ts`

- `connects Customer to Handle Claim from the connector handle`: `goto('/#5')`. Count `#svgTarget svg g.con path.Serving.Relationship` (`before`). `hover()` on `[id="3788"]`, wait for `g.connectorHandle circle`, and take its `boundingBox()`. Take the `boundingBox()` of `[id="3776"]`. Use `mouse.move` to the handle centre, `mouse.down`, then `mouse.move(box.x + 20, box.y + 8, { steps: 5 })` (inside Handle Claim, above its nested children), then `mouse.up`. Wait for `.relation-picker`. `keyboard.type('serv')`, press `Enter`. Expect the picker to be gone and the count to be `before + 1`. Press `Control+z` and expect `before`.
- `Escape closes the relationship picker without adding a connection`: the same drag, then `Escape`. The picker is gone, the count is unchanged, and there is no `g.connectPreview`.

Done when: `npm test`, `npm run build`, `npm run lint`, and `npx playwright test` pass. Also try it by hand in `npm run dev`: hover, select, drag, red invalid feedback, search, arrows, Enter, Escape, Ctrl+Z, Ctrl+Y.

---

## Phase 6: wiki (same change as the behavior; required by AGENTS.md)

- New `wiki/behavior/connect-elements.md` in the style of the existing pages. It is Given / When / Then for each new jsdom test, with the exact `it(...)` names and the file names (`src/diagram-editor.spec.ts`, `src/relationship-rules.spec.ts`, `src/RelationPicker.spec.tsx`). State that the valid types come from Archi's matrix. State that Access previews without an arrowhead because of the known renderer defect (not a test). Do not list methods or describe classes.
- `wiki/index.md`:
  - add `- [Connect elements](behavior/connect-elements.md)` under Behavior;
  - change the sentence to "five action classes (`EditMoveAction`, `EditConnectionAction`, `EditEditAction`, `EditAddRemoveElement`, `EditAddRemoveConnection`) and six `ChangeAction` values (`Move`, `Resize`, `Connection`, `Edit`, `AddRemoveElement`, `AddRemoveConnection`)".
- `wiki/behavior/browser-only.md`: add two table rows for the Playwright tests. Add a row "Connector handle hover styling | No test. It is CSS." if you add any `:hover` CSS.
- `wiki/log.md`: append a dated entry (do not edit old entries) listing the new spec files, the vendored `src/relationships.xml` (Archi, MIT), and the new change type.
- Check the schema lint rules by hand: no orphan page, every test name on a page exists as an `it(...)`.

---

## Pitfalls (read before coding)

1. **Entity type prefixes.** Loaded concepts use `BusinessRole`. Palette-added concepts use `archimate:BusinessRole`. Always pass through `conceptType()`. New relationships use the unprefixed form (`ServingRelationship`), like loaded ones, so the renderer's class rule works.
2. **Do not shallow-clone the relationship** (`{...entity}` loses the `Relationship` prototype, so `instanceof` fails and `relationshipsById` is skipped). Add the same instance.
3. **`sourceConnections = []`** on the new `ArchiSourceConnection`, or `descendantsWithSourceConnections` crashes.
4. **The handle is not inside `g.element`**. Without the early branch in `onPointerDown`, a click on it deselects everything and can start nothing. Without `pointer-events: none` on the preview path and the handle while connecting, the browser reports the preview as the `pointerup` target and no element is found.
5. **Picker keys must not reach the editor.** The editor listens to `keydown` on `document`. Ctrl+Z in the search box would undo, and Enter would hit `targetElement.classList` on `null` in `onKeyDown`. The picker's `stopPropagation` prevents both. Do not "fix" `onKeyDown` beyond the two lines in 3.4.
6. **Nothing touches the model before the pick.** No `startChange`/`updateChange` for the drag. History must not get an entry for a cancelled or invalid drop.
7. **Existing tests must stay unchanged.** In particular `inserts a bend on connection 3812 ...` relies on `onPointerDown` reaching `editConnectionStart`. Your new branch only fires for `g.connectorHandle`.
8. **`targetConnections`**: Archi writes it on the target `child`. Keep it in sync on add, undo, and redo, or Archi may drop the connection when it opens the file.
9. **ChangeAction numbering**: append the new value; never insert in the middle.
10. **Do not wire `save()`, do not touch `componentWillMount`, do not delete `ProjectTools`, do not fix the Access class typo.**

## Acceptance checklist

- [ ] Hovering a connectable element shows the handle. Selection keeps it. Groups and notes have none.
- [ ] Dragging shows a preview. A valid target gets green feedback and the line snaps to it. An invalid target or the source gets red feedback.
- [ ] Release on an invalid target or empty canvas: nothing happens, and there is no history entry.
- [ ] Release on a valid target opens the picker near the line midpoint, showing only the allowed types, grouped, searchable, with descriptions and an arrowhead preview. The canvas line previews the highlighted type.
- [ ] Escape (during the drag or in the picker), a click outside, or changing the diagram cancels with no model change.
- [ ] A pick creates the relationship in the model and XML (relations folder), the `sourceConnection`, `targetConnections`, and the SVG line.
- [ ] One Ctrl+Z removes all of it. Ctrl+Y restores it. A reparse of the XML matches each state.
- [ ] `npm test`, `npm run build`, `npm run lint`, and `npx playwright test` pass. The wiki pages and log are updated in the same change.
