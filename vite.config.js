import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Keep the PDF library separate while Vite preloads it for offline use.
        manualChunks: { pdf: ['jspdf'] },
      },
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
