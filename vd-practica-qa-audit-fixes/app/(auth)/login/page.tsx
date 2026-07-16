import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";
import { Logo } from "@/components/shared/logo";
import { BarChart3, Users, Settings, ShieldCheck, ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Portal | VreauDigitalizare",
  description: "Secure admin access for the VreauDigitalizare platform.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-background">
      
      {/* Left Side: Brand Preview & Info Panel (Only visible on lg screens and above) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-transparent text-card-foreground relative overflow-hidden border-r border-border/5">
        {/* Glow Spheres */}
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-accent/10 blur-[130px] rounded-full pointer-events-none" />
        
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #F2AEBC 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <Logo className="h-10 md:h-12 brightness-0 invert opacity-90" />
          <div className="border-l border-border/20 pl-3">
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block">Admin Portal</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="my-auto max-w-md relative z-10 space-y-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-foreground leading-tight">
              Welcome back!
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your admin dashboard
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
                icon: Settings,
                title: "System Settings",
                desc: "Configure your application preferences"
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-foreground/5 bg-foreground/[0.02] backdrop-blur-md transition-all hover:bg-foreground/[0.04]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-card-foreground">{item.title}</h4>
                  <p className="text-xs text-card-foreground/60 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="relative z-10 p-5 rounded-2xl border border-border/15 bg-card/5 backdrop-blur-md max-w-md">
          <p className="text-xs italic text-muted-foreground leading-relaxed">
            &quot;The best admin experience I&apos;ve used.&quot;
          </p>
          <span className="block text-[10px] font-bold text-primary uppercase tracking-wider mt-3">
            — Admin User
          </span>
        </div>
      </div>

      {/* Right Side: Login Form panel */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-12 w-full bg-transparent relative">
        {/* Ambient background glows for mobile screen depth */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none lg:hidden" />
        
        {/* Back home link */}
        <Link
          href="/"
          className="absolute right-6 top-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground md:right-10 md:top-8"
        >
          <ChevronLeft className="size-4" />
          Back to home
        </Link>

        <div className="w-full max-w-[400px] space-y-8 relative z-10">
          
          {/* Logo preview for mobile views */}
          <div className="flex items-center gap-3 lg:hidden mb-2">
            <Logo className="h-8" />
            <div className="border-l border-border/60 pl-2.5">
              <span className="text-[9px] font-bold tracking-[0.15em] text-primary uppercase block">Admin</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Sign in to your account
            </h1>
            <p className="text-xs text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form wrapper */}
          <div className="relative rounded-2xl border border-border/60 bg-transparent shadow-xl shadow-black/5 dark:border-foreground/5 p-6">
            {/* Gradient accent line */}
            <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <Suspense>
              <UserAuthForm />
            </Suspense>
          </div>

          {/* Security badge footer */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/80">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>Secure access protected by enterprise-grade security</span>
          </div>

        </div>
      </div>

    </div>
  );
}
