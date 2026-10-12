import { redirect } from "next/navigation";
import UserProfilePage from "./profile-client";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AppointmentStatus, PatientProfile } from "@/schemas/user-profile";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null): string {
  return date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
}

function getAppointmentStatus(status: string): AppointmentStatus {
  switch (status) {
    case "PAYMENT_PENDING":
      return "Pending";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "NO_SHOW":
      return "No-show";
    default:
      return "Upcoming";
  }
}

export default async function ProfilePage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phoneNumber: true,
      address: true,
      dateofbirth: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const appointments = await prisma.appointment.findMany({
    where: { userId: user.id },
    include: {
      doctor: {
        select: {
          name: true,
          doctorProfile: {
            select: { specialty: true },
          },
        },
      },
    },
    orderBy: { appointmentStartUTC: "desc" },
    take: 50,
  });

  const patient: PatientProfile = {
    id: user.id,
    fullName:
      user.name.trim() && user.name !== "NO_NAME"
        ? user.name
        : "Account holder",
    avatarUrl: user.image ?? undefined,
    email: user.email,
    phoneNumber: user.phoneNumber ?? "",
    address: user.address ?? "",
    dateOfBirth: formatDate(user.dateofbirth),
    appointments: appointments.map((appointment) => ({
      id: appointment.appointmentId,
      doctorName: appointment.doctor.name,
      doctorSpecialty: appointment.doctor.doctorProfile?.specialty ?? "",
      dateTime: `${appointment.appointmentStartUTC.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })} • ${appointment.appointmentStartUTC.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`,
      status: getAppointmentStatus(appointment.status),
      reasonForVisit: appointment.reasonForVisit ?? undefined,
    })),
  };

  return <UserProfilePage patient={patient} />;
}
