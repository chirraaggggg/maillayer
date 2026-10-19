import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, MotionConfig } from "motion/react";
import * as React from "react";

import { DocsVersionLink } from "@/components/docs-version-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { homeStructuredData, siteTitle } from "@/lib/metadata";
import { appDescription, gitConfig, siteUrl } from "@/lib/shared";

const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

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
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: Home,
});

/* ─── Shared motion variants ─── */
const fadeUpItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } as const,
} as const;

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } as const,
} as const;

function Home() {
  return (
    /* reducedMotion="user" honors prefers-reduced-motion without branching
       render props on useReducedMotion(), which diverged from the server
       markup and left sections stuck at opacity 0 after hydration. */
    <MotionConfig reducedMotion="user">
      <main className="ml-landing">
        <div aria-hidden="true" className="ml-grain" />

        <LandingNav />
        <LandingHero />
        <ProviderCards />
        <DiagramSection />
        <ResultsSection />
        <FeaturesSection />
        <PillsRow />
        <ClosingNote />
        <LandingFooter />
      </main>
    </MotionConfig>
  );
}

/* ─── Navigation ─── */
function LandingNav() {
  return (
    <nav className="ml-nav" aria-label="Primary navigation">
      <div className="ml-container ml-nav-inner">
        <Link className="ml-wordmark" to="/">
          <svg
            className="ml-mark"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="2.5"
              y="5"
              width="19"
              height="14"
              rx="2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M3.5 7 12 13.5 20.5 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          MailLayer
        </Link>
        <div className="ml-nav-links">
          <a href="#how-it-works">How it works</a>
          <DocsVersionLink>Docs</DocsVersionLink>
          <DocsVersionLink docsPath="/docs/adapters">Providers</DocsVersionLink>
          <a href={githubUrl} rel="noreferrer" target="_blank">
            GitHub
          </a>
          <ThemeToggle className="ml-theme-toggle" />
        </div>
        <DocsVersionLink
          aria-label="Open documentation"
          className="ml-mobile-menu"
          docsPath="/docs"
        >
          Docs
        </DocsVersionLink>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function LandingHero() {
  return (
    <section className="ml-hero" aria-labelledby="landing-heading">
      <div className="ml-container">
        <motion.div
          className="ml-hero-text"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
          }}
        >
          <motion.h1
            id="landing-heading"
            className="ml-hero-title"
            variants={fadeUpItem}
          >
            <span className="ml-hero-title-accent">
              mail
              <svg
                aria-hidden="true"
                className="ml-title-underline"
                viewBox="0 0 320 14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M3 9 C 60 3, 120 12, 180 7 S 280 4, 317 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                />
              </svg>
            </span>{" "}
            layer
          </motion.h1>
          <motion.p className="ml-hero-phonetic" variants={fadeUpItem}>
            /ˈmeɪl ˌleɪər/ · <em>noun</em>
          </motion.p>
          <ol className="ml-defs">
            <motion.li variants={fadeUpItem}>
              <span className="ml-def-num" aria-hidden="true">
                1.
              </span>
              <span>
                one typed API for sending email through any provider you
                already use.
              </span>
            </motion.li>
            <motion.li variants={fadeUpItem}>
              <span className="ml-def-num" aria-hidden="true">
                2.
              </span>
              <span>
                the route from your app to the provider, with a real
                <code className="ml-inline-code"> SendResult </code>
                back from each.
              </span>
            </motion.li>
          </ol>
          <motion.div className="ml-hero-actions" variants={fadeUpItem}>
            <DocsVersionLink
              className="ml-btn ml-btn-pill"
              docsPath="/docs/getting-started/quickstart"
            >
              Read the quickstart
            </DocsVersionLink>
            <span className="ml-hero-aside">
              <svg
                viewBox="0 0 40 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M 38 10 Q 22 2 6 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 11 8 L 5 12 L 11 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                or just <code>npm i @maillayer/core</code>
              </span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Provider cards ("shoutout to our sponsors" slot) ─── */
const providerCards = [
  {
    name: "Resend",
    desc: "The Email API for developers",
    initial: "R",
    slug: "resend",
  },
  {
    name: "Postmark",
    desc: "Transactional email, server-token simple",
    initial: "P",
    slug: "postmark",
  },
  {
    name: "AWS SES",
    desc: "Send through your own AWS account",
    initial: "S",
    slug: "ses",
  },
] as const;

function ProviderCards() {
  return (
    <section className="ml-cards-section" aria-label="Featured providers">
      <div className="ml-container">
        <motion.p
          className="ml-center-label"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionReveal}
        >
          works with the providers you already use
        </motion.p>
        <motion.div
          className="ml-card-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {providerCards.map(({ name, desc, initial, slug }) => (
            <motion.div key={slug} variants={fadeUpItem}>
              <DocsVersionLink
                docsPath={`/docs/providers/${slug}`}
                className="ml-pcard"
              >
                <span className="ml-pcard-icon" aria-hidden="true">
                  {initial}
                </span>
                <span className="ml-pcard-body">
                  <span className="ml-pcard-name">{name}</span>
                  <span className="ml-pcard-desc">{desc}</span>
                </span>
              </DocsVersionLink>
            </motion.div>
          ))}
          <motion.div variants={fadeUpItem}>
            <DocsVersionLink docsPath="/docs/providers" className="ml-pcard ml-pcard-dashed">
              <span className="ml-pcard-icon ml-pcard-icon-dashed" aria-hidden="true">
                +
              </span>
              <span className="ml-pcard-body">
                <span className="ml-pcard-name">24 more adapters</span>
                <span className="ml-pcard-desc">
                  SendGrid, Mailgun, SMTP, and the rest
                </span>
              </span>
            </DocsVersionLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Architecture diagram ─── */
