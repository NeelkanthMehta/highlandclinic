import { connection } from "next/server";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDepartmentMetadata, normalizeDepartmentSlug } from "@/lib/department-data";
import {
  Heart,
  Brain,
  Stethoscope,
  Bone,
  Eye,
  Activity,
  Sparkles,
  Smile,
  LucideIcon,
  ChevronRight,
  UserCheck,
  Building2,
  Calendar,
  Stethoscope as DefaultIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Brain,
  Stethoscope,
  Bone,
  Eye,
  Activity,
  Sparkles,
  Smile,
};

export const metadata = {
  title: "Clinical Departments | Highland Medical Center",
  description: "Explore our specialized medical departments, clinical services, and board-certified physicians.",
};

export default async function DepartmentsIndexPage() {
  await connection();

  // 1. Fetch departments from Database
  const dbDepartments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });

  // 2. Fetch all active doctors with specialties
  const doctors = await prisma.user.findMany({
    where: {
      role: "DOCTOR",
      doctorProfile: { isActive: true },
    },
    include: { doctorProfile: true },
  });

  // Group doctor counts per department
  const getDoctorCount = (deptName: string) => {
    const slug = normalizeDepartmentSlug(deptName);
    return doctors.filter((doc) => {
      const spec = (doc.doctorProfile?.specialty || "").toLowerCase();
      if (slug.includes("cardio") && spec.includes("cardio")) return true;
      if (slug.includes("neuro") && spec.includes("neuro")) return true;
      if (slug.includes("pedia") && spec.includes("pedia")) return true;
      if (slug.includes("ortho") && (spec.includes("ortho") || spec.includes("joint"))) return true;
      if (slug.includes("derma") && spec.includes("derma")) return true;
      if (slug.includes("ophthal") && spec.includes("ophthal")) return true;
      if ((slug.includes("general") || slug.includes("internal")) && (spec.includes("internal") || spec.includes("general"))) return true;
      return spec.includes(slug) || slug.includes(spec);
    }).length;
  };

  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 text-sky-600 dark:text-sky-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
            Highland Clinical Care
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Our Medical Departments
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed font-normal">
            Welcome to Highland Medical Center. Browse our specialized clinical departments to view services, facilities, physician profiles, and book appointments.
          </p>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbDepartments.map((dept) => {
            const slug = normalizeDepartmentSlug(dept.name);
            const meta = getDepartmentMetadata(slug);
            const doctorCount = getDoctorCount(dept.name);
            const IconComp = ICON_MAP[dept.iconName] || meta.icon || DefaultIcon;

            return (
              <Link
                key={dept.id}
                href={`/departments/${slug}`}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-2xl shadow-2xs hover:shadow-lg hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Row: Icon & Doctor Count Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-[#1B9AF5] transition-transform group-hover:scale-105">
                      <IconComp className="w-8 h-8 fill-sky-500/20" />
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {doctorCount > 0 ? `${doctorCount} Specialist${doctorCount > 1 ? "s" : ""}` : "Specialist Care"}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {dept.name}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {meta.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {meta.description}
                  </p>
                </div>

                {/* Footer Link Action */}
                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
                  <span>Explore Department Portal</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

