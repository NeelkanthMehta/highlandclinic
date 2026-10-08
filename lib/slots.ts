export type DoctorLeaveType = "FULL_DAY" | "MORNING" | "AFTERNOON";

export interface ExistingAppointment {
  appointmentStartUTC: Date | string;
  appointmentEndUTC: Date | string;
}

export interface AvailableSlot {
  time: string;
  startUTC: string;
  endUTC: string;
  isAvailable: boolean;
  reason?: string;
}

interface GenerateSlotsOptions {
  date: string;
  startTime: string;
  endTime: string;
  slotsPerHour: number;
  leaveType?: DoctorLeaveType | null;
  appointments: ExistingAppointment[];
  now: Date;
}

export function parseUTCDate(date: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  const parsed = new Date(`${date}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date
    ? null
    : parsed;
}

export function generateSlots({
  date,
  startTime,
  endTime,
  slotsPerHour,
  leaveType = null,
  appointments,
  now,
}: GenerateSlotsOptions): AvailableSlot[] {
  if (!Number.isInteger(slotsPerHour) || slotsPerHour <= 0) return [];

  const slotDurationMinutes = Math.floor(60 / slotsPerHour);
  if (slotDurationMinutes <= 0) return [];

  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const slots: AvailableSlot[] = [];

  while (currentMinutes + slotDurationMinutes <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    const startUTC = new Date(`${date}T${time}:00.000Z`);
    const endUTC = new Date(startUTC.getTime() + slotDurationMinutes * 60_000);
    let reason: string | undefined;

    if (leaveType === "MORNING" && hour < 13) {
      reason = "Doctor morning leave";
    } else if (leaveType === "AFTERNOON" && hour >= 13) {
      reason = "Doctor afternoon leave";
    } else if (
      appointments.some((appointment) => {
        const appointmentStart = new Date(appointment.appointmentStartUTC).getTime();
        const appointmentEnd = new Date(appointment.appointmentEndUTC).getTime();
        return startUTC.getTime() < appointmentEnd && endUTC.getTime() > appointmentStart;
      })
    ) {
      reason = "Already booked";
    } else if (startUTC.getTime() < now.getTime()) {
      reason = "Time slot has passed";
    }

    slots.push({
      time,
      startUTC: startUTC.toISOString(),
      endUTC: endUTC.toISOString(),
      isAvailable: reason === undefined,
      reason,
    });

    currentMinutes += slotDurationMinutes;
  }

  return slots;
}
