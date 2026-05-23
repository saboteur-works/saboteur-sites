import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://TODO.com", // TODO: set production URL
  vite: {
    plugins: [tailwindcss()],
  },
});
