import { firstString, jsonProvider } from "./http.js";
import {
  base64Attachments,
  commonHeadersObject,
  formatAddress,
  formatAddresses,
  optionalStringAddresses,
  sendAtIso,
} from "./payloads.js";
import type { EmailAdapter } from "./types.js";

export type Smtp2goAdapterOptions = {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
};

export function smtp2go(options: Smtp2goAdapterOptions): EmailAdapter<"smtp2go", { baseUrl: string }> {
  return jsonProvider({
    name: "smtp2go",
    baseUrl: options.baseUrl ?? "https://api.smtp2go.com",
    endpoint: "/v3/email/send",
    headers: {
      "Content-Type": "application/json",
      "api-key": options.apiKey,
    },
    fetch: options.fetch,
    async buildPayload(message) {
      const attachments = await base64Attachments(message);

      return {
        to: formatAddresses(message.to).join(","),
        sender: formatAddress(message.from),
        subject: message.subject,
        textContent: message.text ?? "",
        htmlContent: message.html ?? "",
        cc: optionalStringAddresses(message.cc),
        bcc: optionalStringAddresses(message.bcc),
        replyTo: optionalStringAddresses(message.replyTo)?.[0],
        headers: commonHeadersObject(message),
        scheduledSendTime: sendAtIso(message),
        attachments: attachments?.map((attachment) => ({
          fileName: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType ?? "application/octet-stream",
        })),
      };
    },
    parseResponse(body, _message, response) {
      const id = firstString(body, ["messageId"]) ??
        firstString(body, ["id"]) ??
        (response.headers.get("x-smtp-message-id") ?? undefined);

      return {
        adapter: "smtp2go",
        id,
        raw: body,
      };
    },
  });
}