"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, Mail, ShieldCheck, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Te rugăm să introduci o adresă de email validă." }),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      // In a real app, this would hit the API
      // const res = await fetch("/api/auth/forgot-password", { ... })
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      toast.success("Link trimis!", {
        description: "Dacă adresa există, vei primi un email în scurt timp.",
      });
    } catch {
      toast.error("Eroare", {
        description: "Ceva nu a funcționat. Te rugăm să încerci din nou.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300",
        className,
      )}
      {...props}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isSuccess}
              className={cn(
                "h-10 w-full rounded-xl border bg-muted/40 pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground/45 outline-none transition-all duration-150",
                "focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/15",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors?.email
                  ? "border-rose-400/60"
                  : "border-border/70",
              )}
              {...register("email")}
            />
          </div>
          {errors?.email && (
            <p className="text-[11px] font-medium text-rose-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className={cn(
            "flex h-11 w-full items-center justify-center gap-2 rounded-xl mt-2 font-semibold text-sm text-white transition-all shadow-md shadow-blue-500/10",
            "bg-[#2563eb] hover:bg-[#1d4ed8] hover:scale-[1.01] active:scale-[0.98]",
            "disabled:pointer-events-none disabled:opacity-60",
          )}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isSuccess ? (
            <span>Link sent successfully</span>
          ) : (
            <>
              <span>Send reset link</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>

        {/* Separator */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border/60"></div>
          <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground">or</span>
          <div className="flex-grow border-t border-border/60"></div>
        </div>

        {/* Try another way */}
        <button
          type="button"
          onClick={() => toast.info("Contact administrator for alternative methods")}
          className={cn(
            "flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border/70 font-semibold text-sm text-foreground transition-all",
            "hover:bg-muted/50 hover:border-border active:scale-[0.98]",
          )}
        >
          <ShieldCheck className="size-4 text-indigo-500" />
          <span>Try another way</span>
        </button>
      </form>

      {/* Info Box */}
      <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 p-4">
        <Info className="size-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="flex flex-col text-xs text-muted-foreground">
          <span className="font-medium text-foreground mb-0.5">Didn&apos;t receive the email?</span>
          <span>Check your spam folder or try another email address.</span>
        </div>
      </div>
      
      {/* Footer link */}
      <div className="text-center text-xs text-muted-foreground mt-2">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
