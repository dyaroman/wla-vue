import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "public/**"],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        // injected by vite.config.js `define`
        __APP_VERSION__: "readonly",
        __WLA_BACKEND_URL__: "readonly",
        __WEBSITES_DATA_URL__: "readonly",
      },
    },
    rules: {
      // formatting is owned by Prettier; keep ESLint focused on correctness
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/html-indent": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/attributes-order": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/multiline-html-element-content-newline": "off",
      // codebase intentionally uses camelCase for custom props/events
      "vue/attribute-hyphenation": "off",
      "vue/v-on-event-hyphenation": "off",
      "vue/require-default-prop": "off",
    },
  },
  {
    files: ["**/*.config.js", "**/*.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
