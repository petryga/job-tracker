/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    // 3000 is taken by the BE (see BE/server.js) — see apiSlice.ts.
    port: 3001,
  },
  build: {
    rollupOptions: {
      output: {
        // Split the big, rarely-changing vendors out of the entry chunk so the
        // initial download stays small and these stay cached across deploys.
        manualChunks: (id) => {
          if (id.includes("node_modules/@supabase/")) return "supabase";
          if (
            id.includes("node_modules/@mui/") ||
            id.includes("node_modules/@emotion/")
          )
            return "mui";
          if (
            /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(
              id
            )
          )
            return "react-vendor";
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        "src/index.tsx",
        "src/test-utils/**",
        "src/**/types.ts",
      ],
    },
  },
});
