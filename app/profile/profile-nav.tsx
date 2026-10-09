"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Calendar, Lock } from "lucide-react";

const navItems = [
  {
    name: "Personal Info",
    href: "/profile",
    icon: User,
    exact: true,
  },
  {
    name: "Medical & Insurance",
    href: "/profile/medical",
    icon: Shield,
    exact: false,
  },
  {
    name: "Appointments History",
    href: "/profile/appointments",
    icon: Calendar,
    exact: false,
  },
  {
    name: "Security Settings",
    href: "/profile/security",
    icon: Lock,
    exact: false,
  },
];

export default function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-1">
      <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        Account Settings
      </div>

      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

