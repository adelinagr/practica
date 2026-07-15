import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Icons } from "@/components/shared/icons";
import { Logo } from "@/components/shared/logo";
import { BarChart3, Users, Settings, ShieldCheck, ChevronLeft, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password | Admin Portal",
  description: "Reset your admin portal password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-background">
      
      {/* Left Side: Brand Preview & Info Panel (Only visible on lg screens and above) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-transparent text-[#F2DCDB] relative overflow-hidden border-r border-[#F2DCDB]/5">
        {/* Glow Spheres */}
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-accent/10 blur-[130px] rounded-full pointer-events-none" />
        
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <Logo className="h-10 md:h-12 brightness-0 invert opacity-90" />
          <div className="border-l border-[#F2DCDB]/20 pl-3">
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block">Admin Portal</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="my-auto max-w-md relative z-10 space-y-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-white leading-tight">
              Welcome back!
            </h2>
            <p className="text-sm text-slate-400">
              Access your dashboard and manage your entire system.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: BarChart3,
                title: "Analytics Overview",
                desc: "Real-time insights and performance metrics"
              },
              {
                icon: Users,
                title: "User Management",
                desc: "Manage users, roles and permissions"
              },
              {
                icon: ShieldCheck,
                title: "Enterprise Security",
                desc: "Advanced security and role-based access"
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md transition-all hover:bg-white/[0.04]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#F2DCDB]">{item.title}</h4>
                  <p className="text-xs text-[#F2DCDB]/60 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="relative z-10 p-5 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md max-w-md">
          <p className="text-xs italic text-slate-300 leading-relaxed">
            &quot;The best admin experience I&apos;ve used.&quot;
          </p>
          <span className="block text-[10px] font-bold text-primary uppercase tracking-wider mt-3">
            — Admin User
          </span>
        </div>
      </div>

      {/* Right Side: Forgot Password Form panel */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-12 w-full bg-transparent relative">
        {/* Ambient background glows for mobile screen depth */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none lg:hidden" />
        
        {/* Back link */}
        <Link
          href="/login"
          className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground md:left-10 md:top-8"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>

        <div className="w-full max-w-[400px] space-y-8 relative z-10 mt-8 lg:mt-0">
          
          {/* Logo preview for mobile views */}
          <div className="flex items-center gap-3 lg:hidden mb-2">
            <Logo className="h-8" />
            <div className="border-l border-border/60 pl-2.5">
              <span className="text-[9px] font-bold tracking-[0.15em] text-primary uppercase block">Admin</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-3 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Forgot your password?
            </h1>
            <p className="text-sm text-muted-foreground">
              No worries! Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {/* Form wrapper */}
          <div className="relative">
            <Suspense>
              <ForgotPasswordForm />
            </Suspense>
          </div>

        </div>
      </div>

    </div>
  );
}
