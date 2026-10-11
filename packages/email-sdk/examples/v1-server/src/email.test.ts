import { expect, test } from "bun:test";
import {
  createEmailClient,
  EmailAdapterError,
} from "@maillayer/core";
import {
  failingAdapter,
  memoryAdapter,
} from "@maillayer/core/testing";

const message = {
  from: "Acme <hello@acme.com>",
  to: "user@example.com",
  subject: "Welcome",
  text: "Your account is ready.",
} as const;

test("falls back only after a proven not-sent failure", async () => {
  const primary = failingAdapter(
    "primary",
    new EmailAdapterError("Rejected before acceptance", {
      adapter: "primary",
      delivery: "not_sent",
    }),
  );

  const backup = memoryAdapter("backup");

  const email = createEmailClient({
    adapters: [primary, backup],
    fallback: { adapters: ["backup"] },
    telemetry: false,
  });

  const result = await email.send(message);

  expect(result.adapter).toBe("backup");
  expect(backup.raw?.sent).toHaveLength(1);
});
