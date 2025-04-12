/* eslint-disable @typescript-eslint/naming-convention */
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      "@/core": fileURLToPath(new URL("src/core", import.meta.url)),
      "@/ui": fileURLToPath(new URL("src/components", import.meta.url)),
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  build: {
    target: ["es2022"],
  },
});
