# Log

## 2026-09-26

Ingested the load, render, and editor tests.

- `src/project-load.spec.ts`
- `src/diagram-render.spec.ts`
- `src/diagram-editor.spec.ts`

Renamed `src/greeter.ts` to `src/archimate-model.ts` and removed gesture logging.

## 2026-09-26

Added Chromium tests for a group drop, a scaled drag, and typing. The Firefox newline is still not a test.

- `e2e/browser-only.spec.ts`

## 2026-09-26

Edits write the XML element the object already holds. A group rename updates the label that is drawn. Both are locked by `src/diagram-editor.spec.ts`.

## 2026-10-04

Moved the UI shell from Preact to React 19. `componentWillMount` still loads the project. No behavior change; the jsdom and Chromium tests are unchanged.

## 2026-10-04

Added drag-to-connect from diagram elements, a searchable ArchiMate relationship picker, and one-step connection undo/redo. The relationship validity table is based on Archi's MIT-licensed model matrix; `src/relationship-matrix.ts` is the compact runtime form generated from `src/relationships.xml`.

- `src/relationship-rules.spec.ts`
- `src/diagram-editor.spec.ts`
- `src/RelationPicker.spec.tsx`
- `e2e/browser-only.spec.ts`
