"use client";

import { useState, useEffect } from "react";
import QuestionnaireCard, { QuestionnaireCardData } from "@/components/questionnaire/QuestionnaireCard";
import { QuestionnaireSidebar } from "@/components/questionnaire/QuestionnaireSidebar";

const ITEMS_PER_PAGE = 6;

interface QuestionnairesListProps {
  questionnaires: QuestionnaireCardData[];
}

export default function QuestionnairesList({ questionnaires }: QuestionnairesListProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered =
    activeCategory === "all"
      ? questionnaires
      : questionnaires.filter((q) => q.category === activeCategory);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Build categories dynamically from data
  const categoryMap: Record<string, number> = {};
  questionnaires.forEach((q) => {
    if (q.category) {
      categoryMap[q.category] = (categoryMap[q.category] ?? 0) + 1;
    }
  });
  const categories = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-[1fr_300px] gap-10">
        {/* ── Left: Cards grid ── */}
        <div className="flex flex-col gap-8">
          {/* Category filter chips (mobile / desktop top) */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 lg:hidden">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeCategory === "all"
                    ? "border-sky-500 bg-sky-500 text-white"
                    : "border-border text-muted-foreground hover:border-sky-500/40 hover:text-foreground"
                }`}
              >
                Toate
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === cat.name
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-border text-muted-foreground hover:border-sky-500/40 hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Cards */}
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
                <svg className="size-7 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-base font-semibold text-foreground">
                Niciun chestionar în această categorie
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Încearcă să selectezi o altă categorie.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {paginated.map((q) => (
                <QuestionnaireCard key={q.id} q={q} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-sky-500/50 hover:text-sky-500 disabled:pointer-events-none disabled:opacity-30"
              >
                <svg className="size-4" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Anterioare
              </button>

              <span className="text-sm text-muted-foreground">
                Pagina{" "}
                <span className="font-semibold text-foreground">{currentPage}</span>{" "}
                din{" "}
                <span className="font-semibold text-foreground">{totalPages}</span>
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-sky-500/50 hover:text-sky-500 disabled:pointer-events-none disabled:opacity-30"
              >
                Următoare
                <svg className="size-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="hidden lg:block">
          <QuestionnaireSidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            totalCount={questionnaires.length}
          />
        </div>
      </div>
    </div>
  );
}
