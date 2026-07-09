import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", ".shots/**"] },

  // Site script (browser, ESM).
  {
    files: ["assets/**/*.js"],
    ...js.configs.recommended,
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: globals.browser },
  },

  // Build/verify scripts and this config (Node, ESM). Browser globals too: the
  // bodies of Playwright `page.evaluate()` callbacks execute in the page.
  {
    files: ["scripts/**/*.mjs", "eslint.config.js"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
  },
];
