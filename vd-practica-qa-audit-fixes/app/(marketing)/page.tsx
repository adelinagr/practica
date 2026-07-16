import { Metadata } from "next";
import HeroLanding from "@/components/sections/hero-landing";
import { SocialProofBar } from "@/components/sections/home-redesign/social-proof";
import { ServicesGrid } from "@/components/sections/home-redesign/services";
import { HowItWorksTimeline } from "@/components/sections/home-redesign/how-it-works";
import { AssessmentCta } from "@/components/sections/home-redesign/assessment-cta";
import { ResultsAndProof } from "@/components/sections/home-redesign/results-proof";
import { BlogPreview } from "@/components/sections/home-redesign/blog-preview";
import { LeadCaptureForm } from "@/components/sections/home-redesign/lead-capture";
import { FaqSection } from "@/components/sections/home-redesign/faq-section";
import { FinalCta } from "@/components/sections/home-redesign/final-cta";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Digitalizare Afaceri România | Evaluare Maturitate Digitală | VreauDigitalizare",
  description: "Ajutăm IMM-urile din România să crească prin transformare digitală, automatizări de fluxuri, implementare CRM/ERP și migrare în cloud.",
  alternates: {
    canonical: "https://vreaudigitalizare.eu",
    languages: {
      "ro": "https://vreaudigitalizare.eu",
      "x-default": "https://vreaudigitalizare.eu",
    },
  },
  openGraph: {
    title: "Digitalizare Afaceri România | Evaluare Maturitate Digitală | VreauDigitalizare",
    description: "Ajutăm IMM-urile din România să crească prin transformare digitală, automatizări de fluxuri, implementare CRM/ERP și migrare în cloud.",
    url: "https://vreaudigitalizare.eu",
    siteName: "VreauDigitalizare",
    images: [
      {
        url: "https://vreaudigitalizare.eu/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VreauDigitalizare - Transformare digitala IMM",
      },
    ],
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digitalizare Afaceri România",
    description: "Ajutăm IMM-urile să crească prin automatizări și soluții software personalizate.",
    images: ["https://vreaudigitalizare.eu/og-image.jpg"],
  },
  other: {
    "geo.region": "RO",
    "geo.placename": "Romania",
    "geo.position": "44.4268;26.1025",
    "ICBM": "44.4268, 26.1025",
  }
};

export default async function IndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://vreaudigitalizare.eu/#organization",
        "name": "VreauDigitalizare",
        "url": "https://vreaudigitalizare.eu",
        "logo": "https://vreaudigitalizare.eu/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+40-000-000-000",
          "contactType": "customer service",
          "areaServed": "RO",
          "availableLanguage": "Romanian"
        },
        "sameAs": [
          "https://www.linkedin.com/company/vreaudigitalizare",
          "https://www.facebook.com/vreaudigitalizare"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://vreaudigitalizare.eu/#website",
        "url": "https://vreaudigitalizare.eu",
        "name": "VreauDigitalizare",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://vreaudigitalizare.eu/blog?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://vreaudigitalizare.eu/#localbusiness",
        "name": "VreauDigitalizare",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "RO"
        },
        "areaServed": "Romania"
      }
    ]
  };

  let latestPostsRaw: any[] = [];
  try {
    latestPostsRaw = await prisma.post.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (error) {
    console.warn("Prisma connection failed (likely on Vercel without DB). Using mock posts for presentation.");
    latestPostsRaw = [
      {
        title: "Cum să automatizezi procesele din agenția ta cu AI",
        category: { name: "Automatizări" },
        excerpt: "Află cum uneltele bazate pe inteligență artificială îți pot reduce munca manuală cu peste 40% în fiecare lună.",
        readingTime: 4,
        slug: "cum-sa-automatizezi-cu-ai",
        createdAt: new Date(),
        imageUrl: null,
      },
      {
        title: "Migrarea în Cloud: Ghid complet pentru IMM-uri",
        category: { name: "Cloud Computing" },
        excerpt: "Pașii critici pentru o tranziție sigură și eficientă către infrastructura de cloud, fără a pierde date.",
        readingTime: 6,
        slug: "migrare-in-cloud-ghid",
        createdAt: new Date(),
        imageUrl: null,
      },
      {
        title: "De ce ai nevoie de un CRM customizat?",
        category: { name: "Dezvoltare Software" },
        excerpt: "O soluție off-the-shelf s-ar putea să nu se potrivească fluxurilor tale unice. Iată de ce soluțiile personalizate câștigă teren.",
        readingTime: 5,
        slug: "de-ce-ai-nevoie-de-crm",
        createdAt: new Date(),
        imageUrl: null,
      }
    ];
  }

  const latestPosts = latestPostsRaw.map((post) => ({
    title: post.title,
    category: post.category?.name || "General",
    excerpt: post.excerpt || "",
    readTime: `${post.readingTime || 5} min`,
    href: `/blog/${post.slug}`,
    date: format(new Date(post.createdAt), "dd MMM yyyy", { locale: ro }),
    imageUrl: post.imageUrl || null,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroLanding />
      <SocialProofBar />
      <ServicesGrid />
      <HowItWorksTimeline />
      <AssessmentCta />
      <ResultsAndProof />
      <BlogPreview posts={latestPosts} />
      <LeadCaptureForm />
      <FaqSection />
      <FinalCta />
    </>
  );
}
