"use client";

import React, { useState } from "react";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AssessmentCta() {
  const [selected, setSelected] = useState<number | null>(1);
  const router = useRouter();

  // Mouse Glow Spotlight Effect for Mockup Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty("--mouse-x", `${clientX - left}px`);
    currentTarget.style.setProperty("--mouse-y", `${clientY - top}px`);
  };

  return (
    <section className="py-28 relative overflow-hidden z-10">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="max-w-2xl"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
              Auto-Evaluare Rapidă
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mt-3 mb-6 leading-none text-foreground">
              Află în 10 minute unde se află compania ta
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-sans font-light mb-8 leading-relaxed">
              Completează gratuit chestionarul nostru de evaluare a maturității digitale. Fără obligații. Fără limbaj tehnic complicat. Doar o radiografie clară a proceselor tale de afaceri.
            </p>
            
            <ul className="space-y-4 mb-10 text-sm font-sans">
              {[
                "Raport PDF personalizat cu soluții clare",
                "Scor exact calculat pe baza la 10 categorii",
                "Comparație cu alte companii din industrie"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center text-foreground/80">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="font-semibold">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/chestionare/evaluare-maturitate-digitala"
              className="inline-flex h-12 items-center justify-center neon-pulse-btn hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              Începe evaluarea gratuită <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

          {/* Right Side: Mock UI Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-3xl blur-xl opacity-15" />
            
            <div
              onMouseMove={handleMouseMove}
              className="group glass-card relative rounded-3xl p-8 overflow-hidden"
            >
              {/* Card mouse spotlight - rose palette */}
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(350px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(242, 174, 188,0.1),transparent_80%)]"
              />

              <div className="relative z-10 flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono font-bold text-foreground/50 uppercase tracking-widest">
                  Progres evaluare
                </span>
                <span className="text-[11px] font-mono font-bold text-primary">20%</span>
              </div>
              
              <div className="relative z-10 w-full bg-foreground/10 rounded-full h-1.5 mb-8">
                <div className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full w-[20%]" />
              </div>

              <h3 className="relative z-10 text-lg font-heading font-bold mb-6 text-foreground leading-snug">
                Cât timp alocă echipa ta zilnic pentru task-uri manuale și introducere de date?
              </h3>

              <div className="relative z-10 space-y-3 font-sans">
                {[
                  "Mai puțin de 1 oră",
                  "Între 1 și 3 ore",
                  "Mai mult de 3 ore",
                  "Nu știu exact"
                ].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelected(idx);
                      if (typeof window !== "undefined") {
                        sessionStorage.setItem("prefilled_first_answer", option);
                      }
                      setTimeout(() => {
                        router.push("/chestionare/evaluare-maturitate-digitala");
                      }, 400);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border text-left text-xs font-bold transition-all duration-300",
                      selected === idx
                        ? "border-primary bg-primary/10 text-foreground shadow-[0_0_15px_rgba(204,255,0,0.15)]"
                        : "border-foreground/10 bg-background/50 text-foreground/60 hover:bg-foreground/5"
                    )}
                  >
                    {option}
                    <div className={cn(
                      "flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors",
                      selected === idx ? "border-primary bg-primary" : "border-foreground/20"
                    )}>
                      {selected === idx && <Check className="h-3 w-3 text-black" />}
                    </div>
                  </button>
                ))}
              </div>

            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
