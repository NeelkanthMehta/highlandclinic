import React from "react";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

export interface HomeBannerProps {
  /** Main banner headline text */
  title?: string;
  /** Subtitle text below headline */
  subtitle?: string;
  /** Background banner image URL */
  imageSrc?: string;
  /** Additional container styling classes */
  className?: string;
}

export default function HomeBanner({
  title = "Welcome to Highland Medical Center",
  subtitle = "Excellence in Healthcare, Committed to Your Well-being",
  imageSrc = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1920&auto=format&fit=crop",
  className = "",
}: HomeBannerProps) {
  return (
    <section className={`relative w-full overflow-hidden h-[340px] xs:h-[400px] sm:h-[480px] md:h-[540px] flex items-center justify-center select-none ${className}`}>
      {/* Clinic Lobby Background Image */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Subtle Overlay to enhance text legibility */}
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />

      {/* Banner Text Overlay */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto space-y-3 sm:space-y-4">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md leading-tight">
          {title}
        </h1>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl font-medium text-white/95 drop-shadow-sm max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* Action Buttons for Quick Access */}
        <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <Link
            href="/book-appointment"
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Consultation</span>
          </Link>
          <Link
            href="/departments"
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 font-semibold text-xs sm:text-sm rounded-xl transition-all inline-flex items-center gap-1.5"
          >
            <span>View Departments</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
