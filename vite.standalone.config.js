import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-standalone',
    assetsInlineLimit: 1024 * 1024,
    rollupOptions: {
      input: fileURLToPath(new URL('./index-standalone.html', import.meta.url)),
    },
  },
})
