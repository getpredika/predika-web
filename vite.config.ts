import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import compression from "vite-plugin-compression"

export default defineConfig({
    plugins: [
        react(),
        compression({ algorithm: "gzip" }),
        compression({ algorithm: "brotliCompress", ext: ".br" }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@assets": path.resolve(__dirname, "./src/assets"),
        },
    },
})
