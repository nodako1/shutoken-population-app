import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 開発時: /api-estat → https://api.e-stat.go.jp に転送するプロキシ。
// e-Stat APIのJSONエンドポイントはCORS対応が公式に明記されているが、
// 環境によってブロックされた場合のフォールバックとして用意している。
// 参考: https://www.e-stat.go.jp/api/api-info/api-spec (CORSの記載)
// 参考: https://ja.vitejs.dev/config/server-options.html#server-proxy
export default defineConfig({
  plugins: [react()],
  base: "./", // GitHub Pages のサブパス配信でも動くよう相対パスにする
  server: {
    proxy: {
      "/api-estat": {
        target: "https://api.e-stat.go.jp",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-estat/, ""),
      },
    },
  },
});
