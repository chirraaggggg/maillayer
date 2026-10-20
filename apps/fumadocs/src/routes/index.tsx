import { createFileRoute, Link } from "@tanstack/react-router";

import { DocsVersionLink } from "@/components/docs-version-link";
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
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&family=Lora:wght@400;500&display=swap",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="ml-landing">
      <SiteNav />
      <Hero />
      <div className="ml-container">
        <hr className="ml-rule" />
      </div>
      <FeatureRow />
      <div className="ml-container">
        <hr className="ml-rule" />
      </div>
      <ResponseSection />
      <div className="ml-container">
        <hr className="ml-rule" />
      </div>
      <SiteFooter />
    </main>
  );
}

/* ─── Shared marks and icons ─── */
function EnvelopeMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 7 12 13.5 20.5 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 8h11m0 0L9.5 4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubMark({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M8 .8a7.2 7.2 0 0 0-2.28 14c.36.07.5-.15.5-.35v-1.24c-2 .44-2.43-.96-2.43-.96-.33-.83-.8-1.06-.8-1.06-.66-.45.05-.44.05-.44.73.05 1.11.75 1.11.75.65 1.1 1.7.79 2.11.6.07-.47.25-.79.46-.97-1.6-.18-3.28-.8-3.28-3.56 0-.79.28-1.43.74-1.93-.07-.19-.32-.92.07-1.91 0 0 .6-.2 1.98.73a6.9 6.9 0 0 1 3.6 0c1.38-.93 1.98-.73 1.98-.73.39.99.14 1.72.07 1.91.46.5.74 1.14.74 1.93 0 2.77-1.69 3.38-3.3 3.56.26.22.49.66.49 1.33v1.97c0 .2.13.42.5.35A7.2 7.2 0 0 0 8 .8Z" />
    </svg>
  );
}

function XMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M9.5 6.9 14.8 1h-1.9L8.7 5.9 5.4 1H1.2l5.6 8.1L1.2 15h1.9l4.9-5.7L12.6 15h4.2L9.5 6.9Zm-1.7 2-1-1.4L3 2.5h1.7l3.4 4.8 1 1.4 4.5 6.4h-1.7L7.8 8.9Z" />
    </svg>
  );
}

const strokeIconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  width: 28,
  height: 28,
  "aria-hidden": true,
} as const;

