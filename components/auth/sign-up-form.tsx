"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { signUp, ActionState } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function SignUpForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const res = await signUp(prevState, formData);
      if (res.success) {
        router.push("/");
        router.refresh();
      }
      return res;
    },
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {/* Global Form Notification Banner */}
      {state.message && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            state.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300"
          }`}
        >
          {state.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="name"
          className="block text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          Full Name
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={signUpDefaultValues.name}
            placeholder="e.g. Eleanor Vance"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {state.fieldErrors?.name && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-0.5">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={signUpDefaultValues.email}
            placeholder="e.g. eleanor@example.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {state.fieldErrors?.email && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-0.5">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="password"
            name="password"
            type="password"
            defaultValue={signUpDefaultValues.password}
            placeholder="At least 6 characters"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {state.fieldErrors?.password && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-0.5">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            defaultValue={signUpDefaultValues.confirmPassword}
            placeholder="Re-enter password"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {state.fieldErrors?.confirmPassword && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-0.5">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Registering Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}

