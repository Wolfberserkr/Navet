import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { maskSavePlugin } from './dev/mask-save-plugin';

export default defineConfig({
  // JSX without @vitejs/plugin-react (not on the approved dependency list).
  esbuild: { jsx: 'automatic' },
  server: { host: true },
  plugins: [
    maskSavePlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/favicon-64.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'The Village',
        short_name: 'Village',
        description: "Rick's village of AI directors.",
        start_url: '/',
        scope: '/',
        display: 'fullscreen',
        orientation: 'any',
        background_color: '#16182a',
        theme_color: '#16182a',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // The map (~6 MB) and the portraits (up to ~2 MB) must be cached for offline use.
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
        navigateFallback: 'index.html',
      },
      devOptions: { enabled: false },
    }),
  ],
});
