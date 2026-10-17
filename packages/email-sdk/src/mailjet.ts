import { firstString, jsonProvider } from "./http.js";
import {
  apiAddress,
  apiAddresses,
  base64Attachments,
  commonHeadersObject,
  optionalApiAddresses,
  optionalSingleApiAddress,
  sendAtIso,
} from "./payloads.js";
import type { EmailAdapter } from "./types.js";

export type MailjetAdapterOptions = {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
};

export function mailjet(options: MailjetAdapterOptions): EmailAdapter<"mailjet", { baseUrl: string }> {
  return jsonProvider({
    name: "mailjet",
    baseUrl: options.baseUrl ?? "https://api.mailjet.com",
    endpoint: "/v3.1/send",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": options.apiKey,
    },
    fetch: options.fetch,    async buildPayload(message) {
      const attachments = await base64Attachments(message);

      return {
        Messages: [
          {
            From: apiAddress(message.from),
            To: apiAddresses(message.to),
            Cc: optionalApiAddresses(message.cc),
            Bcc: optionalApiAddresses(message.bcc),
            ReplyTo: optionalSingleApiAddress("mailjet", "replyTo", message.replyTo),
            Subject: message.subject,
            TextPart: message.text ?? "",
            HTMLPart: message.html ?? "",
            Tags: message.tags?.map((tag) => tag.value),
            Headers: commonHeadersObject(message),
            Attachments: attachments?.map((attachment) => ({
              ContentType: attachment.contentType ?? "application/octet-stream",
              Base64Content: attachment.content,
              Filename: attachment.filename,
            })),
            SendAt: sendAtIso(message),
          },
        ],
      };
    },

    parseResponse(body, _message, response) {
      return {
        adapter: "mailjet",
        id: firstString(body, ["id"]) ??
          (response.headers.get("x-mailjet-message-id") ?? undefined),
        raw: body,
      };
    },
  });
}