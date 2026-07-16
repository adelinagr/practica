import { Metadata } from "next";
import { BookingClient } from "@/components/booking/booking-client";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Programare Apel | vreaudigitalizare.eu",
  description: "Dorești să îți digitalizezi compania? Rezervă un apel de consultanță strategică gratuită sau trimite-ne un mesaj rapid.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-transparent py-16">
      {/* Background visual accents */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-60 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative px-4 mx-auto max-w-6xl">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Hai să vorbim despre proiectul tău
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Alege o zi și o oră pentru a programa o discuție gratuită de 30 de minute cu noi, sau contactează-ne folosind informațiile de mai jos.
          </p>
        </div>

        {/* Info Grid (Email, Phone, Office) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="flex items-start gap-4 rounded-xl border border-foreground/10 bg-[#5A86CB]/10 backdrop-blur-md p-5 shadow-sm">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Mail className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-card-foreground">Scrie-ne un email</h4>
              <p className="text-xs text-muted-foreground mt-1">Răspundem în maximum 24 de ore.</p>
              <a href="mailto:contact@vreaudigitalizare.eu" className="text-xs font-semibold text-primary hover:underline mt-2 block">
                contact@vreaudigitalizare.eu
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-foreground/10 bg-[#5A86CB]/10 backdrop-blur-md p-5 shadow-sm">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Phone className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-card-foreground">Suna-ne direct</h4>
              <p className="text-xs text-muted-foreground mt-1">Luni - Vineri între 09:00 și 17:00.</p>
              <a href="tel:+40722000000" className="text-xs font-semibold text-primary hover:underline mt-2 block">
                +40 722 000 000
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-foreground/10 bg-[#5A86CB]/10 backdrop-blur-md p-5 shadow-sm">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <MapPin className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-card-foreground">Locație birou</h4>
              <p className="text-xs text-muted-foreground mt-1">Te așteptăm la o cafea.</p>
              <span className="text-xs font-semibold text-muted-foreground mt-2 block">
                București, România
              </span>
            </div>
          </div>
        </div>

        {/* Scheduling Core Container */}
        <div className="w-full flex justify-center">
          <BookingClient />
        </div>
      </div>
    </div>
  );
}
