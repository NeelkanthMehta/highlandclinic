import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Stethoscope,
  Clock,
  ArrowRight,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UserProfilePage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      patientAppointments: {
        include: {
          doctor: {
            select: {
              name: true,
              doctorProfile: {
                select: {
                  specialty: true,
                },
              },
            },
          },
        },
        orderBy: { appointmentStartUTC: "desc" },
      },
      doctorProfile: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Banner / Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shrink-0">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Highland Medical Center Patient Portal
            </p>
            <div className="text-xs text-slate-400 pt-1">
              Member since {formatDate(user.createdAt)}
            </div>
          </div>
        </div>

        {/* Account Details & Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Account Details
            </h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Email</div>
                  <div className="font-medium text-slate-900 dark:text-white">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Phone</div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {user.phoneNumber || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Date of Birth</div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {formatDate(user.dateofbirth)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Patient Services & Shortcuts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                Need to schedule a new consultation or view available specialist doctors?
              </p>
            </div>
            <div className="space-y-2 pt-4">
              <Link
                href="/book-appointment"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                Book Appointment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/doctors"
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                View Doctors & Specialists
              </Link>
            </div>
          </div>
        </div>

        {/* Patient Appointment History */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Your Appointment History
            </h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total: {user.patientAppointments.length}
            </span>
          </div>

          {user.patientAppointments.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                You have no medical appointments booked yet.
              </p>
              <Link
                href="/book-appointment"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Book your first consultation <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {user.patientAppointments.map((apt) => (
                <div
                  key={apt.appointmentId}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
                      <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                        <span className="font-semibold">Reason:</span> {apt.reasonForVisit}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                        apt.status === "BOOKING_CONFIRMED" || apt.status === "COMPLETED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : apt.status === "CANCELLED"
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {apt.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

