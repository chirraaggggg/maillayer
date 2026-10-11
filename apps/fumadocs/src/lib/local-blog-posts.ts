import type { BlogPost } from "./blog-types";

export const localBlogPosts: readonly BlogPost[] = [
  {
    slug: "maillayer-v1-safer-typescript-transactional-email",
    title: "MailLayer v1: A Safer TypeScript API for Transactional Email",
    description:
      "Switching transactional email providers looks like an import change. Preserving behavior across failures and uncertain delivery is the difficult part.",
    publishedAt: "2026-07-22",
    updatedAt: "2026-07-22",
    readTime: "10 min read",
    image: "/og/blog/maillayer-v1-safer-typescript-transactional-email.svg",
    imageAlt: "MailLayer v1 transactional email routing and delivery safety",
    tags: ["TypeScript", "Transactional email", "Open source"],
  },
];
