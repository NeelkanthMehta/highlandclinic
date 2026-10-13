"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Sun,
  User as UserIcon,
  LogOut,
  Stethoscope,
  ChevronDown,
  Calendar,
  LayoutDashboard,
  Menu,
  X,
  Building2,
  Phone,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

interface HeaderProps {
  user?: SessionUser | null;
}

/**
 * Calculates user initials (e.g., "JD" for John Doe) if no custom profile picture URL is present.
 */
function getInitials(name?: string | null): string {
  if (!name || name === "NO_NAME") return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header({ user: propUser }: HeaderProps = {}) {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<SessionUser | null>(propUser ?? null);
  const [loadingSession, setLoadingSession] = useState(propUser === undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state when propUser is provided or updated by RootLayout
  useEffect(() => {
    if (propUser !== undefined) {
      setUser(propUser);
      setLoadingSession(false);
    }
  }, [propUser]);

  // Fallback fetch session user on mount if propUser is not passed (e.g. standalone tests)
  useEffect(() => {
    if (propUser !== undefined) return;
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
  }, [propUser]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      await fetch("/api/auth/sign-out", { method: "POST" });
      setUser(null);
      router.refresh();
      router.push("/");
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
    <header className="sticky top-0 z-50 w-full bg-[#f8f9fa] dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left Side: Logo & Brand Name */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded flex items-center justify-center text-white shrink-0 shadow-xs">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="font-bold text-slate-900 dark:text-zinc-50 text-sm sm:text-base tracking-tight truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
            Highland Medical Center
          </span>
        </Link>

        {/* Right Side: Theme Toggle, Nav Links, Auth User/Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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

          {/* Departments Link */}
          <Link
            href="/departments"
            className="hidden md:inline-block px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Departments
          </Link>

          {/* Book Appointment Button */}
          <Link
            href="/book-appointment"
            className="px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md transition-colors shadow-xs whitespace-nowrap"
          >
            Book Appointment
          </Link>

          {/* User Session Info / Auth Buttons */}
          {!loadingSession && user ? (
            <div className="relative flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-zinc-800" ref={dropdownRef}>
              {/* Patient Avatar & Profile Link */}
              <Link
                href="/profile"
                aria-label="User Profile"
                title="View User Profile"
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-blue-500"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
                    User Profile
                  </span>
                </div>
              </Link>

              {/* Dropdown Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded transition-colors hidden sm:inline-block"
                aria-expanded={dropdownOpen}
                aria-label="Toggle user dropdown menu"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Direct Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out"
                title="Sign out"
                className="p-1.5 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Account Avatar Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 space-y-1">
                  {/* Identity Header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </span>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 rounded-full uppercase w-fit">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Site Map Links */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      My Profile (/profile)
                    </Link>

                    <Link
                      href="/book-appointment"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Book Appointment
                    </Link>

                    <Link
                      href="/profile/appointments"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600" />
                      Dashboard / Appointments
                    </Link>
                  </div>

                  {/* Sign Out Button in Dropdown */}
                  <div className="pt-1 border-t border-slate-100 dark:border-zinc-800 px-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !loadingSession ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/sign-in"
                className="px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-md transition-colors shadow-xs"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
              >
                Sign up
              </Link>
            </div>
          ) : null}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-1.5 text-slate-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors md:hidden"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 pt-2 border-t border-slate-200 dark:border-zinc-800 space-y-2 pb-1 animate-in fade-in slide-in-from-top-1 duration-150">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/departments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Building2 className="w-4 h-4 text-blue-500" />
              Clinical Departments
            </Link>
            <Link
              href="/book-appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Calendar className="w-4 h-4 text-blue-500" />
              Schedule Visit
            </Link>

            {user ? (
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Patient Portal
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-blue-500" /> Profile Overview
                </Link>
                <Link
                  href="/profile/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-500" /> Appointments History
                </Link>
                <Link
                  href="/profile/medical"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Stethoscope className="w-4 h-4 text-blue-500" /> Medical & Insurance
                </Link>
              </div>
            ) : null}

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-500" /> (555) 123-4567
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                24/7 Care Center
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}