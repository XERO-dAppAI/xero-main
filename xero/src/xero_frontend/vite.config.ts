import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
    'process.env': {
      DFX_NETWORK: JSON.stringify(process.env.DFX_NETWORK),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
    host: '127.0.0.1',
    port: 5173
  },
  build: {
    target: 'esnext'
  }
}); 