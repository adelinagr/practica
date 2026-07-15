"use client";

import React from "react";
import { motion } from "framer-motion";

export function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border/40">
      {/* Subtle Background Glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(37,99,255,0.06)_0%,transparent_70%)]" />

      <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400"
        >
          <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          BLOG & INSIGHTS
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 text-foreground leading-tight"
        >
          Cele mai recente{" "}
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            insights digitale
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          Ghiduri practice, studii de caz și strategii pentru companii care vor să crească prin digitalizare.
        </motion.p>
      </div>
    </section>
  );
}
