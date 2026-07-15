"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { ClipboardCheck, Compass, Rocket, Sparkles, ArrowRight } from "lucide-react";
import { LiquidEther } from "@/components/ui/liquid-ether";

const PROCESS_STEPS = [
  {
    id: "01",
    label: "EVALUARE",
    icon: ClipboardCheck,
    description: "Completezi un chestionar de 10 minute și afli exact unde se află compania ta din punct de vedere digital.",
  },
  {
    id: "02",
    label: "STRATEGIE",
    icon: Compass,
    description: "Construim împreună un plan de transformare personalizat, clar și fără jargon tehnic.",
  },
  {
    id: "03",
    label: "IMPLEMENTARE",
    icon: Rocket,
    description: "Soluții digitale scalabile, sigure și performante — integrate pas cu pas în afacerea ta.",
  },
] as const;

// Animated Counter Utility
function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.abs(Math.floor(totalMiliseconds / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function HeroLanding() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
        delay: custom * 0.15,
      },
    }),
  };

  // Mouse Glow Spotlight Effect for Cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty("--mouse-x", `${clientX - left}px`);
    currentTarget.style.setProperty("--mouse-y", `${clientY - top}px`);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center py-16 lg:py-24 z-10 text-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none mix-blend-screen">
        <LiquidEther
          colors={['#F2AEBC', '#F2DCDB', '#4A3B40']}
          mouseForce={25}
          cursorSize={120}
          autoDemo={true}
          autoSpeed={0.6}
          autoIntensity={2.5}
          resolution={0.6}
          BFECC={true}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        {/* TEXT SI BRANDING */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 md:gap-8 max-w-4xl"
        >
          {/* Tag/Badge */}
          <motion.div variants={textVariants} className="system-status-tag border border-primary/20 px-4 py-2 rounded-full bg-primary/5 text-white/80">
            <div className="status-dot"></div>
            <span>PARTENERUL TĂU DE TRANSFORMARE DIGITALĂ</span>
          </motion.div>

          {/* Massive Cinematic Heading */}
          <motion.h1
            variants={textVariants}
            className="font-heading font-black tracking-tighter leading-[0.85] text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-white"
          >
            DIGITALIZĂM <br />
            <span className="italic bg-gradient-to-r from-primary to-white bg-clip-text text-transparent">
              AFACEREA TA.
            </span>
          </motion.h1>

          {/* Premium Description Paragraph */}
          <motion.p
            variants={textVariants}
            className="max-w-2xl text-white/60 font-sans font-light text-base sm:text-lg md:text-xl leading-relaxed"
          >
            Evaluăm maturitatea digitală a IMM-urilor în 10 minute și construim împreună un plan de acțiune personalizat, eficient și fără jargon tehnic.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={textVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full sm:w-auto"
          >
            <Link
              href="#chestionar"
              prefetch={true}
              className="group neon-pulse-btn inline-flex justify-center items-center gap-2 w-full sm:w-auto"
            >
              <span>Începe evaluarea gratuită</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#servicii"
              className="inline-flex justify-center items-center h-12 px-8 rounded-full border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors w-full sm:w-auto"
            >
              Serviciile Noastre
            </Link>
          </motion.div>

          {/* Statistics Counters */}
          <motion.div
            variants={textVariants}
            className="flex flex-wrap justify-center gap-8 sm:gap-16 pt-8 mt-4 border-t border-white/10 w-full"
          >
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
                <Counter value={240} />+
              </div>
              <div className="text-[11px] font-bold text-white/40 uppercase mt-1 tracking-wider">Companii</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
                <Counter value={94} />%
              </div>
              <div className="text-[11px] font-bold text-white/40 uppercase mt-1 tracking-wider">Satisfacție</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
                <Counter value={3} />x
              </div>
              <div className="text-[11px] font-bold text-white/40 uppercase mt-1 tracking-wider">Eficiență</div>
            </div>
          </motion.div>
        </motion.div>

        {/* PROCESS STEPS (Below Hero) */}
        <div className="w-full mt-24">
          <div className="grid md:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={step.id}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  onMouseMove={handleMouseMove}
                  className="group relative flex flex-col items-center text-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-primary/40 hover:bg-white/10 overflow-hidden"
                >
                  {/* Spotlight Glow */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(350px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(204,255,0,0.1),transparent_80%)]"
                  />

                  {/* Timeline Node */}
                  <div className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-black shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <IconComp className="size-8" />
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col items-center mt-2">
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <span className="flex h-6 items-center justify-center rounded bg-primary/20 px-3 text-xs font-mono font-black text-primary">
                        PASUL {step.id}
                      </span>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white font-heading">
                        {step.label}
                      </h3>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed font-sans font-light">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
      </div>
    </section>
  );
}