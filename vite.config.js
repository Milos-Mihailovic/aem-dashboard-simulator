/**
 * Vite Configuration File
 * 
 * This file configures the Vite build tool for our Vue.js application.
 * Vite is a modern build tool that provides fast development server
 * and optimized production builds.
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  // Register the Vue plugin to enable .vue file support
  plugins: [vue()],
  
  // Path alias configuration
  // This allows us to use '@/' as a shortcut for 'src/'
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  // CSS preprocessor configuration
  css: {
    preprocessorOptions: {
      // LESS configuration - we use LESS for styling in this project
      less: {
        // Enable JavaScript in LESS files (useful for dynamic calculations)
        javascriptEnabled: true,
        // Global variables that can be used in any LESS file
        additionalData: `
          @primary-color: #1a73e8;
          @secondary-color: #5f6368;
          @success-color: #34a853;
          @warning-color: #fbbc04;
          @error-color: #ea4335;
          @background-color: #0d1117;
          @surface-color: #161b22;
          @text-primary: #e6edf3;
          @text-secondary: #8b949e;
          @border-color: #30363d;
          @border-radius: 8px;
        `
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 5173,
    // Proxy API requests to json-server during development
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
