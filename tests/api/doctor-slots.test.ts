import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { prisma } = vi.hoisted(() => ({
  prisma: {
    user: { findFirst: vi.fn() },
    appSettings: { findFirst: vi.fn() },
    workingDay: { findFirst: vi.fn() },
    doctorLeave: { findFirst: vi.fn() },
    appointment: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma }));

import { GET } from "@/app/api/doctors/[id]/slots/route";

const context = { params: Promise.resolve({ id: "doctor-1" }) };
const doctor = {
  id: "doctor-1",
  name: "Dr. Ada",
  doctorProfile: { specialty: "Cardiology" },
};

function request(date?: string): NextRequest {
  const query = date ? `?date=${date}` : "";
  return new NextRequest(`http://localhost/api/doctors/doctor-1/slots${query}`);
}

describe("GET /api/doctors/[id]/slots", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-07T08:00:00.000Z"));
    for (const model of Object.values(prisma)) {
      for (const method of Object.values(model)) method.mockReset();
    }
    prisma.user.findFirst.mockResolvedValue(doctor);
    prisma.appSettings.findFirst.mockResolvedValue(null);
    prisma.workingDay.findFirst.mockResolvedValue(null);
    prisma.doctorLeave.findFirst.mockResolvedValue(null);
    prisma.appointment.findMany.mockResolvedValue([]);
  });

  afterEach(() => vi.useRealTimers());

  it("validates required and strict calendar dates", async () => {
    expect((await GET(request(), context)).status).toBe(400);
    expect((await GET(request("2026-02-30"), context)).status).toBe(400);
  });

  it("returns not found when the doctor or profile is unavailable", async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null);
    expect((await GET(request("2026-10-08"), context)).status).toBe(404);

    prisma.user.findFirst.mockResolvedValueOnce({ ...doctor, doctorProfile: null });
    expect((await GET(request("2026-10-08"), context)).status).toBe(404);
  });

  it("returns 16 default slots for an open day", async () => {
    const response = await GET(request("2026-10-08"), context);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.isWorkingDay).toBe(true);
    expect(payload.slots).toHaveLength(16);
    expect(payload.slots[0].time).toBe("09:00");
    expect(payload.slots.at(-1).time).toBe("16:30");
    expect(prisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        }),
      })
    );
  });

  it("uses configured working-day closures and full-day leave", async () => {
    const sunday = await GET(request("2026-10-11"), context);
    expect((await sunday.json()).isWorkingDay).toBe(false);

    prisma.workingDay.findFirst.mockResolvedValue({ isWorkingDay: false });
    const closed = await GET(request("2026-10-08"), context);
    expect((await closed.json()).slots).toEqual([]);

    prisma.workingDay.findFirst.mockResolvedValue({ isWorkingDay: true });
    prisma.doctorLeave.findFirst.mockResolvedValue({
      leaveType: "FULL_DAY",
      reason: null,
    });
    const leave = await GET(request("2026-10-08"), context);
    expect((await leave.json()).message).toContain("Full day leave");
  });

  it("returns occupied slots as unavailable and uses custom schedule settings", async () => {
    prisma.appSettings.findFirst.mockResolvedValue({
      startTime: "10:00",
      endTime: "11:00",
      slotsPerHour: 2,
    });
    prisma.appointment.findMany.mockResolvedValue([
      {
        appointmentStartUTC: new Date("2026-10-08T10:00:00.000Z"),
        appointmentEndUTC: new Date("2026-10-08T10:30:00.000Z"),
      },
    ]);

    const response = await GET(request("2026-10-08"), context);
    const slots = (await response.json()).slots;

    expect(slots).toHaveLength(2);
    expect(slots[0]).toMatchObject({
      time: "10:00",
      isAvailable: false,
      reason: "Already booked",
    });
    expect(slots[1].isAvailable).toBe(true);
  });

  it("marks earlier same-day slots as passed", async () => {
    vi.setSystemTime(new Date("2026-10-08T10:15:00.000Z"));
    const response = await GET(request("2026-10-08"), context);
    const slots = (await response.json()).slots;

    expect(slots[0].reason).toBe("Time slot has passed");
    expect(slots.find((slot: { time: string }) => slot.time === "10:30").isAvailable).toBe(
      true
    );
  });

  it("returns an error response when availability cannot be loaded", async () => {
    prisma.user.findFirst.mockRejectedValue(new Error("database unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect((await GET(request("2026-10-08"), context)).status).toBe(500);
  });
});
