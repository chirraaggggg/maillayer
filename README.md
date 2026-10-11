# MailLayer

**One API. Every email provider. Fully open source.**

MailLayer is an open-source TypeScript email SDK for transactional email. Use
one typed API with the provider accounts you already own, while keeping
provider-specific configuration, retries, fallbacks, validation, and
observability in one place.

## Install

```bash
npm install @maillayer/core
```

MailLayer runs server-side on Node.js 20+ or Bun. Provider credentials stay in
your application environment and are never sent to a MailLayer service.

## Quick start

```ts
import { createEmailClient } from "@maillayer/core";
import { resend } from "@maillayer/core/resend";

const email = createEmailClient({
  adapters: [resend({ apiKey: process.env.RESEND_API_KEY! })],
});

await email.send({
  from: "Acme <hello@acme.com>",
  to: "user@example.com",
  subject: "Welcome",
  html: "<p>It works.</p>",
});
```

## Supported adapters

MailLayer includes adapters for Resend, Postmark, SendGrid, AWS SES, Mailgun,
Brevo, MailerSend, SparkPost, Mailchimp, Iterable, Loops, Plunk, Mailtrap,
Cloudflare, Unosend, Scaleway, ZeptoMail, MailPace, Sequenzy, JetEmail,
Lettermint, Lettr, Primitive, SendHeron, Helo, SMTP, and testing.

Each adapter is imported from its own `@maillayer/core/<provider>` entry point.
Provider accounts, API keys, quotas, and delivery policies remain the
developer's responsibility.

## Features

- Normalized messages with HTML, plain text, recipients, headers, and attachments
- Retry policies and fallback routes across providers
- Batch and personalized sending
- Capability validation before unsupported fields are dropped
- Hooks for logs, metrics, and traces
- Mock adapters for tests without real provider calls
- CLI commands for adapter discovery, doctor checks, and dry runs
- Optional Convex integration through `@maillayer/convex-email`

## CLI

```bash
npx --package @maillayer/core maillayer doctor --adapter resend
```

`doctor --live` authenticates with a provider without sending a message. Keep
all credentials server-side and rotate or revoke them through the provider
when needed.

## Documentation

The documentation site is in [`apps/fumadocs`](./apps/fumadocs). It covers
installation, provider setup, configuration, templates, retries, fallbacks,
validation, observability, testing, security, troubleshooting, migration, and
contributing. The planned public documentation URL is
<https://maillayer.dev/docs>.

## Telemetry

MailLayer's opt-out telemetry records only aggregate adapter and command
outcomes, counts, timing, and sanitized error metadata. It never records email
content, addresses, attachments, headers, or credentials.

Disable it with `MAILLAYER_TELEMETRY=0`, `DO_NOT_TRACK=1`, or
`createEmailClient({ telemetry: false })`. Telemetry is disabled automatically
in tests.

## Open source

MailLayer is released under the MIT License. See [`LICENSE`](./LICENSE) and
the package-specific notices for attribution and distribution terms.

- [Contributing](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

## Development

```bash
bun install
bun run lint
bun run check-types
bun run test
bun run build
```

No packages are published, no documentation is deployed, and no GitHub remote
is configured by the local development workflow.
