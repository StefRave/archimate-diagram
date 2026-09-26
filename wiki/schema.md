# Schema

Page types:

- **index** — `wiki/index.md`. What the app does, how to run it, and a link to every behavior page.
- **behavior** — `wiki/behavior/*.md`. Given / When / Then, plus the `it(...)` name that locks it.
- **log** — `wiki/log.md`. Append-only. Do not rewrite an old entry.

A behavior change updates the page and the test together.

Lint failures:

- An orphan page: not linked from the index, or a link to a page that is not there.
- A test name on a page that is not an `it(...)` in the tree.
- A claim of locked behavior with no test. A known defect or a browser-only note must say it is not a test.
- A page that restates a function, or that lists the methods of a class.
