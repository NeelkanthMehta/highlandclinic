import React from "react";
import DoctorCard from "@/components/molecules/doctorcard";
import CarouselSlider from "@/components/ui/carousel-slider";

export interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  imageSrc: string | null;
}

export interface OurDoctorsProps {
  doctors: DoctorData[];
  /** Section heading title */
  heading?: string;
  /** Custom container styling */
  className?: string;
}

export default function OurDoctors({
  doctors,
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

        {doctors.length > 0 ? (
          <CarouselSlider>
            {doctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                id={doc.id}
                name={doc.name}
                specialty={doc.specialty}
                rating={doc.rating}
                reviewCount={doc.reviewCount}
                imageSrc={doc.imageSrc}
                profileHref={`/doctors/${doc.id}`}
                className="w-[calc(100vw-4rem)] max-w-none sm:w-96"
              />
            ))}
          </CarouselSlider>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">
            No doctors are currently available.
          </p>
        )}
      </div>
    </section>
  );
}
