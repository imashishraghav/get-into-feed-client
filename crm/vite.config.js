import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: __dirname,
  base: '/',
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://getintofeed.com',
        changeOrigin: true
      }
    }
  }
});
