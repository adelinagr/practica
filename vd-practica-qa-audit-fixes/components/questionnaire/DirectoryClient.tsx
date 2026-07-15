"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ShieldCheck, ArrowRight, LayoutGrid, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Questionnaire {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  isPinned?: boolean;
  estimatedMinutes: number | null;
}

export default function DirectoryClient({ questionnaires }: { questionnaires: Questionnaire[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All Categories");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    questionnaires.forEach(q => {
      if (q.category) cats.add(q.category);
    });
    return ["All Categories", ...Array.from(cats)];
  }, [questionnaires]);

  // Filter & Sort questionnaires
  const filteredQs = useMemo(() => {
    let result = questionnaires.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === "All Categories" || q.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by isPinned
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0; // fallback to original order
    });

    return result;
  }, [questionnaires, searchQuery, activeCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-urban text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
          Director <span className="text-primary">Chestionare</span> Publice
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Explorează colecția noastră de chestionare dinamice concepute pentru a evalua nivelul tău de digitalizare, a aduna feedback și a optimiza procesele.
        </p>
        
        <div className="relative max-w-2xl mx-auto shadow-sm rounded-full bg-[#5A86CB]/10 backdrop-blur-md ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary transition-all flex items-center px-4 py-2">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <Input 
            type="text"
            placeholder="Caută chestionare după cuvinte cheie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground shadow-none flex-1 h-12"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Main Grid Section (Left - 75%) */}
        <div className="flex-1 w-full">
          {/* Categories Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-white/10 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-[#5A86CB]/10 text-muted-foreground hover:bg-[#5A86CB]/20 ring-1 ring-white/10 backdrop-blur-md"
                }`}
              >
                {cat === "All Categories" ? "Toate Categoriile" : cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredQs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredQs.map((q) => {
                const isDigital = q.slug.includes("evaluare-maturitate") && !q.slug.includes("hr");
                const isHR = q.slug.includes("hr");
                const Icon = isDigital ? LayoutGrid : (isHR ? FileText : FileText);
                
                // Static class maps to fix Tailwind Purge
                let bgIconClass = "bg-primary/10 text-primary ring-primary/20";
                let btnClass = "bg-primary hover:bg-primary/90 shadow-primary/20";
                
                if (isDigital) {
                  bgIconClass = "bg-primary/10 text-primary ring-primary/20";
                  btnClass = "bg-primary hover:bg-primary/90 shadow-primary/20";
                } else if (isHR) {
                  bgIconClass = "bg-accent/10 text-accent ring-accent/20";
                  btnClass = "bg-accent hover:bg-accent/90 shadow-accent/20";
                }

                return (
                  <div key={q.id} className="group relative bg-[#5A86CB]/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-sm hover:shadow-xl hover:bg-[#5A86CB]/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-2xl ring-1 ${bgIconClass}`}>
                        <Icon className="size-6" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {q.isPinned && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full ring-1 ring-amber-500/20">
                            <svg className="size-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                            FIXAT
                          </span>
                        )}
                        {q.category && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {q.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                      {q.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-8 line-clamp-3 flex-1">
                      {q.description || "Evaluează procesele din compania ta și descoperă oportunități de optimizare automată."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                      <div className="text-xs font-medium text-muted-foreground flex items-center">
                        <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {q.estimatedMinutes ? `${q.estimatedMinutes} min est.` : "10 min est."}
                      </div>
                      
                      <Link href={
                        q.slug === "evaluare-maturitate-hr" ? "/chestionare/hr" : 
                        q.slug === "evaluare-planificare-hr" ? "/chestionare/workforce" : 
                        q.slug === "evaluare-recrutare-hr" ? "/chestionare/recrutare" : 
                        q.slug === "evaluare-performanta-hr" ? "/chestionare/performanta" : 
                        q.slug === "evaluare-dezvoltare-hr" ? "/chestionare/dezvoltare" : 
                        q.slug === "evaluare-experienta-hr" ? "/chestionare/experienta" : 
                        q.slug === "evaluare-digitalizare-hr" ? "/chestionare/digitalizare" : 
                        q.slug === "evaluare-compliance-hr" ? "/chestionare/compliance" : 
                        `/chestionare/${q.slug}`
                      }>
                        <Button className={`text-white rounded-full px-6 shadow-md group-hover:shadow-lg transition-all ${btnClass}`}>
                           Start
                           <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                         </Button>
                       </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#5A86CB]/10 backdrop-blur-md rounded-3xl border border-dashed border-white/10">
              <Search className="size-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Niciun chestionar găsit</h3>
              <p className="text-muted-foreground">Încearcă să folosești alte cuvinte cheie pentru căutare.</p>
            </div>
          )}
        </div>

        {/* Sidebar Section (Right - 25%) */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Privacy Card */}
          <div className="bg-[#5A86CB]/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck className="size-24" />
            </div>
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">
              Data Privacy & Purpose
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Toate informațiile transmise prin aceste chestionare sunt criptate securizat și procesate conform reglementărilor GDPR.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Folosim aceste date exclusiv pentru a oferi recomandări personalizate pentru călătoria ta de digitalizare și pentru a îmbunătăți modelele AI ale platformei noastre.
            </p>
            <Link href="/privacy" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center">
              Citește Politica de Confidențialitate <ArrowRight className="ml-1.5 size-3" />
            </Link>
          </div>

          {/* CTA Card */}
          <div className="bg-primary/10 backdrop-blur-md rounded-3xl p-8 border border-primary/20 shadow-xl text-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            <h3 className="text-lg font-bold mb-3 relative z-10 text-foreground">
              Ai nevoie de un flux personalizat?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 relative z-10">
              Platforma noastră enterprise îți permite să construiești, implementezi și analizezi chestionare dinamice adaptate specific nevoilor organizației tale.
            </p>
            <Link href="/contact" className="relative z-10">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                Contactează-ne
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
