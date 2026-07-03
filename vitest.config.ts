import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Mirror tsconfig's "@/*" → "./*" so tests can import app code.
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    // Pure-logic suite only — no DOM, no jsdom dependency.
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
