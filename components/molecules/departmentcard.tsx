import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DepartmentCardProps {
  /** Title of the department, e.g., "Cardiology" */
  title?: string;
  /** Icon component to display above the title */
  icon?: LucideIcon | React.ReactNode;
  /** Link destination (e.g. "/departments/cardiology") */
  href?: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Custom className overrides for the card container */
  className?: string;
}

export default function DepartmentCard({
  title = "Cardiology",
  icon: Icon = Heart,
  href,
  onClick,
  className,
}: DepartmentCardProps) {
  const renderIcon = () => {
    if (!Icon) return null;

    if (typeof Icon === "function" || (typeof Icon === "object" && "render" in (Icon as object))) {
      const LucideComp = Icon as LucideIcon;
      return (
        <LucideComp className="w-11 h-11 text-[#1B9AF5] fill-sky-500/20 transition-transform group-hover:scale-105" />
      );
    }

    return Icon;
  };

  const content = (
    <Card
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center p-8 w-52 h-44 text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-sky-300 dark:hover:border-sky-700 bg-white dark:bg-slate-900 rounded-2xl select-none border border-slate-200/90 dark:border-slate-800",
        className
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-0 gap-3">
        {/* Icon Container */}
        <div className="flex items-center justify-center">
          {renderIcon()}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {title}
        </h3>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block select-none focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
