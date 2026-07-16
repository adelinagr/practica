"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section className="py-24 md:py-32 bg-transparent relative overflow-hidden z-10">
      <div className="mx-auto max-w-5xl px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="rounded-[3rem] bg-primary p-10 md:p-20 text-center shadow-[0_0_80px_rgba(242, 174, 188,0.3)] relative overflow-hidden group"
        >
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('/_static/noise.svg')" }}></div>
          
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-primary-foreground mb-6 leading-none relative z-10">
            Fă primul pas spre digitalizare
          </h2>
          
          <p className="text-primary-foreground/80 font-sans text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-semibold relative z-10">
            Nu lăsa concurența să te depășească. Află exact ce poți automatiza și începe să scalezi eficient, cu costuri controlate.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/chestionare/evaluare-maturitate-digitala"
              className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-background px-8 text-sm font-bold text-card-foreground shadow-xl transition-all hover:bg-background/90 hover:scale-[1.03] active:scale-[0.98] duration-200"
            >
              Începe evaluarea <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/10 px-8 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-foreground/20 hover:scale-[1.03] active:scale-[0.98]"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Contactează-ne
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
