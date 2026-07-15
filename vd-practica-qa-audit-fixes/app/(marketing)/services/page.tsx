import { Metadata } from "next";
import { ServicesHero } from "@/components/sections/services/services-hero";
import { EnterpriseServicesGrid } from "@/components/sections/services/enterprise-services-grid";
import { AeoFaqSection } from "@/components/sections/services/aeo-faq-section";
import { MajorCta } from "@/components/sections/services/major-cta";
import { FloatingActionBtn } from "@/components/sections/services/floating-action-btn";

export const metadata: Metadata = {
  title: "Servicii de Digitalizare IMM România | Consultanță și Automatizări | VreauDigitalizare",
  description: "Servicii enterprise de digitalizare pentru companii: Audit Digital, Automatizări Business, Migrare Cloud, și Consultanță Fonduri PNRR.",
  alternates: {
    canonical: "https://vreaudigitalizare.eu/services",
  },
  openGraph: {
    title: "Servicii de Digitalizare IMM România | VreauDigitalizare",
    description: "Servicii enterprise de digitalizare pentru companii: Audit Digital, Automatizări Business, Migrare Cloud, și Consultanță Fonduri PNRR.",
    url: "https://vreaudigitalizare.eu/services",
    type: "website",
    locale: "ro_RO",
  },
  other: {
    "geo.region": "RO",
    "geo.placename": "Romania",
  }
};

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "Audit Digital & Chestionare Inteligente",
        "provider": {
          "@type": "Organization",
          "name": "VreauDigitalizare"
        },
        "areaServed": "Romania",
        "description": "Evaluare maturitate digitală, colectare inteligentă date, analiză operațională și recomandări automatizate pentru IMM-uri."
      },
      {
        "@type": "Service",
        "name": "Automatizări Business & Integrări API",
        "provider": {
          "@type": "Organization",
          "name": "VreauDigitalizare"
        },
        "areaServed": "Romania",
        "description": "Automatizare procese repetitive, integrare ERP/CRM, workflow orchestration pentru optimizare operațională."
      },
      {
        "@type": "Service",
        "name": "Infrastructură Cloud & Securitate",
        "provider": {
          "@type": "Organization",
          "name": "VreauDigitalizare"
        },
        "areaServed": "Romania",
        "description": "Migrare cloud, arhitectură scalabilă, conformitate GDPR și securitate operațională."
      },
      {
        "@type": "Service",
        "name": "Consultanță Digitalizare & Fonduri IMM",
        "provider": {
          "@type": "Organization",
          "name": "VreauDigitalizare"
        },
        "areaServed": "Romania",
        "description": "Strategie digitalizare, roadmap tehnologic și accesare fonduri (ex: PNRR) pentru digitalizarea firmelor."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="flex min-h-screen flex-col w-full">
        <ServicesHero />
        <EnterpriseServicesGrid />
        <AeoFaqSection />
        <MajorCta />
        <FloatingActionBtn />
      </main>
    </>
  );
}

