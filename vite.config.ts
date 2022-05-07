import { defineConfig } from 'vite'
import dts from 'vite-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.tsx',
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
  plugins: [dts()],
})
