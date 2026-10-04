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
