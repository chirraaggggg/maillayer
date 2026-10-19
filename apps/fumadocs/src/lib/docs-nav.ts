import { docsNavigation, providerCatalog } from "./provider-catalog";
import type { ProviderCatalogEntry } from "./provider-catalog";

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  children?: NavItem[];
}

function providerNavItem(provider: ProviderCatalogEntry): NavItem {
  return { label: provider.name, href: provider.docsPath };
}

export function splitNavByGroup(catalog: readonly ProviderCatalogEntry[]): NavGroup[] {
  const groups: NavGroup[] = [];

  for (const provider of catalog) {
    const existing = groups.find((g) => g.group === provider.group);
    const item = providerNavItem(provider);

    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({ group: provider.group, items: [item] });
    }
  }

  return groups;
}

/** Top-level documentation navigation rendered by the docs sidebar. */
export const navItems: NavItem[] = [
  ...docsNavigation.map((entry): NavItem => ({ label: entry.label, href: entry.href })),
  {
    label: "Providers",
    href: "/docs/adapters",
    children: providerCatalog.map(providerNavItem),
  },
];
