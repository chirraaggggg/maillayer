import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(fileURLToPath(new URL("..", import.meta.url)), "packages/email-sdk");

const packageJson = JSON.parse(await readFile(resolve(packageDir, "package.json"), "utf8"));

const entrypoints = Object.values(packageJson.exports)
  .map((entry) => entry.import)
  .filter(Boolean)
  .map((target) => target.replace(/^\.\/dist\//, "").replace(/\.js$/, ""));

// Bun 1.3.14's bundler silently drops every module binding when an entry file holds two or
// more named `export { ... } from "..."` statements: it reports success but emits references
// to undeclared `import_*` variables, so the emitted .cjs throws ReferenceError on the first
// property read while a bare `require()` still "succeeds" (lazy getters). src/index.ts, the
// package root, is such a barrel, which shipped a dist/index.cjs that crashed every CommonJS
// consumer. A single-statement `export * from` shim of the same module bundles correctly, so
// barrels are built through one, and every emitted bundle is loaded with each export touched
// so a dangling bundle can never pass the build again.
const namedReExportPattern = /export\s*\{[^}]*\}\s*from\s*["']/g;

for (const entrypoint of new Set(entrypoints)) {
  const source = resolve(packageDir, "src", `${entrypoint}.ts`);
  const sourceWithTsx = resolve(packageDir, "src", `${entrypoint}.tsx`);
  const resolvedSource = (await Bun.file(source).exists()) ? source : sourceWithTsx;

  if (!(await Bun.file(resolvedSource).exists())) {
    throw new Error(`Cannot find CommonJS entrypoint source for ${entrypoint}: ${resolvedSource}`);
  }

  const entry = await bundlerEntryFor(resolvedSource, entrypoint);

  try {
    const result = await Bun.build({
      entrypoints: [entry.path],
      outdir: resolve(packageDir, "dist"),
      naming: `${entrypoint}.cjs`,
      format: "cjs",
      target: "node",
      write: true,
      external: ["ai", "react", "react-dom", "@react-email/render"],
    });

    if (!result.success) {
      throw new AggregateError(result.logs, `Failed to build CommonJS entrypoint ${entrypoint}`);
    }
  } finally {
    await entry.cleanup();
  }

  verifyBundleLoads(entrypoint);
}

/**
 * Plain modules build directly. Re-export barrels are routed through a temporary
 * single-statement `export * from` shim, which the bundler resolves and inlines correctly.
 */
async function bundlerEntryFor(sourcePath, entrypoint) {
  const source = await readFile(sourcePath, "utf8");
  const namedReExports = source.match(namedReExportPattern)?.length ?? 0;

  if (namedReExports < 2) {
    return { path: sourcePath, cleanup: async () => {} };
  }

  const shimDir = await mkdtemp(join(tmpdir(), "maillayer-cjs-shim-"));
  const shimPath = join(shimDir, `${entrypoint}.shim.ts`);

  // Absolute specifier: the shim lives outside the package, and Bun maps the .js specifier
  // onto the TypeScript source exactly as it does for in-package relative imports.
  await writeFile(shimPath, `export * from ${JSON.stringify(sourcePath.replace(/\.tsx?$/, ".js"))};\n`);

  return { path: shimPath, cleanup: () => rm(shimDir, { recursive: true, force: true }) };
}

/**
 * Load the emitted bundle and read every export. Export getters only evaluate on access, so
 * a bundle with dangling module references loads "successfully" until a property is touched;
 * reading them here makes that failure immediate and attributable to its entrypoint.
 */
function verifyBundleLoads(entrypoint) {
  const require = createRequire(import.meta.url);
  const bundled = require(resolve(packageDir, "dist", `${entrypoint}.cjs`));

  for (const name of Object.keys(bundled)) {
    void bundled[name];
  }
}
