"use client";

import Link from "next/link";
import { Plus, Sun } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f8f9fa] dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center text-white shrink-0 shadow-xs">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="font-bold text-slate-900 dark:text-zinc-50 text-base tracking-tight">
            Highland Medical Center
          </span>
        </Link>

        {/* Right Side: Theme Toggle, Nav Links, Buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
            className="p-1.5 text-slate-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Nav Link */}
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Home
          </Link>

          {/* Book Appointment Button */}
          <Link
            href="/book-appointment"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md transition-colors shadow-xs"
          >
            Book Appointment
          </Link>

          {/* Sign In Button */}
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-md transition-colors shadow-xs"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}