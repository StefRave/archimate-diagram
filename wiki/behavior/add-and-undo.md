# Add and undo

Tests in `src/diagram-editor.spec.ts`. History keys are Ctrl only, not Meta.

## Add

Given a Business Actor added at (120, 120), when it is dragged, then it is at (156, 156). One Ctrl+Z removes the move and the add, because the move is chained. Ctrl+Y restores (156, 156).

Test: `adds a Business Actor at the pointer and undo and redo that placement`

Parsing the document after the drag finds the actor at (156, 156). After Ctrl+Z the parsed file does not contain it. After Ctrl+Y it is back at (156, 156).

## Short pointer move

Given Customer, when the pointer travels less than 5 units, then Customer does not move.

Test: `does not move an element when the pointer travels less than 5`
