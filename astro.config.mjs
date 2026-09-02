import { defineConfig, fontProviders } from "astro/config";
import supersvgPlugin from "vite-plugin-supersvg";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [supersvgPlugin()],
  },

  fonts: [
    {
      name: "Playfair Display",
      cssVariable: "--font-display",
      provider: fontProviders.google(),
      weights: ["400 800"],
      styles: ["normal", "italic"],
      fallbacks: ["serif"],
    },
    {
      name: "Source Serif 4",
      cssVariable: "--font-ui",
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      fallbacks: ["serif"],
    },
  ],

  integrations: [react()],
});