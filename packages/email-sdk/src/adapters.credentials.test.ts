import { describe, expect, test } from "bun:test";

import { brevo } from "./brevo.js";
import { cloudflare } from "./cloudflare.js";
import { elasticemail } from "./elasticemail.js";
import { EmailValidationError } from "./errors.js";
import { graph } from "./graph.js";
import { helo } from "./helo.js";
import { iterable } from "./iterable.js";
import { jetemail } from "./jetemail.js";
import { lettermint } from "./lettermint.js";
import { lettr } from "./lettr.js";
import { loops } from "./loops.js";
import { mailchimp } from "./mailchimp.js";
import { mailersend } from "./mailersend.js";
import { mailgun } from "./mailgun.js";
import { mailjet } from "./mailjet.js";
import { mailpace } from "./mailpace.js";
import { mailtrap } from "./mailtrap.js";
import { plunk } from "./plunk.js";
import { postmark } from "./postmark.js";
import { primitive } from "./primitive.js";
import { resend } from "./resend.js";
import { scaleway } from "./scaleway.js";
import { sendgrid } from "./sendgrid.js";
import { sendheron } from "./sendheron.js";
import { sequenzy } from "./sequenzy.js";
import { ses } from "./ses.js";
import { smtp } from "./smtp.js";
import { smtp2go } from "./smtp2go.js";
import { socketlabs } from "./socketlabs.js";
import { sparkpost } from "./sparkpost.js";
import type { EmailAdapter } from "./types.js";
import { unosend } from "./unosend.js";
import { zeptomail } from "./zeptomail.js";

type FactoryOptionValue = string | number | null | undefined;

type FactoryOptions = Record<string, FactoryOptionValue>;

function unsafeFactory<TOptions>(create: (options: TOptions) => EmailAdapter) {
  return (options: FactoryOptions): EmailAdapter =>
    // SAFETY: the credential guards under test run at the top of each factory, so the
    // deliberately invalid option objects are rejected before any other option is read.
    create(options as TOptions);
}

type CredentialCase = {
  adapter: string;
  required: readonly string[];
  valid: FactoryOptions;
  create: (options: FactoryOptions) => EmailAdapter;
};

const credentialCases: readonly CredentialCase[] = [
  {
    adapter: "brevo",
    required: ["apiKey"],
    valid: { apiKey: "bv_test_key" },
    create: unsafeFactory(brevo),
  },
  {
    adapter: "cloudflare",
    required: ["apiToken", "accountId"],
    valid: { apiToken: "cf_test_token", accountId: "cf_account" },
    create: unsafeFactory(cloudflare),
  },
  {
    adapter: "elasticemail",
    required: ["apiKey"],
    valid: { apiKey: "ee_test_key" },
    create: unsafeFactory(elasticemail),
  },
  {
    adapter: "graph",
    required: ["user", "tenantId", "clientId", "clientSecret"],
    valid: {
      tenantId: "tenant",
      clientId: "client",
      clientSecret: "graph_secret",
      user: "user@example.com",
    },
    create: unsafeFactory(graph),
  },
  {
    adapter: "helo",
    required: ["apiKey"],
    valid: { apiKey: "helo_test_key" },
    create: unsafeFactory(helo),
  },
  {
    adapter: "iterable",
    required: ["apiKey"],
    valid: { apiKey: "iterable_test_key", campaignId: 1 },
    create: unsafeFactory(iterable),
  },
  {
    adapter: "jetemail",
    required: ["apiKey"],
    valid: { apiKey: "jet_test_key" },
    create: unsafeFactory(jetemail),
  },
  {
    adapter: "lettermint",
    required: ["apiToken"],
    valid: { apiToken: "lm_test_token" },
    create: unsafeFactory(lettermint),
  },
  {
    adapter: "lettr",
    required: ["apiKey"],
    valid: { apiKey: "lttr_test_key" },
    create: unsafeFactory(lettr),
  },
  {
    adapter: "loops",
    required: ["apiKey"],
    valid: { apiKey: "loops_test_key", transactionalId: "tx" },
    create: unsafeFactory(loops),
  },
  {
    adapter: "mailchimp",
    required: ["apiKey"],
    valid: { apiKey: "mc_test_key" },
    create: unsafeFactory(mailchimp),
  },
  {
    adapter: "mailersend",
    required: ["apiKey"],
    valid: { apiKey: "ms_test_key" },
    create: unsafeFactory(mailersend),
  },
  {
    adapter: "mailgun",
    required: ["apiKey", "domain"],
    valid: { apiKey: "mg_test_key", domain: "mg.example.com" },
    create: unsafeFactory(mailgun),
  },
  {
    adapter: "mailjet",
    required: ["apiKey"],
    valid: { apiKey: "mj_test_key" },
    create: unsafeFactory(mailjet),
  },
  {
    adapter: "mailpace",
    required: ["apiKey"],
    valid: { apiKey: "mp_test_key" },
    create: unsafeFactory(mailpace),
  },
  {
    adapter: "mailtrap",
    required: ["apiKey"],
    valid: { apiKey: "mt_test_key" },
    create: unsafeFactory(mailtrap),
  },
  {
    adapter: "plunk",
    required: ["apiKey"],
    valid: { apiKey: "plunk_test_key" },
    create: unsafeFactory(plunk),
  },
  {
    adapter: "postmark",
    required: ["serverToken"],
    valid: { serverToken: "pm_test_token" },
    create: unsafeFactory(postmark),
  },
  {
    adapter: "primitive",
    required: ["apiKey"],
    valid: { apiKey: "primitive_test_key" },
    create: unsafeFactory(primitive),
  },
  {
    adapter: "resend",
    required: ["apiKey"],
    valid: { apiKey: "re_test_key" },
    create: unsafeFactory(resend),
  },
  {
    adapter: "scaleway",
    required: ["secretKey", "projectId"],
    valid: { secretKey: "sc_test_key", projectId: "sc_project" },
    create: unsafeFactory(scaleway),
  },
  {
    adapter: "sendgrid",
    required: ["apiKey"],
    valid: { apiKey: "sg_test_key" },
    create: unsafeFactory(sendgrid),
  },
  {
    adapter: "sendheron",
    required: ["apiKey"],
    valid: { apiKey: "sh_test_key" },
    create: unsafeFactory(sendheron),
  },
  {
    adapter: "sequenzy",
    required: ["apiKey"],
    valid: { apiKey: "sz_test_key" },
    create: unsafeFactory(sequenzy),
  },
  {
    adapter: "ses",
    required: ["accessKeyId", "secretAccessKey", "region"],
    valid: {
      accessKeyId: "aws_access_key",
      secretAccessKey: "aws_secret_key",
      region: "us-east-1",
    },
    create: unsafeFactory(ses),
  },
  {
    adapter: "smtp2go",
    required: ["apiKey"],
    valid: { apiKey: "s2g_test_key" },
    create: unsafeFactory(smtp2go),
  },
  {
    adapter: "socketlabs",
    required: ["apiKey"],
    valid: { apiKey: "sl_test_key" },
    create: unsafeFactory(socketlabs),
  },
  {
    adapter: "sparkpost",
    required: ["apiKey"],
    valid: { apiKey: "spark_test_key" },
    create: unsafeFactory(sparkpost),
  },
  {
    adapter: "unosend",
    required: ["apiKey"],
    valid: { apiKey: "un_test_key" },
    create: unsafeFactory(unosend),
  },
  {
    adapter: "zeptomail",
    required: ["token"],
    valid: { token: "zm_test_token" },
    create: unsafeFactory(zeptomail),
  },
];

