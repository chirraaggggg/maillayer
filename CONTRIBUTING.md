# Contributing to MailLayer

Thanks for helping improve MailLayer. Please open an issue for a bug or
proposal before making a large change, and include a focused pull request
description with tests for behavior changes.

## Development

MailLayer uses Bun and TypeScript.

```bash
bun install
bun run lint
bun run check-types
bun run test
bun run build
```

Provider tests should use the test adapters or request stubs. Do not add real
API keys, customer data, or credentials to issues, examples, fixtures, or
commits.

## Pull requests

Keep changes focused, update the relevant documentation, and explain any
provider-specific behavior. New adapters must include capability metadata,
configuration documentation, unit tests, and an entry in the provider registry.

By contributing, you agree that your contribution is provided under the
project's MIT License.
