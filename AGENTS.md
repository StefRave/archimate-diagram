# Agent rules

Read [wiki/index.md](wiki/index.md) before editing.

Run `npm test`. A behavior change updates the wiki page and the test in the same change.

Do not add an abstraction the current code can already express. Do not document class structure. Do not mock private methods. Do not rewrite `componentWillMount`. Do not delete `ProjectTools`. Do not wire `save()` in an unrelated change. `archimate-model.ts` is the model.
