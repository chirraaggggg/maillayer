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
import { assertRequiredOption } from "./utils.js";

export type ElasticEmailAdapterOptions = {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
};

export function elasticemail(options: ElasticEmailAdapterOptions): EmailAdapter<"elasticemail", { baseUrl: string }> {
  assertRequiredOption("elasticemail", "apiKey", options.apiKey);

  return jsonProvider({
    name: "elasticemail",
    baseUrl: options.baseUrl ?? "https://api.elasticemail.com",
    endpoint: "/v4/email/send",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": options.apiKey,
    },
    fetch: options.fetch,
    async buildPayload(message) {
      const attachments = await base64Attachments(message);

      return {
        subject: message.subject,
        from: apiAddress(message.from),
        to: apiAddresses(message.to),
        cc: optionalApiAddresses(message.cc),
        bcc: optionalApiAddresses(message.bcc),
        replyTo: optionalSingleApiAddress("elasticemail", "replyTo", message.replyTo),
        body: [
          ...(message.text ? [{ contentType: "text/plain", content: message.text }] : []),
          ...(message.html ? [{ contentType: "text/html", content: message.html }] : []),
        ],
        tag: message.tags?.map((tag) => tag.value)?.[0],
        scheduledAt: sendAtIso(message),
        attachment: attachments?.map((attachment) => ({
          fileName: attachment.filename,
          fileContent: attachment.content,
          fileType: attachment.contentType ?? "application/octet-stream",
        })),
        headers: commonHeadersObject(message),
      };
    },
    parseResponse(body, _message, response) {
      return {
        adapter: "elasticemail",
        id: firstString(body, ["MessageID"]) ??
          firstString(body, ["id"]) ??
          (response.headers.get("x-elasticemail-message-id") ?? undefined),
        raw: body,
      };
    },
  });
}