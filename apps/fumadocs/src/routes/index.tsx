import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";

import { DocsVersionLink } from "@/components/docs-version-link";
import { homeStructuredData, siteTitle } from "@/lib/metadata";
import { appDescription, gitConfig, siteUrl } from "@/lib/shared";

const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

// Providers actually implemented in the repository (from providers.ts)
const featuredProviders = [
  "Resend",
  "Postmark",
  "SendGrid",
  "AWS SES",
  "Mailgun",
  "MailerSend",
  "Brevo",
  "Mailtrap",
  "Scaleway",
  "SMTP",
  "Loops",
  "Plunk",
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: siteTitle },
      { name: "description", content: appDescription },
      { property: "og:url", content: siteUrl },
      { "script:ld+json": homeStructuredData },
    ],
    links: [
      { rel: "canonical", href: siteUrl },
      { rel: "alternate", type: "text/markdown", href: `${siteUrl}/index.md` },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="ml-landing">
      {/* Paper grain overlay */}
      <div aria-hidden="true" className="ml-grain" />
      {/* Vertical rule lines */}
      <div aria-hidden="true" className="ml-rule ml-rule-left" />
      <div aria-hidden="true" className="ml-rule ml-rule-right" />

      <LandingNav />
      <LandingHero />
      <ProviderSection />
      <TechnicalDiagram />
      <ResultsSection />
      <CodeSection />
      <LandingFooter />
    </main>
  );
}

/* ─── Navigation ─── */
function LandingNav() {
  return (
    <nav className="ml-nav" aria-label="Primary navigation">
      <Link className="ml-wordmark" to="/">
        MailLayer
      </Link>
      <div className="ml-nav-links">
        <DocsVersionLink>Docs</DocsVersionLink>
        <DocsVersionLink docsPath="/docs/adapters">Adapters</DocsVersionLink>
        <Link to="/compare">How it works</Link>
        <a href={githubUrl} rel="noreferrer" target="_blank">
          GitHub
        </a>
        <DocsVersionLink
          className="ml-nav-cta"
          docsPath="/docs/getting-started/quickstart"
        >
          Get started
        </DocsVersionLink>
      </div>
      {/* Mobile */}
      <DocsVersionLink
        aria-label="Open documentation"
        className="ml-mobile-menu"
        docsPath="/docs"
      >
        Docs
      </DocsVersionLink>
    </nav>
  );
}

