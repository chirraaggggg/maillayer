---
"@maillayer/convex-email": minor
"@maillayer/core": minor
---

Bring the Convex component's adapter registry to parity with the core SDK by adding `elasticemail`, `mailjet`, `smtp2go`, and `socketlabs`. Each is configured with its documented `*_API_KEY` environment variable plus an optional inline `baseUrl`, declared in the component contract, and constructible through the component exactly like the other built-in adapters.

`@maillayer/core` also gains the matching `./mailjet`, `./smtp2go`, `./elasticemail`, and `./socketlabs` subpath exports that the documentation already referenced but the package did not export.
