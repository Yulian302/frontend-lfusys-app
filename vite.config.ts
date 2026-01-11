import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import autoprefixer from "autoprefixer"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
})
