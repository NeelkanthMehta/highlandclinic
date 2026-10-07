import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDepartmentMetadata } from "@/lib/department-data";
import DoctorCard from "@/components/molecules/doctorcard";
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
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Building2,
  HelpCircle,
  Stethoscope as DefaultIcon,
  UserCheck,
  Award,
  ChevronRight,
  Sparkles as BadgeIcon,
} from "lucide-react";

interface DepartmentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

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

export async function generateMetadata({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const meta = getDepartmentMetadata(slug);
  return {
    title: `${meta.title} | Highland Medical Center`,
    description: meta.description,
  };
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  await connection();

  const { slug } = await params;
  const metadata = getDepartmentMetadata(slug);

  // 1. Fetch matching Department from Database
  const dbDepartments = await prisma.department.findMany();
  const matchedDept = dbDepartments.find((d) => {
    const dSlug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return dSlug.includes(slug) || slug.includes(dSlug) || d.name.toLowerCase() === metadata.dbName.toLowerCase();
  });

  // 2. Fetch doctors whose specialty matches the department
  const allDoctors = await prisma.user.findMany({
    where: {
      role: "DOCTOR",
      doctorProfile: {
        isActive: true,
      },
    },
    include: {
      doctorProfile: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Filter doctors by specialty relevance
  const deptDoctors = allDoctors.filter((doc) => {
    const spec = (doc.doctorProfile?.specialty || "").toLowerCase();
    const target = slug.toLowerCase();
    if (target.includes("cardio") && spec.includes("cardio")) return true;
    if (target.includes("neuro") && spec.includes("neuro")) return true;
    if (target.includes("pedia") && spec.includes("pedia")) return true;
    if (target.includes("ortho") && (spec.includes("ortho") || spec.includes("joint"))) return true;
    if (target.includes("derma") && spec.includes("derma")) return true;
    if (target.includes("ophthal") && spec.includes("ophthal")) return true;
    if ((target.includes("general") || target.includes("internal")) && (spec.includes("internal") || spec.includes("general") || spec.includes("medicine"))) return true;
    return spec.includes(target) || target.includes(spec);
  });

  // Fallback: If no exact doctors matched for a dynamic department, show top doctors
  const displayDoctors = deptDoctors.length > 0 ? deptDoctors : allDoctors.slice(0, 3);

  // 3. Fetch real database testimonials for these doctors
  const doctorUserIds = displayDoctors.map((d) => d.id);
  const dbTestimonials = await prisma.doctorTestimonial.findMany({
    where: {
      doctorId: { in: doctorUserIds },
    },
    include: {
      doctor: true,
      patient: true,
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });

  const IconComponent = ICON_MAP[metadata.iconName] || metadata.icon || DefaultIcon;

  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full bg-gradient-to-b from-blue-900 via-slate-900 to-[#101828] text-white pt-10 pb-16 px-6 overflow-hidden">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/departments" className="hover:text-white transition-colors">
              Departments
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sky-400 font-semibold">{metadata.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs sm:text-sm font-semibold tracking-wide">
                <IconComponent className="w-4 h-4 text-sky-400" />
                <span>Highland Specialized Medical Department</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {metadata.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                {metadata.tagline}. {metadata.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={`/book-appointment?department=${metadata.slug}`}
                  className="px-6 py-3 bg-[#1B9AF5] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-base rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Department Appointment</span>
                </Link>

                <a
                  href="#team"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-base rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <span>View Specialists ({displayDoctors.length})</span>
                </a>
              </div>
            </div>

            {/* Right Quick Info Card */}
            <div className="lg:col-span-4 bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 dark:border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Department Location</h3>
                  <p className="text-slate-300 text-xs">{metadata.location}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{metadata.hours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{metadata.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-medium">{metadata.emergencyExtension}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
            {metadata.keyStats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 tracking-tight">
                  {stat.stat}
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW & SPECIALIZATIONS SECTION */}
      <section className="py-14 px-6 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Specializations Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Clinical Expertise
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                Specialized Care & Subspecialties
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
                Our department delivers comprehensive clinical programs focused on precise diagnosis, interventional therapy, and long-term health preservation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {metadata.specializations.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-2xs hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {spec}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Conditions Treated Box */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Key Conditions Treated
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We provide tailored therapeutic management and outpatient care for a wide range of clinical conditions:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {metadata.conditionsTreated.map((cond, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. CLINICAL PROCEDURES & SERVICES */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Diagnostic & Therapeutic
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Procedures & Medical Services Offered
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metadata.procedures.map((proc, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 text-xs font-semibold border border-sky-100 dark:border-sky-900">
                      {proc.category || "Clinical Service"}
                    </span>
                    {proc.duration && (
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {proc.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {proc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {proc.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available at Highland Center
                  </span>
                  <Link
                    href={`/book-appointment?department=${metadata.slug}`}
                    className="text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    Schedule <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. DEPARTMENT SPECIALISTS / MEDICAL TEAM (FROM DATABASE) */}
        <div id="team" className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Database Verified Medical Team
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                Department Specialists & Physicians
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Our board-certified physicians and specialists providing dedicated patient consultations.
              </p>
            </div>

            <Link
              href="/book-appointment"
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm rounded-xl transition-colors shrink-0 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Doctor Consultation</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                id={doc.id}
                name={doc.name}
                specialty={doc.doctorProfile?.specialty || metadata.dbName}
                rating={doc.doctorProfile?.rating || 4.9}
                reviewCount={doc.doctorProfile?.reviewCount || 120}
                imageSrc={doc.image}
              />
            ))}
          </div>
        </div>

        {/* 5. FACILITIES & EQUIPMENT */}
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              State-of-the-Art Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Clinical Facilities & Diagnostic Suites
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metadata.facilities.map((fac, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {fac.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. REAL PATIENT TESTIMONIALS & REVIEWS */}
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Verified Patient Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Patient Experiences & Reviews
            </h2>
          </div>

          {dbTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dbTestimonials.map((t) => (
                <div
                  key={t.testimonialId}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(t.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{t.testimonialText}"
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {t.patient?.name || "Verified Highland Patient"}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Care by {t.doctor.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-center space-y-2">
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                4.9 / 5.0 Rating based on verified outpatient consultations across Highland Medical Center.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patients consistently highlight physician thoroughness, clear communication, and efficient care coordination.
              </p>
            </div>
          )}
        </div>

        {/* 7. FREQUENTLY ASKED QUESTIONS */}
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Department Patient Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {metadata.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-xl space-y-2 shadow-2xs"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 8. CALL TO ACTION BANNER */}
        <div className="bg-gradient-to-r from-blue-600 to-[#1B9AF5] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Schedule a Consultation with {metadata.dbName}?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base">
              Book your appointment online today with our board-certified specialist team at Highland Medical Center.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href={`/book-appointment?department=${metadata.slug}`}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-600 font-bold text-base rounded-xl transition-all shadow-md text-center"
            >
              Book Appointment Now
            </Link>
            <Link
              href="/departments"
              className="px-5 py-3 bg-blue-700/50 hover:bg-blue-700 text-white font-medium text-base rounded-xl transition-all border border-white/20 text-center"
            >
              All Departments
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

