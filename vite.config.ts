
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa"; // Import VitePWA

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://nicebackend.netlify.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/.netlify/functions'),
        secure: true,
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({ // Add VitePWA plugin configuration
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Enable PWA in development
      },
      manifest: {
        name: 'My Nice Application',
        short_name: 'NiceApp',
        description: 'My Awesome Nice Application!',
        theme_color: '#ffffff', // You can customize this
        background_color: '#ffffff', // You can customize this
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // Placeholder: you'll need to create this icon in public/
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Placeholder: you'll need to create this icon in public/
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-maskable-512x512.png', // Placeholder: for maskable icon, create in public/
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Allow assets up to ~5 MB to be precached
        // To exclude specific big bundles, uncomment globIgnores, e.g.:
        // globIgnores: ['assets/index-*.js']
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
