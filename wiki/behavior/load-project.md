# Load a project

Tests in `src/project-load.spec.ts`.

## Model identity

Given the Archisurance file, when it is loaded, then the name is Archisurance, the version is 4.0.0, and the id is 11f5304f.

Test: `reads the model name, version, and id`

## Views

Given that file, when the views are listed, then there are 17 diagrams and `diagrams[0]` is Archimate View 3641.

Test: `lists the 17 views in document order`

## Relationship 693

Given that file, when relationship 693 is read, then its type is AccessRelationship, its name is `create/ update`, its source is 564, and its target is 674.

Test: `loads AccessRelationship 693 from Register to Customer File`

## Business Process View

Given diagram 3761, when its objects are read, then Customer 3788 is at (200, 663, 120, 60), Register 3779 is a child of Handle Claim 3776, and object 3786 has bounds (190, 310, 165, 58).

Test: `loads Business Process View nesting and default bounds`

## Connection on load

Given Customer 3788, when source connection 3812 is read, then its bend is (-180, -1).

Test: `loads source connection 3812 with one bend point`

## Zip

Given a zip whose `model.xml` is an Archi model, when the bytes are loaded, then that diagram is the project.

Test: `returns the diagram stored in the archive`
