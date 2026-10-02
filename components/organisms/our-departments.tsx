import React from "react";
import DepartmentCard from "@/components/molecules/departmentcard";
import CarouselSlider from "@/components/ui/carousel-slider";
import { Heart, Activity, Stethoscope, Bone, Eye, Brain, LucideIcon } from "lucide-react";

export interface DepartmentData {
  id: string | number;
  title: string;
  icon?: LucideIcon | React.ReactNode;
  slug?: string;
  description?: string;
}

/**
 * Placeholder Dummy Data - Replace with database fetch (e.g., Prisma, Supabase, API route)
 */
export const DUMMY_DEPARTMENTS: DepartmentData[] = [
  { id: "1", title: "Cardiology", icon: Heart, slug: "cardiology" },
  { id: "2", title: "Neurology", icon: Brain, slug: "neurology" },
  { id: "3", title: "Pediatrics", icon: Stethoscope, slug: "pediatrics" },
  { id: "4", title: "Orthopedics", icon: Bone, slug: "orthopedics" },
  { id: "5", title: "Ophthalmology", icon: Eye, slug: "ophthalmology" },
  { id: "6", title: "General Medicine", icon: Activity, slug: "general-medicine" },
];

export interface OurDepartmentsProps {
  /** Department records (pass DB query results here) */
  departments?: DepartmentData[];
  /** Section headline title */
  heading?: string;
  /** Intro paragraph text above title */
  description?: string;
  /** Custom container styling */
  className?: string;
}

export default function OurDepartments({
  departments = DUMMY_DEPARTMENTS,
  heading = "Our Departments",
  description = "Welcome to Highland Medical Center, your premier destination for specialized healthcare consultation. Our facility brings together exceptional physicians across all major medical departments, offering expert diagnosis and personalized treatment planning in one convenient location.",
  className = "",
}: OurDepartmentsProps) {
  return (
    <section className={`w-full py-12 px-6 flex flex-col items-center justify-center ${className}`}>
      <div className="max-w-6xl w-full mx-auto space-y-8 text-center">
        {/* Welcome / Intro Text */}
        {description && (
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-normal">
            {description}
          </p>
        )}

        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {heading}
        </h2>

        <CarouselSlider>
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              title={dept.title}
              icon={dept.icon}
            />
          ))}
        </CarouselSlider>
      </div>
    </section>
  );
}