// Values a JavaScript caller can pass despite the typed `string` options.
const invalidValues: readonly FactoryOptionValue[] = [undefined, "", "   ", null, 42];

describe("built-in adapter credential guards", () => {
  test("valid credentials construct every built-in adapter", () => {
    for (const { adapter, valid, create } of credentialCases) {
      expect(create(valid).name).toBe(adapter);
    }
  });

  for (const { adapter, required, valid, create } of credentialCases) {
    for (const field of required) {
      test(`${adapter} rejects a missing or empty ${field} at construction`, () => {
        for (const value of invalidValues) {
          const options = { ...valid, [field]: value };

          expect(() => create(options)).toThrow(EmailValidationError);
          expect(() => create(options)).toThrow(`${adapter} requires a non-empty ${field}.`);
        }
      });
    }
  }

  test("resend({ apiKey: undefined }) is rejected at construction (release-readiness audit)", () => {
    expect(() => unsafeFactory(resend)({ apiKey: undefined })).toThrow(
      "resend requires a non-empty apiKey.",
    );
  });

  test("credential errors carry the validation_error code", () => {
    let thrown: unknown;

    try {
      unsafeFactory(resend)({ apiKey: undefined });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(EmailValidationError);
    expect(thrown).toMatchObject({ code: "validation_error" });
  });

  test("credential errors never echo a configured secret", () => {
    let thrown: unknown;

    try {
      // The apiKey here is valid; only the domain is missing. The thrown error must
      // name the option without echoing either supplied value.
      mailgun({ apiKey: "mg_super_secret_value", domain: "" });
    } catch (error) {
      thrown = error;
    }

    const text = thrown instanceof Error ? thrown.message : "";

    expect(text).toBe("mailgun requires a non-empty domain.");
    expect(text).not.toContain("mg_super_secret_value");
  });

  test("smtp requires a host and a non-empty auth user when auth is configured", () => {
    expect(() => smtp({ host: "" })).toThrow("smtp requires a non-empty host.");
    expect(() => smtp({ host: "   " })).toThrow("smtp requires a non-empty host.");
    // SAFETY: JavaScript callers can supply an empty auth user despite the option types.
    expect(() => smtp({ host: "smtp.example.com", auth: { user: "", pass: "" } })).toThrow(
      "smtp requires a non-empty auth.user.",
    );
    expect(smtp({ host: "smtp.example.com" }).name).toBe("smtp");
  });

  test("alternative credential shapes stay usable", () => {
    expect(
      cloudflare({
        binding: {
          async send() {
            return { messageId: "cf_123" };
          },
        },
      }).name,
    ).toBe("cloudflare");

    expect(graph({ user: "user@example.com", getAccessToken: () => "token" }).name).toBe("graph");
    expect(() => graph({ user: "", getAccessToken: () => "token" })).toThrow(
      "graph requires a non-empty user.",
    );
  });
});
