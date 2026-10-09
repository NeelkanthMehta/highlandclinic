import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppointmentsList from "./appointments-list";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppointmentsHistoryPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/sign-in");
  }

  const appointments = await prisma.appointment.findMany({
    where: { userId: sessionUser.id },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          doctorProfile: {
            select: {
              specialty: true,
              credentials: true,
            },
          },
        },
      },
    },
    orderBy: { appointmentStartUTC: "desc" },
  });

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentStartUTC) >= now
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentStartUTC) < now
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Appointments & Consultations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Track your upcoming medical consultations and review past visit history.
          </p>
        </div>

        <Link
          href="/book-appointment"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Book Consultation
        </Link>
      </div>

      <AppointmentsList
        upcomingAppointments={upcomingAppointments}
        pastAppointments={pastAppointments}
      />
    </div>
  );
}