/* ─── Hero ─── */
function HeroIllustration() {
  return (
    <div className="ml-hero-diagram" aria-hidden="true">
      {/* Code window */}
      <div className="ml-diagram-window">
        <div className="ml-diagram-window-bar">
          <span className="ml-dot" />
          <span className="ml-dot" />
          <span className="ml-dot" />
          <span className="ml-diagram-filename">send.ts</span>
        </div>
        <pre className="ml-diagram-code">
          <code>
            <span className="ml-dc-kw">const</span>
            {" result = "}
            <span className="ml-dc-kw">await</span>
            {" email"}
            <br />
            {"  .send({"}
            <br />
            {"    from: "}
            <span className="ml-dc-str">'you@acme.dev'</span>
            {","}
            <br />
            {"    to: "}
            <span className="ml-dc-str">'ada@example.com'</span>
            {","}
            <br />
            {"    subject: "}
            <span className="ml-dc-str">'Welcome'</span>
            {","}
            <br />
            {"  });"}
          </code>
        </pre>
      </div>

      {/* SVG connector lines to provider endpoints */}
      <svg
        className="ml-diagram-svg"
        viewBox="0 0 260 220"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Lines from code window to unified API node */}
        <line
          x1="130"
          y1="0"
          x2="130"
          y2="60"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          className="ml-svg-connector"
        />

        {/* Unified API box */}
        <rect
          x="70"
          y="60"
          width="120"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          className="ml-svg-box"
        />
        <text
          x="130"
          y="78"
          textAnchor="middle"
          className="ml-svg-label"
          fontSize="9"
        >
          MailLayer API
        </text>

        {/* Fan out lines */}
        <line
          x1="90"
          y1="88"
          x2="40"
          y2="140"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          className="ml-svg-connector"
        />
        <line
          x1="130"
          y1="88"
          x2="130"
          y2="140"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          className="ml-svg-connector"
        />
        <line
          x1="170"
          y1="88"
          x2="220"
          y2="140"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          className="ml-svg-connector"
        />

        {/* Provider endpoint nodes */}
        <rect
          x="4"
          y="140"
          width="70"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          className="ml-svg-endpoint"
        />
        <text
          x="39"
          y="155"
          textAnchor="middle"
          className="ml-svg-label"
          fontSize="7.5"
        >
          Resend
        </text>

        <rect
          x="90"
          y="140"
          width="80"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          className="ml-svg-endpoint"
        />
        <text
          x="130"
          y="155"
          textAnchor="middle"
          className="ml-svg-label"
          fontSize="7.5"
        >
          SendGrid
        </text>

        <rect
          x="186"
          y="140"
          width="70"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          className="ml-svg-endpoint"
        />
        <text
          x="221"
          y="155"
          textAnchor="middle"
          className="ml-svg-label"
          fontSize="7.5"
        >
          Postmark
        </text>

        {/* Small arrows */}
        <text x="26" y="136" className="ml-svg-arrow" fontSize="8">
          ↓
        </text>
        <text x="126" y="136" className="ml-svg-arrow" fontSize="8">
          ↓
        </text>
        <text x="218" y="136" className="ml-svg-arrow" fontSize="8">
          ↓
        </text>

        {/* Annotation */}
        <text
          x="130"
          y="185"
          textAnchor="middle"
          className="ml-svg-annotation"
          fontSize="7.5"
          fontStyle="italic"
        >
          + 24 more adapters
        </text>

        {/* Status dots */}
        <circle cx="39" cy="173" r="3" className="ml-svg-status-ok" />
        <circle cx="130" cy="173" r="3" className="ml-svg-status-ok" />
        <circle cx="221" cy="173" r="3" className="ml-svg-status-ok" />
      </svg>

      {/* Handwritten annotation */}
      <span className="ml-diagram-annotation" aria-hidden="true">
        your code stays the same
        <svg
          className="ml-annotation-arrow"
          viewBox="0 0 40 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 2 10 Q 15 2 32 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M 28 10 L 32 14 L 27 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

function LandingHero() {
  return (
    <section className="ml-hero" aria-labelledby="landing-heading">
      <div className="ml-hero-text">
        <h1 id="landing-heading">Email, without the lock-in.</h1>
        <p id="landing-summary" className="ml-hero-body">
          "One typed API for sending email through the providers you already use. Switch providers without rewriting your application."
        </p>
        <div className="ml-hero-actions">
          <DocsVersionLink
            className="ml-btn ml-btn-primary"
            docsPath="/docs/getting-started/quickstart"
          >
            Read the quickstart
          </DocsVersionLink>
          <DocsVersionLink
            className="ml-btn ml-btn-secondary"
            docsPath="/docs/adapters"
          >
            Explore adapters
          </DocsVersionLink>
        </div>
      </div>
      <HeroIllustration />
    </section>
  );
}

/* ─── Provider Section ─── */
function ProviderSection() {
  return (
    <section
      className="ml-providers"
      aria-labelledby="providers-heading"
    >
      <div className="ml-section-rule" aria-hidden="true" />
      <div className="ml-providers-inner">
        <p className="ml-eyebrow" id="providers-heading">
          Works with your stack
        </p>
        <div className="ml-providers-grid" role="list">
          {featuredProviders.map((name) => (
            <DocsVersionLink
              key={name}
              docsPath={`/docs/adapters/${name.toLowerCase().replace(/\s+/g, "-")}`}
              role="listitem"
              className="ml-provider-chip"
            >
              {name}
            </DocsVersionLink>
          ))}
          <DocsVersionLink
            className="ml-provider-chip ml-provider-chip-more"
            docsPath="/docs/adapters"
          >
            + 15 more →
          </DocsVersionLink>
        </div>
      </div>
    </section>
  );
}

/* ─── Technical Diagram ─── */
function TechnicalDiagram() {
  return (
    <section className="ml-arch" aria-labelledby="arch-heading">
      <div className="ml-section-rule" aria-hidden="true" />
      <div className="ml-arch-inner">
        <div className="ml-arch-label">
          <p className="ml-eyebrow">Architecture</p>
          <h2 id="arch-heading">
            One interface,<br />any provider.
          </h2>
          <p className="ml-arch-desc">
            MailLayer normalizes the send interface across providers. Your
            application talks to one typed API; the adapter handles the HTTP
            call to your provider. Swap the adapter, keep the code.
          </p>
        </div>
        <div className="ml-arch-diagram" aria-hidden="true">
          <ArchDiagramSvg />
        </div>
      </div>
    </section>
  );
}

function ArchDiagramSvg() {
  return (
    <svg
      className="ml-arch-svg"
      viewBox="0 0 480 280"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Your App box */}
      <rect
        x="10"
        y="108"
        width="100"
        height="44"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        className="ml-svg-box"
      />
      <text
        x="60"
        y="126"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="9"
        fontWeight="500"
      >
        Your App
      </text>
      <text
        x="60"
        y="141"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="7"
        opacity="0.6"
      >
        any framework
      </text>

      {/* Arrow 1 */}
      <line
        x1="110"
        y1="130"
        x2="148"
        y2="130"
        stroke="currentColor"
        strokeWidth="0.8"
        className="ml-svg-connector"
      />
      <polygon
        points="145,126 150,130 145,134"
        fill="currentColor"
        className="ml-svg-arrowhead"
      />
      <text
        x="129"
        y="124"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="6.5"
        opacity="0.55"
      >
        email.send()
      </text>

      {/* MailLayer box */}
      <rect
        x="150"
        y="100"
        width="120"
        height="60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="ml-svg-box ml-svg-box-accent"
      />
      <text
        x="210"
        y="122"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="9"
        fontWeight="500"
      >
        MailLayer
      </text>
      <text
        x="210"
        y="136"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="7"
        opacity="0.6"
      >
        unified API
      </text>
      <text
        x="210"
        y="149"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="7"
        opacity="0.6"
      >
        validates + routes
      </text>

      {/* Arrow 2 */}
      <line
        x1="270"
        y1="130"
        x2="308"
        y2="130"
        stroke="currentColor"
        strokeWidth="0.8"
        className="ml-svg-connector"
      />
      <polygon
        points="305,126 310,130 305,134"
        fill="currentColor"
        className="ml-svg-arrowhead"
      />
      <text
        x="289"
        y="124"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="6.5"
        opacity="0.55"
      >
        adapter.send()
      </text>

      {/* Provider Adapter box */}
      <rect
        x="310"
        y="108"
        width="110"
        height="44"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        className="ml-svg-box"
      />
      <text
        x="365"
        y="126"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="9"
        fontWeight="500"
      >
        Provider
      </text>
      <text
        x="365"
        y="141"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="7"
        opacity="0.6"
      >
        Resend / SES / SMTP…
      </text>

      {/* Return arrow */}
      <path
        d="M 365 152 Q 365 195 210 195 Q 55 195 60 152"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeDasharray="4 3"
        className="ml-svg-connector"
        opacity="0.5"
      />
      <polygon
        points="57,149 60,154 64,149"
        fill="currentColor"
        className="ml-svg-arrowhead"
        opacity="0.5"
      />
      <text
        x="210"
        y="212"
        textAnchor="middle"
        className="ml-svg-label"
        fontSize="7"
        opacity="0.45"
        fontStyle="italic"
      >
        normalized SendResult
      </text>

      {/* Side annotation */}
      <text
        x="210"
        y="260"
        textAnchor="middle"
        className="ml-svg-annotation"
        fontSize="7.5"
        fontStyle="italic"
        opacity="0.55"
      >
        provider handles credentials, billing, and delivery
      </text>
    </svg>
  );
}

