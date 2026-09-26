# Bend a connection

Test in `src/diagram-editor.spec.ts`.

Given connection 3812 with bend [(-180, -1)], when the first circle that is not an end is dragged, then the bends are [(-116, -57), (-180, -1)]. The source stays 3788 and the target stays 3783. The path `d` is not locked. Undo restores [(-180, -1)].

Test: `inserts a bend on connection 3812 and undo restores the single point`

Parsing the document after the insert, and again after undo, yields those same bend points.
