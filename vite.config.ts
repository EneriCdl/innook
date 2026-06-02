import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/innook/',
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    target: 'es2020',
    sourcemap: false,
  },
  server: {
    host: true,
  },
})