/* ─── Results Section ─── */
function ResultsSection() {
  return (
    <section className="ml-results" aria-labelledby="results-heading">
      <div className="ml-section-rule" aria-hidden="true" />
      <div className="ml-results-inner">
        <div className="ml-results-text">
          <p className="ml-eyebrow">Outcomes</p>
          <h2 id="results-heading">
            One interface.<br />Clear outcomes.
          </h2>
          <p className="ml-results-body">
            Every send returns a normalized <code>SendResult</code>. Whether
            you routed through Resend or SendGrid, your result shape is
            consistent: adapter name, provider message ID, and status. Errors
            are typed — no more string parsing.
          </p>
          <ul className="ml-results-list">
            <li>
              <span className="ml-results-tick" aria-hidden="true">
                ✦
              </span>
              Normalized <code>SendResult</code> across all adapters
            </li>
            <li>
              <span className="ml-results-tick" aria-hidden="true">
                ✦
              </span>
              Typed error classes — distinguish delivery from auth failures
            </li>
            <li>
              <span className="ml-results-tick" aria-hidden="true">
                ✦
              </span>
              Configurable retry and fallback — without rewriting your calls
            </li>
            <li>
              <span className="ml-results-tick" aria-hidden="true">
                ✦
              </span>
              No-network <code>memory</code> adapter for tests
            </li>
          </ul>
        </div>
        <ResultNotebook />
      </div>
    </section>
  );
}

