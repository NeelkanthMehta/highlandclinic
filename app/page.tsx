import {
  HomeBanner,
  OurDepartments,
  OurDoctors,
  PatientTestimonials,
} from "@/components/organisms";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";
import { normalizeDepartmentSlug } from "@/lib/department-data";
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

export default async function Home() {
  await connection();

  // Fetch departments from database
  const dbDepartments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });

  const departments = dbDepartments.map((dept) => {
    const slug = normalizeDepartmentSlug(dept.name);
    return {
      id: dept.id,
      title: dept.name,
      slug,
      icon: ICON_MAP[dept.iconName] || DefaultIcon,
    };
  });

  // Fetch doctors from database
  const doctorProfiles = await prisma.doctorProfile.findMany({
    where: { isActive: true },
    orderBy: { user: { name: "asc" } },
    select: {
      profileId: true,
      specialty: true,
      rating: true,
      reviewCount: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  const doctors = doctorProfiles.map(({ profileId, specialty, rating, reviewCount, user }) => ({
    id: profileId,
    name: user.name,
    specialty,
    rating,
    reviewCount,
    imageSrc: user.image,
  }));

  return (
    <main className="flex-1">
      <HomeBanner />
      <OurDepartments departments={departments.length > 0 ? departments : undefined} />
      <OurDoctors doctors={doctors} />
      <PatientTestimonials />
    </main>
  );
}
