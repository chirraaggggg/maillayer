import { createEmailClient } from "@maillayer/core";
import { resend } from "@maillayer/core/resend";
import { smtp } from "@maillayer/core/smtp";

export const email = createEmailClient({
  adapters: [
    resend({ apiKey: process.env.RESEND_API_KEY! }),
    smtp({
      name: "backup",
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT ?? 587),
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    }),
  ],
  defaultAdapter: "resend",
  retry: { maxAttempts: 2 },
  fallback: {
    adapters: ["backup"],
    onUnknownDelivery: "stop",
  },
});
