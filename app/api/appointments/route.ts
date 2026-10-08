import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { isRecord } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }
    if (!isRecord(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const {
      doctorId,
      patientType = "MYSELF",
      patientRelation,
      patientName,
      phoneNumber,
      reasonForVisit,
      additionalNotes,
      patientdateofbirth,
      appointmentStartUTC,
      appointmentEndUTC,
      paymentMethod = "CASH",
    } = body;

    // Required fields validation
    if (
      typeof doctorId !== "string" ||
      !doctorId ||
      typeof patientName !== "string" ||
      !patientName.trim() ||
      typeof phoneNumber !== "string" ||
      !phoneNumber.trim() ||
      typeof appointmentStartUTC !== "string" ||
      !appointmentStartUTC ||
      typeof appointmentEndUTC !== "string" ||
      !appointmentEndUTC
    ) {
      return NextResponse.json(
        { error: "Missing required fields: doctorId, patientName, phoneNumber, appointmentStartUTC, appointmentEndUTC" },
        { status: 400 }
      );
    }

    if (
      typeof patientType !== "string" ||
      !["MYSELF", "SOMEONE_ELSE"].includes(patientType) ||
      typeof paymentMethod !== "string" ||
      !["CASH", "ONLINE"].includes(paymentMethod) ||
      (patientRelation !== undefined && patientRelation !== null && typeof patientRelation !== "string") ||
      (reasonForVisit !== undefined && reasonForVisit !== null && typeof reasonForVisit !== "string") ||
      (additionalNotes !== undefined && additionalNotes !== null && typeof additionalNotes !== "string") ||
      (patientdateofbirth !== undefined &&
        patientdateofbirth !== null &&
        (typeof patientdateofbirth !== "string" ||
          Number.isNaN(new Date(patientdateofbirth).getTime())))
    ) {
      return NextResponse.json({ error: "Invalid appointment details" }, { status: 400 });
    }

    // Verify doctor existence
    const doctor = await prisma.user.findFirst({
      where: { id: doctorId, role: "DOCTOR" },
      include: { doctorProfile: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const session = await getSessionUser();
    const startUTC = new Date(appointmentStartUTC);
    const endUTC = new Date(appointmentEndUTC);

    if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format for appointmentStartUTC or appointmentEndUTC" },
        { status: 400 }
      );
    }

    if (startUTC >= endUTC) {
      return NextResponse.json(
        { error: "appointmentStartUTC must be before appointmentEndUTC" },
        { status: 400 }
      );
    }

    // Double-booking check
    const existingConflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: {
          notIn: ["CANCELLED", "NO_SHOW"],
        },
        appointmentStartUTC: { lt: endUTC },
        appointmentEndUTC: { gt: startUTC },
      },
    });

    if (existingConflict) {
      return NextResponse.json(
        { error: "Selected time slot is no longer available. Please select another slot." },
        { status: 409 }
      );
    }

    // Determine status based on payment method
    const status = paymentMethod === "CASH" ? "BOOKING_CONFIRMED" : "PAYMENT_PENDING";

    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        userId: session?.role === "PATIENT" ? session.id : null,
        patientType: patientType === "SOMEONE_ELSE" ? "SOMEONE_ELSE" : "MYSELF",
        patientRelation: patientType === "SOMEONE_ELSE" ? patientRelation : null,
        patientName,
        phoneNumber,
        reasonForVisit: reasonForVisit || null,
        additionalNotes: additionalNotes || null,
        patientdateofbirth: patientdateofbirth ? new Date(patientdateofbirth) : null,
        appointmentStartUTC: startUTC,
        appointmentEndUTC: endUTC,
        paymentMethod,
        status,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            doctorProfile: {
              select: {
                specialty: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to book appointment. Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedDoctorId = searchParams.get("doctorId");
    let where: { doctorId?: string; userId?: string } | undefined;

    if (session.role === "ADMIN") {
      where = requestedDoctorId ? { doctorId: requestedDoctorId } : undefined;
    } else if (session.role === "DOCTOR") {
      where = { doctorId: session.id };
    } else if (session.role === "PATIENT") {
      where = {
        userId: session.id,
        ...(requestedDoctorId ? { doctorId: requestedDoctorId } : {}),
      };
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            image: true,
            doctorProfile: {
              select: { specialty: true },
            },
          },
        },
      },
      orderBy: {
        appointmentStartUTC: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error listing appointments:", error);
    return NextResponse.json(
      { error: "Failed to list appointments" },
      { status: 500 }
    );
  }
}
