import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // FE dev port
    proxy: {
      '/api': {
        target: 'http://localhost:9999', // BE server
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true,
  },
})