function DiagramSection() {
  return (
    <section
      id="how-it-works"
      className="ml-diagram-section"
      aria-label="How MailLayer works"
    >
      <div className="ml-container">
        <motion.div
          className="ml-diagram-wrap"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionReveal}
        >
          <h2 className="ml-diagram-heading">How it works</h2>
          <p className="ml-diagram-sub">
            Configure one adapter for the provider you already have. Call
            <code className="ml-inline-code"> email.send()</code>. Get back one
            normalized result.
          </p>

          {/* SVG architecture diagram — left-to-right flow */}
          <svg
            className="ml-arch-svg"
            viewBox="0 0 760 220"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Architecture diagram: Your app calls email.send() on the MailLayer client, which routes to the configured adapter (Resend, Postmark, or any other provider) and returns a normalized SendResult."
          >
            {/* ── App node ── */}
            <rect x="8" y="40" width="172" height="140" rx="8"
              fill="var(--paper-card)" stroke="var(--paper-border)" strokeWidth="1.5" />
            <text x="94" y="62" textAnchor="middle" className="ml-arch-label">your app</text>
            {/* code snippet */}
            <text x="22" y="84" className="ml-arch-code">
              <tspan x="22" dy="0" className="ml-arch-kw">const </tspan>
              <tspan className="ml-arch-em">result</tspan>
              <tspan> = </tspan>
              <tspan className="ml-arch-kw">await</tspan>
            </text>
            <text x="22" y="100" className="ml-arch-code">
              <tspan x="22">  email.</tspan>
              <tspan className="ml-arch-em">send</tspan>
              <tspan>{"({"}</tspan>
            </text>
            <text x="22" y="116" className="ml-arch-code">
              <tspan x="22">{"    from: "}</tspan>
              <tspan className="ml-arch-str">'ada@co'</tspan>
              <tspan>,</tspan>
            </text>
            <text x="22" y="132" className="ml-arch-code">
              <tspan x="22">{"    to: "}</tspan>
              <tspan className="ml-arch-str">'you@co'</tspan>
              <tspan>,</tspan>
            </text>
            <text x="22" y="148" className="ml-arch-code">
              <tspan x="22">{"    subject: "}</tspan>
              <tspan className="ml-arch-str">'Hi'</tspan>
            </text>
            <text x="22" y="164" className="ml-arch-code">{"  });"}</text>

            {/* ── Arrow: App → MailLayer ── */}
            <motion.line
              x1="180" y1="110" x2="248" y2="110"
              stroke="var(--paper-border-strong)" strokeWidth="1.5" strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.35 }}
            />

            {/* ── MailLayer central node ── */}
            <rect x="252" y="72" width="148" height="76" rx="8"
              fill="var(--paper-accent)" opacity="0.12"
              stroke="var(--paper-accent)" strokeWidth="1.5" />
            <text x="326" y="100" textAnchor="middle" className="ml-arch-brand-label">MailLayer</text>
            <text x="326" y="118" textAnchor="middle" className="ml-arch-sub-label">client</text>
            <text x="326" y="138" textAnchor="middle" className="ml-arch-tiny">configured adapter</text>

            {/* ── Arrow: MailLayer → Providers ── */}
            <motion.line
              x1="400" y1="110" x2="460" y2="60"
              stroke="var(--paper-border-strong)" strokeWidth="1.5" strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.3 }}
            />
            <motion.line
              x1="400" y1="110" x2="460" y2="110"
              stroke="var(--paper-border-strong)" strokeWidth="1.5" strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.3 }}
            />
            <motion.line
              x1="400" y1="110" x2="460" y2="160"
              stroke="var(--paper-border-strong)" strokeWidth="1.5" strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.3 }}
            />

            {/* ── Provider nodes ── */}
            {[
              { y: 40, name: "Resend" },
              { y: 90, name: "Postmark" },
              { y: 140, name: "AWS SES" },
            ].map(({ y, name }, i) => (
              <motion.g
                key={name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.3 }}
              >
                <rect x="464" y={y} width="108" height="36" rx="6"
                  fill="var(--paper-card)" stroke="var(--paper-border)" strokeWidth="1.4" />
                <text x="518" y={y + 22} textAnchor="middle" className="ml-arch-provider">{name}</text>
              </motion.g>
            ))}
            <motion.text
              x="518" y="196" textAnchor="middle" className="ml-arch-tiny"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.68, duration: 0.3 }}
            >
              + 24 more adapters
            </motion.text>

            {/* ── Arrow: Providers → Result ── */}
            <motion.line
              x1="572" y1="60" x2="626" y2="100"
              stroke="var(--paper-border-strong)" strokeWidth="1.5" strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.3 }}
            />
            <motion.line
              x1="572" y1="110" x2="626" y2="110"
              stroke="var(--paper-border-strong)" strokeWidth="1.5" strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.3 }}
            />
            <motion.line
              x1="572" y1="160" x2="626" y2="120"
              stroke="var(--paper-border-strong)" strokeWidth="1.5" strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, duration: 0.3 }}
            />

            {/* ── SendResult node ── */}
            <motion.g
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.75, duration: 0.35 }}
            >
              <rect x="630" y="72" width="122" height="76" rx="8"
                fill="var(--paper-card)" stroke="var(--paper-border)" strokeWidth="1.5" />
              <text x="691" y="94" textAnchor="middle" className="ml-arch-label">SendResult</text>
              <text x="642" y="112" className="ml-arch-code">
                <tspan className="ml-arch-str">ok</tspan>
                <tspan>: </tspan>
                <tspan className="ml-arch-kw">true</tspan>
              </text>
              <text x="642" y="126" className="ml-arch-code">
                <tspan className="ml-arch-str">adapter</tspan>
                <tspan>: </tspan>
                <tspan className="ml-arch-em">'resend'</tspan>
              </text>
              <text x="642" y="140" className="ml-arch-code">
                <tspan className="ml-arch-str">id</tspan>
                <tspan>: </tspan>
                <tspan className="ml-arch-em">'re_…'</tspan>
              </text>
            </motion.g>

            {/* Arrow marker */}
            <defs>
              <marker id="arrowhead" markerWidth="7" markerHeight="7"
                refX="6" refY="3.5" orient="auto">
                <polygon points="0 0, 7 3.5, 0 7"
                  fill="var(--paper-border-strong)" />
              </marker>
            </defs>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── What you get back ─── */
