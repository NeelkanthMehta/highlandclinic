import React from "react";
import DoctorCard from "@/components/molecules/doctorcard";
import CarouselSlider from "@/components/ui/carousel-slider";

export interface DoctorData {
  id: string | number;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  imageSrc: string;
}

/**
 * Placeholder Dummy Data - Replace with database fetch (e.g., Prisma, Supabase, API route)
 */
export const DUMMY_DOCTORS: DoctorData[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    specialty: "Cardiology",
    rating: 4.9,
    reviewCount: 127,
    imageSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Dr. Sarah Mitchell",
    specialty: "Cardiology",
    rating: 4.9,
    reviewCount: 127,
    imageSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Dr. Sarah Mitchell",
    specialty: "Cardiology",
    rating: 4.9,
    reviewCount: 127,
    imageSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
  },
];

export interface OurDoctorsProps {
  /** Doctor records array (pass DB query results here) */
  doctors?: DoctorData[];
  /** Section heading title */
  heading?: string;
  /** Custom container styling */
  className?: string;
}

export default function OurDoctors({
  doctors = DUMMY_DOCTORS,
  heading = "Our Doctors",
  className = "",
}: OurDoctorsProps) {
  return (
    <section className={`w-full py-12 px-6 flex flex-col items-center justify-center ${className}`}>
      <div className="max-w-6xl w-full mx-auto space-y-8 text-center">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {heading}
        </h2>

        <CarouselSlider>
          {doctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              name={doc.name}
              specialty={doc.specialty}
              rating={doc.rating}
              reviewCount={doc.reviewCount}
              imageSrc={doc.imageSrc}
              className="w-[calc(100vw-4rem)] max-w-none sm:w-96"
            />
          ))}
        </CarouselSlider>
      </div>
    </section>
  );
}
