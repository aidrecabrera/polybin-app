import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    viteReact(),
    VitePWA({
      injectRegister: 'auto',
      registerType: "autoUpdate",
      base: "/",
      scope: "/",
      includeAssets: ["**/*"],
      manifest: {
        theme_color: "#003e21",
        background_color: "#003e21",
        display: "fullscreen",
        scope: "/",
        start_url: "/",
        name: "e-SegBin",
        short_name: "e-SegBin",
        description: "Your Automated Solid Waste Segregation Solution",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,otf,mdx}",
        ],
        runtimeCaching: [
          {
            urlPattern: /.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "all-content-cache",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(js|css|html)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(woff|woff2|ttf|eot|otf)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "font-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
