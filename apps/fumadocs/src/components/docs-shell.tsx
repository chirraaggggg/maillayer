import {
  ArrowUp01Icon,
  BlocksIcon,
  BookOpen01Icon,
  ChevronDownIcon,
  CircleCheckIcon,
  Compass01Icon,
  Copy01Icon,
  Download01Icon,
  ExternalLinkIcon,
  GitPullRequestIcon,
  GridViewIcon,
  Home01Icon,
  Menu02Icon,
  PlugSocketIcon,
  Rocket01Icon,
  Search01Icon,
  TerminalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import type { TOCItemType } from "fumadocs-core/toc";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { useTheme } from "fumadocs-ui/provider/base";
import * as React from "react";
import type { ComponentProps, ReactNode } from "react";

import { ThemeToggle, readStoredTheme, setDocumentTheme } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";
import { providers } from "@/lib/providers";
import { appName } from "@/lib/shared";
import { versionDocsHref } from "@/lib/versions";

interface NavLeaf {
  label: string;
  href: string;
  icon: ReactNode;
}

interface NavGroup extends NavLeaf {
  children: NavLeaf[];
}

type NavIconData = ComponentProps<typeof HugeiconsIcon>["icon"];

function sectionIcon(icon: NavIconData, size = 16): ReactNode {
  return <HugeiconsIcon aria-hidden="true" icon={icon} size={size} strokeWidth={1.8} />;
}

const providerNavItems: NavLeaf[] = providers.map((provider) => ({
  label: provider.name,
  href: provider.docs,
  icon: (
    <img
      alt=""
      aria-hidden="true"
      className={"invertOnDark" in provider && provider.invertOnDark ? "ds-nav__brand ds-nav__brand--invert" : "ds-nav__brand"}
      height={15}
      loading="lazy"
      src={provider.logo}
      width={15}
    />
  ),
}));

const docsNav: (NavLeaf | NavGroup)[] = [
  { label: "Overview", href: "/docs", icon: sectionIcon(Home01Icon) },
  { label: "Installation", href: "/docs/getting-started/install", icon: sectionIcon(Download01Icon) },
  { label: "Quickstart", href: "/docs/getting-started/quickstart", icon: sectionIcon(Rocket01Icon) },
  { label: "Providers", href: "/docs/adapters", icon: sectionIcon(GridViewIcon), children: providerNavItems },
  { label: "Concepts", href: "/docs/concepts", icon: sectionIcon(Compass01Icon) },
  { label: "Integrations", href: "/docs/integrations", icon: sectionIcon(PlugSocketIcon) },
  { label: "Guides", href: "/docs/guides", icon: sectionIcon(BookOpen01Icon) },
  { label: "Reference", href: "/docs/reference", icon: sectionIcon(TerminalIcon) },
  { label: "Plugins", href: "/docs/plugins", icon: sectionIcon(BlocksIcon) },
  { label: "Contributing", href: "/docs/contributing", icon: sectionIcon(GitPullRequestIcon) },
];

export interface DocsShellProps {
  title: string;
  description: string;
  toc: TOCItemType[];
  /** URL of this page's raw Markdown mirror, e.g. "/docs/guides/foo.md". */
  markdownUrl: string;
  /** Version-aware absolute docs URL of the current page, used for active states. */
  pageHref: string;
  /** Base path of the docs version being viewed ("/docs" for current). */
  docsBasePath: string;
  children: ReactNode;
}

/**
 * Social SDK-style documentation chrome: a sticky top bar with brand, search,
 * and theme controls; a left icon navigation sidebar; a central reading column;
 * and a right "On this page" rail with scroll-spy links and page actions.
 */
export function DocsShell({
  title,
  description,
  toc,
  markdownUrl,
  pageHref,
  docsBasePath,
  children,
}: DocsShellProps) {
  useDocsDarkDefault();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="ds-shell">
      <header className="ds-topbar">
        <button
          type="button"
          className="ds-menu-toggle"
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          {sectionIcon(Menu02Icon)}
        </button>
        <Link className="ds-brand" to="/" aria-label={`${appName} home`}>
          <MailMark />
          {appName}
        </Link>
        <div className="ds-topbar__spacer" />
        <SearchTrigger />
        <ThemeToggle className="ds-theme-toggle" defaultTheme="dark" />
      </header>

      <div className="ds-body">
        {drawerOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            className="ds-sidebar__overlay"
            onClick={() => setDrawerOpen(false)}
          />
        ) : null}

        <aside className={cn("ds-sidebar", drawerOpen && "ds-sidebar--open")}>
          <DocsNav docsBasePath={docsBasePath} pageHref={pageHref} onNavigate={() => setDrawerOpen(false)} />
        </aside>

        <main className="ds-main">
          <article className="ds-article">
            <h1 className="ds-title">{title}</h1>
            <p className="ds-lead">{description}</p>
            {children}
          </article>
        </main>

        <aside className="ds-toc" aria-label="On this page">
          <DocsToc items={toc} markdownUrl={markdownUrl} />
        </aside>
      </div>
    </div>
  );
}

/**
 * Documentation opens in dark mode when the visitor never picked a theme.
 * Stored choices always win, on every page of the site.
 */
function useDocsDarkDefault() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    if (readStoredTheme() !== null) return;

    setTheme("dark");
    setDocumentTheme("dark");
  }, [setTheme]);
}

function MailMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 7 12 13.5 20.5 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchTrigger() {
  const { setOpenSearch } = useSearchContext();

  return (
    <button type="button" className="ds-search" onClick={() => setOpenSearch(true)}>
      {sectionIcon(Search01Icon, 15)}
      <span className="ds-search__label">Search documentation</span>
      <kbd className="ds-search__kbd">⌘K</kbd>
    </button>
  );
}

