import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Create an Account | VreauDigitalizare",
  description: "Create your administrator account to get started.",
};

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Back to login link */}
      <Link
        href="/login"
        className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:left-10 md:top-8"
      >
        <Icons.chevronLeft className="size-4" />
        Back to login
      </Link>

      {/* Registration card */}
      <div className="w-full max-w-[420px] px-4">
        {/* Logo + brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
            <Icons.logo className="size-7 text-primary-foreground" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80 mb-1.5">
            {siteConfig.name}
          </p>
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">
            Create Account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-[300px]">
            Set up your credentials to manage your digital workspaces and workflows.
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-border/60 bg-transparent shadow-xl shadow-black/5 backdrop-blur-sm dark:border-white/8 dark:shadow-black/30">
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="p-7">
            <Suspense>
              <UserAuthForm type="register" />
            </Suspense>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
        </p>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6">
          {[
            { icon: "🔒", label: "SOC 2 Type II" },
            { icon: "🛡️", label: "GDPR Compliant" },
            { icon: "✅", label: "99.9% Uptime" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-base">{badge.icon}</span>
              <span className="text-[10px] font-medium text-muted-foreground/60 tracking-wide">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
