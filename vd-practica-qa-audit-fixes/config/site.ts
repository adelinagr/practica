import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "VreauDigitalizare",
  description:
    "Soluții complete pentru digitalizarea afacerii tale. Transformăm ideile în realitate prin platforme web, aplicații moderne și strategii digitale.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
  mailSupport: "contact@vreaudigitalizare.eu",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Companie",
    items: [
      { title: "Despre noi", href: "/despre-noi" },
      { title: "Servicii", href: "/servicii" },
      { title: "Termeni și Condiții", href: "/termeni" },
      { title: "Politica de Confidențialitate", href: "/confidentialitate" },
    ],
  },
  {
    title: "Clienți",
    items: [
      { title: "Portofoliu", href: "/portofoliu" },
      { title: "Studii de caz", href: "/studii-de-caz" },
      { title: "Testimoniale", href: "/testimoniale" },
      { title: "Securitate", href: "/securitate" },
    ],
  },
  {
    title: "Resurse",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Ghiduri", href: "/ghiduri" },
      { title: "Întrebări Frecvente", href: "/faq" },
      { title: "Contact", href: "/contact" },
    ],
  },
];