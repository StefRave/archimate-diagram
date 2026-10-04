import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.archimate', '**/*.archimate'],
  base: "",
  server: {
    port: 4000
  }
})
