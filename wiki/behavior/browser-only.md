# Browser only

No jsdom test covers these. Do not invent one by mocking the browser.

- Drop and nest uses `g.element:hover`. These Jest runs do not match `:hover`.
- A non-identity `getScreenCTM`. The Jest setup uses an identity matrix.
- Typing inside a `foreignObject`. The editor text test sets the label; it does not type.
- Firefox newline. `onInput` removes a node, then assigns `newText.substring(0, newText.length)`, which does not change the string, so the extra break is stored. Not a passing test.
- Palette hover is CSS (`.palette:hover`), not an editor test.
