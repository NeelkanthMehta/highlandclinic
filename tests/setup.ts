import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

process.env.JWT_SECRET = "highland-clinic-unit-test-secret";
process.env.DATABASE_URL ??= "postgresql://unit-test:unit-test@localhost:5432/unit_test";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
