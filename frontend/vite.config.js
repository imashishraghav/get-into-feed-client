import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          icons: ["lucide-react"]
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000"
    }
  }
});
