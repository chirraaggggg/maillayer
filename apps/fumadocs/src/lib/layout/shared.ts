export const appName = "MailLayer";

export const productTagline = "One API. Every email provider. Fully open source.";

export const appDescription = `${productTagline} Send transactional email with the providers you already use.`;

export const docsRoute = "/docs";

export const siteUrl = (import.meta.env.VITE_SITE_URL ?? "https://maillayer.dev").replace(/\/$/, "");

export const siteOgImagePath = "/og/maillayer.png";

export const siteOgImageVersion = import.meta.env.VITE_OG_IMAGE_VERSION || "dev";

export const siteOgImageUrl = `${siteUrl}${siteOgImagePath}?v=${encodeURIComponent(siteOgImageVersion)}`;

export const gitConfig = {
  user: "chirraaggggg",
  repo: "maillayer",
  branch: "main",
};
