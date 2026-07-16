"use client";

import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  title?: string;
  message?: string;
}

export function AccessDenied({
  title = "Acces Refuzat",
  message = "Nu aveți permisiunea de a vizualiza sau edita acest chestionar. Contactați administratorul echipei dacă credeți că este o greșeală.",
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      {/* Container glassmorphism */}
      <div className="relative w-full max-w-md rounded-2xl border border-rose-100 bg-secondary/10 backdrop-blur-md/80 p-8 shadow-xl backdrop-blur-md dark:border-rose-950/20 dark:bg-slate-900/80">
        {/* Glow effect in background */}
        <div className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-rose-500/10 blur-xl" />

        {/* Icon wrapper */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 shadow-md shadow-rose-500/5 dark:border-rose-900/30 dark:bg-rose-950/20">
          <ShieldAlert className="size-7 text-rose-600 dark:text-rose-500" />
        </div>

        {/* Header */}
        <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground dark:text-slate-50">
          {title}
        </h2>
        
        {/* Message */}
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground dark:text-accent/80">
          {message}
        </p>

        {/* Action button */}
        <button
          onClick={() => router.push("/admin")}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-foreground shadow-lg hover:bg-slate-800 active:scale-98 transition-all dark:bg-accent/20 dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <ArrowLeft className="size-4" />
          <span>Înapoi la Dashboard</span>
        </button>
      </div>
    </div>
  );
}
