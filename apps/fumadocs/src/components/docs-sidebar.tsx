import { navItems } from "@/lib/docs-nav";
import type { NavItem } from "@/lib/docs-nav";

export function DocsSidebar() {
  return (
    <nav className="docs-sidebar" aria-label="Documentation">
      <div className="docs-sidebar__header">
        <a href="/docs" className="docs-sidebar__brand">
          <span className="docs-sidebar__brand-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="5.5" width="20" height="13" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3.5 7.5 12 14 20.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="docs-sidebar__brand-text">MailLayer</span>
        </a>
        <button type="button" className="docs-sidebar__toggle" aria-label="Toggle navigation">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="docs-sidebar__search-wrap">
        <form className="docs-sidebar__search" role="search">
          <input
            name="q"
            type="search"
            placeholder="Search docs..."
            className="docs-sidebar__search-input"
            autoComplete="off"
          />
          <kbd className="docs-sidebar__search-shortcut">Cmd</kbd>
          <kbd className="docs-sidebar__search-shortcut">K</kbd>
        </form>
      </div>

      <div className="docs-sidebar__list">
        {navItems.map((item) => (
          <DocsNavItem item={item} key={item.href} />
        ))}
      </div>
    </nav>
  );
}

function DocsNavItem({ item }: { item: NavItem }) {
  const { href, label, children, active } = item;
  const isGroup = children !== undefined;
  const items = children ?? [item];

  if (isGroup) {
    return (
      <div className="docs-sidebar__group">
        <div className="docs-sidebar__group-label">{label}</div>
        <div className="docs-sidebar__group-items">
          {items.map((child) => (
            <DocsNavItem key={child.href} item={child} />
          ))}
        </div>
      </div>
    );
  }

  const className = active ? "docs-sidebar__item docs-sidebar__item--active" : "docs-sidebar__item";

  return (
    <a className={className} href={href}>
      <span className="docs-sidebar__item-text">{label}</span>
      <svg className="docs-sidebar__item-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M4 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
