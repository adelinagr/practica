"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Cum poate ajuta digitalizarea un IMM din România?",
    answer: "Digitalizarea ajută IMM-urile din România prin reducerea costurilor operaționale cu până la 40%, eliminarea muncii manuale repetitive și creșterea vitezei de procesare a comenzilor. Implementarea unui sistem CRM sau ERP centralizează datele, oferind control total și claritate asupra profitabilității companiei."
  },
  {
    question: "Ce tipuri de procese pot fi automatizate într-o afacere?",
    answer: "Pot fi automatizate procesele de facturare recurentă, generarea de rapoarte financiare, preluarea și sincronizarea comenzilor din e-commerce direct în curierat sau gestiune, notificările automate către clienți, procedurile de onboarding HR și managementul stocurilor între multiple depozite."
  },
  {
    question: "Cum funcționează un audit digital?",
    answer: "Auditul digital începe cu maparea tuturor fluxurilor de lucru curente ale companiei. Evaluăm software-urile utilizate, fluxul de date și timpul pierdut de angajați pe task-uri manuale. Rezultatul este un Raport de Maturitate Digitală care include un plan de acțiune prioritizat, estimări de cost și calculul ROI-ului (Return of Investment)."
  },
  {
    question: "Ce fonduri sunt disponibile pentru digitalizare?",
    answer: "Companiile românești pot accesa fonduri nerambursabile naționale și europene, precum PNRR (Programul Național de Redresare și Reziliență), pentru digitalizare. Acestea acoperă achiziția de hardware, licențe software, dezvoltarea de aplicații custom, migrarea în cloud și consultanță IT."
  },
  {
    question: "Cum ajută AI-ul în optimizarea operațională?",
    answer: "Inteligența Artificială optimizează operațiunile prin analiza predictivă a stocurilor, recunoașterea automată a datelor din facturi (OCR), asistenți virtuali (chatboți) capabili să rezolve 80% din suportul clienți (L1) și algoritmi care pot personaliza comunicarea de marketing în masă."
  }
];

export function AeoFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-card/20 border-y border-border/40">
      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground mb-4">
            Întrebări Frecvente despre Digitalizare
          </h2>
          <p className="text-lg text-muted-foreground">
            Informații clare, rapide și orientate pe rezultate pentru afacerea ta.
          </p>
        </div>

        <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx}
              itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
              className={cn(
                "rounded-2xl border transition-all duration-300 overflow-hidden",
                openIndex === idx ? "border-primary/40 bg-background shadow-[0_8px_30px_rgba(242, 174, 188,0.08)]" : "border-border/50 bg-transparent hover:border-border"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between p-6 md:p-8 text-left"
                aria-expanded={openIndex === idx}
              >
                <span itemProp="name" className="font-semibold text-lg text-foreground pr-8">
                  {faq.question}
                </span>
                <ChevronDown className={cn(
                  "h-6 w-6 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                  openIndex === idx && "rotate-180 text-primary"
                )} />
              </button>
              
              <div 
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  openIndex === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text" className="px-6 md:px-8 pb-6 md:pb-8 text-muted-foreground leading-relaxed text-base md:text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
