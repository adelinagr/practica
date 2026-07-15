"use client";

import { useState, useEffect } from "react";

const TIPS = [
  "Chestionarele îți oferă un raport personalizat în câteva minute.",
  "Răspunsurile tale sunt anonime și protejate GDPR.",
  "Completează un chestionar pe zi pentru un audit complet în o săptămână.",
  "Fiecare chestionar durează între 3 și 10 minute.",
];

interface QuestionnaireSidebarProps {
  categories: { name: string; count: number }[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  totalCount: number;
}

export function QuestionnaireSidebar({
  categories,
  activeCategory,
  onCategoryChange,
  totalCount,
}: QuestionnaireSidebarProps) {
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    setTipIdx(Math.floor(Math.random() * TIPS.length));
  }, []);

  return (
    <aside className="flex flex-col gap-8">
      {/* ── Categories ── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Categorii
        </p>
        <ul className="flex flex-col">
          <li>
            <button
              onClick={() => onCategoryChange("all")}
              className={`flex items-center justify-between w-full py-2.5 border-b border-border/50 text-sm transition-colors ${
                activeCategory === "all"
                  ? "text-sky-500 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Toate chestionarele</span>
              <span className="rounded-full bg-sky-500/10 text-sky-500 text-xs px-2 py-0.5 font-semibold">
                {totalCount}
              </span>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                onClick={() => onCategoryChange(cat.name)}
                className={`flex items-center justify-between w-full py-2.5 border-b border-border/50 text-sm transition-colors ${
                  activeCategory === cat.name
                    ? "text-sky-500 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{cat.name}</span>
                <span className="rounded-full bg-sky-500/10 text-sky-500 text-xs px-2 py-0.5 font-semibold">
                  {cat.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Privacy note ── */}
      <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="size-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest text-foreground">
            100% Confidențial
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Datele tale sunt protejate conform GDPR. Nu stocăm informații
          personale fără consimțământul tău explicit.
        </p>
      </div>

      {/* ── Tip of the day ── */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="size-4 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            Sfat
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {TIPS[tipIdx]}
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background to-muted/30 p-5">
        <h4 className="text-sm font-bold text-foreground mb-1">
          Ai nevoie de ajutor?
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          Programează o sesiune gratuită de consultanță cu un specialist.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500 hover:text-sky-400 transition-colors"
        >
          Contactează-ne
          <svg width="12" height="12" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
