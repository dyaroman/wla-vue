import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

import pkg from "./package.json";

const base = "/wla-vue/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __WLA_BACKEND_URL__: JSON.stringify(
      "https://yawjfabcunhkncinsykk.supabase.co/functions/v1/wla-api",
    ),
    __WEBSITES_DATA_URL__: JSON.stringify(`${base}data`),
  },
});
