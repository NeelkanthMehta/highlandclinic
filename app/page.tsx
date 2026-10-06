import {
  HomeBanner,
  OurDepartments,
  OurDoctors,
  PatientTestimonials,
} from "@/components/organisms";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export default async function Home() {
  await connection();

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
      <OurDepartments />
      <OurDoctors doctors={doctors} />
      <PatientTestimonials />
    </main>
  );
}
