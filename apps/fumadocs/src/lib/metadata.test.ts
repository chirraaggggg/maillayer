import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

import {
  buildDocsStructuredData,
  homeStructuredData,
  siteImageAlt,
  siteMeta,
  siteTitle,
} from "@/lib/metadata";
import { providers } from "@/lib/providers";
import { appDescription, llmsOverview, siteOgImageUrl } from "@/lib/shared";

const findByName = (name: string) =>
  siteMeta.filter((meta) => "name" in meta && meta.name === name);

const findByProperty = (property: string) =>
  siteMeta.filter((meta) => "property" in meta && meta.property === property);

const providerNames = providers.map((provider) => provider.name);

const apiProviderCount = providers.filter((provider) => provider.key !== "smtp").length;

describe("site social metadata", () => {
  test("uses the canonical PNG open graph image exactly once", () => {
    const ogImages = findByProperty("og:image");
    const twitterImages = findByName("twitter:image");

    expect(ogImages).toHaveLength(1);
    expect(twitterImages).toHaveLength(1);
    expect(ogImages[0]?.content).toBe(siteOgImageUrl);
    expect(twitterImages[0]?.content).toBe(siteOgImageUrl);

    const ogImageAlts = findByProperty("og:image:alt");
    const twitterImageAlts = findByName("twitter:image:alt");
    expect(ogImageAlts).toHaveLength(1);
    expect(twitterImageAlts).toHaveLength(1);
    expect(ogImageAlts[0]?.content).toBe(siteImageAlt);
    expect(twitterImageAlts[0]?.content).toBe(siteImageAlt);

    const imageUrl = new URL(siteOgImageUrl);
    expect(imageUrl.pathname).toBe("/og/maillayer.png");
    expect(imageUrl.searchParams.get("v")).toMatch(/\S+/);
  });

  test("keeps the Twitter preview on the large image card", () => {
    const twitterCards = findByName("twitter:card");

    expect(twitterCards).toHaveLength(1);
    expect(twitterCards[0]?.content).toBe("summary_large_image");
  });
});

describe("homepage product explanation", () => {
  const home = readFileSync(new URL("../routes/index.tsx", import.meta.url), "utf8");

  test("shows one send-result example beside the product headline", () => {
    // The editorial hero keeps one H1 with the product headline.
    expect(home).toContain('id="landing-heading"');
    expect(home).toContain("Send emails");
    expect(home).toContain("from your code.");
    expect(home.match(/aria-label="MailLayer send result example"/g)).toHaveLength(1);
    // The result card renders tokens as JSX spans, so match the literals it contains.
    expect(home).toContain('"adapter"');
    expect(home).toContain('"resend"');
    expect(home).toContain('"f1a2b3c4"');
    expect(home).not.toContain("landing-mobile-only");
  });

  test("links practical next steps to existing current docs", () => {
    for (const match of home.matchAll(/docsPath="(\/docs[^"{}]*)"/g)) {
      const path = match[1]!.replace(/^\/docs\/?/, "");
      const base = new URL(`../../content/docs/${path}`, import.meta.url);
      expect(existsSync(`${base.pathname}.mdx`) || existsSync(`${base.pathname}/index.mdx`)).toBe(
        true,
      );
    }
  });

  test("leads every product surface with the same positioning", () => {
    const readmes = [
      readFileSync(new URL("../../../../README.md", import.meta.url), "utf8"),
      readFileSync(new URL("../../../../packages/email-sdk/README.md", import.meta.url), "utf8"),
      readFileSync(new URL("../../content/docs/index.mdx", import.meta.url), "utf8"),
    ];

    expect(appDescription.startsWith("One API. Every email provider. Fully open source.")).toBe(
      true,
    );
    expect(siteTitle).toContain("One API. Every email provider. Fully open source.");

    for (const text of [appDescription, ...readmes]) {
      expect(text).toMatch(/provider account|providers you already|existing provider/);
      expect(text).not.toMatch(/guarantee[sd]? (inbox )?delivery|99\.\d+%|testimonial/i);
    }

    // Counts derive from the provider registry so a new adapter fails here until
    // every product surface is updated, instead of silently drifting.
    for (const text of readmes) {
      expect(text).toContain(`${apiProviderCount} provider API`);
      expect(text).toContain(`${providers.length} adapters total`);
    }

    expect(llmsOverview).toContain(`${providers.length} adapters total`);
    const webpage = homeStructuredData["@graph"].find((node) => node["@type"] === "WebPage");
    expect(webpage?.speakable.cssSelector).toEqual(["#landing-heading", "#landing-summary"]);
    const faq = homeStructuredData["@graph"].find((node) => node["@type"] === "FAQPage");
    expect(faq?.mainEntity[0]?.acceptedAnswer.text.startsWith("Email, without the lock-in.")).toBe(
      true,
    );
  });

  test("keeps machine-readable copy within the runtime and delivery boundaries", () => {
    expect(appDescription).toMatch(/provider account|providers you already use/);
    expect(llmsOverview).toContain("Node.js 20+ or Bun 1.1+");
    expect(llmsOverview).toContain("not delivery");
    expect(llmsOverview).toContain("direct provider SDK is sufficient");

    const software = homeStructuredData["@graph"].find(
      (node) => node["@type"] === "SoftwareApplication",
    );

    expect(software?.runtimePlatform).toEqual(["Node.js 20+", "Bun 1.1+"]);
    const webpage = homeStructuredData["@graph"].find((node) => node["@type"] === "WebPage");

    for (const selector of webpage?.speakable.cssSelector ?? []) {
      expect(home).toContain(`id="${selector.slice(1)}"`);
    }
  });
});

