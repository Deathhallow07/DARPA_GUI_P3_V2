import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // This tells Vite "don't even try to scan these for now"
    exclude: ['react-map-gl']
  }
})