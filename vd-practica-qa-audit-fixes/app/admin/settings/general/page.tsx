import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { GeneralSettingsForm } from "@/components/admin/settings/general-settings-form";
import { prisma } from "@/lib/db";

export const metadata = { title: "General Settings - Admin" };

export default async function GeneralSettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  // Fetch full user from DB for settings
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      company: true,
      phone: true,
      timezone: true,
      language: true,
      jobTitle: true,
      role: true
    }
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">General</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="h-px bg-slate-200" />
      <GeneralSettingsForm user={user} />
    </div>
  );
}