describe("documentation structured data", () => {
  test("describes current docs as a canonical TechArticle with breadcrumbs", () => {
    const canonicalUrl = "https://maillayer.dev/docs/adapters/resend";

    const structuredData = buildDocsStructuredData({
      canonicalUrl,
      dateModified: "2026-07-22",
      description: "Configure the Resend adapter for MailLayer.",
      title: "Resend",
    });

    expect(structuredData["@graph"][0]).toMatchObject({
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      headline: "Resend",
      dateModified: "2026-07-22",
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
    });
    expect(structuredData["@graph"][1]).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "MailLayer", item: "https://maillayer.dev" },
        { position: 2, name: "Documentation", item: "https://maillayer.dev/docs" },
        { position: 3, name: "Resend", item: canonicalUrl },
      ],
    });
  });
});

describe("machine-facing agent files", () => {
  const machineFiles = {
    "public/agents.md": readFileSync(new URL("../../public/agents.md", import.meta.url), "utf8"),
    "public/.well-known/agent.json": readFileSync(
      new URL("../../public/.well-known/agent.json", import.meta.url),
      "utf8",
    ),
    "public/.well-known/agent-skills": readFileSync(
      new URL("../../public/.well-known/agent-skills", import.meta.url),
      "utf8",
    ),
    // llmsOverview is the same claim in the llms.txt source.
    "src/lib/shared.ts": readFileSync(new URL("./shared.ts", import.meta.url), "utf8"),
  };

  test("report the current adapter count", () => {
    const stale = Object.entries(machineFiles).filter(([, text]) => {
      const counts = [...text.matchAll(/(\d+) provider API/g)].map((match) => Number(match[1]));

      return counts.length === 0 || counts.some((count) => count !== apiProviderCount);
    });

    expect(stale.map(([file]) => file)).toEqual([]);
  });

  test("agents.md names every registered adapter in its supported list", () => {
    // The guide wraps prose at ~70 columns, so the list can span lines.
    const agentsMd = machineFiles["public/agents.md"].replace(/\s+/g, " ");
    const list = agentsMd.match(/Supported providers: ([^.]+)\./)?.[1] ?? "";
    const entries = list.split(/,|\band\b/).map((entry) => entry.trim());
    const missing = providerNames.filter((name) => !entries.includes(name));

    expect(missing).toEqual([]);
  });
});

describe("supported provider structured data", () => {
  const providerNames = providers.map((provider) => provider.name);

  test("lists every registered adapter in the supported providers ItemList", () => {
    const itemList = homeStructuredData["@graph"].find((node) => node["@type"] === "ItemList");

    expect(itemList?.itemListElement.map((item) => item.name)).toEqual(providerNames);
    expect(itemList?.numberOfItems).toBe(providerNames.length);
  });

  test("names every registered adapter in the supported providers FAQ answer", () => {
    const faq = homeStructuredData["@graph"].find((node) => node["@type"] === "FAQPage");

    const answer = faq?.mainEntity.find((question) =>
      question.name.includes("Which email providers"),
    )?.acceptedAnswer.text;

    for (const name of providerNames) {
      expect(answer).toContain(name);
    }
  });
});
