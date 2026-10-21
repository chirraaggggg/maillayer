import { describe, expect, test } from "bun:test";

import {
  dedupeSlug,
  estimateReadTime,
  excerptFromMarkdown,
  mapNotraPost,
  type NotraPostInput,
  renderMarkdownToSafeHtml,
  slugify,
  stripLeadingH1,
  toDateKey,
} from "../../scripts/notra-content";
import { getBlogPostMetaTitle } from "./blog";

function notraPost(overrides: Partial<NotraPostInput> = {}): NotraPostInput {
  return {
    id: "post_1",
    title: "My First Post",
    slug: null,
    content: "",
    markdown: "# My First Post\n\nThe body starts here.",
    status: "published",
    createdAt: "2026-06-01T12:00:00.000Z",
    updatedAt: "2026-06-02T08:30:00.000Z",
    ...overrides,
  };
}

describe("slugify", () => {
  test("lowercases, strips punctuation, and collapses separators", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("Multiple   spaces")).toBe("multiple-spaces");
  });

  test("strips diacritics", () => {
    expect(slugify("Café Crème")).toBe("cafe-creme");
  });
});

describe("dedupeSlug", () => {
  test("suffixes collisions and tracks seen slugs", () => {
    const seen = new Set<string>();
    expect(dedupeSlug("post", seen)).toBe("post");
    expect(dedupeSlug("post", seen)).toBe("post-2");
    expect(dedupeSlug("post", seen)).toBe("post-3");
  });
});

describe("toDateKey", () => {
  test("normalizes an ISO timestamp to a UTC date key", () => {
    expect(toDateKey("2026-06-01T12:34:56.000Z")).toBe("2026-06-01");
  });
});

describe("estimateReadTime", () => {
  test("rounds to whole minutes at 200 wpm with a one-minute floor", () => {
    expect(estimateReadTime("word ".repeat(200))).toBe("1 min read");
    expect(estimateReadTime("word ".repeat(450))).toBe("2 min read");
    expect(estimateReadTime("")).toBe("1 min read");
  });
});

describe("stripLeadingH1 + excerptFromMarkdown", () => {
  test("drops a single leading H1", () => {
    expect(stripLeadingH1("# Title\n\nBody")).toBe("Body");
    expect(stripLeadingH1("No heading here")).toBe("No heading here");
  });

  test("uses the first prose paragraph, skipping the title, headings, and images", () => {
    const markdown = "# Title\n\n![cover](https://img/x.png)\n\n## Section\n\nThe real intro.";
    expect(excerptFromMarkdown(markdown)).toBe("The real intro.");
  });

  test("truncates long paragraphs at a word boundary", () => {
    const excerpt = excerptFromMarkdown(`Intro. ${"alpha ".repeat(60)}`);
    expect(excerpt.length).toBeLessThanOrEqual(156);
    expect(excerpt.endsWith("…")).toBe(true);
  });
});

