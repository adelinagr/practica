"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ceva nu a mers bine.");
      }

      setStatus("success");
      setMessage(data.message || "Abonare reușită!");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "A apărut o eroare la conectare.");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-card border border-border px-6 py-16 sm:px-12 sm:py-24 md:px-16 lg:flex lg:items-center lg:justify-between">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-50" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-primary ring-1 ring-foreground/5 shadow-xl shadow-xl shadow-foreground/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="lg:w-1/2 lg:pr-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Fii la curent cu digitalizarea
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Abonează-te la newsletter-ul nostru pentru a primi studii de caz, sfaturi despre scalarea afacerii și oferte exclusive de parteneriat. Nu trimitem spam.
        </p>
      </div>

      <div className="mt-10 lg:mt-0 lg:w-1/2 lg:max-w-md lg:shrink-0">
        <form onSubmit={handleSubmit} className="relative mt-6 sm:flex sm:max-w-md">
          <label htmlFor="email-address" className="sr-only">
            Adresa de email
          </label>
          <input
            type="email"
            name="email"
            id="email-address"
            autoComplete="email"
            required
            disabled={status === "loading" || status === "success"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-w-0 appearance-none rounded-xl border-0 bg-primary/10 px-4 py-3.5 text-base text-foreground shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-inset focus:ring-white sm:w-auto sm:flex-auto"
            placeholder="Introduceți adresa de email"
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 sm:mt-0 sm:ml-4 sm:w-auto"
          >
            {status === "loading" ? (
              <div className="flex items-center">
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
                Se trimite...
              </div>
            ) : status === "success" ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Abonat
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Mă abonez
                <Send className="size-4" />
              </span>
            )}
          </Button>
        </form>
        
        {message && (
          <div className={`mt-4 flex items-center gap-2 text-sm ${status === "error" ? "text-red-300" : "text-green-300"}`}>
            {status === "error" ? <AlertCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
