import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DoctorCardProps {
  id?: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  /** Profile image URL */
  imageSrc: string | null;
  /** Custom href for profile link */
  profileHref?: string;
  /** View profile click callback */
  onViewProfile?: () => void;
  /** Custom container class names */
  className?: string;
}

export default function DoctorCard({
  id,
  name,
  specialty,
  rating,
  reviewCount,
  imageSrc,
  profileHref,
  onViewProfile,
  className,
}: DoctorCardProps) {
  const targetHref = profileHref || (id ? `/doctors/${id}` : undefined);

  return (
    <Card
      className={cn(
        "w-full max-w-sm p-5 border border-slate-200/90 rounded-2xl bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 select-none flex flex-col justify-between",
        className
      )}
    >
      {/* Top Section: Avatar & Info */}
      <div className="flex items-center gap-4 mb-4">
        {/* Doctor Avatar Image */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center text-lg font-semibold text-slate-500 dark:text-slate-400"
            >
              {name
                .replace(/^Dr\.\s*/i, "")
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>

        {/* Doctor Details */}
        <div className="flex flex-col min-w-0 text-left">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg tracking-tight truncate">
            {targetHref ? (
              <Link href={targetHref} className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal -mt-0.5 truncate">
            {specialty}
          </p>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 mt-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">
              {rating} ({reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action: View Profile Button */}
      {targetHref ? (
        <Link
          href={targetHref}
          className="w-full py-2.5 px-4 bg-[#1d9bf0] hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-base rounded-xl transition-colors shadow-xs text-center block"
        >
          View Profile
        </Link>
      ) : (
        <button
          type="button"
          onClick={onViewProfile}
          className="w-full py-2.5 px-4 bg-[#1d9bf0] hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-base rounded-xl transition-colors shadow-xs"
        >
          View Profile
        </button>
      )}
    </Card>
  );
}

