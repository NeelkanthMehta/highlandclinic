import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id: appointmentId } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phoneNumber: true,
            address: true,
            doctorProfile: {
              select: {
                specialty: true,
                credentials: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const canRead =
      session.role === "ADMIN" ||
      (session.role === "PATIENT" && appointment.userId === session.id) ||
      (session.role === "DOCTOR" && appointment.doctorId === session.id);
    if (!canRead) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment details" },
      { status: 500 }
    );
  }
}
