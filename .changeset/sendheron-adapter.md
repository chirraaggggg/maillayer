---
"@maillayer/core": minor
"@maillayer/convex-email": minor
---

Add a SendHeron adapter (`@maillayer/core/sendheron`) with native idempotency keys, `sendAt` scheduling, attachments, and a `doctor --live` check that authenticates without sending. Suppressed sends are reported as non-retryable errors. The Convex component accepts `adapter: "sendheron"` with `SENDHERON_API_KEY`.
