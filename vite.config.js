import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/dist/',
  plugins: [vue()],
  server: {
    host: true,
    port: 5173
  }
})