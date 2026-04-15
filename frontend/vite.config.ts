import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
        enabled: true
    },
    workbox: {
      globPatterns: ["**/*"],
    },
    includeAssets: [
      "**/*",
    ],
    manifest: {
      // "theme_color": "#f69435",
      // "background_color": "#f69435",
      "display": "standalone",
      "scope": "/",
      "start_url": "/",
      "short_name": "ParkirUKK",
      "description": "frontend pwa parkir",
      "name": "Parkir-UKK",
      "prefer_related_applications": false,
      // "icons": [
      //   {
      //     "src": "/192.png",
      //     "sizes": "192x192",
      //     "type": "image/png"
      //   },
      //   {
      //     "src": "/512.png",
      //     "sizes": "512x512",
      //     "type": "image/png"
      //   }
      // ],
    }
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: true
    },
    host: true,
    port: 3002,
    strictPort: true
  }
})
