import React from "react";
import Review from "@/components/molecules/review";
import CarouselSlider from "@/components/ui/carousel-slider";

export interface ReviewData {
  id: string | number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl: string;
}

/**
 * Placeholder Dummy Data - Replace with database fetch (e.g., Prisma, Supabase, API route)
 */
export const DUMMY_REVIEWS: ReviewData[] = [
  {
    id: "1",
    name: "Michael Thompson",
    rating: 5,
    comment: "Outstanding service! The booking process was seamless, and Dr. Mitchell provided excellent care.",
    date: "March 15, 2025",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Michael Thompson",
    rating: 5,
    comment: "Outstanding service! The booking process was seamless, and Dr. Mitchell provided excellent care.",
    date: "March 15, 2025",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Michael Thompson",
    rating: 5,
    comment: "Outstanding service! The booking process was seamless, and Dr. Mitchell provided excellent care.",
    date: "March 15, 2025",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Sophia Martinez",
    rating: 5,
    comment: "The staff at Highland Medical Center are incredibly professional and compassionate. Highly recommend!",
    date: "February 28, 2025",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "David Reynolds",
    rating: 5,
    comment: "Quick appointment scheduling and state-of-the-art facilities. Truly top tier healthcare.",
    date: "January 19, 2025",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
];

export interface PatientTestimonialsProps {
  /** Review records array (pass DB query results here) */
  reviews?: ReviewData[];
  /** Section heading title */
  heading?: string;
  /** Custom container styling */
  className?: string;
}

export default function PatientTestimonials({
  reviews = DUMMY_REVIEWS,
  heading = "Patient Testimonials",
  className = "",
}: PatientTestimonialsProps) {
  return (
    <section className={`w-full py-12 px-6 flex flex-col items-center justify-center ${className}`}>
      <div className="max-w-6xl w-full mx-auto space-y-8 text-center">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {heading}
        </h2>

        {/* Single-line Slider Carousel for Review Cards */}
        <CarouselSlider>
          {reviews.map((rev) => (
            <Review
              key={rev.id}
              name={rev.name}
              rating={rev.rating}
              comment={rev.comment}
              date={rev.date}
              avatarUrl={rev.avatarUrl}
            />
          ))}
        </CarouselSlider>
      </div>
    </section>
  );
}
