// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // Add reporters to the base test configuration
    reporters: ['default', 'html'],
    outputFile: './vite-report/index.html',
  },
  // Add this line for GitHub Pages (use your repo name)
  base: '/rjsf-tailwind/',
})