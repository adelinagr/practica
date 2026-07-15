"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Cloud, Code2, Cpu, LineChart, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";

const SERVICES = [
  {
    title: "Evaluare Digitală",
    description: "Analizăm procesele actuale și identificăm blocajele.",
    benefit: "Află exact ce poți automatiza și cât timp vei economisi zilnic.",
    icon: LineChart,
    href: "/servicii/evaluare",
  },
  {
    title: "Dezvoltare Software",
    description: "Creăm aplicații custom pentru nevoile companiei tale.",
    benefit: "Platforme scalabile care cresc odată cu afacerea ta.",
    icon: Code2,
    href: "/servicii/dezvoltare",
  },
  {
    title: "Automatizări Fluxuri",
    description: "Eliminăm munca manuală repetitivă din companie.",
    benefit: "Scădem costurile operaționale și riscul erorilor umane.",
    icon: Cpu,
    href: "/servicii/automatizari",
  },
  {
    title: "Migrare Cloud",
    description: "Mutăm infrastructura ta în siguranță în cloud.",
    benefit: "Acces rapid la date de oriunde, cu securitate maximă.",
    icon: Cloud,
    href: "/servicii/cloud",
  },
  {
    title: "Securitate Cibernetică",
    description: "Protejăm datele sensibile ale clienților și firmei.",
    benefit: "Zero downtime și siguranță totală împotriva atacurilor.",
    icon: ShieldCheck,
    href: "/servicii/securitate",
  },
  {
    title: "Analiză de Date (BI)",
    description: "Transformăm datele tale în decizii strategice.",
    benefit: "Rapoarte în timp real pentru management eficient.",
    icon: BarChart3,
    href: "/servicii/analiza-date",
  },
];

export function ServicesGrid() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15
      }
    }
  };

  // Mouse Glow Spotlight Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty("--mouse-x", `${clientX - left}px`);
    currentTarget.style.setProperty("--mouse-y", `${clientY - top}px`);
  };

  return (
    <section id="servicii" className="py-24 md:py-36 relative overflow-hidden z-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Title Header */}
        <div className="mb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
              Serviciile Noastre
            </span>
            <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground leading-none">
              Ce facem concret
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground font-sans font-light leading-relaxed text-balance">
              De la auditul inițial al proceselor interne până la implementarea de soluții avansate, acoperim întreg spectrul transformării digitale pentru afacerea ta.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service, idx) => {
            const IconComp = service.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                onMouseMove={handleMouseMove}
                className="glass-card group relative flex flex-col overflow-hidden p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 hover:border-primary/40 bg-[#F2DCDB]/8 border border-[#F2DCDB]/20"
              >
                {/* Mouse spotlight overlay - rose palette */}
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(280px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(242, 174, 188,0.12),transparent_80%)]"
                />

                {/* Animated Icon Circle */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <IconComp className="h-5 w-5" />
                </div>

                {/* Header & Description */}
                <h3 className="mb-3 font-heading text-lg font-bold text-foreground">
                  {service.title}
                </h3>
                
                {/* Layout holding description and benefit */}
                <div className="relative min-h-[75px] mb-6 flex-1 overflow-hidden">
                  {/* Default description */}
                  <p className="text-muted-foreground font-sans font-light text-[13px] leading-relaxed transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                    {service.description}
                  </p>
                  
                  {/* Animated Reveal Benefit on Hover */}
                  <p className="absolute inset-0 text-[13px] font-semibold text-primary leading-relaxed opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {service.benefit}
                  </p>
                </div>

                {/* Learn More Trigger Modal */}
                <div className="pt-4 border-t border-white/10">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors group/btn">
                        Află mai mult
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[420px] rounded-3xl border border-[#F2DCDB]/30 bg-[#3D5D91]">
                      <DialogHeader>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                          <IconComp className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-2xl font-heading font-bold tracking-tight text-foreground">
                          {service.title}
                        </DialogTitle>
                        <DialogDescription className="text-sm pt-3 font-sans leading-relaxed text-muted-foreground">
                          {service.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-xs font-bold text-primary bg-primary/5 p-4 rounded-xl border border-primary/20 leading-relaxed font-sans">
                          ✨ {service.benefit}
                        </p>
                        <div className="mt-5">
                          <p className="text-xs text-white/40 font-sans leading-relaxed">
                            Programează o discuție gratuită cu unul dintre consultanții noștri pentru a stabili cum putem implementa acest serviciu în afacerea ta.
                          </p>
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-end gap-2">
                        <Link 
                          href="/contact" 
                          className="w-full sm:w-auto neon-pulse-btn text-xs h-10 px-6 py-0 inline-flex items-center justify-center transition-transform hover:scale-105"
                        >
                          Programează un Apel
                        </Link>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
