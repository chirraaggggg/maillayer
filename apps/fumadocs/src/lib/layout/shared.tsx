import type { ReactNode } from "react";

import { appName } from "./shared";

export interface DocsHeaderProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; href: string }[];
  actions?: ReactNode;
}

export function DocsHeader({ title, description, breadcrumbs, actions }: DocsHeaderProps) {
  return (
    <header className="paper-header">
      <div className="paper-header__inner">
        <div className="paper-header__brand">
          <a href="/" className="paper-header__home" aria-label={`${appName} homepage`}>
            <span className="paper-logo">ML</span>
          </a>
          <div className="paper-header__title-block">
            <h1 className="paper-header__title">{title}</h1>
            <p className="paper-header__description">{description}</p>
          </div>
        </div>
      </div>
      {actions ? (
        <div className="paper-header__actions">{actions}</div>
      ) : (
        <nav aria-label="Documentation navigation" className="paper-header__nav">
          <div className="paper-nav-rail">
            <a href="/docs" className="paper-nav-rail__item paper-nav-rail__item--active">
              Documentation
            </a>
            <a href="/docs/getting-started" className="paper-nav-rail__item">
              Getting started
            </a>
            <a href="/docs/adapters" className="paper-nav-rail__item">
              Providers
            </a>
            <a href="/docs/guides" className="paper-nav-rail__item">
              Guides
            </a>
            <a href="/docs/reference" className="paper-nav-rail__item">
              Reference
            </a>
            <a href="/docs/concepts" className="paper-nav-rail__item">
              Concepts
            </a>
          </div>
        </nav>
      )}
      <div className="paper-header__breadcrumbs">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <a href="/" className="breadcrumb-link">
              MailLayer
            </a>
          </li>
          {breadcrumbs.map((crumb) => (
            <li key={crumb.href} className="breadcrumb-item">
              <span aria-hidden="true">/</span>
              <a href={crumb.href} className="breadcrumb-link">
                {crumb.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}

export interface PageShellProps {
  children: ReactNode;
  title: string;
  description: string;
  navLinks?: { label: string; href: string }[];
  footer?: ReactNode;
}

export function PageShell({
  children,
  title,
  description,
  navLinks,
  footer,
}: PageShellProps) {
  return (
    <div className="page-shell">
      <header className="paper-header">
        <div className="paper-header__inner">
          <div className="paper-header__brand">
            <a href="/" className="paper-header__home" aria-label={`${appName} homepage`}>
              <span className="paper-logo">ML</span>
            </a>
            <div className="paper-header__title-block">
              <h1 className="paper-header__title">{title}</h1>
              <p className="paper-header__description">{description}</p>
            </div>
          </div>
          {navLinks ? (
            <nav aria-label="Documentation navigation" className="paper-header__nav">
              <div className="paper-nav-rail">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="paper-nav-rail__item">
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          ) : null}
        </div>
        <div className="paper-header__breadcrumbs">
          <ol className="breadcrumb-list">
            <li className="breadcrumb-item">
              <a href="/" className="breadcrumb-link">
                MailLayer
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/docs" className="breadcrumb-link">
                Documentation
              </a>
            </li>
          </ol>
        </div>
      </header>
      <main className="page-main">{children}</main>
      {footer ? <footer className="page-footer">{footer}</footer> : null}
    </div>
  );
}
