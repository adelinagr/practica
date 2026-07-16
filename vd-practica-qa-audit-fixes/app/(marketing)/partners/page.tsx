import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { NewsletterSection } from "@/components/sections/marketing/newsletter-section";

export const metadata = {
  title: "Partners | vreaudigitalizare.eu",
  description: "Descoperă partenerii de încredere alături de care transformăm digital afacerile.",
};

const services = [
  "Consultanță strategică în Resurse Umane",
  "Recrutare și onboarding digitalizat",
  "Managementul performanței angajaților",
  "Dezvoltarea programelor de training și coaching",
  "Optimizarea proceselor de evaluare internă",
  "Politici de retenție și employer branding"
];

export default function PartnersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent py-20 md:py-32">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <MaxWidthWrapper className="relative z-10">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Parteneriate Strategice
            </h1>
            <p className="text-lg text-muted-foreground">
              Colaborăm cu experți de top pentru a oferi soluții complete de digitalizare și dezvoltare a afacerii tale.
            </p>
          </div>

          {/* Partner Card */}
          <div className="overflow-hidden rounded-3xl bg-[#5A86CB]/10 backdrop-blur-md shadow-xl shadow-black/5 ring-1 ring-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
            <div className="grid md:grid-cols-5">
              {/* Image Section */}
              <div className="relative col-span-2 flex items-center justify-center bg-foreground/5 p-8 md:border-r md:border-foreground/10">
                <Image
                  src="/partners/hr-lab-usv.jpg"
                  alt="HR Lab USV"
                  width={600}
                  height={600}
                  className="h-auto w-full max-w-[280px] object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Content Section */}
              <div className="col-span-3 flex flex-col justify-center p-8 md:p-12">
                <div className="mb-6">
                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
                    HR Lab USV
                  </h2>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Parteneriat cu conf. univ. dr. Carmen CHASOVSCHI
                  </h3>
                </div>

                <p className="mb-8 leading-relaxed text-muted-foreground">
                  Îmbinăm inovația digitală cu excelența academică și expertiza avansată în resurse umane. Împreună cu <strong className="text-foreground">HR Lab USV</strong> și echipa coordonată de conf. univ. dr. Carmen Chasovschi, oferim strategii moderne pentru a transforma nu doar infrastructura tehnologică a companiei tale, ci și capitalul uman care o susține.
                </p>

                <div className="mb-10">
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
                    Servicii și Colaborare
                  </h4>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {services.map((service, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Link href="/chestionare/hr">
                    <Button
                      size="lg"
                      className="group w-full rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-all hover:bg-primary/90 sm:w-auto"
                    >
                      Începe evaluarea gratuită
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mx-auto mt-24 max-w-5xl">
          <NewsletterSection />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
