# Browser only

No jsdom test covers these. Do not invent one by mocking the browser. Chromium tests are in `e2e/browser-only.spec.ts`.

| Behavior | Test |
| --- | --- |
| Drop onto a Group | `drops 4079 onto group 4065 and nests it` |
| Scaled `getScreenCTM` | `drags Customer by the diagram delta under scale(2)` |
| Typing in a `foreignObject` | `types a new Customer label from a double-click` |
| Firefox newline | No test. `onInput`'s `substring` is a no-op, so the extra break is stored. |
| Palette hover | No test. It is CSS (`.palette:hover`), not an editor test. |
