import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { z } from "zod";

import communityPlugins from "../../content/community/plugins.json";
import { buildAdapterFaq, getAdapterSupportEntry } from "./adapter-faq";
import { communityEntrySchema } from "./community-registry";
import { resolveDocsIcon } from "./docs-icons";
import { renderComponentsAsMarkdown } from "./markdown-components";
import { absolutizeSiteLinks } from "./markdown-links";
import { docsRoute, siteUrl } from "./shared";
import {
  getDocsVersionBase,
  latestDocsVersion,
  type DocsVersion,
} from "./versions";

const sources = {
  docs: loader({
    source: docs.toFumadocsSource(),
    baseUrl: docsRoute,
    icon: resolveDocsIcon,
  }),
};

export const source = sources[latestDocsVersion.collection];

export function getDocsSource(version: DocsVersion) {
  return sources[version.collection];
}

export function markdownPathToSlugs(segs: string[]) {
  if (segs.length === 0) return [];

  const out = [...segs];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, "");

  if (out[out.length - 1] === "index") out.pop();

  return out;
}

export function slugsToMarkdownPath(slugs: string[], version: DocsVersion = latestDocsVersion) {
  const segments = [...slugs];

  if (segments.length === 0) {
    segments.push("index.md");
  } else {
    segments[segments.length - 1] += ".md";
  }

  return {
    segments,
    url: `${getDocsVersionBase(version)}/${segments.join("/")}`,
  };
}

export function getPageMarkdownUrl(slugs: string[]) {
  const segments = [...slugs];

  if (segments.length === 0) {
    segments.push("index.md");
  } else {
    segments[segments.length - 1] += ".md";
  }

  return {
    segments,
    url: `${docsRoute}/${segments.join("/")}`,
  };
}

export async function getLLMText(
  page: (typeof source)["$inferPage"],
  version: DocsVersion = latestDocsVersion,
) {
  const docsBasePath = getDocsVersionBase(version);

  const processed = absolutizeSiteLinks(
    renderComponentsAsMarkdown(await page.data.getText("processed"), {
      currentVersion: version.current,
    })
      .replaceAll("](/docs/", `](${docsBasePath}/`)
      .replaceAll('href="/docs/', `href="${docsBasePath}/`),
  );

  const markdown = inlineCommunityRegistry(processed, page.path);

  const adapterEntry = version.current ? getAdapterSupportEntry(page.path) : undefined;
  const faq = adapterEntry ? renderFaqMarkdown(buildAdapterFaq(adapterEntry)) : "";

  return `# ${page.data.title} (${siteUrl}${page.url})

${markdown}${faq}`;
}

// The community registry renders from plugins.json, not the MDX body, so the
// markdown mirror would otherwise show a bare JSX tag and no entries. Substitute
// the current registry data so agents can answer "is there a community adapter
// for X?" without evaluating components.
const COMMUNITY_REGISTRY_PAGE = "plugins/community.mdx";

const communityRegistryTag = /<CommunityPluginRegistry[^>]*\/?>\s*/;

function inlineCommunityRegistry(markdown: string, pagePath: string) {
  if (!pagePath.endsWith(COMMUNITY_REGISTRY_PAGE)) return markdown;

  const registryMarkdown = renderCommunityRegistryMarkdown();

  if (communityRegistryTag.test(markdown)) {
    return markdown.replace(communityRegistryTag, `${registryMarkdown}\n\n`);
  }

  return `${markdown}\n\n${registryMarkdown}\n`;
}

function renderCommunityRegistryMarkdown() {
  const entries = z.array(communityEntrySchema).parse(communityPlugins);

  if (entries.length === 0) {
    return "No community plugins are listed yet. Community packages are listed by pull request after their registry entry passes the static checks.";
  }

  return entries
    .map(
      (entry) =>
        `- [${entry.name}](${entry.href}) (\`${entry.package}\`, ${entry.kind}, ${entry.status}): ${entry.description} Source: ${entry.repo}. Maintainer: ${entry.maintainer}.`,
    )
    .join("\n");
}

function renderFaqMarkdown(items: { question: string; answer: string }[]) {
  return `

## Frequently asked questions

${items.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}
`;
}
