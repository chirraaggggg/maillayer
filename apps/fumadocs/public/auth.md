# MailLayer — Authentication for Agents

This document tells an AI agent how authentication works for MailLayer. The short
version: **there is nothing to authenticate against here.**

MailLayer is an open-source TypeScript library (npm: `@maillayer/core`)
that you install into an application. It is **not** a hosted API and not a service
you sign up for, so `maillayer.dev` issues no API keys, tokens, or OAuth
credentials. Do not probe this origin for `WWW-Authenticate`, `agent_auth`,
`register_uri`, an authorization server, or an `id-jag` / `identity_assertion`
handshake — none exist, by design.

## Discover

The credentials MailLayer uses are **the email provider's own credentials**
(Resend, Postmark, SendGrid, Mailgun, AWS SES, SMTP, …), which the host
application already holds. The SDK is a typed client in front of those providers.

## Pick a method

There is one method: configure each adapter with the provider key the app owns.

- Read the provider key from an environment variable.
- Pass it to the adapter at construction time.
- The SDK never asks `maillayer.dev` for anything at runtime.

## Use the credential

```ts
import { createEmailClient } from "@maillayer/core";
import { resend } from "@maillayer/core/resend";

// RESEND_API_KEY is the provider's credential, supplied by the app — not by us.
const email = createEmailClient({
  adapters: [resend({ apiKey: process.env.RESEND_API_KEY! })],
});
```

To obtain a provider key, follow that provider's own dashboard and docs (for
example, create a Resend API key in the Resend dashboard). MailLayer plays no part
in issuing or exchanging it.

## Errors

Authentication failures surface as the **provider's** error (for example an
invalid-API-key response from Resend or SES), normalized by the SDK and thrown
from `send()`. There is no MailLayer auth endpoint to return `401` or a
`resource_metadata` hint, because there is no MailLayer server in the request
path.

## Revocation

Rotate or revoke credentials in the provider's dashboard, then update the
environment variable the app reads. MailLayer holds no session or token state to
revoke.

## Safety for agents

- Keep all provider keys in environment variables. Never hardcode or log API
  keys, SMTP passwords, raw tokens, full message bodies, or recipient lists.
- Gate any agent-initiated send behind explicit human approval.
- Run `maillayer doctor` and `send --dry-run` before any live send.

## Per-provider credentials

Each provider's required credential and environment variable is listed in one
place at https://maillayer.dev/docs/getting-started/credentials (append `.md` for
markdown: https://maillayer.dev/docs/getting-started/credentials.md). For example:
Resend uses `apiKey` from `RESEND_API_KEY`, AWS SES uses `accessKeyId` /
`secretAccessKey` / `region`, and SMTP uses `host` / `port` / `auth.user` /
`auth.pass`.

See also: the agent guide at https://maillayer.dev/agents.md and the machine
index at https://maillayer.dev/llms.txt.
