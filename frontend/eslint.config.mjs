import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // Plugins and global settings
  {
    plugins: {
      import: eslintPluginImport,
      "unused-imports": unusedImports,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
  },

  // Base rules
  {
    rules: {
      // ── Remove unused imports ──
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // ── Automatic type imports ──
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      // ── Import sorting order ──
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
          ],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "react-dom", group: "external", position: "before" },
            { pattern: "next", group: "external", position: "before" },
            { pattern: "next/**", group: "external", position: "before" },
            { pattern: "@/core/**", group: "internal", position: "before" },
            {
              pattern: "@/core/features/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  // Clarity architecture
  {
    name: "clarity-architecture",
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // 1. Core (excluding features) cannot import from features
            {
              target: "./src/core/**",
              from: "./src/core/features/**",
              message: "Core layer cannot import from features.",
            },
            // 2. Feature isolation (Features cannot import directly from each other)
            {
              target: "./src/core/features/*/",
              from: "./src/core/features/*/",
              message:
                "Features must be isolated. Communication must go through the core adapter.",
            },
            // 3. Pure (utils) - only within core/features
            {
              target: "./src/core/features/*/utils/**",
              from: ["./src/core/**/state/**", "./src/core/**/components/**"],
              message:
                "Utils must be pure, no dependencies on state or components.",
            },
            // 4. Core UI Components only from core tools
            {
              target: "./src/core/components/ui/**",
              from: ["./src/core/features/**", "./src/core/**/state/**"],
              message:
                "Core UI components cannot import from features or state.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
