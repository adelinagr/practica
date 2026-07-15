"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
  gdpr: boolean;
}

type FormStatus = "idle" | "loading" | "success" | "error";

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-all"
      />
    </div>
  );
}

function TrustPoint({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 mt-0.5">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{subtitle}</div>
      </div>
    </li>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CtaContactSection() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
    gdpr: false,
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const set = (field: keyof FormData) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit() {
    if (!form.gdpr) return;
    setStatus("loading");

    try {
      // Replace with your actual server action or API call
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-950 px-8 py-16 lg:px-16 lg:py-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_80%_at_25%_55%,rgba(14,165,233,0.13)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-sky-500/5 blur-3xl -z-10" />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* ── LEFT — text + trust points ── */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-4">
              Începe transformarea
            </p>
            <h2 className="text-3xl font-extrabold text-white lg:text-4xl leading-tight">
              Gata să digitalizezi?
            </h2>
          </div>

          <p className="text-slate-300 leading-relaxed text-sm lg:text-base">
            Solicită o consultație pentru a discuta nevoile tale specifice. Experții noștri te vor ghida prin capabilitățile platformei și soluțiile adaptate pentru tine.
          </p>

          <ul className="flex flex-col gap-5 mt-2">
            <TrustPoint
              icon={
                <svg className="size-4 text-sky-400" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              title="Securitate Enterprise"
              subtitle="Auth, 2FA și conformitate GDPR completă — incluse din start."
            />
            <TrustPoint
              icon={
                <svg className="size-4 text-sky-400" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              title="Implementare Rapidă"
              subtitle="Chestionarele tale live în minute, nu săptămâni."
            />
            <TrustPoint
              icon={
                <svg className="size-4 text-sky-400" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              title="Fără costuri ascunse"
              subtitle="Evaluarea inițială este gratuită. Plătești doar ce ai nevoie."
            />
          </ul>
        </div>

        {/* ── RIGHT — form card ── */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-7 lg:p-8">

          {status === "success" ? (
            // Success state
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-sky-500/20">
                <svg className="size-8 text-sky-400" viewBox="0 0 24 24" fill="none">
                  <path d="m4.5 12.75 6 6 9-13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Mesaj trimis!</h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Mulțumim! Te vom contacta în maxim 24 de ore la adresa de email furnizată.
              </p>
              <button
                onClick={() => { setStatus("idle"); setForm({ firstName: "", lastName: "", email: "", company: "", message: "", gdpr: false }); }}
                className="mt-2 text-sm text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-2"
              >
                Trimite alt mesaj
              </button>
            </div>
          ) : (
            <>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField
                  label="Prenume"
                  placeholder="Ion"
                  value={form.firstName}
                  onChange={set("firstName")}
                  required
                />
                <InputField
                  label="Nume"
                  placeholder="Popescu"
                  value={form.lastName}
                  onChange={set("lastName")}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <InputField
                  label="Email de serviciu"
                  type="email"
                  placeholder="ion@compania.ro"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>

              {/* Company */}
              <div className="mb-4">
                <InputField
                  label="Companie"
                  placeholder="Acme SRL"
                  value={form.company}
                  onChange={set("company")}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Cum te putem ajuta?
                </label>
                <textarea
                  rows={3}
                  placeholder="Spune-ne despre obiectivele tale de digitalizare..."
                  value={form.message}
                  onChange={(e) => set("message")(e.target.value)}
                  className="rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-all resize-none"
                />
              </div>

              {/* GDPR */}
              <div className="flex items-start gap-2.5 mb-6">
                <input
                  type="checkbox"
                  id="gdpr-cta"
                  checked={form.gdpr}
                  onChange={(e) => set("gdpr")(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 rounded border-slate-600 accent-sky-500 cursor-pointer"
                />
                <label htmlFor="gdpr-cta" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                  Sunt de acord cu{" "}
                  <Link href="/privacy" className="text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-2">
                    Politica de confidențialitate
                  </Link>{" "}
                  și îmi dau acordul ca vreaudigitalizare.eu să stocheze datele mele pentru a răspunde solicitării.
                </label>
              </div>

              {/* Submit */}
              <button
                type="button"
                disabled={!form.gdpr || status === "loading"}
                onClick={handleSubmit}
                className="w-full rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Se trimite...
                  </>
                ) : (
                  "Solicită consultație"
                )}
              </button>

              {status === "error" && (
                <p className="mt-3 text-center text-xs text-red-400">
                  A apărut o eroare. Încearcă din nou sau scrie-ne la contact@vreaudigitalizare.eu
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
