# Render a diagram

Tests in `src/diagram-render.spec.ts`.

## Archimate View

Given Archimate View 3641, when it is drawn, then `g#3657` has transform `translate(555, 304)`, its text includes Application Structure View, and the svg element viewBox is `2 2 889 532`.

Test: `draws Archimate View reference 3657 and the padded viewBox`

## Business Process View

Given Business Process View 3761, when it is drawn, then the nested groups keep their transforms and texts: Customer `translate(200, 663)`, Register under Handle Claim at `translate(20, 20)`, and the customer-file object at `translate(190, 310)`.

The path class is `Access Relationship` and `Assignment Relationship`. `addConnectionPath` compares `entityType` to `AccessRelationShip` (capital S). The file stores `AccessRelationship`, so that branch does not run. That typo is a known defect. The class the test sees is not the desired class.

Test: `draws Business Process View nesting and connection classes`
