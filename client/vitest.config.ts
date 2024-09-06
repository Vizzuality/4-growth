import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    environment: 'jsdom',
    clearMocks: true,
    coverage: {
      provider: 'v8'
    },
  },
   resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})