function ResultNotebook() {
  return (
    <div className="ml-notebook" aria-label="Example SendResult JSON">
      <div className="ml-notebook-header">
        <span className="ml-notebook-label">SendResult</span>
        <span className="ml-notebook-lang">json</span>
      </div>
      <pre className="ml-notebook-body">
        <code>
          {"{\n"}
          {"  "}
          <span className="ml-dc-key">"ok"</span>
          {": "}
          <span className="ml-dc-kw">true</span>
          {",\n"}
          {"  "}
          <span className="ml-dc-key">"adapter"</span>
          {": "}
          <span className="ml-dc-str">"resend"</span>
          {",\n"}
          {"  "}
          <span className="ml-dc-key">"id"</span>
          {": "}
          <span className="ml-dc-str">"re_aZ9bCdEfGh"</span>
          {",\n"}
          {"  "}
          <span className="ml-dc-key">"status"</span>
          {": "}
          <span className="ml-dc-str">"accepted"</span>
          {"\n}"}
        </code>
      </pre>
      <p className="ml-notebook-note" aria-hidden="true">
        — same shape regardless of provider
      </p>
    </div>
  );
}

/* ─── Code Section ─── */
function CodeSection() {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    const code = [
      "import { createEmailClient } from '@maillayer/core';",
      "import { resend } from '@maillayer/core/resend';",
      "",
      "const email = createEmailClient({",
      "  adapters: [resend({ apiKey: process.env.RESEND_API_KEY! })],",
      "});",
      "",
      "const result = await email.send({",
      "  from: 'Acme <hello@acme.dev>',",
      "  to: 'ada@example.com',",
      "  subject: 'Welcome',",
      "  text: 'Hi Ada, your account is ready.',",
      "});",
      "",
      "console.log(result.adapter, result.id);",
    ].join("\n");

    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  }

  return (
    <section className="ml-code-section" aria-labelledby="code-heading">
      <div className="ml-section-rule" aria-hidden="true" />
      <div className="ml-code-inner">
        <div className="ml-code-label">
          <p className="ml-eyebrow">Quick start</p>
          <h2 id="code-heading">
            Up and running<br />in minutes.
          </h2>
          <p className="ml-code-desc">
            Install the package, pick your adapter, and send. The same call
            works with any of the 27 supported providers.
          </p>
          <DocsVersionLink
            className="ml-section-link"
            docsPath="/docs/getting-started/quickstart"
          >
            Full quickstart guide →
          </DocsVersionLink>
        </div>
        <div className="ml-code-panel">
          <div className="ml-code-header">
            <span className="ml-code-filename">src/email.ts</span>
            <button
              className="ml-copy-btn"
              onClick={handleCopy}
              type="button"
              aria-label={copied ? "Copied to clipboard" : "Copy code"}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="ml-code-block" aria-label="TypeScript email send example">
            <code>
              <span className="ml-code-line">
                <span className="ml-dc-kw">import </span>
                <span className="ml-dc-em">{"{ createEmailClient } "}</span>
                <span className="ml-dc-kw">from </span>
                <span className="ml-dc-str">'@maillayer/core'</span>
                {";"}
              </span>
              <span className="ml-code-line">
                <span className="ml-dc-kw">import </span>
                <span className="ml-dc-em">{"{ resend } "}</span>
                <span className="ml-dc-kw">from </span>
                <span className="ml-dc-str">'@maillayer/core/resend'</span>
                {";"}
              </span>
              <span className="ml-code-gap" />
              <span className="ml-code-line">
                <span className="ml-dc-kw">const </span>
                <span className="ml-dc-em">email </span>
                {"= createEmailClient({"}
              </span>
              <span className="ml-code-line">
                {"  adapters: ["}
                <span className="ml-dc-em">resend</span>
                {"({ apiKey: process.env."}
                <span className="ml-dc-em">RESEND_API_KEY</span>
                {"! })],"}
              </span>
              <span className="ml-code-line">{"});"}</span>
              <span className="ml-code-gap" />
              <span className="ml-code-line">
                <span className="ml-dc-kw">const </span>
                <span className="ml-dc-em">result </span>
                {"= "}
                <span className="ml-dc-kw">await </span>
                <span className="ml-dc-em">email</span>
                {".send({"}
              </span>
              <span className="ml-code-line">
                {"  from: "}
                <span className="ml-dc-str">{"'Acme <hello@acme.dev>'"}</span>
                {","}
              </span>
              <span className="ml-code-line">
                {"  to: "}
                <span className="ml-dc-str">'ada@example.com'</span>
                {","}
              </span>
              <span className="ml-code-line">
                {"  subject: "}
                <span className="ml-dc-str">'Welcome'</span>
                {","}
              </span>
              <span className="ml-code-line">
                {"  text: "}
                <span className="ml-dc-str">'Hi Ada, your account is ready.'</span>
                {","}
              </span>
              <span className="ml-code-line">{"});"}</span>
              <span className="ml-code-gap" />
              <span className="ml-code-line">
                {"console.log("}
                <span className="ml-dc-em">result</span>
                {".adapter, "}
                <span className="ml-dc-em">result</span>
                {".id);"}
              </span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function LandingFooter() {
  return (
    <footer className="ml-footer">
      <div className="ml-section-rule" aria-hidden="true" />
      <div className="ml-footer-inner">
        <div className="ml-footer-brand">
          <Link to="/" className="ml-footer-wordmark">
            MailLayer
          </Link>
        </div>
        <nav className="ml-footer-group" aria-label="Footer links">
          <DocsVersionLink>Documentation</DocsVersionLink>
          <a href={githubUrl} rel="noreferrer" target="_blank">
            GitHub repository
          </a>
          <a
            href={`${githubUrl}/blob/main/LICENSE`}
            rel="noreferrer"
            target="_blank"
          >
            License
          </a>
        </nav>
      </div>
    </footer>
  );
}
