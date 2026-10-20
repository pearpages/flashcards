import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    // Card drawings are emitted as files, not inlined as data URIs, so a deck's
    // drawings are only downloaded when they are shown (see ADR-0012).
    assetsInlineLimit: (filePath) => (filePath.endsWith('.svg') ? false : undefined),
  },
})
