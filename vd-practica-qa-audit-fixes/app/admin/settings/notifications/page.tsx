import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Notifications - Admin" };

export default async function NotificationsSettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure how you receive alerts and system emails.
        </p>
      </div>
      <div className="h-px bg-slate-200" />
      
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-12 text-center shadow-lg">
        <h4 className="text-lg font-bold text-foreground mb-2">Notification Preferences</h4>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          Email and push notification settings will be available in the next platform update.
        </p>
        <button className="rounded-xl bg-accent/20 px-4 py-2 text-sm font-bold text-muted-foreground cursor-not-allowed">
          Coming Soon
        </button>
      </div>
    </div>
  );
}
