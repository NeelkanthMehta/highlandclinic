"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselSliderProps {
  children: React.ReactNode;
  className?: string;
}

export default function CarouselSlider({ children, className }: CarouselSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cn("relative w-full group/slider", className)}>
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll("left")}
        type="button"
        aria-label="Scroll left"
        className="absolute left-0.5 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all opacity-80 sm:opacity-0 group-hover/slider:opacity-100"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Horizontal Cards Scroll Track (Single Line) */}
      <div
        ref={scrollContainerRef}
        role="region"
        aria-label="Carousel items"
        className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 px-1 sm:px-2 scroll-smooth touch-pan-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {React.Children.map(children, (child, idx) => (
          <div key={idx} className="shrink-0 snap-start">
            {child}
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll("right")}
        type="button"
        aria-label="Scroll right"
        className="absolute right-0.5 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all opacity-80 sm:opacity-0 group-hover/slider:opacity-100"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
