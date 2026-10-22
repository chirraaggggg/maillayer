---
"@maillayer/core": patch
---

Reject missing or empty adapter credentials at construction and validate email address syntax in the shared message layer.

Every built-in adapter factory now throws `EmailValidationError` when a required credential (or required option such as Mailgun's `domain` or SES's `region`) is missing, empty, or whitespace-only, naming the adapter and option without echoing the value. `client.validate()` and every send now also reject malformed `from`, `to`, `cc`, `bcc`, and `replyTo` addresses with a practical syntax check before any provider request. The address check is a typo guard, not a full RFC 5322 parser: display-name strings and `{ email, name }` objects are validated by their extracted address.
