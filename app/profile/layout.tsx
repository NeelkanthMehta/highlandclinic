import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import ProfileNav from "./profile-nav";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/sign-in");
  }

  function getInitials(name?: string | null): string {
    if (!name || name === "NO_NAME") return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
              {getInitials(sessionUser.name)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {sessionUser.name}
              </h1>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {sessionUser.email}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full uppercase">
                  {sessionUser.role}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/book-appointment"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </Link>
        </div>

        {/* Layout Grid: Sidebar Navigation + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProfileNav />
          </div>

          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}

