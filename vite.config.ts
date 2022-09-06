import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import inlinePlugin from "@molgenis/vite-plugin-inline/src/vite-plugin-inline.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(),inlinePlugin()],
  build: {
    rollupOptions: {
      input: ["./index.html", "@molgenis/vite-plugin-inline/src/loader.ts"],
      output: {
        manualChunks: undefined,
      },
    }
  },
  assetsInclude: ['**/*.archimate', '**/*.archimate'],
  base: "",
  server: {
    port: 4000
  }
})
