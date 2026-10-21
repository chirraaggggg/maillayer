---
"@maillayer/core": patch
---

Fix the CommonJS root entrypoint. `require("@maillayer/core")` previously loaded a bundle whose exports referenced undefined module bindings and threw `ReferenceError` on the first property access; every export now resolves correctly. The build bundles re-export barrels through a shim and loads each emitted `.cjs` with every export touched, and the tarball smoke test now reads every export of every subpath instead of only calling `require()`.
