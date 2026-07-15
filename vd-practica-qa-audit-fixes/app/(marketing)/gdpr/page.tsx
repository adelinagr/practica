import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate (GDPR) | VreauDigitalizare",
  description: "Cum procesăm și protejăm datele tale personale la VreauDigitalizare.",
};

export default function GDPRPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24 lg:py-32">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-4">Politica de Confidențialitate (GDPR)</h1>
          <p className="text-muted-foreground text-lg">Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
        </div>
        
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <h2>1. Introducere</h2>
          <p>
            VreauDigitalizare respectă intimitatea dvs. și se angajează să vă protejeze datele personale. Această notificare de confidențialitate vă va informa cu privire la modul în care vă îngrijim datele cu caracter personal și vă vom informa cu privire la drepturile dvs. de confidențialitate.
          </p>

          <h2>2. Datele pe care le colectăm</h2>
          <p>
            Putem colecta, utiliza, stoca și transfera diferite tipuri de date cu caracter personal despre dvs., pe care le-am grupat împreună după cum urmează:
          </p>
          <ul>
            <li><strong>Date de Identitate:</strong> prenume, nume de familie, funcție, nume companie.</li>
            <li><strong>Date de Contact:</strong> adresă de email, număr de telefon.</li>
            <li><strong>Date Tehnice:</strong> adresa IP, tipul de browser, locația și alte tehnologii de pe dispozitivele pe care le utilizați.</li>
            <li><strong>Date de Utilizare:</strong> informații despre modul în care utilizați site-ul nostru, produsele și serviciile noastre.</li>
          </ul>

          <h2>3. Cum colectăm datele dvs. personale?</h2>
          <p>
            Utilizăm diferite metode de colectare a datelor, inclusiv prin completarea formularelor de contact, descărcarea materialelor informative sau aplicarea pentru un audit digital.
          </p>

          <h2>4. Cum utilizăm datele dvs. personale</h2>
          <p>
            Vom folosi datele dvs. personale doar atunci când legea ne permite. Cele mai frecvente utilizări sunt pentru: furnizarea serviciilor solicitate, îmbunătățirea experienței pe site și trimiterea de comunicări de marketing (dacă ați fost de acord).
          </p>

          <h2>5. Securitatea Datelor</h2>
          <p>
            Am implementat măsuri de securitate adecvate pentru a preveni pierderea accidentală, utilizarea sau accesarea neautorizată a datelor dvs. cu caracter personal, modificarea sau dezvăluirea acestora.
          </p>

          <h2>6. Drepturile Dumneavoastră</h2>
          <p>
            Conform legislației GDPR, aveți dreptul de a solicita accesul la datele dvs. personale, corectarea, ștergerea, restricționarea prelucrării sau transferul acestora, contactându-ne direct.
          </p>
        </div>
      </div>
    </div>
  );
}
