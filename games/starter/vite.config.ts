import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // three.js alone is ~520 kB minified; a single chunk is fine for a game page.
    chunkSizeWarningLimit: 600,
  },
});
