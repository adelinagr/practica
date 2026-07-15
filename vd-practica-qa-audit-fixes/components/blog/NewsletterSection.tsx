"use client";

import { useState } from "react";
import Link from "next/link";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  fullName: string;
  email: string;
  gdpr: boolean;
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
        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
          {subtitle}
        </div>
      </div>
    </li>
  );
}

export function NewsletterSection() {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    gdpr: false,
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const set =
    (field: keyof FormData) => (value: string | boolean) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit() {
    if (!form.gdpr || !form.email || !form.fullName) return;
    setStatus("loading");
    try {
      // TODO: connect to your newsletter API / server action
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-slate-900 dark:bg-slate-950 w-full">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* ── Left ── */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-3">
                Newsletter
              </p>
              <h2 className="text-2xl font-extrabold text-white lg:text-3xl leading-tight">
                Fii primul care află
              </h2>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Abonează-te la newsletter pentru cele mai recente insights despre
              transformare digitală, actualizări de platformă și studii de caz
              exclusive.
            </p>

            <ul className="flex flex-col gap-4">
              <TrustPoint
                icon={
                  <svg
                    className="size-4 text-sky-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM3 10h18M8 2v4M16 2v4"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="Insights săptămânale"
                subtitle="Articole curate livrate direct în inbox."
              />
              <TrustPoint
                icon={
                  <svg
                    className="size-4 text-sky-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="Actualizări platformă"
                subtitle="Fii primul care află despre noile funcționalități AI și capabilități."
              />
            </ul>
          </div>

          {/* ── Right — Form ── */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-7">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-sky-500/20">
                  <svg
                    className="size-7 text-sky-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="m4.5 12.75 6 6 9-13.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Abonare reușită!</h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  Mulțumim! Vei primi primul newsletter în curând.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm({ fullName: "", email: "", gdpr: false });
                  }}
                  className="mt-1 text-sm text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-2"
                >
                  Abonează alt email
                </button>
              </div>
            ) : (
              <>
                {/* Full Name */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Nume complet
                  </label>
                  <input
                    type="text"
                    placeholder="Ion Popescu"
                    value={form.fullName}
                    onChange={(e) => set("fullName")(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5 mb-5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Email de serviciu
                  </label>
                  <input
                    type="email"
                    placeholder="ion@compania.ro"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-all"
                  />
                </div>

                {/* GDPR */}
                <div className="flex items-start gap-2.5 mb-6">
                  <input
                    type="checkbox"
                    id="gdpr-newsletter"
                    checked={form.gdpr}
                    onChange={(e) => set("gdpr")(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 rounded border-slate-600 accent-sky-500 cursor-pointer"
                  />
                  <label
                    htmlFor="gdpr-newsletter"
                    className="text-xs text-slate-400 leading-relaxed cursor-pointer"
                  >
                    Sunt de acord cu{" "}
                    <Link
                      href="/privacy"
                      className="text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-2"
                    >
                      Politica de confidențialitate
                    </Link>{" "}
                    și accept să primesc comunicări de la vreaudigitalizare.eu.
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="button"
                  disabled={
                    !form.gdpr ||
                    !form.email ||
                    !form.fullName ||
                    status === "loading"
                  }
                  onClick={handleSubmit}
                  className="w-full rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="size-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Se procesează...
                    </>
                  ) : (
                    "Abonează-te la Newsletter"
                  )}
                </button>

                {status === "error" && (
                  <p className="mt-3 text-center text-xs text-red-400">
                    A apărut o eroare. Încearcă din nou sau scrie-ne la
                    contact@vreaudigitalizare.eu
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
