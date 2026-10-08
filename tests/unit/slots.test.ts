import { describe, expect, it } from "vitest";
import { generateSlots, parseUTCDate } from "@/lib/slots";

describe("parseUTCDate", () => {
  it.each(["2026-02-30", "2026-13-01", "10/08/2026", "not-a-date"])(
    "rejects invalid date %s",
    (value) => {
      expect(parseUTCDate(value)).toBeNull();
    }
  );

  it("accepts a real ISO calendar date at UTC midnight", () => {
    expect(parseUTCDate("2026-10-08")?.toISOString()).toBe(
      "2026-10-08T00:00:00.000Z"
    );
  });
});

describe("generateSlots", () => {
  const fixedNow = new Date("2026-10-07T00:00:00.000Z");

  it("generates the expected default 30-minute schedule", () => {
    const slots = generateSlots({
      date: "2026-10-08",
      startTime: "09:00",
      endTime: "17:00",
      slotsPerHour: 2,
      appointments: [],
      now: fixedNow,
    });

    expect(slots).toHaveLength(16);
    expect(slots[0]).toMatchObject({ time: "09:00", isAvailable: true });
    expect(slots.at(-1)?.time).toBe("16:30");
  });

  it("blocks overlapping appointments but leaves adjacent slots open", () => {
    const slots = generateSlots({
      date: "2026-10-08",
      startTime: "09:00",
      endTime: "11:00",
      slotsPerHour: 2,
      appointments: [
        {
          appointmentStartUTC: "2026-10-08T09:30:00.000Z",
          appointmentEndUTC: "2026-10-08T10:00:00.000Z",
        },
      ],
      now: fixedNow,
    });

    expect(slots.map(({ isAvailable }) => isAvailable)).toEqual([
      true,
      false,
      true,
      true,
    ]);
  });

  it("applies leave and past-time reasons at their boundaries", () => {
    const slots = generateSlots({
      date: "2026-10-08",
      startTime: "12:30",
      endTime: "13:30",
      slotsPerHour: 2,
      leaveType: "MORNING",
      appointments: [],
      now: new Date("2026-10-08T12:45:00.000Z"),
    });

    expect(slots.map(({ reason }) => reason)).toEqual([
      "Doctor morning leave",
      undefined,
    ]);
  });

  it("returns no slots for invalid schedule configuration", () => {
    expect(
      generateSlots({
        date: "2026-10-08",
        startTime: "09:00",
        endTime: "17:00",
        slotsPerHour: 0,
        appointments: [],
        now: fixedNow,
      })
    ).toEqual([]);
  });
});
