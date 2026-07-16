"use client";

import React from "react";
import { motion } from "framer-motion";

const LOGOS = [
  "Acme Corp", "TechNova", "GlobalSys", "InnovateRO", "DataFlow",
  "CloudSync", "NextGen", "SmartSolutions", "AlphaLogix", "PioneerSystems"
];

export function SocialProofBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-y border-foreground/10 bg-background/80 py-8 overflow-hidden relative z-10"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 mb-6 text-center">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/40">
          Companii care au încredere în noi
        </p>
      </div>
      
      {/* Marquee container */}
      <div className="flex w-full overflow-hidden">
        <div className="flex w-max animate-marquee space-x-12 px-12 md:space-x-24 md:px-24">
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center font-heading text-lg font-black text-foreground/20 transition-all duration-300 hover:text-primary"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradients for fade effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent" />
    </motion.section>
  );
}
