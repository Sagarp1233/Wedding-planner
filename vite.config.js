import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    // Inject build timestamp as the app version — unique per deployment
    '__BUILD_TIMESTAMP__': JSON.stringify(new Date().toISOString()),
  },
})
