import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/Student-mission-app/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [vue()],
  server: {
    host: true,
    port: 5173
  }
})