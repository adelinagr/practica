import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și Condiții | VreauDigitalizare",
  description: "Termenii și condițiile de utilizare a platformei VreauDigitalizare.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24 lg:py-32">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-4">Termeni și Condiții</h1>
          <p className="text-muted-foreground text-lg">Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
        </div>
        
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <h2>1. Acceptarea Termenilor</h2>
          <p>
            Prin accesarea și utilizarea acestui website, acceptați și sunteți de acord să respectați acești termeni și condiții. Dacă nu sunteți de acord cu acești termeni, vă rugăm să nu utilizați platforma noastră.
          </p>

          <h2>2. Descrierea Serviciilor</h2>
          <p>
            VreauDigitalizare oferă servicii de consultanță și implementare de soluții software (CRM, ERP, automatizări de fluxuri) pentru IMM-urile din România. Ne rezervăm dreptul de a modifica, suspenda sau întrerupe orice aspect al serviciilor noastre în orice moment.
          </p>

          <h2>3. Obligațiile Utilizatorului</h2>
          <p>
            Sunteți de acord să utilizați acest website doar în scopuri legale și într-un mod care nu încalcă drepturile, nu restricționează sau nu inhibă utilizarea website-ului de către nicio terță parte.
          </p>

          <h2>4. Proprietate Intelectuală</h2>
          <p>
            Tot conținutul de pe acest website (texte, grafică, logo-uri, imagini, software) este proprietatea VreauDigitalizare și este protejat de legile privind drepturile de autor.
          </p>

          <h2>5. Limitarea Răspunderii</h2>
          <p>
            VreauDigitalizare nu va fi răspunzătoare pentru daunele directe, indirecte, accidentale, speciale sau de consecință care rezultă din utilizarea sau incapacitatea de a utiliza website-ul nostru sau serviciile oferite.
          </p>
        </div>
      </div>
    </div>
  );
}
