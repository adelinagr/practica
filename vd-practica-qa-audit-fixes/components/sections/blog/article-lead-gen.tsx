"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ArticleLeadGen() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    toast.success("Cererea a fost trimisă cu succes! Te vom contacta în curând.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Pregătit să îți digitalizezi compania?
            </h2>
            <p className="text-lg text-slate-300 mb-12 max-w-xl">
              Solicită o evaluare gratuită și află cum platforma VreauDigitalizare te poate ajuta să optimizezi procesele și să reduci costurile operaționale.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Eficiență Crescută</h4>
                  <p className="text-sm text-slate-400 mt-1">Automatizează task-urile repetitive și concentrează-te pe decizii strategice.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Implementare Rapidă</h4>
                  <p className="text-sm text-slate-400 mt-1">Integrăm soluțiile direct în ecosistemul tău de business, fără întreruperi.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="rounded-3xl border border-slate-700 bg-slate-800/50 p-8 sm:p-10 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-slate-400">Prenume</label>
                  <input required id="firstName" name="firstName" placeholder="Ion" className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-slate-400">Nume</label>
                  <input required id="lastName" name="lastName" placeholder="Popescu" className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Profesional</label>
                <input required type="email" id="email" name="email" placeholder="contact@compania-ta.ro" className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>

              <div className="space-y-2">
                <label htmlFor="companySize" className="text-xs font-bold uppercase tracking-wider text-slate-400">Dimensiune Companie</label>
                <select id="companySize" name="companySize" className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors appearance-none">
                  <option value="1-10">1-10 angajați</option>
                  <option value="11-50">11-50 angajați</option>
                  <option value="51-200">51-200 angajați</option>
                  <option value="200+">Peste 200 angajați</option>
                </select>
              </div>

              <div className="flex items-start gap-3">
                <input required type="checkbox" id="privacy" className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="privacy" className="text-[13px] text-slate-400 leading-relaxed">
                  Sunt de acord cu <span className="text-blue-400 cursor-pointer hover:underline">Politica de Confidențialitate</span> și accept să fiu contactat.
                </label>
              </div>

              <button disabled={loading} type="submit" className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 flex justify-center items-center">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Solicită Consultanță"}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}
