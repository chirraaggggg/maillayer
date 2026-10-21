# MailLayer — Agent Guide

Machine-facing guide for AI agents and coding assistants. MailLayer is an
open-source **TypeScript SDK** (npm: `@maillayer/core`) that sends
transactional email through 30 provider API adapters plus SMTP behind one typed
`send()` call. It is
a library you install into an app — not a hosted API or a service you sign up
for. There are no API keys to obtain from us; you bring the provider credentials
the app already has.

- Docs: https://maillayer.dev/docs
- Machine index: https://maillayer.dev/llms.txt and https://maillayer.dev/llms-full.txt
- Source: https://github.com/chirraaggggg/maillayer
- Package: https://www.npmjs.com/package/@maillayer/core

## When to use MailLayer

Use it when a TypeScript/JavaScript (Node, Bun, or edge/Workers) app needs to:

- Send transactional email (receipts, verifications, alerts, password resets).
- Send through one provider but keep the option to switch or add providers later
  without rewriting send sites.
- Route across multiple providers with retries and compatible fallbacks.
- Give an LLM agent a guarded `send_email` tool that goes through the same
  validated pipeline as the rest of the app.

## When NOT to use it

- You need a marketing/campaign email builder or a CRM — this is transactional sending.
- You are not in a TypeScript/JavaScript runtime.
- You want a hosted email API with its own dashboard and billing — MailLayer wraps
  providers you already pay (Resend, SES, Postmark, SMTP, …); it is not one itself.

## Install and send

```bash
npm install @maillayer/core
```

```ts
import { createEmailClient } from "@maillayer/core";
import { resend } from "@maillayer/core/resend";

const email = createEmailClient({
  adapters: [resend({ apiKey: process.env.RESEND_API_KEY! })],
  retry: { maxAttempts: 2 },
});

await email.send({
  from: "Acme <hello@acme.com>",
  to: "user@example.com",
  subject: "Welcome",
  text: "Your account is ready.",
});
```

Adapters import from their own entry point (`@maillayer/core/resend`,
`/smtp`, `/ses`, …). Supported providers: Resend, Postmark, SendGrid, AWS SES,
Mailgun, MailerSend, Brevo, Mailchimp Transactional, SparkPost, Mailtrap,
Cloudflare Email Sending, Unosend, Scaleway, ZeptoMail, MailPace, Iterable,
Loops, Sequenzy, JetEmail, Primitive, Lettermint, Lettr, Plunk, SMTP, Microsoft
Graph, SendHeron, Helo, Mailjet, SMTP2GO, Elastic Email, and SocketLabs.

## Give an agent a send tool

`createEmailAgentTools(client)` from `@maillayer/core/agent-tools` returns a
`send_email` tool (name, description, JSON-Schema parameters, `execute`) that maps
onto any framework's tool format. `execute` runs the full client pipeline —
validation, retries, fallbacks, plugins, hooks. See
https://maillayer.dev/docs/getting-started/agent-skill.

## The maillayer skill

A skill for coding agents lives at
https://github.com/chirraaggggg/maillayer/blob/main/skills/maillayer/SKILL.md.
Install it with:

```bash
npx skills add chirraaggggg/maillayer --skill maillayer
```

## Machine-readable endpoints

Predictable URLs for programmatic discovery:

- Agent discovery: https://maillayer.dev/.well-known/agent.json
- Authentication model: https://maillayer.dev/auth.md (there is no hosted API or platform credential to obtain)
- Per-provider credentials: https://maillayer.dev/docs/getting-started/credentials (every adapter's config field + env var in one table)
- Markdown homepage: https://maillayer.dev/index.md
- Docs-scoped index: https://maillayer.dev/docs/llms.txt
- API catalog (RFC 9727): https://maillayer.dev/.well-known/api-catalog
- Schema feed (NLWeb): https://maillayer.dev/schemamap.xml → https://maillayer.dev/feeds/docs.jsonl
- Skill descriptor: https://maillayer.dev/.well-known/agent-skills

Append `.md` to any documentation URL (for example
`/docs/getting-started/quickstart.md`) to fetch its raw markdown, or pass
`?mode=agent` to the homepage for this guide.

## Constraints for agents

- Keep all provider credentials in environment variables. Never hardcode or log
  API keys, SMTP passwords, raw tokens, full message bodies, or recipient lists.
- Do not add Nodemailer — the SDK ships its own SMTP transport.
- Only configure a fallback adapter that supports the same fields as the primary;
  check https://maillayer.dev/docs/adapters/field-support first.
- Use idempotency keys for externally visible sends that may be retried.
- Gate agent-initiated sends behind explicit human approval; the tool description
  asks the model to confirm, but you must enforce it.
- Run the CLI `maillayer doctor` and `send --dry-run` before any live send, and do
  not send real external mail without the user's approval.
