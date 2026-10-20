import emailSdkPackage from "../../../../packages/email-sdk/package.json";

export const sdkPackageName = emailSdkPackage.name;

export const latestPublishedVersion = emailSdkPackage.version;

export const currentDocsMajorVersion = 2;

export const docsVersion = `v${currentDocsMajorVersion}`;

export const currentDocsPublishedVersion = getCurrentDocsPublishedVersion(latestPublishedVersion);

export const docsVersionRoutePrefix = "v";

export const docsVersionStorageKey = "maillayer-docs-version";

export function getCurrentDocsPublishedVersion(packageVersion: string) {
  return packageVersion.startsWith(`${currentDocsMajorVersion}.`) ? packageVersion : undefined;
}

export const docsVersions = [
  {
    label: currentDocsPublishedVersion ? "latest" : "v1 preview",
    version: docsVersion,
    description: currentDocsPublishedVersion
      ? "Current v1 SDK, CLI, and docs"
      : "Unreleased v1 SDK, CLI, and docs",
    href: "/docs",
    collection: "docs",
    contentPath: "content/docs",
    current: true,
    external: false,
  },
] as const;

export type DocsVersion = (typeof docsVersions)[number];

export const latestDocsVersion = docsVersions[0];

export type DocsVersionCollection = DocsVersion["collection"];

export function getDocsVersionBySlug(slug: string) {
  return docsVersions.find((version) => getDocsVersionSlug(version) === slug);
}

export function getDocsVersionByStoredValue(value: string | null | undefined) {
  if (!value) return undefined;

  // "latest" tracks whichever version is current, so readers on latest move
  // forward when a new version ships; a specific slug stays pinned.
  if (value === "latest") return latestDocsVersion;

  return getDocsVersionBySlug(value.replace(/^v/, ""));
}

export function getDocsVersionSlug(version: DocsVersion) {
  return version.version.replace(/^v/, "");
}

export function getDocsVersionStorageValue(version: DocsVersion) {
  // Persist the current version as "latest" so a reader on latest tracks future
  // releases instead of pinning to today's version number.
  return version.current ? "latest" : getDocsVersionSlug(version);
}

export function getDocsVersionBase(version: DocsVersion) {
  return version.href;
}

export function resolveDocsVersionedSlugs(slugs: string[]) {
  if (slugs[0] !== docsVersionRoutePrefix || !slugs[1]) {
    return {
      version: latestDocsVersion,
      slugs,
    };
  }

  const version = getDocsVersionBySlug(slugs[1]);

  if (!version) {
    return {
      version: latestDocsVersion,
      slugs: slugs.slice(2),
    };
  }

  return {
    version,
    slugs: slugs.slice(2),
  };
}

export function getDocsVersionHref(version: DocsVersion, pathname = "/docs") {
  const cleanPathname = pathname.split(/[?#]/, 1)[0] ?? "/docs";
  const docsPath = cleanPathname.startsWith("/docs") ? cleanPathname : "/docs";

  const slugs = docsPath
    .replace(/^\/docs\/?/, "")
    .split("/")
    .filter(Boolean);

  const resolved = resolveDocsVersionedSlugs(slugs);
  const pageSlugs = resolved.slugs.join("/");

  if (version.current) {
    return pageSlugs ? `/docs/${pageSlugs}` : "/docs";
  }

  const versionBase = getDocsVersionBase(version);

  return pageSlugs ? `${versionBase}/${pageSlugs}` : versionBase;
}

export function getDocsVersionFromPathname(pathname: string) {
  const slugs = pathname
    .replace(/^\/docs\/?/, "")
    .split("/")
    .filter(Boolean);

  return resolveDocsVersionedSlugs(slugs).version;
}

export function getVersionLinks(version: DocsVersion) {
  const publishedPackageVersion = version.current
    ? currentDocsPublishedVersion
    : getDocsVersionSlug(version);

  return [
    ...(publishedPackageVersion
      ? [
          {
            label: "npm package",
            href: `https://www.npmjs.com/package/${sdkPackageName}/v/${publishedPackageVersion}`,
          },
        ]
      : []),
    {
      label: "Changelog",
      href: "https://github.com/chirraaggggg/maillayer/blob/main/packages/email-sdk/CHANGELOG.md",
    },
  ] as const;
}

export const versionLinks = getVersionLinks(latestDocsVersion);

/**
 * Rewrite a current-version docs href ("/docs/...") onto the base path of the
 * version being viewed, so navigation stays inside an old version instead of
 * bouncing the reader back to current docs.
 */
export function versionDocsHref(href: string | undefined, docsBasePath: string) {
  if (href === undefined || docsBasePath === "/docs") return href;

  if (href === "/docs") return docsBasePath;

  if (href.startsWith("/docs/")) return `${docsBasePath}${href.slice("/docs".length)}`;

  return href;
}
