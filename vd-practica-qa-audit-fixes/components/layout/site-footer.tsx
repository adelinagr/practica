import * as React from "react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container max-w-7xl px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <Link href="/" className="font-heading text-xl font-bold mb-4">
              VreauDigitalizare
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Platforma B2B completă care te ajută să elimini munca manuală, să scazi costurile și să scalezi eficient prin soluții software și automatizări.
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <Link href={siteConfig.links.github} target="_blank" className="text-muted-foreground hover:text-foreground">
                <Icons.gitHub className="size-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Servicii */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Servicii</h3>
            <ul className="space-y-3">
              {[
                { label: "Evaluare Digitală", href: "/servicii/evaluare" },
                { label: "Dezvoltare Software", href: "/servicii/dezvoltare" },
                { label: "Automatizări Fluxuri", href: "/servicii/automatizari" },
                { label: "Migrare Cloud", href: "/servicii/cloud" },
                { label: "Securitate Cibernetică", href: "/servicii/securitate" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resurse */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Resurse</h3>
            <ul className="space-y-3">
              {[
                { label: "Blog", href: "/blog" },
                { label: "Ghiduri de Digitalizare", href: "/ghiduri" },
                { label: "Studii de caz", href: "/studii-de-caz" },
                { label: "FAQ", href: "/faq" },
                { label: "Chestionar Maturitate", href: "/chestionare/evaluare-maturitate-digitala" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Companie */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Companie</h3>
            <ul className="space-y-3">
              {[
                { label: "Despre Noi", href: "/despre-noi" },
                { label: "Cariere", href: "/cariere" },
                { label: "Contact", href: "#contact" },
                { label: "Termeni și Condiții", href: "/termeni" },
                { label: "Politica de Confidențialitate", href: "/gdpr" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 py-6">
        <div className="container max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Copyright &copy; {new Date().getFullYear()} VreauDigitalizare.eu. Toate drepturile rezervate. Made in Romania 🇷🇴
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/gdpr" className="text-sm text-muted-foreground hover:text-foreground">
              Conformitate GDPR
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
