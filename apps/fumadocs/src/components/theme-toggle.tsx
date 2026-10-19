import { useEffect, useState } from "react";
import { useTheme } from "fumadocs-ui/provider/base";
import type { ComponentProps } from "react";

import { Moon, Sun } from "@/components/icon";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem("maillayer-docs-theme");

  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setDocumentTheme(theme: Theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = theme;
}

let persistedTheme: Theme | null = null;

function ThemeState() {
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
      )}
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);

        try {
          window.localStorage.setItem("maillayer-docs-theme", next);
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

export function ThemeToggle({ className }: Pick<ComponentProps<"button">, "className">) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preferred = getPreferredTheme();

    if (persistedTheme === null) {
      persistedTheme = preferred;
    }

    setDocumentTheme(persistedTheme);
    setReady(true);
  }, []);

  if (!ready) {
    return <span className={cn("inline-block size-7", className)} aria-hidden="true" />;
  }

  return <ThemeState />;
}
