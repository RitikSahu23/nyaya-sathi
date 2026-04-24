import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { generateGeminiResponse } from "./api/gemini-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  // const geminiDevApiPlugin = {
  //   name: "gemini-dev-api",
  //   configureServer(server) {
  //     ... (disabled - use proxy to server.js for Ollama support)
  //   },
  // };

  return {
    plugins: [react(), tailwindcss(), viteSingleFile()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
