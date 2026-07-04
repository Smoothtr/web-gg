import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
  },
  // Đảm bảo chỉ có 1 instance React (tránh "Invalid hook call" khi dùng framer-motion)
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
})
