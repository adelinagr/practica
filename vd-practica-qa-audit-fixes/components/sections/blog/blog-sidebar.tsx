"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export function BlogSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const activeCategory = searchParams.get("category");

  // Debounced Search
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set("search", searchTerm);
        params.delete("page"); // reset to page 1 on new search
      } else {
        params.delete("search");
      }
      router.push(`/blog?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, router, searchParams]);

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (activeCategory === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`, { scroll: true });
  };

  return (
    <aside className="sticky top-24 space-y-10">
      
      {/* Search Widget */}
      <div className="rounded-3xl border border-border/50 bg-card/40 p-6 shadow-sm backdrop-blur-md">
        <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Caută articole</h3>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Automatizare, AI, PNRR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border/50 bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Categories Widget */}
      {categories.length > 0 && (
        <div className="rounded-3xl border border-border/50 bg-card/40 p-6 shadow-sm backdrop-blur-md">
          <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Categorii</h3>
          <ul className="flex flex-col gap-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-colors",
                    activeCategory === cat.slug
                      ? "bg-blue-600 font-medium text-white"
                      : "bg-background font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{cat.name}</span>
                  <span
                    className={cn(
                      "inline-flex h-5 items-center justify-center rounded-full px-2 text-xs font-bold",
                      activeCategory === cat.slug
                        ? "bg-white/20 text-white"
                        : "bg-muted-foreground/10 text-muted-foreground"
                    )}
                  >
                    {cat.articleCount}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Newsletter Placeholder (Optional) */}
      <div className="rounded-3xl border border-border/50 bg-slate-900 p-6 shadow-sm text-center">
        <h3 className="mb-2 font-heading text-lg font-bold text-white">Abonează-te</h3>
        <p className="mb-4 text-xs text-slate-300 leading-relaxed">Primești săptămânal cele mai bune strategii de digitalizare.</p>
        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Adresa de email"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <button className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-500">
            Mă abonez
          </button>
        </div>
      </div>

    </aside>
  );
}
