import { useEffect, useState } from "react";
import { useTheme } from "fumadocs-ui/provider/base";

import { Moon, Sun } from "@/components/icon";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";

const themeStorageKey = "maillayer-docs-theme";

/** Read the visitor's stored theme choice, or null when they never picked one. */
export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(themeStorageKey);

  return stored === "light" || stored === "dark" ? stored : null;
}

export function setDocumentTheme(theme: Theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = theme;
}

function getPreferredTheme(defaultTheme: Theme): Theme {
  const stored = readStoredTheme();

  if (stored) return stored;

  if (typeof window === "undefined") return defaultTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : defaultTheme;
}

let persistedTheme: Theme | null = null;

function ThemeState({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const theme: Theme = isDark ? "dark" : "light";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme} mode`}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary",
        className,
      )}
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);

        try {
          window.localStorage.setItem(themeStorageKey, next);
        } catch {
          // ignore write failures
        }

        setDocumentTheme(next);
      }}
    >
      <Icon aria-hidden="true" className="size-4.5" strokeWidth={2} />
    </button>
  );
}

export interface ThemeToggleProps {
  className?: string;
  /**
   * Theme applied when the visitor has never picked one. The docs shell
   * passes "dark" so documentation opens in dark mode like Social SDK;
   * the landing page keeps its light default.
   */
  defaultTheme?: Theme;
}

export function ThemeToggle({ className, defaultTheme = "light" }: ThemeToggleProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preferred = getPreferredTheme(defaultTheme);

    if (persistedTheme === null) {
      persistedTheme = preferred;
    }

    setDocumentTheme(persistedTheme);
    setReady(true);
  }, [defaultTheme]);

  if (!ready) {
    return <span className={cn("inline-block size-7", className)} aria-hidden="true" />;
  }

  return <ThemeState className={className} />;
}
