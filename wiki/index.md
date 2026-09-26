# ArchiMate diagram editor

The app loads an Archi file, draws one diagram as SVG, and edits that diagram with the pointer. A file is plain XML, or a zip that contains `model.xml`.

`npm run dev` serves the app on port 4000. `npm test` runs Jest. `npm run build` typechecks and builds.

`ArchiEditor.componentWillMount` loads the project. The model is `src/archimate-model.ts`. `ProjectTools` is not imported by the shell; leave it. `save()` is not wired to a button. It serializes `project.element.ownerDocument`, the original XML, not the session.

There are four action classes (`EditMoveAction`, `EditConnectionAction`, `EditEditAction`, `EditAddRemoveElement`) and five `ChangeAction` values (`Move`, `Resize`, `Connection`, `Edit`, `AddRemoveElement`). Resize uses the move action.

## Behavior

- [Load a project](behavior/load-project.md)
- [Render a diagram](behavior/render-diagram.md)
- [Move and resize](behavior/move-and-resize.md)
- [Bend a connection](behavior/bend-connection.md)
- [Edit text](behavior/edit-text.md)
- [Add and undo](behavior/add-and-undo.md)
- [Browser only](behavior/browser-only.md)
