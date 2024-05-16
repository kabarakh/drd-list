import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '/drd-list/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('vue') || id.includes('pinia')) {
            return 'vue'
          }
          if (id.includes('lodash')) {
            return 'lodash'
          }
          if (id.includes('node_modules')) {
            return 'libraries'
          }
        }
      }
    }
  }
})
