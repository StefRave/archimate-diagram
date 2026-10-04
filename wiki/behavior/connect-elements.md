# Connect elements

## Relationship types

Given a BusinessRole and a BusinessProcess, when allowed relationship types are listed, then the choices are Assignment, Serving, Association, Triggering, and Flow in catalog order.

Test: `allows Assignment, Serving, Association, Triggering, and Flow from BusinessRole to BusinessProcess`

Given a BusinessObject and a BusinessRole, when allowed relationship types are listed, then only Association is available.

Test: `allows only Association from BusinessObject to BusinessRole`

Given a palette-created concept type with an `archimate:` prefix, when its valid relationships are checked, then it has the same choices as the unprefixed type.

Test: `reads the archimate: prefix the palette writes`

Given a Group, Note, diagram reference, Relationship, or unknown concept, when connection eligibility is checked, then it is not connectable. A BusinessRole and Junction are connectable.

Test: `treats groups, notes, and unknown types as not connectable`

Given the catalog, when its types are listed, then it has eleven types in Structural, Dependency, Dynamic, and Other groups.

Test: `lists eleven relationship types in four groups`

Valid source and target pairs come from Archi's ArchiMate relationship matrix (`src/relationships.xml`). Regenerate the compact runtime table with `python tools/generate-relationship-matrix.py` after changing the source matrix. Access has no arrowhead in the preview because the existing renderer does not determine direction without an Access mode; that behavior is not separately browser-tested.

## Handle and gesture

Given a hovered connectable Customer, when the pointer moves over it, then a connector handle appears beside it. Moving away hides the handle.

Test: `shows the connector handle next to a hovered element and hides it away from it`

Given a selected Customer, when the pointer moves away, then its connector handle remains available.

Test: `keeps the connector handle on the selected element`

Given a Group without an ArchiMate concept, when the pointer hovers over it, then no connector handle appears.

Test: `does not show a handle for a group without a concept`

Given Customer and Handle Claim, when the connector handle is dragged to Handle Claim, then a preview line and valid-target feedback appear, and the picker request contains the allowed types. The model remains unchanged until a type is picked.

Test: `offers the allowed types when Customer is dropped on Handle Claim and changes nothing yet`

Given Insurance Policy and Customer, when Insurance Policy is connected to Customer, then the picker offers only Association.

Test: `offers only Association from Insurance Policy to Customer`

Given a connection drag in progress, when Escape is pressed, then the preview is removed and the model is unchanged.

Test: `Escape cancels a connection drag and leaves the model unchanged`

Given the relationship picker is open, when Escape is pressed, then the picker request and preview are removed without changing the model.

Test: `Escape closes an open relationship request`

Given a drag from Customer, when the pointer is released on Customer itself, a Group, or an existing connection, then no connection is accepted.

Test: `does not accept the source, a group, or a connection as the target`

## Picker

Given the types allowed from Customer to Handle Claim, when the picker opens, then it groups them by relationship family, highlights the first option, describes it, and previews its direction.

Test: `groups the Customer to Handle Claim types under Structural, Dependency, and Dynamic`

Given the picker is open, when one search character is entered, then matching type labels and groups filter immediately. With two or more characters, descriptions are searchable too. Empty groups disappear, and when there are no matches Enter does not choose a type.

Test: `filters by search text and hides empty groups`

Given a highlighted relationship type, when the arrow keys are pressed, then the highlight wraps through the visible choices and updates the preview. Enter selects the highlighted type.

Test: `arrow keys move the highlight and Enter picks it`

Given the picker is open, when Escape is pressed, then the request is cancelled without sending the key to the editor.

Test: `Escape cancels and the key does not reach the document`

Given the picker is open, when a relationship type is clicked, then it is selected. A pointer press outside the picker cancels it.

Test: `clicking an option picks it and a pointerdown outside cancels`

## Model, diagram, and undo

Given Customer and Handle Claim, when a valid Serving relationship is created, then the relationship entity, XML relationship, source connection, target reference, and SVG line are added together. One undo removes them and one redo restores them.

Test: `adds a Serving relationship from Customer to Handle Claim as one undoable change`

Given Customer has other incoming diagram connections, when a new relationship is added and then undone, then those existing target references are preserved.

Test: `preserves other target connections when adding and undoing a relationship`

Given a source and target whose types do not allow the selected relation, when connection creation is attempted, then it is rejected without changing the model.

Test: `rejects a relationship type the matrix does not allow`

The editor behavior is tested in `src/diagram-editor.spec.ts`, relationship rules in `src/relationship-rules.spec.ts`, and picker behavior in `src/RelationPicker.spec.tsx`. Browser-only interaction tests are listed in [Browser only](./browser-only.md).
