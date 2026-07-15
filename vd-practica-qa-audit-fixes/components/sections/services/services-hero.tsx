"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ServicesHero() {
  const scrollToServices = () => {
    document.getElementById("servicii-principale")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background elegant gradients - palette */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(242, 174, 188,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_40%_at_80%_20%,rgba(213,197,200,0.04)_0%,transparent_60%)]" />

      <div className="container max-w-5xl mx-auto px-4 md:px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
        >
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          SERVICIILE NOASTRE PRINCIPALE
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mx-auto max-w-4xl font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground"
        >
          Servicii de Digitalizare{" "}
          <br className="hidden md:block" />
          <span className="text-gradient_rose">
            Construite pentru Creștere
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10"
        >
          Explorează suita noastră completă de instrumente de transformare digitală — de la chestionare inteligente la strategie și implementare, oferim infrastructura pentru viitorul tău digital.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <button
            onClick={scrollToServices}
            className="group inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-[0_0_30px_rgba(242, 174, 188,0.3)] transition-all hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242, 174, 188,0.25)] active:translate-y-0"
          >
            Explorează soluțiile 
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
