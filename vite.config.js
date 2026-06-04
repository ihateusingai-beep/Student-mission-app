import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/Student-mission-app/',
  plugins: [vue()],
  server: {
    host: true,
    port: 5173
  }
})