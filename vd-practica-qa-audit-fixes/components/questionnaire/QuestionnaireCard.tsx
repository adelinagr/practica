"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface QuestionnaireCardData {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category?: string | null;
  estimatedMinutes?: number;
  questionCount?: number;
}

// ── Category theming ──────────────────────────────────────────────────────────

const CATEGORY_THEME: Record<
  string,
  { accent: string; badge: string; icon: string; glow: string }
> = {
  "Digital Readiness": {
    accent: "from-violet-500 to-indigo-500",
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    icon: "text-violet-500",
    glow: "group-hover:shadow-violet-500/15",
  },
  Marketing: {
    accent: "from-orange-500 to-rose-500",
    badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    icon: "text-orange-500",
    glow: "group-hover:shadow-orange-500/15",
  },
  "IT Infrastructure": {
    accent: "from-emerald-500 to-teal-500",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: "text-emerald-500",
    glow: "group-hover:shadow-emerald-500/15",
  },
  "HR & Operations": {
    accent: "from-sky-500 to-cyan-500",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    icon: "text-sky-500",
    glow: "group-hover:shadow-sky-500/15",
  },
  default: {
    accent: "from-slate-500 to-zinc-500",
    badge: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    icon: "text-slate-500",
    glow: "group-hover:shadow-slate-500/15",
  },
};

// ── Category icons (inline SVG) ───────────────────────────────────────────────

function CategoryIcon({ category }: { category?: string | null }) {
  if (category === "Marketing") {
    return (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    );
  }
  if (category === "IT Infrastructure") {
    return (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    );
  }
  if (category === "HR & Operations") {
    return (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  // Default / Digital Readiness
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuestionnaireCard({ q }: { q: QuestionnaireCardData }) {
  const theme = CATEGORY_THEME[q.category ?? ""] ?? CATEGORY_THEME.default;
  const minutes = q.estimatedMinutes ?? 5;
  const questions = q.questionCount ?? 0;

  return (
    <Link
      href={`/chestionare/${q.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border/60 bg-background overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl",
        theme.glow,
      )}
    >
      {/* Gradient top accent line */}
      <div className={cn("h-[3px] w-full bg-gradient-to-r", theme.accent)} />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between gap-3">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/50",
            theme.icon,
          )}>
            <CategoryIcon category={q.category} />
          </div>

          {q.category && (
            <span className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
              theme.badge,
            )}>
              {q.category}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex-1">
          <h3 className="text-base font-bold text-foreground leading-snug tracking-tight group-hover:text-sky-500 transition-colors duration-200">
            {q.title}
          </h3>
          {q.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {q.description}
            </p>
          )}
        </div>

        {/* Footer: meta + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {/* Clock */}
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
              {minutes} min
            </span>

            {/* Question count */}
            {questions > 0 && (
              <>
                <span className="size-1 rounded-full bg-muted-foreground/30" />
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {questions} întrebări
                </span>
              </>
            )}
          </div>

          <span className={cn(
            "inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r",
            theme.accent,
            "shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:gap-2",
          )}>
            Începe
            <svg width="12" height="12" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
