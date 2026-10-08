import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("test setup", () => {
  it("resolves the project alias and runs in Node", () => {
    expect(cn("text-sm", "font-medium")).toBe("text-sm font-medium");
  });
});
