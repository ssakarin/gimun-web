import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// 상대 경로(base "./")로 빌드해서 어느 주소(GitHub Pages 하위 폴더 등)에 올려도 동작한다.
export default defineConfig({
  base: "./",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "기문명리 - 기문둔갑 사주",
        short_name: "기문명리",
        description: "기문둔갑 사주 프로그램",
        lang: "ko",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#f4f1ea",
        theme_color: "#7a3b2e",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,webmanifest}"],
        navigateFallback: "index.html",
      },
    }),
  ],
});
