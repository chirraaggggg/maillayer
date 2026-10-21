---
"@maillayer/core": patch
---

Fix the SES adapter's field-support registry entry to include `tags`. The adapter already mapped `message.tags` to SES `EmailTags` and the docs documented it, but `SUPPORTED_MESSAGE_FIELDS.ses` omitted `tags`, so `validate` and `send` rejected messages with tags before the provider call. Messages with tags now validate and send on SES, while unsupported fields (such as `metadata` and `sendAt`) are still rejected.
