import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import browserCollections from "collections/browser";
import type { TOCItemType } from "fumadocs-core/toc";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import type { ReactNode } from "react";

import { useMDXComponents } from "@/components/mdx";
import { getDocsSource, slugsToMarkdownPath } from "@/lib/source";
import {
  type DocsVersionCollection,
  getDocsVersionBase,
  getDocsVersionHref,
  latestDocsVersion,
  resolveDocsVersionedSlugs,
} from "@/lib/versions";
import { appName, siteOgImageUrl, siteUrl } from "@/lib/shared";
import { buildDocsStructuredData, siteImageAlt } from "@/lib/metadata";
import docsLastmod from "@/lib/docs-lastmod.generated.json";
import { getAdapterSupportEntry } from "@/lib/adapter-faq";
import { buildAdapterFaq } from "@/lib/adapter-faq";
import { getLatestDocsRedirect } from "@/lib/docs-redirects";
import { DocsShell } from "@/components/docs-shell";

export const Route = createFileRoute("/docs/$")({
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/").filter(Boolean) ?? [];
    const data = await loader({ data: slugs });
    await getClientLoader(data.versionCollection).preload(data.path);

    return data;
  },
  head: ({ loaderData: data }) => {
    const title = data?.title
      ? data.title === appName
        ? `${appName} Documentation - TypeScript email SDK`
        : `${data.title} - ${appName}`
      : appName;

    const description =
      data?.description ?? "MailLayer documentation for TypeScript email adapters.";

    const docsPath = data?.path.replace(/\/?index\.mdx$/, "").replace(/\.mdx$/, "");

    const canonicalPath = data?.docsBasePath
      ? docsPath
        ? `${data.docsBasePath}/${docsPath}`
        : data.docsBasePath
      : "/docs";

    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    // Old-version docs stay reachable (version picker, inbound links) but must
    // not compete with current docs in search; "follow" preserves link equity.
    const isCurrentVersion = !data || data.docsBasePath === "/docs";

    const dateModified = data ? (docsLastmodByPath.get(data.path) ?? "2026-06-01") : "2026-06-01";

    const adapterEntry = data ? getAdapterSupportEntry(data.path) : undefined;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(isCurrentVersion ? [] : [{ name: "robots", content: "noindex, follow" }]),
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonicalUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: siteOgImageUrl },
        { name: "twitter:image:alt", content: siteImageAlt },
        ...(data && isCurrentVersion
          ? [
              {
                "script:ld+json": buildDocsStructuredData({
                  canonicalUrl,
                  dateModified,
                  description,
                  faq: adapterEntry ? buildAdapterFaq(adapterEntry) : undefined,
                  title: data.title,
                }),
              },
            ]
          : []),
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
        // Advertise the raw markdown mirror every docs page already serves at
        // <url>.md so agents can discover it without knowing the convention.
        ...(data
          ? [
              {
                rel: "alternate",
                type: "text/markdown",
                href: `${siteUrl}${data.markdownUrl}`,
              },
            ]
          : []),
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Lora:wght@400;500;600&display=swap",
        },
      ],
    };
  },
  component: Page,
});

const docsLastmodByPath = new Map<string, string>(Object.entries(docsLastmod));

const loader = createServerFn({
  method: "GET",
})
  .inputValidator((slugs: string[]) => slugs)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: slugs }) => {
    const resolved = resolveDocsVersionedSlugs(slugs);
    const movedPage = resolved.version.current ? getLatestDocsRedirect(resolved.slugs) : undefined;

    if (movedPage) {
      throw redirect({
        href: `/docs/${movedPage}`,
        statusCode: 308,
      });
    }

    const docsSource = getDocsSource(resolved.version);
    const page = docsSource.getPage(resolved.slugs);

    if (!page) {
      throw resolveMissingVersionedDocsPage(resolved);
    }

    return {
      title: page.data.title,
      description: page.data.description,
      path: page.path,
      markdownUrl: slugsToMarkdownPath(page.slugs, resolved.version).url,
      versionCollection: resolved.version.collection,
      contentPath: resolved.version.contentPath,
      docsBasePath: getDocsVersionBase(resolved.version),
      pageTree: await docsSource.serializePageTree(docsSource.getPageTree()),
    };
  });

