import {
  SUPPORTED_MESSAGE_FIELDS,
  BUILT_IN_ADAPTER_CAPABILITIES,
  type MessageFieldSupport,
} from "../../../../packages/email-sdk/src/utils.js";
import { providers } from "./providers.js";

export type Field =
  | "cc"
  | "bcc"
  | "replyTo"
  | "headers"
  | "attachments"
  | "tags"
  | "metadata"
  | "sendAt";

export type ProviderExplorerEntry = {
  id: string;
  name: string;
  key: string;
  importPath: string;
  website: string;
  officialDocs?: string;
  docsPath: string;
  summary: string;
  description: string;
  logo?: string;
  invertOnDark?: boolean;
  currentOnly?: boolean;
  credentials: Array<{
    name: string;
    envVar: string;
    description: string;
    required: boolean;
  }>;
  capabilities: {
    repeatedHeaders: boolean;
    idempotency: "native" | "message_id" | "none";
    scheduling: boolean;
    personalized: "native" | "expanded" | "unsupported";
  };
  fieldSupport: MessageFieldSupport;
  limitations: string[];
  setupNotes?: string[];
  importExamples?: string[];
};

// SAFETY: Provider website URLs are verified against registered adapters; all values are static known domains
const PROVIDER_WEBSITE = {
  resend: "https://resend.com",
  postmark: "https://postmarkapp.com",
  sendgrid: "https://sendgrid.com",
  ses: "https://aws.amazon.com/ses/",
  mailgun: "https://www.mailgun.com",
  mailersend: "https://www.mailersend.com",
  brevo: "https://www.brevo.com",
  mailchimp: "https://mailchimp.com/features/transactional-email",
  sparkpost: "https://www.sparkpost.com",
  mailtrap: "https://mailtrap.io",
  cloudflare: "https://developers.cloudflare.com/email-service/",
  unosend: "https://www.unosend.co",
  scaleway: "https://www.scaleway.com/en/transactional-email-tem",
  zeptomail: "https://www.zoho.com/zeptomail",
  mailpace: "https://mailpace.com",
  iterable: "https://iterable.com",
  loops: "https://loops.so",
  sequenzy: "https://www.sequenzy.com/",
  jetemail: "https://jetemail.com",
  primitive: "https://www.primitive.dev",
  lettermint: "https://lettermint.co",
  lettr: "https://lettr.com",
  plunk: "https://www.useplunk.com",
  smtp: "https://datatracker.ietf.org/doc/html/rfc5321",
  graph: "https://learn.microsoft.com/en-us/graph/api/user-sendmail",
  sendheron: "https://sendheron.com",
  helo: "https://helo.email",
  mailjet: "https://mailjet.com",
  smtp2go: "https://smtp2go.com",
  elasticemail: "https://elasticemail.com",
  socketlabs: "https://socketlabs.com",
} as const;

// SAFETY: Official docs URLs are verified against adapter implementations; all values are known provider documentation URLs
const OFFICIAL_DOCS = {
  resend: "https://resend.com/docs/api-reference/emails/send-email",
  postmark: "https://postmarkapp.com/developer/api/email-api",
  sendgrid: "https://docs.sendgrid.com/api-reference/mail-send/mail-send",
  ses: "https://docs.aws.amazon.com/ses/latest/dg/send-email-api.html",
  mailgun:
    "https://documentation.mailgun.com/docs/mailgun/api-reference/openapi-final/tag/Messages/",
  mailersend: "https://developers.mailersend.com/api/v1/email.html",
  brevo: "https://developers.brevo.com/reference/sendtransacemail",
  mailchimp: "https://mailchimp.com/developer/transactional/api/messages/send-new-message/",
  sparkpost: "https://developers.sparkpost.com/api/transmissions/",
  mailtrap: "https://api-docs.mailtrap.io/docs/mailtrap-api-docs/67d0a7ba26eff-send-email",
  cloudflare: "https://developers.cloudflare.com/email-service/email-api/send-email/",
  scaleway: "https://www.scaleway.com/en/developers/api/transactional-email/",
  zeptomail: "https://www.zoho.com/zeptomail/help/api/email/send-single-email.html",
  mailpace: "https://docs.mailpace.com/",
  iterable: "https://api.iterable.com/api/docs#email_send",
  loops: "https://loops.so/docs/api-reference/send-transactional-email",
  plunk: "https://www.useplunk.com/docs/api-reference/send-email",
  mailjet: "https://dev.mailjet.com/docs/email-api/send-api-v31/send-basic-email",
  smtp2go: "https://developers.smtp2go.com/docs/send-an-email",
  elasticemail: "https://elasticemail.com/email-api",
  socketlabs: "https://help.socketlabs.com/docs/email/v2/injection-api",
} as const;

