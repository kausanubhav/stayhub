import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import pluginChecker from "vite-plugin-checker"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pluginChecker({ typescript: true })],
  resolve: {
    alias: {
      // "@shared": path.resolve(__dirname, "../backend/src/shared"),
      "@src": path.resolve(__dirname, "src"),
    },
  },
})
