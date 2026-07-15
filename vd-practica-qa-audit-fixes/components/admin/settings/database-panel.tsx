"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Database, Activity, HardDrive, RefreshCw, Server, AlertCircle } from "lucide-react";
import { getDatabaseStats, triggerBackup } from "@/app/admin/settings/database-actions";

export function DatabasePanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    const res = await getDatabaseStats();
    if (res.success) {
      setData(res);
    } else {
      toast.error(res.error);
      setData(res); // sets the error state data
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // Live refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleBackup = async () => {
    setBackupLoading(true);
    toast.info("Initializing database backup...");
    const res = await triggerBackup();
    if (res.success) {
      toast.success(res.message);
    }
    setBackupLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md">
        <Loader2 className="size-8 animate-spin text-accent/60" />
      </div>
    );
  }

  const { stats, health } = data;
  const isOperational = health?.status === "OPERATIONAL";

  return (
    <div className="space-y-6">
      
      {/* Status Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative flex size-12 items-center justify-center rounded-full bg-accent/20">
            <Database className="size-6 text-foreground" />
            {isOperational ? (
              <span className="absolute right-0 top-0 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
              </span>
            ) : (
              <span className="absolute right-0 top-0 flex size-3">
                <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">PostgreSQL (Prisma)</h4>
            <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mt-0.5">
              <span className={isOperational ? "text-green-600" : "text-red-600"}>{health.status}</span>
              <span>•</span>
              <span>eu-central-1</span>
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md px-4 py-2 text-xs font-bold text-foreground transition-colors hover:bg-accent/20 disabled:opacity-50"
        >
          <RefreshCw className={`size-3 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-5 shadow-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Activity className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Latency</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-foreground">{health.latency}</span>
            <span className="text-sm font-semibold text-muted-foreground mb-1">ms</span>
          </div>
        </div>
        
        <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-5 shadow-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Server className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Active Conns</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-foreground">{health.activeConnections}</span>
            <span className="text-sm font-semibold text-muted-foreground mb-1">/ 100</span>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-5 shadow-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <AlertCircle className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Uptime</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-foreground">{health.uptime}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-5 shadow-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <HardDrive className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Last Sync</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-foreground line-clamp-1">{new Date(health.lastSync).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Table Stats */}
      {stats && (
        <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-6 shadow-lg">
          <h4 className="text-sm font-bold text-foreground mb-6">Database Records</h4>
          <div className="grid sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Users</p>
              <p className="text-2xl font-bold text-foreground">{stats.users}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Leads</p>
              <p className="text-2xl font-bold text-foreground">{stats.leads}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Articles</p>
              <p className="text-2xl font-bold text-foreground">{stats.articles}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Questionnaires</p>
              <p className="text-2xl font-bold text-foreground">{stats.questionnaires}</p>
            </div>
          </div>
        </div>
      )}

      {/* Backup Actions */}
      <div className="rounded-2xl border border-secondary/30 bg-accent/20 p-6">
        <h4 className="text-sm font-bold text-foreground mb-2">Manual Backup</h4>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          Generate an immediate snapshot of your database. The backup will be compressed and safely stored in the S3 archive bucket.
        </p>
        <button 
          onClick={handleBackup}
          disabled={backupLoading || !isOperational}
          className="flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-70"
        >
          {backupLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <HardDrive className="mr-2 size-4" />}
          Generate Backup Now
        </button>
      </div>

    </div>
  );
}
