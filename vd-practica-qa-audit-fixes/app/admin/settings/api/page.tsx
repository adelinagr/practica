import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Key } from "lucide-react";

export const metadata = { title: "API Settings - Admin" };

export default async function ApiSettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">API Access</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your API keys, webhooks, and external integrations.
        </p>
      </div>
      <div className="h-px bg-slate-200" />
      
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-12 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent/20 text-muted-foreground">
            <Key className="size-6" />
          </div>
        </div>
        <h4 className="text-lg font-bold text-foreground mb-2">Developer API</h4>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          API key generation and webhooks management is currently in closed beta.
        </p>
        <button className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-70">
          Request Early Access
        </button>
      </div>
    </div>
  );
}
