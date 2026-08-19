import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // relative base so the build works under any sub-path (e.g. GitHub Pages /ifab/)
  base: './',
  plugins: [react()],
  server: { port: 5173, host: true },
})
