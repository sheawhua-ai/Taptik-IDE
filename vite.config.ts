import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      // Keep the HMR socket on the same hostname used by the browser. This avoids
      // localhost -> 127.0.0.1 WebSocket failures in Codex's local preview pane.
      hmr: process.env.DISABLE_HMR !== 'true'
        ? {
            host: 'localhost',
            port: 5173,
            protocol: 'ws',
          }
        : false,
    },
  };
});
