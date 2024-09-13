import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "https://backend-taskmanagement-atbi.onrender.com/api/v1",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