interface DocsNavProps {
  docsBasePath: string;
  pageHref: string;
  onNavigate: () => void;
}

function DocsNav({ docsBasePath, pageHref, onNavigate }: DocsNavProps) {
  return (
    <nav className="ds-nav" aria-label="Documentation">
      {docsNav.map((item) =>
        "children" in item ? (
          <NavGroupItemView item={item} docsBasePath={docsBasePath} pageHref={pageHref} onNavigate={onNavigate} key={item.href} />
        ) : (
          <NavItemView item={item} docsBasePath={docsBasePath} pageHref={pageHref} onNavigate={onNavigate} key={item.href} />
        ),
      )}
    </nav>
  );
}

interface NavItemViewProps extends DocsNavProps {
  item: NavLeaf;
}

function NavItemView({ item, docsBasePath, pageHref, onNavigate }: NavItemViewProps) {
  const href = versionDocsHref(item.href, docsBasePath) ?? item.href;
  const active = href === pageHref;

  return (
    <a
      className={cn("ds-nav__item", active && "ds-nav__item--active")}
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      <span className="ds-nav__icon">{item.icon}</span>
      <span className="ds-nav__label">{item.label}</span>
    </a>
  );
}

function NavGroupItemView({ item, docsBasePath, pageHref, onNavigate }: NavItemViewProps & { item: NavGroup }) {
  const groupHref = versionDocsHref(item.href, docsBasePath) ?? item.href;
  const groupActive = groupHref === pageHref;

  const childActive = item.children.some(
    (child) => (versionDocsHref(child.href, docsBasePath) ?? child.href) === pageHref,
  );

  const [open, setOpen] = React.useState(childActive);

  React.useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  return (
    <div className="ds-nav__group">
      <div className="ds-nav__group-row">
        <a
          className={cn("ds-nav__item", groupActive && "ds-nav__item--active")}
          href={groupHref}
          aria-current={groupActive ? "page" : undefined}
          onClick={onNavigate}
        >
          <span className="ds-nav__icon">{item.icon}</span>
          <span className="ds-nav__label">{item.label}</span>
        </a>
        <button
          type="button"
          className="ds-nav__chevron-btn"
          aria-label={open ? `Collapse ${item.label}` : `Expand ${item.label}`}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {sectionIcon(ChevronDownIcon, 14)}
        </button>
      </div>
      {open ? (
        <div className="ds-nav__children">
          {item.children.map((child) => {
            const childHref = versionDocsHref(child.href, docsBasePath) ?? child.href;
            const isActive = childHref === pageHref;

            return (
              <a
                className={cn("ds-nav__child", isActive && "ds-nav__child--active")}
                href={childHref}
                aria-current={isActive ? "page" : undefined}
                onClick={onNavigate}
                key={childHref}
              >
                <span className="ds-nav__icon">{child.icon}</span>
                <span className="ds-nav__label">{child.label}</span>
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

interface DocsTocProps {
  items: TOCItemType[];
  markdownUrl: string;
}

/** TOC urls are anchors ("#heading"); the DOM id drops the hash. */
function tocHeadingId(item: TOCItemType) {
  return item.url.replace(/^#/, "");
}

function DocsToc({ items, markdownUrl }: DocsTocProps) {
  const headingIds = React.useMemo(() => items.map(tocHeadingId), [items]);
  const activeId = useActiveHeadingId(headingIds);

  return (
    <>
      <p className="ds-toc__label" id="ds-toc-heading">
        On this page
      </p>
      <ul className="ds-toc__list" aria-labelledby="ds-toc-heading">
        {items.map((item) => (
          <li key={item.url}>
            <a
              className={cn(
                "ds-toc__link",
                item.depth >= 3 && "ds-toc__link--depth-3",
                activeId === tocHeadingId(item) && "ds-toc__link--active",
              )}
              href={item.url}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>

      <hr className="ds-toc__divider" />

      <div className="ds-toc__actions">
        <button
          type="button"
          className="ds-toc__action"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {sectionIcon(ArrowUp01Icon, 15)}
          Scroll to top
        </button>
        <CopyMarkdownAction markdownUrl={markdownUrl} />
        <a className="ds-toc__action" href={markdownUrl}>
          {sectionIcon(ExternalLinkIcon, 15)}
          View as Markdown
        </a>
      </div>
    </>
  );
}

function CopyMarkdownAction({ markdownUrl }: { markdownUrl: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      className="ds-toc__action"
      onClick={() => {
        void copyPageMarkdown(markdownUrl).then((ok) => {
          if (!ok) return;

          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {sectionIcon(copied ? CircleCheckIcon : Copy01Icon, 15)}
      {copied ? "Copied" : "Copy as Markdown"}
    </button>
  );
}

async function copyPageMarkdown(markdownUrl: string): Promise<boolean> {
  try {
    const response = await fetch(markdownUrl);

    if (!response.ok) return false;

    await navigator.clipboard.writeText(await response.text());

    return true;
  } catch {
    return false;
  }
}

/**
 * Tracks the heading nearest the top of the viewport so the "On this page"
 * rail highlights the section being read.
 */
function useActiveHeadingId(ids: string[]): string | undefined {
  const [activeId, setActiveId] = React.useState<string | undefined>(ids[0]);

  React.useEffect(() => {
    let frame = 0;

    function measure() {
      frame = 0;
      let current = ids[0];

      for (const id of ids) {
        const element = document.getElementById(id);

        if (!element) continue;

        if (element.getBoundingClientRect().top <= 100) {
          current = id;
        } else {
          break;
        }
      }

      setActiveId(current);
    }

    function onScroll() {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);

      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [ids]);

  return activeId;
}
