import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy requests prefixed '/api'
    proxy: {
      "/api": "https://proshop-68yq.onrender.com",
      "/uploads": "https://proshop-68yq.onrender.com",
    },
  },
});
