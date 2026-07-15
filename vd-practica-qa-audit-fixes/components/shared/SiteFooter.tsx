import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const footerLinks = {
  platforma: [
    { label: "Chestionare Digitalizare", href: "/chestionare" },
    { label: "Servicii", href: "/services" },
    { label: "Partners", href: "/partners" },
    { label: "Contact", href: "/contact" },
  ],
  resurse: [
    { label: "Blog & News", href: "/blog" },
    { label: "Evaluare Gratuită", href: "/chestionare" },
    { label: "Partners", href: "/partners" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "GDPR Compliance", href: "/gdpr" },
    { label: "Contact Us", href: "/contact" },
  ],
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden bg-transparent pt-32 pb-12 border-t border-white/10">
      {/* Massive Background Watermark */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 flex select-none justify-center opacity-5">
        <span className="font-heading text-[10rem] font-bold leading-none tracking-tighter text-[#F2DCDB]">
          DIGITALIZARE
        </span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Call To Action */}
        <div className="mb-24 flex flex-col items-center justify-center text-center">
          <h2 className="mb-8 font-heading text-4xl font-bold tracking-tight text-[#F2DCDB] md:text-5xl">
            Ready to upgrade your workflow?
          </h2>
          {/* Oversized Lime Button with slide-up hover */}
          <Link
            href="/chestionare"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-12 py-5 font-bold text-[#3D5D91] transition-all hover:scale-105"
            style={{ boxShadow: "0 0 40px rgba(242, 174, 188, 0.25)" }}
          >
            <span className="relative z-10 text-lg uppercase tracking-wider">Start Now</span>
            <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-[#F2DCDB] transition-transform duration-300 ease-out group-hover:translate-y-0" />
          </Link>
        </div>

        {/* 3-Column Footer */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Col 1: Links */}
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Platform
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.platforma.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Policy */}
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Social & Copyright */}
          <div className="flex flex-col md:items-end">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Socials
            </h3>
            <div className="mb-8 flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-colors hover:border-primary hover:text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-colors hover:border-primary hover:text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-[#3D5D91]">
              V
            </div>
            <span className="font-heading font-bold text-[#F2DCDB]">VreauDigitalizare</span>
          </div>
          <p className="mt-4 font-mono text-xs text-[#F2DCDB]/40 md:mt-0">
            © {year} VREAUDIGITALIZARE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
