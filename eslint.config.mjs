import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

/**
 * Flat config per the house convention (`conventions/frontend-web-code-convention`
 * in gbrain): @eslint/js + typescript-eslint + Next core-web-vitals + jsx-a11y,
 * the rule blocks from §TypeScript, §Import/Export and §Loading States, and
 * eslint-config-prettier last so formatting never comes from lint.
 */
const eslintConfig = defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    // Next already registers the `jsx-a11y` plugin, so its recommended rule set
    // is merged as rules only — registering the plugin again is a config error.
    rules: { ...jsxA11y.flatConfigs.recommended.rules },
  },
  {
    plugins: { import: importPlugin },
    rules: {
      // Imports: nine groups, blank line between, @/ as internal.
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
        },
      ],
      // Routes may not reach into another route's private folders.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*/_*"],
              message:
                "Routes may not import another route's private folders. Promote the code first.",
            },
          ],
        },
      ],
      // TypeScript: judgement calls stay warnings until the count is zero.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      // Underscore-prefixed bindings are intentionally unused (destructuring a
      // field out before sending a payload, ignored catch params, and so on).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Client-rendered layers may not reach into a server-only module; the
    // bundler is the real gate (`server-only`), this is the second net.
    files: ["src/components/**/*.{ts,tsx}", "src/hooks/**/*.ts", "src/stores/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*/_*"],
              message:
                "Routes may not import another route's private folders. Promote the code first.",
            },
            {
              group: ["@/services/*.server", "@/services/*.server.ts"],
              message:
                "Server-only module: fetch in a Server Component and pass data down, or use an action.",
            },
          ],
        },
      ],
    },
  },
  {
    // §Loading States: no images or icons in a skeleton, and a literal
    // animate-pulse must carry its reduced-motion opt-out.
    files: ["**/*Skeleton.tsx", "**/loading.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/^(img|svg|Image)$/]",
          message: "Skeletons never render images or icons. Use a sized div.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'][value.value=/animate-pulse/]:not([value.value=/motion-reduce/])",
          message: "animate-pulse must be paired with motion-reduce:animate-none.",
        },
      ],
    },
  },
  prettier,
]);

export default eslintConfig;
