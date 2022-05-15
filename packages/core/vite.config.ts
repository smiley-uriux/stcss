import { defineConfig } from 'vitest/config'
import react from "@vitejs/plugin-react";
import dts from 'vite-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react'],
      output: {
        sourcemapExcludeSources: true,
      },
    },
    sourcemap: true,
    target: 'esnext',
    minify: true,
  },
  plugins: [react(), dts()],
  test: {
    globals: true,
    environment: 'happy-dom'
  }
})
