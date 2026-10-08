import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    clearMocks: true,
    restoreMocks: true,
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx,js,jsx}"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "lib/**/*.ts",
        "app/api/**/*.ts",
        "components/**/*.{ts,tsx}",
      ],
      exclude: [
        "lib/generated/**",
        "lib/prisma.ts",
        "**/index.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "tests/**",
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 75,
        "lib/auth.ts": {
          lines: 90,
          branches: 85,
        },
        "app/api/**": {
          lines: 90,
          branches: 85,
        },
      },
    },
  },
});
