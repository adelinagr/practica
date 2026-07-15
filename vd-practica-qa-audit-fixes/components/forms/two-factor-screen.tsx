"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import { Checkbox } from "@/components/ui/checkbox";

interface TwoFactorScreenProps {
  email: string;
  tempToken: string;
  onVerify: (code: string, trustDevice: boolean) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  onResend: () => Promise<void>;
}

export function TwoFactorScreen({
  email,
  tempToken,
  onVerify,
  onBack,
  isLoading,
  onResend,
}: TwoFactorScreenProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [trustDevice, setTrustDevice] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [isResending, setIsResending] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // Move to previous if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;

    // Handle paste of multiple characters
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) newCode[index + i] = char;
      });
      setCode(newCode);
      
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single character
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedData) return;

    const newCode = [...code];
    pastedData.split("").forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);
    
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex === 6 ? 5 : nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      onVerify(fullCode, trustDevice);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    await onResend();
    setCountdown(60);
    setIsResending(false);
  };

  const isComplete = code.every(digit => digit !== "");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Autentificare în 2 Pași
        </h2>
        <p className="text-sm text-muted-foreground">
          Am trimis un cod din 6 cifre pe adresa<br/>
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div 
          className="flex justify-between gap-2"
          onPaste={handlePaste}
        >
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6} // allow pasting full code
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isLoading}
              className={cn(
                "h-12 w-10 sm:w-12 text-center text-lg font-semibold rounded-xl border bg-muted/30 text-foreground transition-all duration-200 outline-none",
                "focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:bg-background shadow-sm",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                digit ? "border-indigo-500/40 bg-indigo-50/30 dark:bg-indigo-500/10" : "border-border/70"
              )}
            />
          ))}
        </div>

        <div className="flex items-start space-x-3 bg-muted/30 p-3 rounded-xl border border-border/50">
          <Checkbox 
            id="trust-device" 
            checked={trustDevice}
            onCheckedChange={(c) => setTrustDevice(c as boolean)}
            disabled={isLoading}
            className="mt-0.5 border-muted-foreground/40 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
          />
          <div className="grid gap-1.5 leading-none cursor-pointer" onClick={() => !isLoading && setTrustDevice(!trustDevice)}>
            <label
              htmlFor="trust-device"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Ține minte acest dispozitiv
            </label>
            <p className="text-xs text-muted-foreground">
              Nu vom mai cere codul pe acest dispozitiv timp de 30 de zile.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isComplete}
          className={cn(
            "flex h-11 w-full items-center justify-center gap-2 rounded-xl",
            "bg-gradient-to-r from-indigo-600 to-blue-500 px-4 text-sm font-semibold text-white",
            "shadow-md shadow-indigo-500/25 transition-all duration-200",
            "hover:shadow-indigo-500/45 hover:scale-[1.01]",
            "active:scale-[0.98]",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {isLoading ? (
            <Icons.spinner className="size-4 animate-spin" />
          ) : (
            "Verifică & Continuă"
          )}
        </button>
      </form>

      <div className="flex flex-col items-center gap-4 text-sm mt-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || isResending || isLoading}
          className={cn(
            "text-muted-foreground transition-colors",
            countdown === 0 && !isResending && !isLoading ? "text-indigo-600 font-medium hover:text-indigo-700 dark:hover:text-indigo-400" : "opacity-70 cursor-not-allowed"
          )}
        >
          {isResending ? (
            "Se retrimite..."
          ) : countdown > 0 ? (
            `Nu ai primit codul? Retrimite (${countdown}s)`
          ) : (
            "Nu ai primit codul? Retrimite"
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground text-xs transition-colors flex items-center gap-1"
        >
          <Icons.chevronLeft className="size-3" />
          Înapoi la Autentificare
        </button>
      </div>
    </div>
  );
}