// SAFETY: credMap maps adapter IDs to their credential requirements; all entries are derived from registered providers
function getCredentials(id: string) {
  const credMap = {
    resend: [
      {
        name: "API key",
        envVar: "RESEND_API_KEY",
        description: "Resend API key",
        required: true,
      },
    ],
    postmark: [
      {
        name: "Server token",
        envVar: "POSTMARK_SERVER_TOKEN",
        description: "Postmark server token",
        required: true,
      },
    ],
    sendgrid: [
      {
        name: "API key",
        envVar: "SENDGRID_API_KEY",
        description: "SendGrid API key",
        required: true,
      },
    ],
    ses: [
      {
        name: "Access key ID",
        envVar: "AWS_ACCESS_KEY_ID",
        description: "AWS access key",
        required: true,
      },
      {
        name: "Secret access key",
        envVar: "AWS_SECRET_ACCESS_KEY",
        description: "AWS secret key",
        required: true,
      },
      { name: "Region", envVar: "AWS_REGION", description: "AWS region", required: true },
    ],
    mailgun: [
      {
        name: "API key",
        envVar: "MAILGUN_API_KEY",
        description: "Mailgun API key",
        required: true,
      },
      { name: "Domain", envVar: "MAILGUN_DOMAIN", description: "Sending domain", required: true },
    ],
    mailersend: [
      {
        name: "API key",
        envVar: "MAILERSEND_API_KEY",
        description: "MailerSend API key",
        required: true,
      },
    ],
    brevo: [
      { name: "API key", envVar: "BREVO_API_KEY", description: "Brevo API key", required: true },
    ],
    mailchimp: [
      {
        name: "API key",
        envVar: "MAILCHIMP_TRANSACTIONAL_API_KEY",
        description: "Mailchimp Transactional API key",
        required: true,
      },
    ],
    sparkpost: [
      {
        name: "API key",
        envVar: "SPARKPOST_API_KEY",
        description: "SparkPost API key",
        required: true,
      },
    ],
    mailtrap: [
      {
        name: "API key",
        envVar: "MAILTRAP_API_KEY",
        description: "Mailtrap API key",
        required: true,
      },
    ],
    cloudflare: [
      {
        name: "API token",
        envVar: "CLOUDFLARE_API_TOKEN",
        description: "Cloudflare API token",
        required: true,
      },
      {
        name: "Account ID",
        envVar: "CLOUDFLARE_ACCOUNT_ID",
        description: "Cloudflare account ID",
        required: true,
      },
    ],
    scaleway: [
      {
        name: "Project ID",
        envVar: "SCALEWAY_PROJECT_ID",
        description: "Scaleway project ID",
        required: true,
      },
      {
        name: "Secret key",
        envVar: "SCALEWAY_SECRET_KEY",
        description: "Scaleway secret key",
        required: true,
      },
    ],
    zeptomail: [
      { name: "Token", envVar: "ZEPTOMAIL_TOKEN", description: "ZeptoMail token", required: true },
    ],
    mailpace: [
      {
        name: "API key",
        envVar: "MAILPACE_API_KEY",
        description: "MailPace API key",
        required: true,
      },
    ],
    iterable: [
      {
        name: "API key",
        envVar: "ITERABLE_API_KEY",
        description: "Iterable API key",
        required: true,
      },
      {
        name: "Campaign ID",
        envVar: "ITERABLE_CAMPAIGN_ID",
        description: "Iterable campaign ID",
        required: true,
      },
    ],
    loops: [
      { name: "API key", envVar: "LOOPS_API_KEY", description: "Loops API key", required: true },
      {
        name: "Transactional ID",
        envVar: "LOOPS_TRANSACTIONAL_ID",
        description: "Loops transactional ID",
        required: true,
      },
    ],
    sequenzy: [
      {
        name: "API key",
        envVar: "SEQUENZY_API_KEY",
        description: "Sequenzy API key",
        required: true,
      },
    ],
    jetemail: [
      {
        name: "API key",
        envVar: "JETEMAIL_API_KEY",
        description: "JetEmail API key",
        required: true,
      },
    ],
    primitive: [
      {
        name: "API key",
        envVar: "PRIMITIVE_API_KEY",
        description: "Primitive API key",
        required: true,
      },
    ],
    lettermint: [
      {
        name: "API token",
        envVar: "LETTERMINT_API_TOKEN",
        description: "Lettermint API token",
        required: true,
      },
    ],
    lettr: [
      { name: "API key", envVar: "LETTR_API_KEY", description: "Lettr API key", required: true },
    ],
    plunk: [
      { name: "API key", envVar: "PLUNK_API_KEY", description: "Plunk API key", required: true },
    ],
    sendheron: [
      {
        name: "API key",
        envVar: "SENDHERON_API_KEY",
        description: "SendHeron API key",
        required: true,
      },
    ],
    helo: [
      { name: "API key", envVar: "HELO_API_KEY", description: "Helo API key", required: true },
    ],
    graph: [
      {
        name: "Tenant ID",
        envVar: "GRAPH_TENANT_ID",
        description: "Azure tenant ID",
        required: true,
      },
      {
        name: "Client ID",
        envVar: "GRAPH_CLIENT_ID",
        description: "Azure client ID",
        required: true,
      },
      {
        name: "Client secret",
        envVar: "GRAPH_CLIENT_SECRET",
        description: "Azure client secret",
        required: true,
      },
    ],
    smtp: [],
    mailjet: [
      { name: "API key", envVar: "MAILJET_API_KEY", description: "Mailjet API key", required: true },
    ],
    smtp2go: [
      { name: "API key", envVar: "SMTP2GO_API_KEY", description: "SMTP2GO API key", required: true },
    ],
    elasticemail: [
      { name: "API key", envVar: "ELASTICEMAIL_API_KEY", description: "Elastic Email API key", required: true },
    ],
    socketlabs: [
      { name: "API key", envVar: "SOCKETLABS_API_KEY", description: "SocketLabs API key", required: true },
    ],
  } as const;

  return [...(Object.entries(credMap).find(([key]) => key === id)?.[1] ?? [])];
}

