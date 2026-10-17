import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { appName } from "./shared";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
}

/**
 * A compact top-level navigation rail for the paper-inspired docs system.
 * Replaces the inherited left sidebar + right-side table of contents.
 */
export function PaperNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="paper-nav" aria-label="Documentation">
      <div className="paper-nav__inner">
        <Link to="/" className="paper-nav__home" aria-label={`${appName} homepage`}>
          <span className="paper-logo">ML</span>
        </Link>
        <div className="paper-nav__items">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.external ? item.href : undefined}
              rel={item.external ? "noreferrer" : undefined}
              target={item.external ? "_blank" : undefined}
              className={`paper-nav__item${item.active ? " paper-nav__item--active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function PaperNavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="paper-nav-group">
      <div className="paper-nav-group__label">{label}</div>
      <div className="paper-nav-group__list">{children}</div>
    </div>
  );
}

export function PaperNavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <a href={href} className={`paper-nav-link${active ? " paper-nav-link--active" : ""}`}>
      {label}
    </a>
  );
}
