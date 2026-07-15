"use client";

import React from "react";
import { Quote } from "lucide-react";

const METRICS = [
  { value: "-60%", label: "Timp pierdut manual", desc: "în medie după prima lună de implementare" },
  { value: "3x", label: "Viteză procese interne", desc: "datorită automatizărilor și integrărilor" },
  { value: "6 luni", label: "Recuperare investiție", desc: "ROI clar calculat în faza de strategie" },
];

const TESTIMONIALS = [
  {
    quote: "Aplicația personalizată ne-a permis să renunțăm complet la Excel-uri. Acum toată echipa știe în timp real statusul comenzilor.",
    name: "Alexandru M.",
    role: "CEO",
    company: "Producție Mobilier",
    initials: "AM",
  },
  {
    quote: "Nu credeam că digitalizarea poate fi atât de nedureroasă. Evaluarea inițială ne-a deschis ochii, iar implementarea a mers impecabil.",
    name: "Diana T.",
    role: "Director Operațional",
    company: "Logistică & Transport",
    initials: "DT",
  },
  {
    quote: "Recomand cu încredere. Am automatizat fluxul de emitere facturi și rapoarte zilnice. Am salvat 20 de ore pe săptămână din munca contabilei.",
    name: "Mihai C.",
    role: "Fondator",
    company: "E-commerce IT",
    initials: "MC",
  },
];

export function ResultsAndProof() {
  return (
    <section className="py-24 bg-transparent border-t border-white/10 relative z-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
            Ce obțin companiile după digitalizare
          </h2>
          <p className="text-muted-foreground font-sans font-light text-lg">
            Nu vindem doar tehnologie. Livrăm rezultate de business măsurabile care se reflectă direct în profit și eficiență.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {METRICS.map((metric, idx) => (
            <div key={idx} className="glass-card flex flex-col items-center text-center p-8 bg-[#F2DCDB]/10 border border-[#F2DCDB]/20 hover:border-primary/40 transition-colors">
              <span className="text-4xl md:text-5xl font-mono font-black text-primary mb-3 tracking-tighter">
                {metric.value}
              </span>
              <span className="text-lg font-bold font-heading text-foreground mb-2">{metric.label}</span>
              <span className="text-sm text-muted-foreground font-sans">{metric.desc}</span>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        {TESTIMONIALS.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((test, idx) => (
              <div key={idx} className="glass-card relative flex flex-col p-8 bg-[#F2DCDB]/10 border border-[#F2DCDB]/20 transition-hover hover:border-primary/40">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20 rotate-180" />
                <p className="text-foreground/80 font-sans font-light leading-relaxed mb-8 flex-1 italic">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold font-mono text-lg border border-primary/30">
                    {test.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold font-heading text-foreground">{test.name}</p>
                    <p className="text-xs text-muted-foreground font-sans">{test.role}, {test.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
