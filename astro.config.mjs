import { defineConfig } from "astro/config";
import { glslify } from "vite-plugin-glslify";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [glslify()]
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  })
});