import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma } = vi.hoisted(() => ({
  prisma: { user: { findMany: vi.fn() } },
}));

vi.mock("@/lib/prisma", () => ({ prisma }));

import { GET } from "@/app/api/doctors/route";

describe("GET /api/doctors", () => {
  beforeEach(() => {
    prisma.user.findMany.mockReset();
  });

  it("returns active doctors in name order", async () => {
    prisma.user.findMany.mockResolvedValue([{ id: "doctor-1", name: "A Doctor" }]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      doctors: [{ id: "doctor-1", name: "A Doctor" }],
    });
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { role: "DOCTOR", doctorProfile: { isActive: true } },
        orderBy: { name: "asc" },
      })
    );
  });

  it("returns an empty collection when no doctors are available", async () => {
    prisma.user.findMany.mockResolvedValue([]);

    expect(await (await GET()).json()).toEqual({ doctors: [] });
  });

  it("returns a server error when the doctor query fails", async () => {
    prisma.user.findMany.mockRejectedValue(new Error("database unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect((await GET()).status).toBe(500);
  });
});
