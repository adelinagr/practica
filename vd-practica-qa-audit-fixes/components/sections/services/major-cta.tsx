"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export function MajorCta() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container max-w-5xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-[#3D5D91] border border-[#F2DCDB]/20 p-8 md:p-16 text-center shadow-2xl relative overflow-hidden"
        >
          
          {/* Subtle palette gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/15 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F2DCDB]/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
          
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
            Transformarea companiei tale începe aici
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Programează o discuție tehnică gratuită de 15 minute. Experții noștri îți vor analiza nevoile și îți vor recomanda pașii concreți spre o afacere digitalizată, scalabilă și profitabilă.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-[0_0_30px_rgba(242, 174, 188,0.3)] transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(242, 174, 188,0.5)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="mr-2 h-5 w-5" /> Programează un Apel Rapid
            </Link>
            
            <Link
              href="/chestionare"
              className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl border border-[#F2DCDB]/30 bg-[#F2DCDB]/10 px-8 text-base font-bold text-foreground backdrop-blur-sm transition-all hover:bg-[#F2DCDB]/20 hover:border-[#F2DCDB]/50"
            >
              Explorează Chestionarele <ArrowRight className="ml-2 h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
