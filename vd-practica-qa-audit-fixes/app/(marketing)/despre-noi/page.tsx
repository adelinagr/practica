import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Target, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Despre Noi | VreauDigitalizare",
  description: "Cunoaște echipa din spatele VreauDigitalizare și misiunea noastră de a transforma digital IMM-urile din România.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 w-full bg-transparent overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute top-1/2 left-0 -ml-40 w-96 h-96 rounded-full bg-card/5 blur-[120px]" />

      <section className="relative z-10 container max-w-7xl pt-32 pb-16 md:pt-48 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              Misiunea Noastră
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Aducem tehnologia de top <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">în IMM-urile</span> din România
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Ne-am propus să simplificăm procesele complexe. Credem că orice afacere merită acces la soluții software performante, care elimină munca repetitivă și lasă loc pentru inovație și creștere.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/chestionare">
                <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-primary to-[#b36371] text-foreground hover:opacity-90 transition-opacity">
                  Hai să ne cunoaștem <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl -z-10 rounded-full" />
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm overflow-hidden flex items-center justify-center p-8">
              {/* Illustration placeholder */}
              <div className="text-center space-y-4">
                <Users className="w-24 h-24 text-primary mx-auto opacity-80" />
                <h3 className="text-2xl font-bold text-foreground">Echipa VreauDigitalizare</h3>
                <p className="text-muted-foreground">Dezvoltatori, consultanți și strategi la dispoziția ta.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 container max-w-7xl py-16 md:py-24 border-t border-foreground/5">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Valorile care ne ghidează</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fiecare linie de cod și fiecare proces pe care îl automatizăm respectă aceste principii.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-foreground/5 border border-foreground/10 backdrop-blur-sm hover:bg-foreground/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 text-primary">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Eficiență înainte de toate</h3>
            <p className="text-muted-foreground">
              Nu implementăm tehnologie doar de dragul tehnologiei. Ne asigurăm că fiecare soluție generează ROI clar și reduce munca manuală.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-foreground/5 border border-foreground/10 backdrop-blur-sm hover:bg-foreground/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Viteză de reacție</h3>
            <p className="text-muted-foreground">
              În mediul de business modern, viteza este totul. Răspundem prompt și livrăm proiecte în termene realiste și respectate.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-foreground/5 border border-foreground/10 backdrop-blur-sm hover:bg-foreground/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 text-primary">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Parteneriat pe termen lung</h3>
            <p className="text-muted-foreground">
              Ne considerăm partenerii tăi de tehnologie, nu doar simpli furnizori. Creștem odată cu afacerea ta.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
