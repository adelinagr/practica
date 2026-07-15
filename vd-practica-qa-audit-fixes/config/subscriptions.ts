import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Start",
    description: "Pentru afaceri la început de drum",
    benefits: [
      "Site de prezentare (până la 5 pagini)",
      "Găzduire web inclusă",
      "Analitice de trafic de bază",
    ],
    limitations: [
      "Fără funcționalități e-commerce",
      "Suport tehnic standard (răspuns în 48h)",
      "Fără design complet personalizat",
      "Fără optimizare SEO avansată",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Profesional",
    description: "Deblochează potențialul digital",
    benefits: [
      "Pagini web nelimitate",
      "Design complet personalizat",
      "Optimizare SEO de bază",
      "Suport tehnic prioritar",
      "Integrări standard (ex: plăți, newsletter)",
    ],
    limitations: [
      "Fără integrări complexe (ERP/CRM)",
      "Fără manager de proiect dedicat",
    ],
    prices: {
      monthly: 15,
      yearly: 144,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Business",
    description: "Pentru companii în expansiune",
    benefits: [
      "Funcționalități E-commerce avansate",
      "Rapoarte de performanță și SEO în timp real",
      "Integrări personalizate (CRM, ERP, API)",
      "Suport tehnic și mentenanță 24/7",
      "Manager de cont și consultanță strategică",
    ],
    limitations: [],
    prices: {
      monthly: 30,
      yearly: 300,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = [
  "starter",
  "pro",
  "business",
  "enterprise",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Acces la Analitice",
    starter: true,
    pro: true,
    business: true,
    enterprise: "Personalizat",
    tooltip: "Toate planurile includ analitice de bază pentru monitorizarea traficului.",
  },
  {
    feature: "Design Personalizat",
    starter: null,
    pro: "Inclus",
    business: "Premium",
    enterprise: "Nelimitat",
    tooltip: "Designul personalizat (UI/UX) este disponibil de la planul Profesional în sus.",
  },
  {
    feature: "Suport Tehnic",
    starter: null,
    pro: "Email",
    business: "Email & Chat",
    enterprise: "Suport 24/7",
  },
  {
    feature: "Rapoarte Avansate SEO",
    starter: null,
    pro: null,
    business: true,
    enterprise: "Personalizat",
    tooltip:
      "Rapoartele detaliate de performanță sunt disponibile pentru planurile Business și Enterprise.",
  },
  {
    feature: "Manager de Proiect Dedicat",
    starter: null,
    pro: null,
    business: null,
    enterprise: true,
    tooltip: "Planul Enterprise include un manager de cont dedicat afacerii tale.",
  },
  {
    feature: "Acces API / Integrări",
    starter: "Limitat",
    pro: "Standard",
    business: "Avansat",
    enterprise: "Complet",
  },
  {
    feature: "Consultanță Lunară",
    starter: false,
    pro: true,
    business: true,
    enterprise: "Personalizat",
    tooltip: "Planurile superioare includ ședințe lunare de consultanță și strategie.",
  },
  {
    feature: "Integrări Custom (ERP/CRM)",
    starter: false,
    pro: false,
    business: "Disponibil",
    enterprise: "Disponibil",
    tooltip:
      "Dezvoltăm integrări la comandă pentru planurile Business și Enterprise.",
  },
  {
    feature: "Conturi de Utilizator (Echipă)",
    starter: null,
    pro: "De bază",
    business: "Avansat",
    enterprise: "Avansat",
    tooltip:
      "Gestionarea rolurilor și permisiunilor echipei tale se îmbunătățește la planurile superioare.",
  },
  {
    feature: "Asistență la Configurare",
    starter: false,
    pro: "Ghidat",
    business: "Asistat",
    enterprise: "Serviciu Complet",
    tooltip: "Planurile premium includ asistență completă la lansarea proiectului tău.",
  },
];