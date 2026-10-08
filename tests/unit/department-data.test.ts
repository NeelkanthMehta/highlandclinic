import { describe, expect, it } from "vitest";
import {
  DEPARTMENT_METADATA_MAP,
  getDepartmentMetadata,
  normalizeDepartmentSlug,
} from "@/lib/department-data";

describe("department data", () => {
  it.each([
    [" Cardiology & Vascular Care ", "cardiology"],
    ["Pediatric Medicine", "pediatrics"],
    ["Orthopedic Surgery", "orthopedics"],
    ["Internal Medicine", "general-medicine"],
    ["Dental Care", "dental-care"],
    ["Community Health", "community-health"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeDepartmentSlug(input)).toBe(expected);
  });

  it("looks up canonical metadata and creates a safe fallback for custom departments", () => {
    expect(getDepartmentMetadata("Cardiology").title).toBe(
      DEPARTMENT_METADATA_MAP.cardiology.title
    );

    const fallback = getDepartmentMetadata("sleep_health");
    expect(fallback.slug).toBe("sleep-health");
    expect(fallback.title).toBe("Sleep Health Department");
    expect(fallback.faqs).toHaveLength(1);
  });

  it("keeps every metadata entry structurally complete", () => {
    for (const [key, department] of Object.entries(DEPARTMENT_METADATA_MAP)) {
      expect(department.slug).toBe(key);
      expect(department.title).toBeTruthy();
      expect(department.icon).toBeDefined();
      expect(department.procedures.length).toBeGreaterThan(0);
      expect(department.faqs.length).toBeGreaterThan(0);
      expect(new Set(department.faqs.map(({ question }) => question)).size).toBe(
        department.faqs.length
      );
    }
  });
});
