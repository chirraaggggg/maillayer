import { describe, expect, test } from "bun:test";

import { context, message } from "../test-support/adapter-fixtures.js";
import { createEmailClient } from "./core.js";
import { EmailValidationError } from "./errors.js";
import { resend } from "./resend.js";
import { memoryAdapter } from "./testing.js";
import type { EmailAddress, EmailMessage } from "./types.js";

const validAddresses: readonly EmailAddress[] = [
  "user@example.com",
  "User Example <user@example.com>",
  { email: "user@example.com", name: "User Example" },
  "user+welcome@example.co.uk",
  "user.name@sub.example.com",
  "o'neil+tag_u@example.museum",
  "üser@example.com",
  "user@example.xn--p1ai",
];

const malformedAddresses: readonly EmailAddress[] = [
  "not-an-email",
  "user@",
  "@example.com",
  "user@example",
  "user@@example.com",
  "two words@example.com",
  "user@exa mple.com",
  "user@example..com",
  "user@.example.com",
  "user@example.com.",
  ".user@example.com",
  "user.@example.com",
  "user@-example.com",
  "user@example-.com",
  "Name <not-an-email>",
  "Broken <user@example.com",
  '"user name"@example.com',
  { email: "", name: "Nobody" },
  { email: "user(at)example.com", name: "Nobody" },
];

const addressFields = ["from", "to", "cc", "bcc", "replyTo"] as const;

function withAddress(field: (typeof addressFields)[number], address: EmailAddress): EmailMessage {
  if (field === "from") {
    return { ...message, from: address };
  }

  return { ...message, [field]: address };
}

describe("message address validation", () => {
  const client = createEmailClient({ adapters: [memoryAdapter()] });

  for (const address of validAddresses) {
    test(`accepts ${JSON.stringify(address)}`, async () => {
      for (const field of addressFields) {
        await expect(client.validate(withAddress(field, address))).resolves.toMatchObject({
          adapter: "memory",
        });
      }
    });
  }

  for (const address of malformedAddresses) {
    test(`rejects ${JSON.stringify(address)}`, async () => {
      for (const field of addressFields) {
        await expect(client.validate(withAddress(field, address))).rejects.toBeInstanceOf(
          EmailValidationError,
        );
      }
    });
  }

  test("reports the offending address and field", async () => {
    await expect(client.validate(withAddress("cc", "oops"))).rejects.toThrow(
      'Email message cc address "oops" is not a valid email address.',
    );
  });

  test("enforces length limits without rejecting boundary values", async () => {
    const maxLocalPart = `${"a".repeat(64)}@example.com`;
    const overLocalPart = `${"a".repeat(65)}@example.com`;
    const maxTotalLength = `${"a".repeat(64)}@${"b".repeat(63)}.${"b".repeat(63)}.${"b".repeat(61)}`;
    const overTotalLength = `${"a".repeat(64)}@${"b".repeat(63)}.${"b".repeat(63)}.${"b".repeat(62)}`;

    expect(maxTotalLength.length).toBe(254);
    expect(overTotalLength.length).toBe(255);

    await expect(client.validate(withAddress("to", maxLocalPart))).resolves.toMatchObject({
      adapter: "memory",
    });
    await expect(client.validate(withAddress("to", maxTotalLength))).resolves.toMatchObject({
      adapter: "memory",
    });
    await expect(client.validate(withAddress("to", overLocalPart))).rejects.toThrow(
      "is not a valid email address",
    );
    await expect(client.validate(withAddress("to", overTotalLength))).rejects.toThrow(
      "is not a valid email address",
    );
  });

  test("client send rejects a malformed recipient before any adapter runs", async () => {
    const adapter = memoryAdapter();

    const sending = createEmailClient({ adapters: [adapter] });

    await expect(sending.send(withAddress("to", "not-an-email"))).rejects.toBeInstanceOf(
      EmailValidationError,
    );
    expect(adapter.raw.sent.length).toBe(0);
  });

  test("built-in adapters reject malformed addresses before issuing a request", async () => {
    let requests = 0;

    const adapter = resend({
      apiKey: "re_test_key",
      fetch: async () => {
        requests += 1;

        return new Response(JSON.stringify({ id: "res_123" }), {
          headers: { "content-type": "application/json" },
        });
      },
    });

    await expect(adapter.send(withAddress("to", "not-an-email"), context)).rejects.toBeInstanceOf(
      EmailValidationError,
    );
    expect(requests).toBe(0);
  });
});
