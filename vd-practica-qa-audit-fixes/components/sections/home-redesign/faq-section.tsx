"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Cât costă procesul de evaluare și audit?",
    answer: "Evaluarea inițială a maturității digitale prin chestionarul nostru online este 100% gratuită. Vei primi un raport generat instantaneu. Pentru auditul aprofundat on-site, costurile sunt personalizate în funcție de complexitatea companiei tale."
  },
  {
    question: "Cât timp durează implementarea soluțiilor tehnice?",
    answer: "Timpul de implementare variază între 1 săptămână pentru soluții simple (precum automatizări de email sau fluxuri mici) și până la 3-6 luni pentru sisteme complexe de tip ERP sau integrări majore. Transparența este esențială: vei ști termenul exact din faza de strategie."
  },
  {
    question: "Ce include mai exact un proces de digitalizare?",
    answer: "Digitalizarea acoperă de la trecerea documentelor în format cloud, semnături electronice, până la sisteme CRM (management clienți), ERP (resurse), automatizări API și rapoarte de Business Intelligence în timp real."
  },
  {
    question: "Pentru ce tip de companii sunt potrivite serviciile voastre?",
    answer: "Ne adresăm în principal companiilor B2B din România cu 10 - 200 de angajați, care operează în producție, retail, servicii profesionale sau logistică și vor să renunțe la munca manuală repetitivă (Excel-uri, hârtii)."
  },
  {
    question: "Ce se întâmplă după ce completez evaluarea gratuită?",
    answer: "Primești pe email un Raport PDF detaliat cu scorul de maturitate și 3-5 recomandări clare. Apoi, poți programa o discuție gratuită de 15 minute cu unul dintre experții noștri pentru a interpreta rezultatele."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-transparent border-t border-foreground/10 relative z-10">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Întrebări frecvente
          </h2>
          <p className="mt-4 text-lg text-muted-foreground font-sans font-light">
            Răspunsuri clare la cele mai comune curiozități despre digitalizare.
          </p>
        </div>

        <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx}
              itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
              className={cn(
                "rounded-2xl border transition-all duration-300 overflow-hidden",
                openIndex === idx ? "border-primary/40 bg-card/10 shadow-sm" : "border-border/20 bg-card/5 hover:border-primary/30"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between p-6 text-left"
                aria-expanded={openIndex === idx}
              >
                <span itemProp="name" className="font-bold font-heading text-foreground pr-8">
                  {faq.question}
                </span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
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
                  <p itemProp="text" className="px-6 pb-6 text-muted-foreground font-sans leading-relaxed">
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
