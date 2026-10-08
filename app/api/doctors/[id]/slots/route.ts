import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlots, parseUTCDate } from "@/lib/slots";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: doctorId } = await params;
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json(
        { error: "Query parameter 'date' (YYYY-MM-DD) is required" },
        { status: 400 }
      );
    }

    // Validate doctor existence
    const doctor = await prisma.user.findFirst({
      where: { id: doctorId, role: "DOCTOR" },
      include: { doctorProfile: true },
    });

    if (!doctor || !doctor.doctorProfile) {
      return NextResponse.json(
        { error: "Doctor not found or inactive" },
        { status: 404 }
      );
    }

    // App settings (defaults to 09:00 - 17:00, 30 min per slot)
    const settings = await prisma.appSettings.findFirst({
      where: { id: "global" },
    });

    const startTimeStr = settings?.startTime || "09:00";
    const endTimeStr = settings?.endTime || "17:00";
    const slotsPerHour = settings?.slotsPerHour || 2;

    // Parse target date (YYYY-MM-DD)
    const targetDate = parseUTCDate(dateStr);
    if (!targetDate) {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const dayOfWeek = targetDate.getUTCDay(); // 0 = Sun, 6 = Sat

    // Check if Sunday (0) or Saturday (6) - custom clinic working day logic
    const workingDay = await prisma.workingDay.findFirst({
      where: { dayOfWeek },
    });
    const isClinicOpen = workingDay ? workingDay.isWorkingDay : (dayOfWeek !== 0); // Default Sun closed, Mon-Sat open

    if (!isClinicOpen) {
      return NextResponse.json({
        date: dateStr,
        doctorId,
        doctorName: doctor.name,
        specialty: doctor.doctorProfile.specialty,
        isWorkingDay: false,
        message: "Clinic is closed on this day.",
        slots: [],
      });
    }

    // Check Doctor Leave for this date
    const leave = await prisma.doctorLeave.findFirst({
      where: {
        doctorId,
        leaveDate: targetDate,
      },
    });

    if (leave?.leaveType === "FULL_DAY") {
      return NextResponse.json({
        date: dateStr,
        doctorId,
        doctorName: doctor.name,
        specialty: doctor.doctorProfile.specialty,
        isWorkingDay: true,
        leaveType: "FULL_DAY",
        message: `Doctor is on leave: ${leave.reason || "Full day leave"}`,
        slots: [],
      });
    }

    // Fetch existing appointments for the day
    const dayStartUTC = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEndUTC = new Date(`${dateStr}T23:59:59.999Z`);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentStartUTC: { gte: dayStartUTC, lte: dayEndUTC },
        status: {
          notIn: ["CANCELLED", "NO_SHOW"],
        },
      },
      select: {
        appointmentStartUTC: true,
        appointmentEndUTC: true,
      },
    });

    const slots = generateSlots({
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      slotsPerHour,
      leaveType: leave?.leaveType || null,
      appointments: existingAppointments,
      now: new Date(),
    });

    return NextResponse.json({
      date: dateStr,
      doctorId,
      doctorName: doctor.name,
      specialty: doctor.doctorProfile.specialty,
      isWorkingDay: true,
      leaveType: leave?.leaveType || null,
      slots,
    });
  } catch (error) {
    console.error("Error fetching doctor slots:", error);
    return NextResponse.json(
      { error: "Failed to calculate slot availability" },
      { status: 500 }
    );
  }
}
