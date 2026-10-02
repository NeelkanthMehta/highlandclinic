import React from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReviewProps {
  /** Name of the reviewer, e.g., "Michael Thompson" */
  name?: string;
  /** Rating score out of 5, e.g., 5 */
  rating?: number;
  /** Testimonial comment */
  comment?: string;
  /** Review date string, e.g., "March 15, 2025" */
  date?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Custom container class names */
  className?: string;
}

export default function Review({
  name = "Michael Thompson",
  rating = 5,
  comment = '"Outstanding service! The booking process was seamless, and Dr. Mitchell provided excellent care."',
  date = "March 15, 2025",
  avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  className,
}: ReviewProps) {
  // Ensure comment starts and ends with quotes if not provided
  const formattedComment = comment.startsWith('"') ? comment : `"${comment}"`;

  return (
    <Card
      className={cn(
        "w-full max-w-md p-6 border border-slate-200/90 rounded-2xl bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between select-none",
        className
      )}
    >
      <div>
        {/* Top Section: Avatar, Name & Star Rating */}
        <div className="flex items-center gap-3.5 mb-4">
          {/* User Avatar */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Rating */}
          <div className="flex flex-col min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight truncate">
              {name}
            </h4>
            {/* Star Rating Icons */}
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "w-4 h-4",
                    index < rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-700"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed font-normal">
          {formattedComment}
        </p>
      </div>

      {/* Date */}
      <div className="mt-5 pt-1">
        <span className="text-slate-400 dark:text-slate-500 text-sm font-normal">
          {date}
        </span>
      </div>
    </Card>
  );
}
