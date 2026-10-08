"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Sun, User as UserIcon, LogOut, Stethoscope } from "lucide-react";
import { useState, useEffect } from "react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  image?: string | null;
  doctorProfile?: {
    specialty?: string;
  } | null;
}

export default function Header() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Fetch session user on mount
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        }
      } catch (err) {
        console.error("Failed to check auth session:", err);
      } finally {
        setLoadingSession(false);
      }
    }
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

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
    <header className="sticky top-0 z-50 w-full bg-[#f8f9fa] dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 py-3">
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

        {/* Right Side: Theme Toggle, Nav Links, Auth User/Buttons */}
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

          {/* Home Nav Link */}
          <Link
            href="/"
            className="hidden sm:inline-block px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Home
          </Link>

          {/* Book Appointment Button */}
          <Link
            href="/book-appointment"
            className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md transition-colors shadow-xs"
          >
            Book Appointment
          </Link>

          {/* User Session Info / Auth Buttons */}
          {!loadingSession && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                  {user.role === "DOCTOR" ? <Stethoscope className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                title="Sign out"
                className="p-1.5 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : !loadingSession ? (
            <Link
              href="/sign-in"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-md transition-colors shadow-xs"
            >
              Sign in
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}