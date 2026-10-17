import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./apps/fumadocs/src/**/*.{ts,tsx,js,jsx}",
    "./packages/email-sdk/src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // MailLayer Control Room color system
        background: "#f8fafc",
        foreground: "#1e293b",
        muted: "#64748b",
        mutedForeground: "#94a3b8",
        card: "#ffffff",
        border: "#e2e8f0",
        primary: "#3b82f6", // cobalt blue
        primaryForeground: "#ffffff",
        accent: "#ef4444", // coral/red for warnings
        accentForeground: "#ffffff",
        secondary: "#1e293b",
        info: "#64748b",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SF Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
