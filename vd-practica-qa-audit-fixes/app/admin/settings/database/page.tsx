import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DatabasePanel } from "@/components/admin/settings/database-panel";

export const metadata = { title: "Database & Infrastructure - Admin" };

export default async function DatabaseSettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">Infrastructure & Database</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your PostgreSQL health, view real-time metrics, and manage backups.
        </p>
      </div>
      <div className="h-px bg-slate-200" />
      <DatabasePanel />
    </div>
  );
}
