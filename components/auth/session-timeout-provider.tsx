"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, ShieldAlert, LogOut } from "lucide-react";

interface SessionTimeoutContextType {
  lastActivity: number;
  resetTimer: () => void;
  isWarningOpen: boolean;
  secondsRemaining: number;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextType>({
  lastActivity: Date.now(),
  resetTimer: () => {},
  isWarningOpen: false,
  secondsRemaining: 0,
});

export const useSessionTimeout = () => useContext(SessionTimeoutContext);

// Configurable timing constants
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity
export const WARNING_BEFORE_TIMEOUT_MS = 2 * 60 * 1000; // Warning shown 2 minutes prior
export const ACTIVITY_THROTTLE_MS = 3000; // Throttle event listeners to 3s
export const STORAGE_ACTIVITY_KEY = "highland_last_activity_timestamp";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SessionTimeoutProviderProps {
  children: React.ReactNode;
  user?: SessionUser | null;
}

export function SessionTimeoutProvider({ children, user }: SessionTimeoutProviderProps) {
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isTimedOutModalOpen, setIsTimedOutModalOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120);

  const lastRecordedRef = useRef<number>(Date.now());
  const isLoggingOutRef = useRef<boolean>(false);

  // Updates activity timestamp both in memory and across browser tabs
  const recordActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastRecordedRef.current < ACTIVITY_THROTTLE_MS) return;

    lastRecordedRef.current = now;
    setLastActivity(now);
    try {
      localStorage.setItem(STORAGE_ACTIVITY_KEY, String(now));
    } catch {
      // localStorage may not be available in private browsing or iframe
    }

    if (isWarningOpen) {
      setIsWarningOpen(false);
    }
  }, [isWarningOpen]);

  // Explicitly reset inactivity timer (e.g., clicking "Stay Signed In")
  const resetTimer = useCallback(() => {
    const now = Date.now();
    lastRecordedRef.current = now;
    setLastActivity(now);
    setIsWarningOpen(false);
    try {
      localStorage.setItem(STORAGE_ACTIVITY_KEY, String(now));
    } catch {
      // ignore
    }
  }, []);

  // Perform sign-out when 30 minutes of inactivity is reached
  const handleTimeoutSignOut = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    setIsWarningOpen(false);
    setIsTimedOutModalOpen(true);

    try {
      localStorage.removeItem(STORAGE_ACTIVITY_KEY);
      await fetch("/api/auth/sign-out", { method: "POST" });
    } catch (err) {
      console.error("Failed to sign out on session timeout:", err);
    }
  }, []);

  // Inactivity monitoring effect
  useEffect(() => {
    // If not signed in (natural signed-out state), do not track inactivity
    if (!user) {
      setIsWarningOpen(false);
      setIsTimedOutModalOpen(false);
      return;
    }

    // Initialize timestamp on login
    const initialTime = Date.now();
    lastRecordedRef.current = initialTime;
    setLastActivity(initialTime);
    try {
      localStorage.setItem(STORAGE_ACTIVITY_KEY, String(initialTime));
    } catch {
      // ignore
    }

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "wheel",
    ];

    const handleUserActivity = () => {
      recordActivity();
    };

    // Cross-tab synchronization listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_ACTIVITY_KEY && e.newValue) {
        const remoteTime = Number(e.newValue);
        if (!isNaN(remoteTime)) {
          lastRecordedRef.current = remoteTime;
          setLastActivity(remoteTime);
          setIsWarningOpen(false);
        }
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });
    window.addEventListener("storage", handleStorageChange);

    // Periodic inactivity check interval
    const intervalId = setInterval(() => {
      let currentLastActivity = lastRecordedRef.current;
      try {
        const stored = localStorage.getItem(STORAGE_ACTIVITY_KEY);
        if (stored) {
          const parsed = Number(stored);
          if (!isNaN(parsed) && parsed > currentLastActivity) {
            currentLastActivity = parsed;
            lastRecordedRef.current = parsed;
            setLastActivity(parsed);
          }
        }
      } catch {
        // ignore
      }

      const elapsed = Date.now() - currentLastActivity;

      // Check if session has exceeded 30 minutes of inactivity
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        handleTimeoutSignOut();
      } else if (elapsed >= INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_TIMEOUT_MS) {
        // Within 2-minute warning window
        const remainingMs = INACTIVITY_TIMEOUT_MS - elapsed;
        const remainingSec = Math.max(Math.ceil(remainingMs / 1000), 0);
        setSecondsRemaining(remainingSec);
        setIsWarningOpen(true);
      } else {
        setIsWarningOpen(false);
      }
    }, 1000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [user, recordActivity, handleTimeoutSignOut]);

  const handleDismissTimeout = () => {
    setIsTimedOutModalOpen(false);
    isLoggingOutRef.current = false;
    router.refresh();
    router.push("/sign-in?reason=session_timeout");
  };

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <SessionTimeoutContext.Provider
      value={{
        lastActivity,
        resetTimer,
        isWarningOpen,
        secondsRemaining,
      }}
    >
      {children}

      {/* Inactivity Warning Dialog (Shown at 28 mins) */}
      <Dialog open={isWarningOpen} onOpenChange={(open) => !open && resetTimer()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
              Session Inactivity Warning
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-600 dark:text-slate-300">
              You have been inactive for nearly 30 minutes. To protect your patient information
              and security, your session will automatically end in:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-center">
            <span className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tracking-wider">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleTimeoutSignOut}
              className="text-slate-700 dark:text-slate-200"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out Now
            </Button>
            <Button
              type="button"
              onClick={resetTimer}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Stay Signed In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Expired Notice Dialog (Shown at 30 mins) */}
      <Dialog open={isTimedOutModalOpen} onOpenChange={handleDismissTimeout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              Session Expired
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-600 dark:text-slate-300">
              Your session was timed out after 30 minutes of inactivity for your security.
              Please sign in again to access your clinic portal.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              onClick={handleDismissTimeout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Return to Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SessionTimeoutContext.Provider>
  );
}

export default SessionTimeoutProvider;

