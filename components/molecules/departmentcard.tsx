import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DepartmentCardProps {
  /** Title of the department, e.g., "Cardiology" */
  title?: string;
  /** Icon component to display above the title */
  icon?: LucideIcon | React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Custom className overrides for the card container */
  className?: string;
}

export default function DepartmentCard({
  title = "Cardiology",
  icon: Icon = Heart,
  onClick,
  className,
}: DepartmentCardProps) {
  const renderIcon = () => {
    if (!Icon) return null;

    // Check if Icon is a Lucide component or custom element
    if (typeof Icon === "function" || (typeof Icon === "object" && "render" in (Icon as object))) {
      const LucideComp = Icon as LucideIcon;
      return (
        <LucideComp className="w-11 h-11 text-[#1d9bf0] fill-[#1d9bf0] transition-transform group-hover:scale-105" />
      );
    }

    return Icon;
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center p-8 w-52 h-44 text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 bg-white dark:bg-slate-900 rounded-2xl select-none",
        className
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-0 gap-3">
        {/* Icon Container */}
        <div className="flex items-center justify-center">
          {renderIcon()}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h3>
      </CardContent>
    </Card>
  );
}
