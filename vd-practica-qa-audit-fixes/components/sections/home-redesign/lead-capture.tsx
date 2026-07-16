"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Loader2, ShieldCheck, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    industry: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.company) {
      setError("Te rugăm să completezi câmpurile obligatorii.");
      return;
    }

    // Duplicate email protection via sessionStorage
    const submittedEmail = sessionStorage.getItem("submitted_lead_email");
    if (submittedEmail === formData.email) {
      setSuccess(true);
      return; // Already submitted in this session
    }

    setLoading(true);
    try {
      // Create lead
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: "", // Optional
          source: "homepage_lead_form",
          companyName: formData.company,
          industry: formData.industry,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        throw new Error("Eroare la trimiterea mesajului.");
      }

      sessionStorage.setItem("submitted_lead_email", formData.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Eroare la trimiterea mesajului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-transparent border-t border-foreground/10 relative z-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-6 text-foreground">
              Hai să vorbim despre afacerea ta
            </h2>
            <p className="text-lg text-muted-foreground font-sans font-light mb-8">
              Fie că vrei o evaluare detaliată sau ai deja un proiect în minte, suntem aici să te ajutăm să scalezi eficient.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Răspundem în maximum 24 de ore",
                "Consultanță inițială 100% gratuită",
                "Audit tehnic preliminar inclus",
                "Propunere transparentă, fără costuri ascunse",
                "Garanția confidențialității datelor tale (NDA)"
              ].map((val, i) => (
                <li key={i} className="flex items-center text-foreground/80 font-sans font-medium">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span>{val}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono font-medium bg-card/10 px-4 py-2 rounded-lg border border-border/20">
                <ShieldCheck className="h-4 w-4 text-secondary" />
                Date securizate
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono font-medium bg-card/10 px-4 py-2 rounded-lg border border-border/20">
                <Zap className="h-4 w-4 text-primary" />
                Răspuns rapid
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="glass-card rounded-3xl border border-border/25 p-6 md:p-10 shadow-xl relative overflow-hidden bg-card/60 backdrop-blur-md">
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                <div className="h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2 text-foreground">Mesaj trimis cu succes!</h3>
                <p className="text-muted-foreground font-sans">
                  Îți mulțumim pentru interes. Un specialist te va contacta în cel mai scurt timp la adresa de email furnizată.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in font-sans">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                    {error}
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-foreground/50">Prenume</label>
                    <Input 
                      required 
                      className="h-11 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-foreground/50">Nume</label>
                    <Input 
                      required 
                      className="h-11 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase text-foreground/50">Email de serviciu *</label>
                  <Input 
                    required 
                    type="email" 
                    className="h-11 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-foreground/50">Companie *</label>
                    <Input 
                      required 
                      className="h-11 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-foreground/50">Industrie</label>
                    <select 
                      className="flex h-11 w-full rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground/30 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#3D5D91] disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    >
                      <option value="" className="bg-background">Alege...</option>
                      <option value="IT" className="bg-background">IT / Software</option>
                      <option value="Productie" className="bg-background">Producție</option>
                      <option value="Retail" className="bg-background">Retail & E-commerce</option>
                      <option value="Servicii" className="bg-background">Servicii Profesionale</option>
                      <option value="Logistica" className="bg-background">Logistică & Transport</option>
                      <option value="Altele" className="bg-background">Altele</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase text-foreground/50">Cu ce te putem ajuta?</label>
                  <Textarea 
                    className="min-h-[100px] bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary resize-none" 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="neon-pulse-btn w-full h-12 text-base font-bold rounded-xl flex items-center justify-center transition-transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Se trimite...</>
                  ) : "Trimite mesajul →"}
                </Button>

                <p className="text-[11px] text-foreground/40 font-mono text-center mt-4">
                  Prin trimiterea acestui formular, ești de acord cu <a href="/gdpr" className="underline hover:text-foreground">Politica de Confidențialitate (GDPR)</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
