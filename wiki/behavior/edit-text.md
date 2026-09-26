# Edit text

Test in `src/diagram-editor.spec.ts`.

Given Customer 3788, entity 521, when it is double-clicked and the label is set to Client, then the entity name is Client before blur. Focusout on the label div finalizes that name. Ctrl+Z and Ctrl+Y are history undo and redo. The name is the shared entity name.

Test: `renames Customer from a double-click and undoes and redoes the name`

A group has no entity id. Renaming it sets `child.name`, which is the label the grouping figure draws. Parsing the document again keeps that name.

Test: `renames a group and keeps the label after the file is parsed again`
