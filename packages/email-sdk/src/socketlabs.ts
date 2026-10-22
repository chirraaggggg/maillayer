import { firstString, jsonProvider } from "./http.js";
import { formatAddress, formatAddresses } from "./payloads.js";
import type { EmailAdapter } from "./types.js";
import { attachmentToBase64, assertRequiredOption } from "./utils.js";

export type SocketLabsAdapterOptions = {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
};

export function socketlabs(options: SocketLabsAdapterOptions): EmailAdapter<"socketlabs", { baseUrl: string }> {
  assertRequiredOption("socketlabs", "apiKey", options.apiKey);

  return jsonProvider({
    name: "socketlabs",
    baseUrl: options.baseUrl ?? "https://api.socketlabs.com",
    endpoint: "/v2/email/send",
    headers: {
      "Content-Type": "application/json",
      "X-SMTPAPI-Key": options.apiKey,
    },
    fetch: options.fetch,
    async buildPayload(message) {
      type Personalization = {
        to: string[];
        subject: string;
        sub?: Record<string, string[]>;
      };

      const personalization: Personalization = {
        to: formatAddresses(message.to),
        subject: message.subject,
      };

      if (message.html && message.tags && message.tags.length > 0) {
        const sub: Record<string, string[]> = {};

        for (const tag of message.tags) {
          sub[tag.name] = [tag.value];
        }

        personalization.sub = sub;
      }

      return {
        inbound: false,
        from: formatAddress(message.from),
        subject: message.subject,
        personalization,
        headers: message.headers
          ? Object.entries(message.headers).reduce(
              (acc: Record<string, string>, [name, value]) => {
                acc[name] = String(value);

                return acc;
              },
              {}
            )
          : undefined,
        attach: message.attachments
          ? await Promise.all(
              message.attachments.map(async (att) => ({
                fileName: att.filename,
                fileContent: await attachmentToBase64(att),
                fileType: att.contentType ?? "application/octet-stream",
              }))
            )
          : undefined,
      };
    },
    parseResponse(body, _message, response) {
      const id = firstString(body, ["MessageID"]) ??
        firstString(body, ["id"]) ??
        (response.headers.get("x-socketlabs-message-id") ?? undefined);

      return {
        adapter: "socketlabs",
        id,
        raw: body,
      };
    },
  });
}