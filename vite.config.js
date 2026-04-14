import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    '__BUILD_TIMESTAMP__': JSON.stringify(new Date().toISOString()),
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase'
          }
          if (id.includes('node_modules/react-quill') ||
              id.includes('node_modules/quill') ||
              id.includes('node_modules/@tiptap') ||
              id.includes('node_modules/prosemirror') ||
              id.includes('node_modules/marked') ||
              id.includes('node_modules/react-markdown') ||
              id.includes('node_modules/remark') ||
              id.includes('node_modules/rehype') ||
              id.includes('node_modules/unified') ||
              id.includes('node_modules/micromark') ||
              id.includes('node_modules/highlight.js') ||
              id.includes('node_modules/prismjs')) {
            return 'editor'
          }
          if (id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/@heroicons') ||
              id.includes('node_modules/react-icons')) {
            return 'icons'
          }
          if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/@motionone')) {
            return 'animation'
          }
          if (id.includes('node_modules/date-fns') ||
              id.includes('node_modules/dayjs') ||
              id.includes('node_modules/moment')) {
            return 'date-utils'
          }
          if (id.includes('node_modules/d3-') ||
              id.includes('node_modules/d3/')) {
            return 'd3'
          }
          if (id.includes('node_modules/recharts')) {
            return 'charts'
          }
          if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/zod') ||
              id.includes('node_modules/yup')) {
            return 'forms'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})