function ResultsSection() {
  return (
    <section className="ml-split-section" aria-labelledby="results-heading">
      <div className="ml-container">
        <motion.div
          className="ml-split"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionReveal}
        >
          <div className="ml-split-text">
            <h2 id="results-heading">What you get back.</h2>
            <p>
              One result per send. Not a provider-specific response object.
              <code className="ml-inline-code"> ok</code>,
              <code className="ml-inline-code"> adapter</code>,
              <code className="ml-inline-code"> id</code>,
              <code className="ml-inline-code"> status</code> — the same shape
              whether you routed through Resend or plain SMTP.
            </p>
            <p>
              Errors are typed, too. An auth failure, a validation failure, and
              a provider outage are different classes — not strings to parse.
            </p>
          </div>
          <div className="ml-code-panel">
            <div className="ml-code-header">
              <span className="ml-code-filename">send.ts</span>
              <CopyButton
                code={[
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
                  "// { ok: true, adapter: 'resend',",
                  "//   id: 're_aZ9b…', status: 'accepted' }",
                ].join("\n")}
              />
            </div>
            <pre className="ml-code-block" aria-label="TypeScript email send example">
              <code>
                <span className="ml-code-line">
                  <span className="ml-dc-kw">import </span>
                  <span className="ml-dc-em">{"{ createEmailClient } "}</span>
                  <span className="ml-dc-kw">from </span>
                  <span className="ml-dc-str">@maillayer/core</span>
                  {";"}
                </span>
                <span className="ml-code-line">
                  <span className="ml-dc-kw">import </span>
                  <span className="ml-dc-em">{"{ resend } "}</span>
                  <span className="ml-dc-kw">from </span>
                  <span className="ml-dc-str">@maillayer/core/resend</span>
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
                <span className="ml-code-line">{");"}</span>
                <span className="ml-code-gap" />
                <span className="ml-code-line">
                  <span className="ml-dc-kw">const </span>
                  <span className="ml-dc-em">result </span>
                  {"= "}
                  <span className="ml-dc-kw">await </span>
                  <span className="ml-dc-em">email</span>
                  {"."}
                </span>
                <span className="ml-code-line">
                  {"  .send({"}
                </span>
                <span className="ml-code-line">
                  {"  from: "}
                  Acme (hello@acme.com)
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
                <span className="ml-code-line">{");"}</span>
              </code>
            </pre>
            <p className="ml-panel-annotation">← same shape on every adapter</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  }

  return (
    <button
      className="ml-copy-btn"
      onClick={handleCopy}
      type="button"
      aria-label={copied ? "Copied to clipboard" : "Copy code"}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ─── Everything it does ─── */
const features = [
  {
    title: "Unified send",
    body: "One typed message shape on every adapter: from, to, subject, text or html, cc, bcc, replyTo, attachments where the provider supports them.",
    note: "change providers, keep call sites",
    icon: (
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3.5 12 21 4l-6 17-4.5-6.5L3.5 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 14.5 21 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Fallbacks & retries",
    body: "List several adapters and route by message type. Retry policies apply the same way on every provider, without rewriting your calls.",
    note: "configurable per client",
    icon: (
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4 9a8 8 0 0 1 13.5-3.5L20 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M20 3v4h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 15a8 8 0 0 1-13.5 3.5L4 17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M4 21v-4h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Typed errors",
    body: "Auth failures, validation failures, and provider outages are distinct error classes with structured fields — no string matching.",
    note: "no string parsing",
    icon: (
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 4 2.8 20h18.4L12 4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 10v4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="17.3" r="0.4" fill="currentColor" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    title: "Memory adapter",
    body: "A no-network adapter records every send in memory, so your test suite and CI never touch a live provider.",
    note: "runs offline",
    icon: (
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9.5 3v5.5L4.8 17a2.5 2.5 0 0 0 2.2 3.7h10a2.5 2.5 0 0 0 2.2-3.7L14.5 8.5V3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 3h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7.3 14h9.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

function FeaturesSection() {
  return (
    <section className="ml-features-section" aria-labelledby="features-heading">
      <div className="ml-container">
        <motion.h2
          id="features-heading"
          className="ml-features-heading"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionReveal}
        >
          Everything it does.
        </motion.h2>
        <motion.div
          className="ml-features-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {features.map(({ title, body, note, icon }) => (
            <motion.div key={title} className="ml-feature" variants={fadeUpItem}>
              <span className="ml-feature-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <p className="ml-feature-note">{note}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Pills row ─── */
const pillProviders = [
  { name: "Resend", slug: "resend" },
  { name: "Postmark", slug: "postmark" },
  { name: "SendGrid", slug: "sendgrid" },
  { name: "AWS SES", slug: "ses" },
  { name: "Mailgun", slug: "mailgun" },
] as const;

function PillsRow() {
  return (
    <section className="ml-pills-section" aria-label="Provider directory">
      <div className="ml-container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionReveal}
        >
          <p className="ml-pills-label">
            already with a provider? keep it — your account, your credentials:
          </p>
          <div className="ml-pills">
            {pillProviders.map(({ name, slug }) => (
              <DocsVersionLink
                key={slug}
                docsPath={`/docs/providers/${slug}`}
                className="ml-pill"
              >
                <span className="ml-pill-icon" aria-hidden="true">
                  {name.charAt(0)}
                </span>
                {name}
              </DocsVersionLink>
            ))}
            <DocsVersionLink docsPath="/docs/providers" className="ml-pill">
              + 22 more
            </DocsVersionLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Closing note ─── */
function ClosingNote() {
  return (
    <section className="ml-closing-section" aria-label="Open source">
      <div className="ml-container">
        <motion.p
          className="ml-closing-note"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionReveal}
        >
          open source, MIT licensed, and on npm today. if it saves you a
          weekend,{" "}
          <a href={githubUrl} rel="noreferrer" target="_blank">
            star it on GitHub
          </a>
          . the full{" "}
          <DocsVersionLink docsPath="/docs/reference/client">
            reference
          </DocsVersionLink>{" "}
          lives in the{" "}
          <DocsVersionLink docsPath="/docs">docs</DocsVersionLink>.
          <svg
            className="ml-closing-squiggle"
            viewBox="0 0 220 10"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2 6 C 50 2, 110 9, 160 4 S 210 6, 218 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
const footerPlatforms = [
  { name: "Resend", slug: "resend" },
  { name: "Postmark", slug: "postmark" },
  { name: "SendGrid", slug: "sendgrid" },
  { name: "AWS SES", slug: "ses" },
  { name: "Mailgun", slug: "mailgun" },
  { name: "MailerSend", slug: "mailersend" },
  { name: "Brevo", slug: "brevo" },
  { name: "Mailtrap", slug: "mailtrap" },
  { name: "SMTP", slug: "smtp" },
] as const;

function LandingFooter() {
  return (
    <footer className="ml-footer">
      <div className="ml-container">
        <svg
          className="ml-footer-line"
          viewBox="0 0 1200 8"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2 5 C 200 2, 420 7, 640 4 S 1000 6, 1198 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <div className="ml-footer-platforms">
          {footerPlatforms.map(({ name, slug }) => (
            <DocsVersionLink key={slug} docsPath={`/docs/providers/${slug}`}>
              {name}
            </DocsVersionLink>
          ))}
        </div>
        <div className="ml-footer-bottom">
          <span>© 2026 MailLayer. MIT licensed.</span>
          <nav aria-label="Footer links">
            <DocsVersionLink>Docs</DocsVersionLink>
            <DocsVersionLink docsPath="/docs/providers">Providers</DocsVersionLink>
            <DocsVersionLink docsPath="/docs/reference/client">
              Reference
            </DocsVersionLink>
            <a href={`${githubUrl}/blob/main/CONTRIBUTING.md`} rel="noreferrer" target="_blank">
              Contributing
            </a>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <a href={githubUrl} rel="noreferrer" target="_blank">
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}