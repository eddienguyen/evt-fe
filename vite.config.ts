import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  }
})
