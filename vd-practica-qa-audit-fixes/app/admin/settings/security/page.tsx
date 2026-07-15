import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SecuritySettingsForm } from "@/components/admin/settings/security-settings-form";

export const metadata = { title: "Security Settings - Admin" };

export default async function SecuritySettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      twoFactorEnabled: true,
      password: true, // We only need to check if it exists, but Prisma needs it selected to pass down. (Better: boolean flag)
    }
  });

  if (!user) redirect("/login");

  // Fetch security logs
  const logs = await prisma.securityLog.findMany({
    where: { userId: sessionUser.id },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  const hasPassword = !!user.password;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">Security & 2FA</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your password, 2-step verification, and view active sessions.
        </p>
      </div>
      <div className="h-px bg-slate-200" />
      <SecuritySettingsForm 
        hasPassword={hasPassword} 
        twoFactorEnabled={user.twoFactorEnabled} 
        logs={logs} 
      />
    </div>
  );
}
