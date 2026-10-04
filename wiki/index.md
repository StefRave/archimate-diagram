# ArchiMate diagram editor

The app loads an Archi file, draws one diagram as SVG, and edits that diagram with the pointer. A file is plain XML, or a zip that contains `model.xml`.

`npm run dev` serves the app on port 4000. `npm test` runs Jest. `npm run build` typechecks and builds.

`ArchiEditor.componentWillMount` loads the project. The model is `src/archimate-model.ts`. `ProjectTools` is not imported by the shell; leave it. `save()` is not wired to a button. It serializes `project.element.ownerDocument`. Edits update that same XML element, so a parsed copy matches the session.

There are five action classes (`EditMoveAction`, `EditConnectionAction`, `EditEditAction`, `EditAddRemoveElement`, `EditAddRemoveConnection`) and six `ChangeAction` values (`Move`, `Resize`, `Connection`, `Edit`, `AddRemoveElement`, `AddRemoveConnection`). Resize uses the move action.

## Behavior

- [Load a project](behavior/load-project.md)
- [Render a diagram](behavior/render-diagram.md)
- [Move and resize](behavior/move-and-resize.md)
- [Bend a connection](behavior/bend-connection.md)
- [Edit text](behavior/edit-text.md)
- [Add and undo](behavior/add-and-undo.md)
- [Connect elements](behavior/connect-elements.md)
- [Browser only](behavior/browser-only.md)
