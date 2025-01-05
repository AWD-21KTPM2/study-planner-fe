import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// Get the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8080', 10),
    hmr: true,
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL),
    __GOOGLE_CLIENT_ID__: JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID)
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Filter out deprecation warnings related to Sass functions
        if (warning.message.includes('deprecated')) return
        warn(warning) // Log other warnings
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
