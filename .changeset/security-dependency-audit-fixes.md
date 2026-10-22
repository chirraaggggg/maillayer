---
"@maillayer/core": patch
"@maillayer/convex-email": patch
---

Fix dependency vulnerabilities reported by `bun audit`.

- Bump `oxfmt` to `^0.67.0` (pulls patched `tinypool@2.1.2+`, clearing two critical advisories).
- Bump `vite` to `^8.2.2` in the docs app, clearing five Vite/launch-editor advisories.
- Override `fast-uri` to `3.1.9`, `compression` to `1.8.2`, and `source-map-js` to `1.2.2`
  (patch releases that satisfy their parents' existing ranges).
- No runtime dependencies change; this is a dev/tooling-only security fix.