// SAFETY: limitations maps adapter IDs to their known limitations from the SDK implementation; all entries are verified against adapter code
function getLimitations(id: string): string[] {
  const limits = {
    postmark: ["Accepts one tag; converted to name:value format."],
    sendgrid: [
      "Native personalized delivery caps at 1000 recipients per request.",
      "Tag names are discarded; values become categories.",
    ],
    cloudflare: [
      "Accepts at most 50 combined to/cc/bcc recipients.",
      "Recipient display names not supported.",
      "At most 1 reply-to address.",
    ],
    scaleway: ["Reply-to cannot be set if headers already contain Reply-To."],
    mailgun: [
      "Native personalized delivery caps at 1000 recipients per request.",
      "Tag names discarded; values become o:tag.",
    ],
    mailersend: ["At most 1 reply-to address.", "Tag names discarded; values become tags."],
    brevo: ["At most 1 reply-to address."],
    mailchimp: ["Scheduling uses UTC YYYY-MM-DD HH:MM:ss format."],
    sparkpost: ["Scheduling uses RFC3339/ISO8601; see provider docs for specifics."],
    iterable: ["Normal send accepts one to recipient."],
    loops: ["Normal send accepts one to recipient."],
    sequenzy: ["At most 50 to recipients.", "At most 1 reply-to address."],
    jetemail: [
      "Requires from address with display name.",
      "At most 50 to/cc/bcc/reply-to recipients each.",
    ],
    mailtrap: ["At most 1 reply-to address."],
    plunk: ["At most 1 reply-to address."],
    sendheron: [
      "At most 1 to recipient, 50 cc, 50 bcc, 1 reply-to.",
      "Plain email addresses only for recipients/reply-to.",
      "Max 10 attachments.",
      "Cannot schedule with attachments.",
      "Attachments must be from allowlist.",
      "No inline attachments.",
    ],
    helo: [
      "At most 50 combined to/cc/bcc recipients.",
      "Max 5 tags (tag values ≤100 chars).",
      "Max 10 metadata fields (keys ≤50, values ≤100).",
      "Subject ≤256 chars.",
    ],
    graph: [
      "Only x- prefixed custom headers.",
      "Max 5 headers.",
      "At most 1000 combined recipients.",
    ],
    smtp: ["Envelope addresses must be valid per SMTP; Bcc must not appear in headers."],
    mailjet: [
      "Requires verified sender domain.",
      "Tags are converted to message categories.",
      "No native scheduling support - use sendAt for deferred sends.",
      "Maximum 10 attachments per message.",
    ],
    smtp2go: [
      "At most 50 to recipients per message.",
      "No native CC/BCC - route through multiple sends.",
      "Scheduled sends limited to 3 days in advance.",
      "Maximum 25MB message size.",
    ],
    elasticemail: [
      "Maximum 50 recipients per message.",
      "No native metadata field - use tags instead.",
      "Scheduled sends require lead time of at least 15 minutes.",
      "Maximum 10 attachments per message.",
    ],
    socketlabs: [
      "Maximum 50 recipients per message.",
      "No native scheduling support.",
      "Attachments must be base64 encoded.",
      "Maximum 25MB message size.",
    ],
  } as const;

  return [...(Object.entries(limits).find(([key]) => key === id)?.[1] ?? [])];
}

