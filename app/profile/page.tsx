import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PersonalInfoForm from "./personal-info-form";

export const dynamic = "force-dynamic";

export default async function PersonalInfoPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Personal Information
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
          Manage your official legal identity and primary contact details for clinic consultations.
        </p>
      </div>

      <PersonalInfoForm user={user} />
    </div>
  );
}

