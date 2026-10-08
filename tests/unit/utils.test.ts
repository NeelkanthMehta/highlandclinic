import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class inputs and resolves conflicting Tailwind utilities", () => {
    expect(cn("px-2 py-1", false && "hidden", "px-4")).toBe("py-1 px-4");
  });

  it("accepts conditional classes and empty values", () => {
    expect(cn("text-sm", undefined, null, ["font-medium"])).toBe(
      "text-sm font-medium"
    );
  });
});