function ZapIcon() {
  return (
    <svg {...strokeIconProps} xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg {...strokeIconProps} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg {...strokeIconProps} xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

/* ─── Navigation ─── */
function SiteNav() {
  return (
    <nav className="ml-nav" aria-label="Primary navigation">
      <div className="ml-container ml-nav-inner">
        <Link className="ml-brand" to="/">
          <EnvelopeMark />
          <span className="ml-brand-name">MailLayer</span>
        </Link>

        <div className="ml-nav-right">
          <div className="ml-nav-links">
            <DocsVersionLink>Docs</DocsVersionLink>
            <DocsVersionLink docsPath="/docs/getting-started/quickstart">
              Examples
            </DocsVersionLink>
            <a href={githubUrl} rel="noreferrer" target="_blank">
              GitHub
            </a>
          </div>
          <a
            className="ml-nav-github"
            href={githubUrl}
            rel="noreferrer"
            target="_blank"
            aria-label="MailLayer on GitHub"
          >
            <GithubMark size={18} />
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="ml-hero" aria-labelledby="landing-heading">
      <div className="ml-container">
        <p className="ml-eyebrow">Open-source email SDK</p>
        <span className="ml-eyebrow-rule" aria-hidden="true" />

        <h1 id="landing-heading" className="ml-hero-title">
          Send emails
          <br />
          from your code.
          <span className="ml-caret" aria-hidden="true" />
        </h1>

        <p id="landing-summary" className="ml-hero-summary">
          MailLayer is an open-source SDK to send emails with any provider. No
          lock-in, no extra infrastructure.
        </p>

        <DocsVersionLink
          className="ml-link-arrow"
          docsPath="/docs/getting-started/quickstart"
        >
          Get started
          <ArrowRight />
        </DocsVersionLink>
      </div>
    </section>
  );
}

/* ─── Feature row ─── */
const features = [
  {
    title: "Provider-flexible",
    desc: "Works with Resend, SMTP, SendGrid, AWS SES and more.",
    icon: <ZapIcon />,
  },
  {
    title: "Typed & minimal",
    desc: "Clean API with TypeScript types out of the box.",
    icon: <CodeIcon />,
  },
  {
    title: "Framework agnostic",
    desc: "Use it in any Node.js environment.",
    icon: <FileIcon />,
  },
  {
    title: "Open source",
    desc: "Inspect, extend, and make it yours.",
    icon: <GithubMark size={28} />,
  },
] as const;

function FeatureRow() {
  return (
    <section className="ml-features" aria-label="Why MailLayer">
      <div className="ml-container ml-features-grid">
        {features.map((feature) => (
          <div className="ml-feature" key={feature.title}>
            <div className="ml-feature-icon" aria-hidden="true">
              {feature.icon}
            </div>
            <h2 className="ml-feature-title">{feature.title}</h2>
            <p className="ml-feature-desc">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── "What you get back." response section ─── */
function ResponseSection() {
  return (
    <section className="ml-response">
      <div className="ml-container ml-response-grid">
        <div className="ml-response-copy">
          <h2 className="ml-response-title">What you get back.</h2>
          <p className="ml-response-desc">
            A clean response with the actual result — not just a boolean. Know
            which adapter handled the send, the {"provider's"} message id, and
            the raw response behind it.
          </p>
          <DocsVersionLink
            className="ml-link-arrow"
            docsPath="/docs/getting-started/quickstart"
          >
            View example
            <ArrowRight />
          </DocsVersionLink>
        </div>

        <div
          className="ml-json"
          role="region"
          aria-label="MailLayer send result example"
        >
          <pre className="ml-json-pre">
            <code>
              <span className="ml-json-p">{"{"}</span>
              {"\n    "}
              <span className="ml-json-k">{'"adapter"'}</span>
              <span className="ml-json-p">{": "}</span>
              <span className="ml-json-s">{'"resend"'}</span>
              <span className="ml-json-p">{","}</span>
              {"\n    "}
              <span className="ml-json-k">{'"id"'}</span>
              <span className="ml-json-p">{": "}</span>
              <span className="ml-json-s">{'"f1a2b3c4"'}</span>
              <span className="ml-json-p">{","}</span>
              {"\n    "}
              <span className="ml-json-k">{'"raw"'}</span>
              <span className="ml-json-p">{": "}</span>
              <span className="ml-json-p">{"{"}</span>
              {"\n        "}
              <span className="ml-json-k">{'"id"'}</span>
              <span className="ml-json-p">{": "}</span>
              <span className="ml-json-s">{'"f1a2b3c4"'}</span>
              {"\n    "}
              <span className="ml-json-p">{"}"}</span>
              {"\n"}
              <span className="ml-json-p">{"}"}</span>
              {"\n"}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Docs", href: "/docs", kind: "docs" as const },
      {
        label: "Examples",
        href: "/docs/getting-started/quickstart",
        kind: "docs" as const,
      },
      { label: "GitHub", href: githubUrl, kind: "external" as const },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Guide", href: "/docs", kind: "docs" as const },
      { label: "API Reference", href: "/docs/reference", kind: "docs" as const },
      {
        label: "Contributing",
        href: `${githubUrl}/blob/main/CONTRIBUTING.md`,
        kind: "external" as const,
      },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/terms", kind: "route" as const },
      { label: "Privacy", href: "/privacy", kind: "route" as const },
      {
        label: "Security",
        href: `${githubUrl}/blob/main/SECURITY.md`,
        kind: "external" as const,
      },
    ],
  },
] as const;

const footerSocials = [
  {
    label: "MailLayer on GitHub",
    href: githubUrl,
    icon: <GithubMark size={18} />,
  },
  {
    label: "MailLayer on X",
    href: "https://x.com/grimcodes",
    icon: <XMark size={16} />,
  },
] as const;

function SiteFooter() {
  return (
    <footer className="ml-footer">
      <div className="ml-container ml-footer-grid">
        <div className="ml-footer-brand">
          <Link className="ml-brand" to="/">
            <EnvelopeMark size={24} />
            <span className="ml-brand-name">MailLayer</span>
          </Link>
          <p className="ml-footer-tagline">
            An open-source email SDK to send emails with any provider.
          </p>
          <div className="ml-footer-socials">
            {footerSocials.map(({ label, href, icon }) => (
              <a key={label} href={href} rel="noreferrer" target="_blank" aria-label={label}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {footerColumns.map(({ heading, links }) => (
          <nav className="ml-footer-col" aria-label={heading} key={heading}>
            <p className="ml-footer-heading">{heading}</p>
            <ul>
              {links.map(({ label, href, kind }) => (
                <li key={label}>
                  {kind === "docs" ? (
                    <DocsVersionLink docsPath={href}>{label}</DocsVersionLink>
                  ) : kind === "route" ? (
                    <Link to={href}>{label}</Link>
                  ) : (
                    <a href={href} rel="noreferrer" target="_blank">
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="ml-container">
        <div className="ml-footer-bottom">
          <p>© 2026 MailLayer. Open source.</p>
        </div>
      </div>
    </footer>
  );
}
