import { providers } from "./providers";

export interface ProviderCatalogEntry {
  name: string;
  group: string;
  docsPath: string;
}

const INSTALLATION = "/docs/getting-started/install" as const;

const QUICKSTART = "/docs/getting-started/quickstart" as const;

const ADAPTERS = "/docs/adapters" as const;

const CONCEPTS = "/docs/concepts" as const;

const INTEGRATIONS = "/docs/integrations" as const;

const GUIDES = "/docs/guides" as const;

const REFERENCE = "/docs/reference" as const;

const PLUGINS = "/docs/plugins" as const;

const CONTRIBUTING = "/docs/contributing" as const;

export const docsNavigation = [
  { label: "Overview", href: "/docs", group: "overview" },
  { label: "Installation", href: INSTALLATION, group: "getting-started" },
  { label: "Quickstart", href: QUICKSTART, group: "getting-started" },
  { label: "Providers", href: ADAPTERS, group: "adapters" },
  { label: "Concepts", href: CONCEPTS, group: "concepts" },
  { label: "Integrations", href: INTEGRATIONS, group: "integrations" },
  { label: "Guides", href: GUIDES, group: "guides" },
  { label: "API Reference", href: REFERENCE, group: "reference" },
  { label: "Plugins", href: PLUGINS, group: "plugins" },
  { label: "Contributing", href: CONTRIBUTING, group: "contributing" },
] as const;

export const providerCatalog: ProviderCatalogEntry[] = providers.map((provider) => ({
  name: provider.name,
  group: "adapters",
  docsPath: provider.docs,
}));

export function isActive(href: string, currentPath: string): boolean {
  if (href === currentPath) return true;

  if (href.endsWith("/") && currentPath.startsWith(href)) return true;

  return false;
}
