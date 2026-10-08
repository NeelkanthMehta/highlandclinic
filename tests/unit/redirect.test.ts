import { describe, expect, it } from "vitest";
import { getSafeRedirectPath } from "@/lib/redirect";

describe("getSafeRedirectPath", () => {
  it("preserves a same-site path, query, and fragment", () => {
    expect(getSafeRedirectPath("/appointments?created=true#details")).toBe(
      "/appointments?created=true#details"
    );
  });

  it.each([
    null,
    "",
    "https://attacker.example",
    "//attacker.example/path",
    "/\\attacker.example",
    "relative/path",
  ])("falls back to home for an unsafe target: %s", (candidate) => {
    expect(getSafeRedirectPath(candidate)).toBe("/");
  });
});
