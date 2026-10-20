import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { isValidElement, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";

import { versionDocsHref } from "@/lib/versions";

import { AdapterPricing } from "./adapter-pricing";
import { AdapterVerification } from "./adapter-verification";
import { AdapterCapabilitySupport, AdapterFieldSupport } from "./adapter-support";
import { CommunityPluginRegistry } from "./community-plugin-registry";
import { EmailExample, EmailExampleGallery } from "./email-examples";
import { PackageInstallTabs } from "./package-install-tabs";
import { ProviderBadge, ProviderGrid } from "./provider-catalog";
import { ProviderExplorer } from "./provider-explorer";

type MdxComponentOptions = {
  docsBasePath?: string;
};

export function getMDXComponents(components?: MDXComponents, options: MdxComponentOptions = {}) {
  const docsBasePath = options.docsBasePath ?? "/docs";

  return {
    ...defaultMdxComponents,
    a: (props) => {
      const href = versionDocsHref(props.href, docsBasePath);

      return href ? (
        <defaultMdxComponents.a {...props} href={href} />
      ) : (
        <defaultMdxComponents.a {...props} />
      );
    },
    Card: (props) => (
      <defaultMdxComponents.Card
        {...props}
        className={["docs-card", props.className].filter(Boolean).join(" ")}
        href={versionDocsHref(props.href, docsBasePath)}
      />
    ),
    Accordion,
    Accordions,
    AdapterPricing,
    AdapterVerification,
    AdapterCapabilitySupport,
    AdapterFieldSupport,
    CommunityPluginRegistry,
    EmailExample,
    EmailExampleGallery,
    File,
    Files,
    Folder,
    PackageInstallTabs,
    ProviderBadge,
    ProviderExplorer,
    ProviderGrid,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    pre: DocsCodeBlock,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

/* ---------- Social SDK-style code blocks ---------- */

const languageLabels = new Map<string, string>([
  ["ts", "TypeScript"],
  ["tsx", "TSX"],
  ["js", "JavaScript"],
  ["jsx", "JSX"],
  ["mjs", "JavaScript"],
  ["bash", "Bash"],
  ["sh", "Shell"],
  ["shell", "Shell"],
  ["json", "JSON"],
  ["jsonc", "JSON"],
  ["css", "CSS"],
  ["html", "HTML"],
  ["md", "Markdown"],
  ["mdx", "MDX"],
  ["yaml", "YAML"],
  ["yml", "YAML"],
  ["python", "Python"],
  ["py", "Python"],
  ["plaintext", "Text"],
  ["env", "Env"],
  ["sql", "SQL"],
  ["http", "HTTP"],
  ["toml", "TOML"],
  ["ini", "INI"],
  ["txt", "Text"],
]);

/** Find the `language-*` marker shiki leaves on the nested code element. */
function findCodeLanguage(node: ReactNode): string | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findCodeLanguage(child);

      if (found !== undefined) return found;
    }

    return undefined;
  }

  if (isValidElement<{ children?: ReactNode; className?: string }>(node)) {
    const match = /language-([\w+-]+)/.exec(node.props.className ?? "");

    if (match?.[1] !== undefined) return match[1];

    return findCodeLanguage(node.props.children);
  }

  return undefined;
}

/**
 * Renders every fenced code block as a bordered card with a language header
 * and copy button, matching the Social SDK documentation design.
 */
function DocsCodeBlock({ children, ...preProps }: ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const language = findCodeLanguage(children);
  const languageLabel = language ? (languageLabels.get(language) ?? language) : undefined;
  // Meta like ```ts title="send.ts" lands on the pre as a title attribute;
  // show it in the header the way the reference design shows file names.
  const title = preProps.title;
  const label = title ?? languageLabel ?? "Code";
  const badge = language ? language.slice(0, 2) : "</>";

  return (
    <figure className="ds-code">
      <figcaption className="ds-code__header">
        <span className="ds-code__badge" aria-hidden="true">
          {badge}
        </span>
        <span className="ds-code__lang">{label}</span>
        <button
          type="button"
          className={copied ? "ds-code__copy ds-code__copy--success" : "ds-code__copy"}
          aria-label={copied ? "Copied to clipboard" : "Copy code"}
          onClick={() => {
            const text = preRef.current?.textContent;

            if (text === null || text === undefined) return;

            void navigator
              .clipboard.writeText(text)
              .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              })
              .catch(() => {
                // Clipboard access can be denied (permissions, headless).
                // Leave the button idle instead of raising an unhandled rejection.
              });
          }}
        >
          {copied ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12.5 10 17.5 19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="9"
                y="9"
                width="11"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </figcaption>
      <div className="ds-code__body">
        <pre ref={preRef} {...preProps}>
          {children}
        </pre>
      </div>
    </figure>
  );
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