function resolveMissingVersionedDocsPage(resolved: ReturnType<typeof resolveDocsVersionedSlugs>) {
  if (resolved.version.current) return notFound();

  const latestPage = getDocsSource(latestDocsVersion).getPage(resolved.slugs);

  if (latestPage) {
    const docsPath = resolved.slugs.length > 0 ? `/docs/${resolved.slugs.join("/")}` : "/docs";

    return redirect({
      href: getDocsVersionHref(latestDocsVersion, docsPath),
      statusCode: 302,
    });
  }

  return redirect({
    href: getDocsVersionBase(resolved.version),
    statusCode: 302,
  });
}

function createDocsClientLoader(collection: (typeof browserCollections)[DocsVersionCollection]) {
  return collection.createClientLoader({
    component(
      { frontmatter, default: MDX, toc },
      // you can define props for the component
      {
        docsBasePath,
        markdownUrl,
        path,
      }: {
        docsBasePath: string;
        markdownUrl: string;
        path: string;
      },
    ) {
      return (
        <DocsPage
          title={frontmatter.title}
          description={frontmatter.description ?? "MailLayer documentation."}
          toc={toc}
          markdownUrl={markdownUrl}
          docsBasePath={docsBasePath}
          pageHref={pageHrefForDocsPath(docsBasePath, path)}
        >
          <MDX components={useMDXComponents(undefined, { docsBasePath })} />
          {docsBasePath === "/docs" ? <AdapterFaq path={path} /> : null}
        </DocsPage>
      );
    },
  });
}

const clientLoaders = {
  docs: createDocsClientLoader(browserCollections.docs),
};

function getClientLoader(collection: DocsVersionCollection) {
  return clientLoaders[collection];
}

function AdapterFaq({ path }: { path: string }) {
  const entry = getAdapterSupportEntry(path);

  if (!entry) return null;

  return (
    <section aria-labelledby="adapter-faq">
      <h2 id="adapter-faq">Frequently asked questions</h2>
      {buildAdapterFaq(entry).map((item) => (
        <div key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </section>
  );
}

function Page() {
  const { docsBasePath, markdownUrl, path, versionCollection } =
    useFumadocsLoader(Route.useLoaderData());

  const contentLoader = getClientLoader(versionCollection);

  return contentLoader.useContent(path, { docsBasePath, markdownUrl, path });
}

/** Turn a docs content path ("getting-started/quickstart.mdx") into its
 * version-aware docs URL, used for sidebar and TOC active states. */
function pageHrefForDocsPath(docsBasePath: string, path: string) {
  const pageSlug = path.replace(/(?:^|\/)index\.mdx$/, "").replace(/\.mdx$/, "");

  return pageSlug ? `${docsBasePath}/${pageSlug}` : docsBasePath;
}

interface DocsPageProps {
  title: string;
  description: string;
  toc: TOCItemType[];
  markdownUrl: string;
  docsBasePath: string;
  pageHref: string;
  children: ReactNode;
}

/**
 * Central documentation page layout.
 *
 * Wraps the fumadocs-core MDX content in the Social SDK-style docs shell:
 * top bar, icon navigation sidebar, reading column, and "On this page" rail.
 * The per-page loader metadata, Markdown mirror, and structured data remain.
 */
export function DocsPage({
  title,
  description,
  toc,
  markdownUrl,
  docsBasePath,
  pageHref,
  children,
}: DocsPageProps) {
  return (
    <DocsShell
      title={title}
      description={description}
      toc={toc}
      markdownUrl={markdownUrl}
      docsBasePath={docsBasePath}
      pageHref={pageHref}
    >
      {children}
    </DocsShell>
  );
}
