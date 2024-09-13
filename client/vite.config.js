import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Use environment variable for API base URL
      "/api": {
        target: process.env.VITE_API_BASE_URL || "https://backend-taskmanagement-atbi.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
