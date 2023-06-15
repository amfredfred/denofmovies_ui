import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), process.env],
  build: {
    outDir: 'build'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.MY_ENV': JSON.stringify(process.env.MY_ENV),
  }, 
})
