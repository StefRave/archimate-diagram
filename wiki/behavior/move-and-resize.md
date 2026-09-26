# Move and resize

Tests in `src/diagram-editor.spec.ts`, on Business Process View. Snap is 12 unless Ctrl is held. A drag starts only after 5 diagram units. A `:hover` drop is not what these jsdom tests lock.

## Move Customer

Given Customer 3788 at (200, 663, 120, 60), when it is dragged and released, then it is at (240, 684) and the position readout is gone.

Test: `moves Customer on the grid and clears the position readout`

## Lift Register

Given Register 3779 inside Handle Claim 3776, when it is lifted onto the diagram, then it is at (216, 192) with no parent. Ctrl+Z restores parent 3776 and bounds (20, 20).

Test: `lifts Register onto the diagram and undo nests it again`

## East resize

Given Customer selected, when the east handle is dragged with Ctrl, then the width is 156. A further drag with Ctrl floors the width at 12.

Test: `resizes Customer from the east handle and floors the width at 12`
