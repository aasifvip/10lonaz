import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          framer: ["framer-motion"],
          prism: [
            "prismjs",
            "prismjs/components/prism-javascript",
            "prismjs/components/prism-typescript",
            "prismjs/components/prism-python",
            "prismjs/components/prism-java",
            "prismjs/components/prism-markup",
            "prismjs/components/prism-css",
            "prismjs/components/prism-sql",
            "prismjs/components/prism-json",
            "prismjs/components/prism-bash",
          ],
        },
      },
    },
  },
});
