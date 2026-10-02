import {
  HomeBanner,
  OurDepartments,
  OurDoctors,
  PatientTestimonials,
} from "@/components/organisms";

export default function Home() {
  return (
    <main className="flex-1">
      <HomeBanner />
      <OurDepartments />
      <OurDoctors />
      <PatientTestimonials />
    </main>
  );
}
