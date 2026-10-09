"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Stethoscope,
  XCircle,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface AppointmentItem {
  appointmentId: string;
  appointmentStartUTC: Date;
  appointmentEndUTC: Date;
  status: string;
  reasonForVisit?: string | null;
  doctor: {
    id: string;
    name: string;
    doctorProfile?: {
      specialty?: string;
      credentials?: string;
    } | null;
  };
}

interface AppointmentsListProps {
  upcomingAppointments: AppointmentItem[];
  pastAppointments: AppointmentItem[];
}

export default function AppointmentsList({
  upcomingAppointments: initialUpcoming,
  pastAppointments,
}: AppointmentsListProps) {
  const [upcoming, setUpcoming] = useState<AppointmentItem[]>(initialUpcoming);
  const [notification, setNotification] = useState<string | null>(null);

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelAppointment = (id: string) => {
    setUpcoming((prev) =>
      prev.map((apt) =>
        apt.appointmentId === id ? { ...apt, status: "CANCELLED" } : apt
      )
    );
    setNotification("Appointment cancelled successfully.");
  };

  return (
    <div className="space-y-8">
      {notification && (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Upcoming Scheduled Appointments */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Upcoming Scheduled Appointments ({upcoming.length})
        </h3>

        {upcoming.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <Clock className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No upcoming scheduled appointments.
            </p>
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Book a consultation now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <div
                key={apt.appointmentId}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{apt.doctor.name}</span>
                    {apt.doctor.doctorProfile?.specialty && (
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        ({apt.doctor.doctorProfile.specialty})
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDateTime(apt.appointmentStartUTC)}</span>
                  </div>

                  {apt.reasonForVisit && (
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">Reason:</span> {apt.reasonForVisit}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      apt.status === "BOOKING_CONFIRMED" || apt.status === "COMPLETED"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : apt.status === "CANCELLED"
                        ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                        : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {apt.status.replace("_", " ")}
                  </span>

                  {apt.status !== "CANCELLED" && (
                    <>
                      <Link
                        href={`/book-appointment?doctorId=${apt.doctor.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" /> Reschedule
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleCancelAppointment(apt.appointmentId)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-lg transition-colors"
                      >
                        <XCircle className="w-3 h-3" /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Medical Visits & Consultations Logs */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Clock className="w-4 h-4 text-slate-500" />
          Past Medical Visits & Consultation Logs ({pastAppointments.length})
        </h3>

        {pastAppointments.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              No previous visit logs recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastAppointments.map((apt) => (
              <div
                key={apt.appointmentId}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-90"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    {apt.doctor.name}{" "}
                    {apt.doctor.doctorProfile?.specialty && (
                      <span className="font-normal text-slate-500 dark:text-slate-400">
                        • {apt.doctor.doctorProfile.specialty}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatDateTime(apt.appointmentStartUTC)}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase w-fit ${
                    apt.status === "COMPLETED"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      : "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {apt.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

