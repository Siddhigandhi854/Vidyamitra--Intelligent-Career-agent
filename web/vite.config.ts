import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "vidyamitra-frontend-uqfo.onrender.com"
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          api: ['axios'],
          ui: ['lucide-react']
        }
      }
    },
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'lucide-react']
  }
})
