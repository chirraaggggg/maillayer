import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { appName } from "@/lib/shared";

export interface Breadcrumb {
  label: string;
  href: string;
}

export interface BrandHeaderProps {
  breadcrumbs: Breadcrumb[];
  title: string;
  description: string;
  actions?: ReactNode;
}

/**
 * Compact branded header shared by every documentation page.
 *
 * It replaces the inherited black-and-yellow documentation chrome with a
 * warm paper header, a path back to the MailLayer homepage, a page title and
 * description, breadcrumbs for orientation, and a compact top-level
 * documentation navigation rail.
 */
export function BrandHeader({
  breadcrumbs,
  title,
  description,
  actions,
}: BrandHeaderProps): ReactNode {
  const breadcrumbList: Breadcrumb[] = [
    { label: "MailLayer", href: "/" },
    ...breadcrumbs,
  ];

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
          {actions}
        </div>

        <nav aria-label="Documentation navigation" className="paper-header__nav">
          <div className="paper-nav-rail">
            <a href="/docs" className="paper-nav-rail__item paper-nav-rail__item--active">
              Overview
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
            <ThemeToggle className="paper-nav-toggle" />
          </div>
        </nav>
      </div>

      <div className="paper-header__breadcrumbs">
        <ol className="breadcrumb-list">
          {breadcrumbList.map((crumb, index) => (
            <li key={crumb.href} className="breadcrumb-item">
              {index > 0 ? (
                <>
                  <span aria-hidden="true">/</span>
                  <a href={crumb.href} className="breadcrumb-link">
                    {crumb.label}
                  </a>
                </>
              ) : (
                <a href="/" className="breadcrumb-link">
                  {crumb.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}

export interface DocsLayoutProps {
  breadcrumbs: Breadcrumb[];
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}

/**
 * Central reading column wrapper. A narrow max-width column keeps the docs
 * readable on both desktop and mobile, while the surrounding chrome stays out
 * of the way.
 */
export function DocsLayout({
  breadcrumbs,
  title,
  description,
  children,
  actions,
}: DocsLayoutProps) {
  return (
    <div className="page-shell">
      <BrandHeader breadcrumbs={breadcrumbs} title={title} description={description} actions={actions} />
      <ReadingColumn>{children}</ReadingColumn>
    </div>
  );
}

export interface ReadingColumnProps {
  children: ReactNode;
  className?: string;
}

/**
 * Central reading column with a sensible maximum width and left margin for a
 * reading-focused paper experience.
 */
export function ReadingColumn({ children, className }: ReadingColumnProps) {
  return <div className={`reading-column${className ? ` ${className}` : ""}`}>{children}</div>;
}
