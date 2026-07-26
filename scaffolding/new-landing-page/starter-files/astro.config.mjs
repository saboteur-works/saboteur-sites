import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://TODO.com", // TODO: set production URL
  // Emits /sitemap-index.xml, which public/robots.txt points at.
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
