import { baseConfig, reactConfig } from "@seoyunnie/oxc-config/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  options: { reportUnusedDisableDirectives: "warn", typeAware: true, typeCheck: true },

  env: { builtin: true, node: true, es2023: true },

  extends: [baseConfig, reactConfig],

  overrides: [
    {
      files: ["**/*.tsx"],

      jsPlugins: ["eslint-plugin-perfectionist", { name: "react-compiler", specifier: "eslint-plugin-react-hooks" }],
      rules: {
        /* eslint-plugin-perfectionist */
        "perfectionist/sort-jsx-props": ["error", { type: "natural" }],

        /* eslint-plugin-react-hooks */
        "react-compiler/component-hook-factories": "error",
        "react-compiler/config": "error",
        "react-compiler/error-boundaries": "error",
        "react-compiler/gating": "error",
        "react-compiler/globals": "error",
        "react-compiler/immutability": "error",
        "react-compiler/incompatible-library": "error",
        "react-compiler/preserve-manual-memoization": "error",
        "react-compiler/purity": "error",
        "react-compiler/refs": "error",
        "react-compiler/set-state-in-effect": "error",
        "react-compiler/set-state-in-render": "error",
        "react-compiler/static-components": "error",
        "react-compiler/unsupported-syntax": "error",
        "react-compiler/use-memo": "error",
      },
    },

    {
      files: ["src/**/*"],

      env: { node: false, browser: true },

      rules: {
        /* Style */
        "import/no-nodejs-modules": "warn",
      },
    },
    {
      files: ["src/main.tsx"],

      rules: {
        /* Pedantic */
        "unicorn/prefer-query-selector": "off",
      },
    },
  ],
});
