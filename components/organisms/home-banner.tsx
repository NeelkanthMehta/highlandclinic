import React from "react";

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
    <section className={`relative w-full overflow-hidden h-[400px] sm:h-[480px] md:h-[540px] flex items-center justify-center select-none ${className}`}>
      {/* Clinic Lobby Background Image */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Subtle Overlay to enhance text legibility */}
      <div className="absolute inset-0 bg-black/30 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

      {/* Banner Text Overlay */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-medium text-white/95 drop-shadow-sm max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
