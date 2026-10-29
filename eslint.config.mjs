import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";

/**
 * Flat config per the house convention (`conventions/frontend-web-code-convention`,
 * v1.4.1): @eslint/js + typescript-eslint + Next core-web-vitals + jsx-a11y,
 * the rule blocks from §TypeScript, §Import/Export, §Styling and §Loading States,
 * and eslint-config-prettier last so formatting never comes from lint.
 *
 * Deliberate deviations from the page's reference config — do not "fix" them back
 * without reading AGENTS.md first:
 *  - `eslint-plugin-import` (+ the TypeScript resolver) instead of
 *    `eslint-plugin-import-x`: same `order` rule, and alias resolution is declared
 *    rather than hoped for (`import/resolver` below). Swapping the plugin is a
 *    dependency change; it belongs in its own commit, not in a convention refactor.
 *  - the skeleton primitive is `src/components/ui/Skeleton.tsx`
 *    (SkeletonRegion / SkeletonBlock / SkeletonText), not `Sk.tsx`: that is the
 *    file allowed to paint `bg-skeleton`.
 *  - react-hooks rules come from `eslint-config-next` (16 rules, including
 *    rules-of-hooks and exhaustive-deps), so the plugin is not registered twice.
 *  - `@typescript-eslint` likewise comes from `eslint-config-next/typescript` only.
 *    Yarn classic has no autoInstallPeers, so a second copy of the plugin (from a
 *    root `typescript-eslint` dependency) is a hard config error, not a warning:
 *    "Cannot redefine plugin @typescript-eslint".
 */
const CLIENT_LAYERS = [
  "src/components/**/*.{ts,tsx}",
  "src/hooks/**/*.ts",
  "src/providers/**/*.{ts,tsx}",
  "src/stores/**/*.ts",
];

// §Import/Export: routes never reach into another route's private folders.
// `*/**` matters: `@/app/**/_*` also flags the root route's own `src/app/_components`,
// while `@/app/*/_*` never matched a route group. Verified against this tree.
const restrictedImports = [
  "error",
  {
    patterns: [
      {
        group: ["@/app/*/**/_*"],
        message: "Routes may not import another route's private folders. Promote the code first.",
      },
    ],
  },
];

// §Security: `services/` is the server side. Client layers never import the folder
// at all — the bare folder pattern is the rule, not the `.server` suffix.
const restrictedClientImports = [
  "error",
  {
    patterns: [
      {
        group: ["@/app/*/**/_*"],
        message: "Routes may not import another route's private folders. Promote the code first.",
      },
      {
        group: ["@/services/**"],
        message:
          "services/ is server-only. Fetch in a Server Component and pass data down, use an action, or import browser transport from @/lib.",
      },
    ],
  },
];

// §Styling: colours come from `@theme` tokens, never from a hex literal, and the
// skeleton surface is painted only by the primitive.
const tokenSelectors = [
  {
    selector: "JSXAttribute[name.name='className'] Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
    message: "No hardcoded colours. Use a token from globals.css @theme.",
  },
  {
    selector:
      "JSXAttribute[name.name='className'] TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]",
    message: "No hardcoded colours. Use a token from globals.css @theme.",
  },
  {
    selector: "JSXAttribute[name.name='className'] Literal[value=/\\bbg-skeleton\\b/]",
    message:
      "Loading blocks go through SkeletonBlock / SkeletonText (src/components/ui/Skeleton.tsx), not raw bg-skeleton.",
  },
];

// §Loading States: a skeleton never renders an image or an icon, and every
// matching file also keeps the token rules (a later config object replaces the
// rule, it does not merge it).
const skeletonSelectors = [
  {
    selector: "JSXOpeningElement[name.name=/^(img|svg|Image)$/]",
    message: "Skeletons never render images or icons. Use a sized div.",
  },
  ...tokenSelectors,
];

const eslintConfig = defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    // Next already registers the `jsx-a11y` plugin, so its recommended rule set
    // is merged as rules only — registering the plugin again is a config error.
    rules: { ...jsxA11y.flatConfigs.recommended.rules },
  },
  {
    plugins: { import: importPlugin },
    settings: {
      // Without this the `@/` alias does not resolve and every project import is
      // classified as external — the ordering rule then enforces the wrong thing.
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
    },
    rules: {
      // Imports: groups separated by a blank line, `@/` treated as internal.
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
        },
      ],
      "no-restricted-imports": restrictedImports,
      "no-restricted-syntax": ["error", ...tokenSelectors],
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
    files: CLIENT_LAYERS,
    rules: { "no-restricted-imports": restrictedClientImports },
  },
  {
    files: ["**/*Skeleton.tsx", "**/loading.tsx"],
    rules: { "no-restricted-syntax": ["error", ...skeletonSelectors] },
  },
  {
    // The one file allowed to paint the skeleton surface. It keeps the
    // image ban: the primitive renders sized divs, never `<img>`.
    files: ["src/components/ui/Skeleton.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/^(img|svg|Image)$/]",
          message: "Skeletons never render images or icons. Use a sized div.",
        },
      ],
    },
  },
  prettier,
]);

export default eslintConfig;
