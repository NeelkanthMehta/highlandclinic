import React from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DoctorCardProps {
  /** Name of the doctor, e.g., "Dr. Sarah Mitchell" */
  name?: string;
  /** Specialty or department, e.g., "Cardiology" */
  specialty?: string;
  /** Average rating score, e.g., 4.9 */
  rating?: number;
  /** Number of total reviews, e.g., 127 */
  reviewCount?: number;
  /** Profile image URL */
  imageSrc?: string;
  /** View profile click callback */
  onViewProfile?: () => void;
  /** Custom container class names */
  className?: string;
}

export default function DoctorCard({
  name = "Dr. Sarah Mitchell",
  specialty = "Cardiology",
  rating = 4.9,
  reviewCount = 127,
  imageSrc = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
  onViewProfile,
  className,
}: DoctorCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm p-5 border border-slate-200/90 rounded-2xl bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 select-none",
        className
      )}
    >
      {/* Top Section: Avatar & Info */}
      <div className="flex items-center gap-4 mb-4">
        {/* Doctor Avatar Image */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Doctor Details */}
        <div className="flex flex-col min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg tracking-tight truncate">
            {name}
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
      <button
        type="button"
        onClick={onViewProfile}
        className="w-full py-2.5 px-4 bg-[#1d9bf0] hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-base rounded-xl transition-colors shadow-xs"
      >
        View Profile
      </button>
    </Card>
  );
}
