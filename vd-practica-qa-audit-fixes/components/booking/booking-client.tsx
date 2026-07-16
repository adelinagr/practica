"use client";

import * as React from "react";
import { format, parseISO, startOfDay, getDay } from "date-fns";
import { ro } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, ArrowRight, CheckCircle2, User, Mail, Phone, AlertCircle, ArrowLeft, Video } from "lucide-react";

export function BookingClient() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [step, setStep] = React.useState(1); // 1 = Date/Time, 2 = Form, 3 = Success

  // Form states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Fetch slots when date changes
  React.useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedTime(undefined);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const res = await fetch(`/api/booking/available-slots?date=${formattedDate}`);
        if (!res.ok) {
          throw new Error("Eroare la preluarea orelor disponibile");
        }
        const data = await res.json();
        setAvailableSlots(data.slots || []);
      } catch (err: any) {
        toast.error(err.message || "A apărut o problemă la încărcarea orelor.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  // Disable past days and weekends by default
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const day = getDay(date);
    // Disable past days
    if (date < today) return true;
    // Disable Sunday (0) and Saturday (6)
    return day === 0 || day === 6;
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNextStep = () => {
    if (!selectedDate || !selectedTime) {
      toast.warning("Te rugăm să alegi data și ora programării.");
      return;
    }
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Numele și emailul sunt obligatorii.");
      return;
    }

    setSubmitting(true);
    try {
      const formattedDate = format(selectedDate!, "yyyy-MM-dd");
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formattedDate,
          time: selectedTime,
          name,
          email,
          phone: phone || null,
          notes: notes || null
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Eroare la salvarea programării.");
      }

      toast.success("Programarea a fost înregistrată cu succes!");
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || "A apărut o problemă. Te rugăm să încerci din nou.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-2xl border border-border bg-card shadow-xl backdrop-blur-md">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12"
          >
            {/* Call Details Side */}
            <div className="border-b border-border p-6 md:col-span-5 md:border-b-0 md:border-r">
              <div className="sticky top-6">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Consultanță Gratuită
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                  Apel de Aliniere Strategică
                </h2>
                <div className="mt-4 flex flex-col gap-3 text-[13px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-primary" />
                    <span>30 de minute</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="size-4 text-primary" />
                    <span>Google Meet / Zoom (online)</span>
                  </div>
                </div>
                <p className="mt-6 text-[13px] leading-relaxed text-muted-foreground">
                  Rezervă o discuție de 30 de minute cu unul dintre consultanții noștri pentru a identifica procesele din compania ta care pot fi digitalizate și automatizate.
                </p>
                <div className="mt-8 rounded-xl bg-background p-4 border border-border">
                  <div className="flex gap-2">
                    <AlertCircle className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      Disponibilitatea este afișată în timp real în fusul tău orar local.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Date/Time Picker Side */}
            <div className="p-6 md:col-span-7 flex flex-col">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                1. Selectează data și ora
              </h3>
              
              <div className="mt-6 flex flex-col lg:flex-row gap-6 justify-center">
                {/* Calendar */}
                <div className="flex flex-col items-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    className="rounded-xl border border-border bg-background p-3 shadow-sm"
                  />
                </div>

                {/* Time Slots */}
                <div className="flex-1 flex flex-col min-h-[300px]">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-3">
                    {selectedDate ? (
                      <>Intervale disponibile pentru <span className="text-primary font-bold">{format(selectedDate, "d MMMM", { locale: ro })}</span></>
                    ) : (
                      "Alege o dată din calendar"
                    )}
                  </h4>

                  {!selectedDate ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
                      <CalendarDays className="size-8 text-muted-foreground/50" />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Alege o zi disponibilă pentru a vizualiza orele.
                      </p>
                    </div>
                  ) : loadingSlots ? (
                    <div className="grid grid-cols-2 gap-2">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-background p-6 text-center border border-border">
                      <AlertCircle className="size-6 text-muted-foreground/50" />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Nu sunt intervale disponibile. Alege altă zi.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[280px] pr-1">
                      {availableSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`flex items-center justify-center rounded-lg border py-2.5 text-xs font-semibold transition-all ${
                            selectedTime === time
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-auto pt-6"
                    >
                      <Button
                        onClick={handleNextStep}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Continuă spre detalii
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="p-6 md:p-8"
          >
            {/* Header info */}
            <div className="flex items-center gap-4 border-b border-border pb-5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackStep}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 size-4" />
                Înapoi
              </Button>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  2. Introdu detaliile tale
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Rezervat pe data de <span className="font-bold text-primary">{format(selectedDate!, "d MMMM yyyy", { locale: ro })}</span> la ora <span className="font-bold text-primary">{selectedTime}</span>.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground" />
                    Nume Complet *
                  </label>
                  <Input
                    required
                    placeholder="ex: Ion Popescu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 text-xs border-border bg-background focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-muted-foreground" />
                    Adresă Email *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="ex: ion.popescu@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 text-xs border-border bg-background focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  Număr de Telefon (Opțional)
                </label>
                <Input
                  type="tel"
                  placeholder="ex: 0722 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 text-xs border-border bg-background focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Scopul discuției / Ce dorești să digitalizezi?
                </label>
                <Textarea
                  placeholder="Descrie pe scurt activitatea firmei tale și ce obiective vrei să obții..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="text-xs border-border bg-background focus-visible:ring-primary"
                />
              </div>

              <div className="pt-4 border-t border-border mt-6">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                >
                  {submitting ? "Se trimite..." : "Confirmă Programarea"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 text-center flex flex-col items-center justify-center max-w-xl mx-auto min-h-[400px]"
          >
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-500">
              <CheckCircle2 className="size-12 animate-pulse" strokeWidth={2.5} />
            </div>
            
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
              Solicitare Trimisă!
            </h2>
            
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Salutare, <strong className="text-foreground">{name}</strong>. Solicitarea ta pentru data de <span className="font-semibold text-primary">{format(selectedDate!, "EEEE, d MMMM yyyy", { locale: ro })}</span> la ora <span className="font-semibold text-primary">{selectedTime}</span> a fost înregistrată cu succes.
            </p>

            <div className="mt-6 rounded-xl bg-background p-4 text-left border border-border w-full">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Ce urmează:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                <li>Vei primi un email de notificare în curând.</li>
                <li>Un consultant va analiza datele tale și va confirma apelul.</li>
                <li>După confirmare, vei primi pe email linkul final de conectare (Google Meet / Zoom).</li>
              </ul>
            </div>

            <Button
              onClick={() => {
                setStep(1);
                setSelectedDate(undefined);
                setSelectedTime(undefined);
                setName("");
                setEmail("");
                setPhone("");
                setNotes("");
              }}
              variant="outline"
              className="mt-8 border-border text-foreground hover:bg-background"
            >
              Programează alt apel
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
