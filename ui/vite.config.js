import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH,
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
    resolve: {
      alias: {
        "@/": path.join(__dirname, "src/"),
      },
    },
    server: {
      port: parseInt(env.VITE_PORT),
    },
  };
});
