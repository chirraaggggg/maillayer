import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import type { ShikiTransformer } from "shiki";

import { emailSdkDark, emailSdkLight } from "./src/lib/code-theme";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

/**
 * Shiki strips the `language-*` class from the highlighted code element, but
 * the docs code-block header needs the language to render its badge and label.
 * This re-adds the class so the MDX `pre` override can read it.
 */
const languageClassTransformer: ShikiTransformer = {
  name: "maillayer:code-language-class",
  code(node) {
    this.addClassToHast(node, `language-${this.options.lang}`);
  },
};

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      themes: {
        light: emailSdkLight,
        dark: emailSdkDark,
      },
      transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), languageClassTransformer],
    },
  },
});
