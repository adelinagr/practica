"use client";

import { useState } from "react";

interface Category {
  name: string;
  count: number;
}

interface BlogSidebarProps {
  categories: Category[];
  popularTags: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function BlogSidebar({
  categories,
  popularTags,
  activeCategory,
  onCategoryChange,
}: BlogSidebarProps) {
  const [search, setSearch] = useState("");

  return (
    <aside className="flex flex-col gap-8">
      {/* ── Search ── */}
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
          Caută articole
        </p>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Caută după cuvânt cheie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border bg-background pl-9 pr-3 py-2.5 text-sm w-full focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-all"
          />
        </div>
      </div>

      {/* ── Categories ── */}
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
          Categorii
        </p>
        <ul className="flex flex-col">
          {/* "All" option */}
          <li>
            <button
              onClick={() => onCategoryChange?.("all")}
              className={`flex items-center justify-between w-full py-2.5 border-b border-border/50 text-sm transition-colors ${
                !activeCategory || activeCategory === "all"
                  ? "text-sky-500 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Toate articolele</span>
              <span className="rounded-full bg-sky-500/10 text-sky-500 text-xs px-2 py-0.5 font-semibold">
                {categories.reduce((sum, c) => sum + c.count, 0)}
              </span>
            </button>
          </li>

          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                onClick={() => onCategoryChange?.(cat.name)}
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

      {/* ── Popular Tags ── */}
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
          Tag-uri populare
        </p>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground hover:border-sky-500/50 hover:text-sky-500 hover:bg-sky-500/5 transition-all cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
