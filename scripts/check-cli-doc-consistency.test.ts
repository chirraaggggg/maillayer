import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const docsRoot = new URL("../apps/fumadocs/content/docs/", import.meta.url).pathname;

function unscopedCommandLines(source: string): number[] {
  const violations: number[] = [];
  let fence: string | undefined;
  let executable = false;

  for (const [index, line] of source.split("\n").entries()) {
    const marker = line.match(/^\s*(`{3,}|~{3,})(.*)$/);

    if (marker) {
      if (!fence) {
        fence = marker[1]!;
        executable =
          /^(?:bash|sh|shell|shellscript|zsh|console|terminal|powershell|ps1|cmd|batch)?(?:\s|$)/.test(
            marker[2]!.trim(),
          );
      } else if (
        marker[1]![0] === fence[0] &&
        marker[1]!.length >= fence.length &&
        !marker[2]!.trim()
      ) {
        fence = undefined;
        executable = false;
      }

      continue;
    }

    if (executable && !/^\s*#/.test(line) && /\b(?:npx|bunx)\s+maillayer(?=\s|$)/.test(line)) {
      violations.push(index + 1);
    }
  }

  return violations;
}

test("current docs executable fences use the scoped CLI package", () => {
  // Only current docs are scanned; docs-v snapshots are historical.
  const files = [...new Bun.Glob("**/*.{md,mdx}").scanSync(docsRoot)].sort();
  expect(files.length).toBeGreaterThan(0);

  const violations = files.flatMap((file) =>
    unscopedCommandLines(readFileSync(join(docsRoot, file), "utf8")).map(
      (line) => `${file}:${line}`,
    ),
  );

  expect(violations).toEqual([]);
});

test("scanner rejects npm and Bun shortcuts including environment-prefixed commands", () => {
  expect(
    unscopedCommandLines(
      [
        "```bash",
        'RESEND_API_KEY="..." npx maillayer doctor --adapter resend',
        "bunx maillayer adapters",
        "```",
        "~~~sh",
        "  npx maillayer send \\",
        "~~~",
      ].join("\n"),
    ),
  ).toEqual([2, 3, 6]);
});

test("scanner preserves warning prose, comments, scoped runners, and installed local binaries", () => {
  expect(
    unscopedCommandLines(
      [
        "Do not use `npx maillayer` in an uninstalled directory.",
        "```bash",
        "# Do not use npx maillayer",
        "npx --package @maillayer/core maillayer adapters",
        "bunx --package @maillayer/core maillayer adapters",
        "maillayer adapters",
        "```",
        "```text",
        "npx maillayer is an unrelated package",
        "```",
      ].join("\n"),
    ),
  ).toEqual([]);
});