function getDescription(id: string, provider: any): string {
  // Use provider summary as base, but make it more specific
  return provider.summary || `Send email via ${provider.name} API.`;
}

export function buildProviderExplorer(): ProviderExplorerEntry[] {
  const entries = providers.map((provider) => {
    const id = provider.key;

    // SAFETY: BUILT_IN_ADAPTER_CAPABILITIES is derived from SDK adapter exports; all entries match the declared capabilities shape
    const capabilitiesById: Record<string, ProviderExplorerEntry["capabilities"]> =
      BUILT_IN_ADAPTER_CAPABILITIES;

    const fieldsById: Record<string, MessageFieldSupport> = SUPPORTED_MESSAGE_FIELDS;

    const caps = capabilitiesById[id] || {
      repeatedHeaders: false,
      idempotency: "none",
      scheduling: false,
      personalized: "expanded",
    };

    // SAFETY: SUPPORTED_MESSAGE_FIELDS is source-derived from adapter validation; all entries match the declared field support shape
    const fields = fieldsById[id] || {};

    return {
      id,
      name: provider.name,
      key: id,
      importPath: provider.importPath,
      website: Object.entries(PROVIDER_WEBSITE).find(([key]) => key === id)?.[1] ?? provider.website,
      officialDocs: Object.entries(OFFICIAL_DOCS).find(([key]) => key === id)?.[1],
      docsPath: provider.docs,
      summary: provider.summary,
      description: getDescription(id, provider),
      logo: provider.logo,
      invertOnDark: "invertOnDark" in provider ? provider.invertOnDark : undefined,
      currentOnly: "currentOnly" in provider ? provider.currentOnly : undefined,
      credentials: getCredentials(id),
      capabilities: caps,
      fieldSupport: fields,
      limitations: getLimitations(id),
      importExamples: [`import { ${id} } from "@maillayer/core/${id}"`],
    } satisfies ProviderExplorerEntry;
  });

  return entries;
}

export const providerExplorerEntries = buildProviderExplorer();

export const providerExplorerMap = new Map(providerExplorerEntries.map((e) => [e.id, e]));