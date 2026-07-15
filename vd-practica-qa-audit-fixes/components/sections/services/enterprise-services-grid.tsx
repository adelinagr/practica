"use client";

import React from "react";
import { ClipboardList, Network, CloudCog, Landmark, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    title: "Audit Digital & Chestionare Inteligente",
    description: "Mapăm exact procesele din compania ta și identificăm zonele cu cel mai mare potențial de eficientizare și reducere a costurilor.",
    icon: ClipboardList,
    focusStack: ["Evaluare maturitate digitală", "Colectare inteligentă date", "Analiză operațională", "Recomandări automatizate"],
    href: "/servicii/audit-digital",
    accentColor: "text-primary",
    bgAccent: "bg-primary/10 group-hover:bg-primary/20",
    borderAccent: "group-hover:border-primary/40",
  },
  {
    title: "Automatizări Business & Integrări API",
    description: "Eliminăm eroarea umană și task-urile repetitive conectând sistemele izolate (facturare, vânzări, logistică) într-un flux centralizat.",
    icon: Network,
    focusStack: ["Automatizare procese", "Integrare ERP/CRM", "Workflow orchestration", "Sincronizare platforme"],
    href: "/servicii/automatizari",
    accentColor: "text-[#5A86CB]",
    bgAccent: "bg-[#5A86CB]/15 group-hover:bg-[#5A86CB]/25",
    borderAccent: "group-hover:border-[#5A86CB]/40",
  },
  {
    title: "Infrastructură Cloud & Securitate",
    description: "Mutăm ecosistemul companiei într-un mediu cloud scalabil, protejând datele sensibile cu cele mai înalte standarde de securitate.",
    icon: CloudCog,
    focusStack: ["Migrare cloud", "Arhitectură scalabilă", "Backup & Disaster Recovery", "Conformitate GDPR"],
    href: "/servicii/infrastructura-cloud",
    accentColor: "text-[#F2DCDB]",
    bgAccent: "bg-[#F2DCDB]/15 group-hover:bg-[#F2DCDB]/25",
    borderAccent: "group-hover:border-[#F2DCDB]/40",
  },
  {
    title: "Consultanță Digitalizare & Fonduri IMM",
    description: "Te ajutăm să construiești roadmap-ul tehnologic și să accesezi finanțări guvernamentale sau europene (ex: PNRR) pentru digitalizare.",
    icon: Landmark,
    focusStack: ["Finanțări PNRR", "Strategie digitalizare", "Roadmap tehnologic", "Optimizare costuri"],
    href: "/servicii/consultanta-fonduri",
    accentColor: "text-[#F2DCDB]",
    bgAccent: "bg-[#F2DCDB]/10 group-hover:bg-[#F2DCDB]/20",
    borderAccent: "group-hover:border-[#F2DCDB]/30",
  },
];


export function EnterpriseServicesGrid() {
  return (
    <section id="servicii-principale" className="py-20 md:py-24 bg-background scroll-mt-20">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={cn(
                "group relative flex flex-col rounded-3xl border border-border/50 bg-card/40 p-8 shadow-sm backdrop-blur-md transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg",
                service.borderAccent
              )}
            >
              {/* Icon */}
              <div className={cn("mb-6 flex size-14 items-center justify-center rounded-2xl transition-colors duration-300", service.bgAccent)}>
                <service.icon className={cn("size-7", service.accentColor)} />
              </div>

              {/* Text content */}
              <h3 className="mb-3 font-heading text-2xl font-bold tracking-tight text-foreground">
                {service.title}
              </h3>
              <p className="mb-8 text-base text-muted-foreground leading-relaxed flex-1">
                {service.description}
              </p>

              {/* Focus Stack List */}
              <div className="mb-8 rounded-xl bg-background/50 p-5 border border-border/30">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Tech / Focus Stack
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  {service.focusStack.map((item, i) => (
                    <li key={i} className="flex items-center text-sm font-medium text-foreground/80">
                      <span className={cn("mr-2 size-1.5 rounded-full", "bg-foreground/20 group-hover:bg-foreground/50 transition-colors")} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Link */}
              <div className="mt-auto pt-2">
                <Link
                  href={service.href}
                  className="inline-flex items-center text-sm font-bold text-foreground/80 transition-colors hover:text-primary"
                >
                  Vezi detalii soluție
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