describe("renderMarkdownToSafeHtml", () => {
  test("renders Markdown structure", () => {
    const html = renderMarkdownToSafeHtml("## Heading\n\nA paragraph with **bold**.");
    expect(html).toContain("<h2");
    expect(html).toContain("<strong>bold</strong>");
  });

  test("removes script tags and their contents", () => {
    const html = renderMarkdownToSafeHtml('<script>alert("xss")</script>\n\nSafe copy.');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert");
    expect(html).toContain("Safe copy.");
  });

  test("hardens external links and lazy-loads images", () => {
    const link = renderMarkdownToSafeHtml("Visit [Example](https://example.com).");
    expect(link).toContain('target="_blank"');
    expect(link).toContain('rel="noopener noreferrer"');

    const image = renderMarkdownToSafeHtml("![cat](https://example.com/cat.png)");
    expect(image).toContain('loading="lazy"');
  });

  // Regression coverage for the sanitize-html >= 2.18.1 upgrade (GHSA-374f-7chj-9948,
  // GHSA-x3q4-9hxx-gx8m, GHSA-cv27-6wvh-8x7j). Notra HTML is third-party content,
  // so every advisory vector for that version range is pinned here.
  test("strips javascript:, vbscript:, and data:text/html URLs from links", () => {
    const vectors = [
      "[click me](javascript:alert(1))",
      '<a href="javascript:alert(1)">click me</a>',
      '<a href="JaVaScRiPt:alert(1)">click me</a>',
      '<a href="vbscript:msgbox(1)">click me</a>',
      "[click me](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)",
    ];

    for (const vector of vectors) {
      const html = renderMarkdownToSafeHtml(vector);
      expect(html).not.toContain("javascript:");
      expect(html).not.toContain("vbscript:");
      expect(html).not.toContain("data:text/html");
    }
  });

  test("strips event-handler and style attributes from otherwise-allowed tags", () => {
    const image = renderMarkdownToSafeHtml('<img src="https://example.com/x.png" onerror="alert(1)">');
    expect(image).toContain("<img");
    expect(image).not.toContain("onerror");
    expect(image).not.toContain("alert");

    const styled = renderMarkdownToSafeHtml('<p style="background:url(javascript:alert(1))">text</p>');
    expect(styled).not.toContain("style");
    expect(styled).not.toContain("javascript:");
    expect(styled).toContain("text");
  });

  test("discards meta refresh redirects carrying javascript: or data: URLs", () => {
    const html = renderMarkdownToSafeHtml(
      '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
    );

    expect(html).not.toContain("<meta");
    expect(html).not.toContain("http-equiv");
    expect(html).not.toContain("javascript:");
  });

  test("does not leak markup hidden behind implied-close noscript breakouts", () => {
    // GHSA-x3q4-9hxx-gx8m (fixed in 2.18.0): an implied close ended the noscript
    // discard region early and smuggled the trailing markup out as live HTML.
    // Verified: on 2.17.7 this exact input emits the <img> below.
    const html = renderMarkdownToSafeHtml(
      '<p>Hi</p><div><noscript></div><img src="https://beacon.example/t.gif"></noscript>',
    );

    expect(html).toContain("<p>Hi</p>");
    expect(html).toContain("<div></div>");
    expect(html).not.toContain("<noscript");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("beacon.example");
  });

  test("does not resurrect javascript: URLs through namespaced SMIL animation elements", () => {
    // GHSA-374f-7chj-9948 (fixed in 2.18.0): a namespace-prefixed svg:animate
    // evaded the SMIL animation protection. This allowlist already drops svg
    // entirely, so the vector is pinned here as defense in depth.
    // Wrapped in a block-level tag so marked passes the raw HTML through and the
    // sanitizer, not Markdown escaping, is what neutralizes the vector.
    const html = renderMarkdownToSafeHtml(
      '<div><svg><a href="#safe"><svg:animate attributeName="href" values="#safe;javascript:alert(1)" dur=".01s" fill="freeze"></svg:animate><text>Click</text></a></svg></div>',
    );

    expect(html).not.toContain("<svg");
    expect(html).not.toContain("animate");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("svg:animate");
  });
});

describe("mapNotraPost", () => {
  test("maps a published post into the blog shape", () => {
    const mapped = mapNotraPost(notraPost(), new Set());

    expect(mapped).not.toBeNull();
    expect(mapped?.post.slug).toBe("my-first-post");
    expect(mapped?.post.image).toBe("/og/blog/my-first-post.svg");
    expect(mapped?.post.publishedAt).toBe("2026-06-01");
    expect(mapped?.post.tags).toEqual([]);
    expect(mapped?.post.description).toBe("The body starts here.");
    // The page renders the title separately, so the body H1 is stripped.
    expect(mapped?.html).not.toContain("<h1");
    expect(mapped?.html).toContain("The body starts here.");
  });

  test("prefers an explicit slug when present", () => {
    const mapped = mapNotraPost(notraPost({ slug: "custom-slug" }), new Set());
    expect(mapped?.post.slug).toBe("custom-slug");
  });

  test("sanitizes an explicit slug into a single path segment", () => {
    const mapped = mapNotraPost(notraPost({ slug: "release/notes" }), new Set());
    expect(mapped?.post.slug).toBe("release-notes");
  });

  test("skips drafts", () => {
    expect(mapNotraPost(notraPost({ status: "draft" }), new Set())).toBeNull();
  });

  test("skips posts without a Markdown body (image-type posts)", () => {
    // @usenotra/sdk 1.3.x: image posts carry `markdown: null` and put an image
    // URL in `content` — there is no prose body for the blog to render.
    const mapped = mapNotraPost(
      notraPost({ markdown: null, content: "https://cdn.usenotra.com/posts/post_1.png" }),
      new Set(),
    );

    expect(mapped).toBeNull();
  });
});

describe("getBlogPostMetaTitle", () => {
  test("appends the suffix and keeps titles within the search-snippet limit", () => {
    const short = getBlogPostMetaTitle("Sending email without a vendor lock-in");
    expect(short.endsWith(" - MailLayer")).toBe(true);
    expect(short.length).toBeLessThanOrEqual(68);

    const long = getBlogPostMetaTitle(
      "An extremely long blog post title that goes well beyond the search snippet limit",
    );

    expect(long.endsWith(" - MailLayer")).toBe(true);
    expect(long.length).toBeLessThanOrEqual(68);
  });
});
