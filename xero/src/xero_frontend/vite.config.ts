import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import environment from 'vite-plugin-environment';

export default defineConfig({
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK),
    global: 'window',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
  },
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.DFX_PORT || 4943}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}); 