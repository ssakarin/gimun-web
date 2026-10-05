import { defineConfig } from "vitest/config";

// 시험에는 PWA 플러그인이 필요 없어서 vite.config.ts 와 따로 둔다.
export default defineConfig({
  test: { environment: "node" },
});
