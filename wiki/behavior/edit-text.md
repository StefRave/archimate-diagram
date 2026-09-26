# Edit text

Test in `src/diagram-editor.spec.ts`.

Given Customer 3788, entity 521, when it is double-clicked and the label is set to Client, then the entity name is Client before blur. Focusout on the label div finalizes that name. Ctrl+Z and Ctrl+Y are history undo and redo. The name is the shared entity name.

Test: `renames Customer from a double-click and undoes and redoes the name`

Group rename does not stick. That is a known defect, not locked by a test. `EditEditAction` writes `element.content` when there is no entity id. The grouping draw uses `child.name`.
