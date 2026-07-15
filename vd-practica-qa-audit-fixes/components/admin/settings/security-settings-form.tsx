"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldAlert, MonitorSmartphone, KeyRound } from "lucide-react";
import { toggleTwoFactor, updatePassword } from "@/app/admin/settings/security-actions";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

type SecurityLog = {
  id: string;
  event: string;
  ipAddress: string | null;
  userAgent: string | null;
  status: string;
  createdAt: Date;
};

interface SecurityProps {
  hasPassword: boolean;
  twoFactorEnabled: boolean;
  logs: SecurityLog[];
}

export function SecuritySettingsForm({ hasPassword, twoFactorEnabled, logs }: SecurityProps) {
  const [loading2FA, setLoading2FA] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleToggle2FA = async () => {
    setLoading2FA(true);
    const result = await toggleTwoFactor();
    setLoading2FA(false);

    if (result.success) {
      toast.success(result.enabled ? "2FA has been enabled." : "2FA has been disabled.");
      if (result.enabled) {
        toast.info("A modal to scan QR code would appear here in a real Auth0/Clerk setup.");
      }
    } else {
      toast.error(result.error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPass(true);
    
    const formData = new FormData(e.currentTarget);
    const newPass = formData.get("newPassword") as string;
    const confirmPass = formData.get("confirmPassword") as string;

    if (newPass !== confirmPass) {
      toast.error("Passwords do not match.");
      setLoadingPass(false);
      return;
    }

    const result = await updatePassword(formData);
    setLoadingPass(false);

    if (result.success) {
      toast.success("Password updated successfully.");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      
      {/* 2FA Section */}
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-6 shadow-lg flex flex-col sm:flex-row gap-6 items-start justify-between">
        <div className="flex gap-4">
          <div className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-full ${twoFactorEnabled ? "bg-green-100 text-green-600" : "bg-accent/20 text-accent/80"}`}>
            {twoFactorEnabled ? <ShieldCheck className="size-5" /> : <ShieldAlert className="size-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Two-Factor Authentication (2FA)</h4>
            <p className="mt-1 text-sm text-muted-foreground max-w-md leading-relaxed">
              Add an extra layer of security to your account. When enabled, you will be required to enter a code from your authenticator app when logging in.
            </p>
          </div>
        </div>
        <button 
          onClick={handleToggle2FA}
          disabled={loading2FA}
          className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            twoFactorEnabled 
              ? "bg-accent/20 text-foreground hover:bg-slate-200 focus:ring-secondary/30" 
              : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900"
          }`}
        >
          {loading2FA ? <Loader2 className="size-4 animate-spin" /> : twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
        </button>
      </div>

      {/* Password Section */}
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <KeyRound className="size-4" />
          </div>
          <h4 className="text-sm font-bold text-foreground">Change Password</h4>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          {hasPassword && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Current Password</label>
              <input required type="password" name="currentPassword" placeholder="••••••••" className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">New Password</label>
            <input required minLength={8} type="password" name="newPassword" placeholder="••••••••" className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <p className="text-[11px] text-muted-foreground">Must be at least 8 characters long.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Confirm New Password</label>
            <input required type="password" name="confirmPassword" placeholder="••••••••" className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <button 
            disabled={loadingPass}
            type="submit" 
            className="mt-2 flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-70"
          >
            {loadingPass && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </button>
        </form>
      </div>

      {/* Security Logs Section */}
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md shadow-lg overflow-hidden">
        <div className="p-6 border-b border-secondary/30 flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
            <MonitorSmartphone className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Recent Activity</h4>
            <p className="text-[13px] text-muted-foreground mt-0.5">Your most recent security events and active sessions.</p>
          </div>
        </div>
        
        {logs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No recent activity found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-accent/20/50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">{log.event.replace(/_/g, " ")}</span>
                  <span className="text-xs text-muted-foreground mt-1">{log.userAgent || "Unknown Device"} • {log.ipAddress}</span>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${log.status === "SUCCESS" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {log.status}
                  </span>
                  <span className="text-accent/80 min-w-[120px] text-right">
                    {format(new Date(log.createdAt), "d MMM yyyy, HH:mm", { locale: ro })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
