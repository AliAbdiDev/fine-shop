import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

const config = [
  { ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"] },
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      import: eslintPluginImport,
      "unused-imports": unusedImports,
    },
    settings: {
      "import/resolver": { typescript: true, node: true },
    },

    rules: {
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
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
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
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/core/*",
              from: "./src/core/features/**",
              message: "Core layer cannot import from features.",
            },
            {
              target: "./src/core/features/*/",
              from: "./src/core/features/*/",
              message: "Features must be isolated.",
            },
            {
              target: "./src/core/features/*/utils/**",
              from: ["./src/core/**/state/**", "./src/core/**/components/**"],
              message: "Utils must be pure.",
            },
            {
              target: "./src/core/components/ui/**",
              from: ["./src/core/features/**", "./src/core/**/state/**"],
              message: "Core UI cannot import from features or state.",
            },
          ],
        },
      ],
    },
  },

  prettierConfig,
];

export default config;
