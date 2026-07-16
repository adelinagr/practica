"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Check,
  X,
  Plus,
  Trash2,
  AlertCircle,
  Video,
  User,
  Mail,
  Phone,
  BarChart2,
  Sliders,
  CalendarDays,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  startTime: string | Date;
  endTime: string | Date;
  status: string;
  googleMeetLink: string | null;
}

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface CalendarSettings {
  slotDuration: number;
  bufferTime: number;
  noticePeriod: number;
  maxDaysAhead: number;
}

interface BlockedDate {
  date: string | Date;
  reason: string | null;
}

interface AdminAppointmentsClientProps {
  initialAppointments: Appointment[];
  initialAvailabilities: Availability[];
  initialSettings: CalendarSettings;
  initialBlockedDates: BlockedDate[];
}

const WEEKDAYS = [
  "Duminică",
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă"
];

export function AdminAppointmentsClient({
  initialAppointments,
  initialAvailabilities,
  initialSettings,
  initialBlockedDates
}: AdminAppointmentsClientProps) {
  const [activeTab, setActiveTab] = React.useState<"list" | "settings" | "analytics">("list");
  
  // Data States
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);
  const [availabilities, setAvailabilities] = React.useState<Availability[]>(
    // Ensure all 7 days have a record
    [...Array(7)].map((_, i) => {
      const existing = initialAvailabilities.find(av => av.dayOfWeek === i);
      return existing || { dayOfWeek: i, startTime: "09:00", endTime: "17:00", isActive: i !== 0 && i !== 6 };
    })
  );
  const [settings, setSettings] = React.useState<CalendarSettings>(initialSettings);
  const [blockedDates, setBlockedDates] = React.useState<BlockedDate[]>(initialBlockedDates);

  // New Blocked Date Input State
  const [newBlockedDate, setNewBlockedDate] = React.useState("");
  const [newBlockedReason, setNewBlockedReason] = React.useState("");

  // Rescheduling Modal State
  const [reschedulingApp, setReschedulingApp] = React.useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = React.useState("");
  const [rescheduleTime, setRescheduleTime] = React.useState("");

  // Loading States
  const [submittingSettings, setSubmittingSettings] = React.useState(false);
  const [analyticsData, setAnalyticsData] = React.useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = React.useState(false);

  // Filter lists
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  // Fetch Analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch("/api/admin/analytics/booking");
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Actions: Approve Appointment
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" })
      });
      if (!res.ok) throw new Error("Eroare la aprobare");
      const updated = await res.json();
      
      setAppointments(prev => prev.map(app => app.id === id ? updated : app));
      toast.success("Programarea a fost aprobată cu succes!");
    } catch (err: any) {
      toast.error(err.message || "Nu s-a putut aproba programarea.");
    }
  };

  // Actions: Cancel / Reject Appointment
  const handleCancel = async (id: string) => {
    if (!confirm("Sigur dorești să anulezi această programare? Clientul va fi notificat pe email.")) return;
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" })
      });
      if (!res.ok) throw new Error("Eroare la anulare");
      const updated = await res.json();

      setAppointments(prev => prev.map(app => app.id === id ? updated : app));
      toast.success("Programarea a fost anulată.");
    } catch (err: any) {
      toast.error(err.message || "Nu s-a putut anula programarea.");
    }
  };

  // Actions: Reschedule
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingApp || !rescheduleDate || !rescheduleTime) return;

    try {
      const targetDate = parseISO(rescheduleDate);
      const [hours, minutes] = rescheduleTime.split(":").map(Number);
      const startTime = new Date(targetDate);
      startTime.setHours(hours, minutes, 0, 0);
      const endTime = new Date(startTime.getTime() + settings.slotDuration * 60000);

      const res = await fetch(`/api/admin/appointments/${reschedulingApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: "PENDING" // reset status to pending for confirmation
        })
      });

      if (!res.ok) throw new Error("Eroare la reprogramare");
      const updated = await res.json();

      setAppointments(prev => prev.map(app => app.id === reschedulingApp.id ? updated : app));
      toast.success("Programarea a fost reprogramată. Email trimis clientului.");
      setReschedulingApp(null);
    } catch (err: any) {
      toast.error(err.message || "Eroare la reprogramare.");
    }
  };

  // Settings Save
  const handleSaveSettings = async () => {
    setSubmittingSettings(true);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings,
          availabilities,
          blockedDates
        })
      });

      if (!res.ok) throw new Error("Eroare la salvare");
      toast.success("Configurările au fost salvate cu succes!");
    } catch (err: any) {
      toast.error(err.message || "Nu s-a putut efectua salvarea.");
    } finally {
      setSubmittingSettings(false);
    }
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    const exists = blockedDates.some(
      d => format(new Date(d.date), "yyyy-MM-dd") === newBlockedDate
    );
    if (exists) {
      toast.error("Această dată este deja blocată.");
      return;
    }
    setBlockedDates(prev => [...prev, { date: newBlockedDate, reason: newBlockedReason }]);
    setNewBlockedDate("");
    setNewBlockedReason("");
  };

  const removeBlockedDate = (index: number) => {
    setBlockedDates(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDayActive = (index: number) => {
    setAvailabilities(prev =>
      prev.map((av, i) => (i === index ? { ...av, isActive: !av.isActive } : av))
    );
  };

  const updateDayTime = (index: number, field: "startTime" | "endTime", value: string) => {
    setAvailabilities(prev =>
      prev.map((av, i) => (i === index ? { ...av, [field]: value } : av))
    );
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter(app => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "PENDING") return app.status === "PENDING";
    if (statusFilter === "APPROVED") return app.status === "APPROVED";
    if (statusFilter === "HISTORY") return app.status === "CANCELLED" || app.status === "REJECTED";
    return true;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-zinc-50">
            Administrare Programări
          </h1>
          <p className="text-xs text-muted-foreground mt-1 dark:text-zinc-400">
            Gestionează apelurile programate, configurează programul tău săptămânal și blochează zile de concediu.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === "list"
              ? "border-primary text-primary dark:border-indigo-400 dark:text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground dark:hover:text-zinc-300"
          }`}
        >
          <CalendarDays className="size-4" />
          Programări Primite
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === "settings"
              ? "border-primary text-primary dark:border-indigo-400 dark:text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground dark:hover:text-zinc-300"
          }`}
        >
          <Sliders className="size-4" />
          Program de Lucru & Setări
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
            activeTab === "analytics"
              ? "border-primary text-primary dark:border-indigo-400 dark:text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground dark:hover:text-zinc-300"
          }`}
        >
          <BarChart2 className="size-4" />
          Statistici & Rapoarte
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Filter Row */}
              <div className="flex gap-2">
                {["ALL", "PENDING", "APPROVED", "HISTORY"].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      statusFilter === filter
                        ? "bg-slate-900 text-foreground dark:bg-zinc-50 dark:text-zinc-950"
                        : "bg-background text-muted-foreground hover:bg-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {filter === "ALL" && "Toate"}
                    {filter === "PENDING" && "În așteptare"}
                    {filter === "APPROVED" && "Confirmate"}
                    {filter === "HISTORY" && "Istoric (Anulate/Respinse)"}
                  </button>
                ))}
              </div>

              {/* Table / List */}
              <div className="rounded-xl border border-border bg-secondary/10 backdrop-blur-md shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                {filteredAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
                    <Calendar className="size-10 text-accent/60 dark:text-zinc-700" />
                    <p className="mt-4 text-xs font-semibold text-muted-foreground dark:text-zinc-400">
                      Nu s-au găsit programări pentru filtrul selectat.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-150 bg-background/50 text-xs font-bold text-muted-foreground dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
                          <th className="px-6 py-4">Client</th>
                          <th className="px-6 py-4">Dată & Oră</th>
                          <th className="px-6 py-4">Notă/Scop</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Acțiuni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                        {filteredAppointments.map(app => {
                          const dateObj = new Date(app.startTime);
                          const dateFormatted = format(dateObj, "EEEE, d MMM yyyy", { locale: ro });
                          const timeFormatted = format(dateObj, "HH:mm") + " - " + format(new Date(app.endTime), "HH:mm");

                          return (
                            <tr key={app.id} className="hover:bg-background/50 dark:hover:bg-zinc-900/20">
                              <td className="px-6 py-4">
                                <div className="font-semibold text-foreground dark:text-zinc-100">{app.name}</div>
                                <div className="text-[11px] text-accent/80 space-y-0.5 mt-1">
                                  <div className="flex items-center gap-1">
                                    <Mail className="size-3" />
                                    <span>{app.email}</span>
                                  </div>
                                  {app.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="size-3" />
                                      <span>{app.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-foreground dark:text-zinc-100">{dateFormatted}</div>
                                <div className="text-[11px] text-accent/80 mt-1 flex items-center gap-1">
                                  <Clock className="size-3 text-primary" />
                                  <span>{timeFormatted}</span>
                                </div>
                                {app.googleMeetLink && app.status === "APPROVED" && (
                                  <a
                                    href={app.googleMeetLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline mt-1.5 dark:text-primary"
                                  >
                                    <Video className="size-3.5" />
                                    Google Meet
                                    <ExternalLink className="size-3" />
                                  </a>
                                )}
                              </td>
                              <td className="px-6 py-4 max-w-xs">
                                <p className="truncate text-muted-foreground dark:text-zinc-400" title={app.notes || ""}>
                                  {app.notes || "-"}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                  app.status === "APPROVED"
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                    : app.status === "PENDING"
                                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                                }`}>
                                  {app.status === "APPROVED" && "Confirmat"}
                                  {app.status === "PENDING" && "În așteptare"}
                                  {app.status === "CANCELLED" && "Anulat"}
                                  {app.status === "REJECTED" && "Respins"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1.5">
                                  {app.status === "PENDING" && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleApprove(app.id)}
                                      className="h-8 bg-emerald-600 text-foreground hover:bg-emerald-500 text-xs px-2.5 font-bold"
                                    >
                                      <Check className="mr-1 size-3.5" />
                                      Aprobă
                                    </Button>
                                  )}
                                  
                                  {app.status !== "CANCELLED" && app.status !== "REJECTED" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setReschedulingApp(app);
                                          setRescheduleDate(format(dateObj, "yyyy-MM-dd"));
                                          setRescheduleTime(format(dateObj, "HH:mm"));
                                        }}
                                        className="h-8 border-border text-xs px-2.5 font-bold dark:border-zinc-800"
                                      >
                                        Reprogramează
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleCancel(app.id)}
                                        className="h-8 text-rose-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs px-2"
                                      >
                                        <X className="size-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Working Hours Setup */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-border dark:border-zinc-800 dark:bg-zinc-950">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold">Program de Lucru Săptămânal</CardTitle>
                    <CardDescription className="text-[11px]">
                      Selectează zilele active de lucru și stabilește intervalul orar în care ești disponibil.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {availabilities.map((av, index) => (
                      <div
                        key={av.dayOfWeek}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0 dark:border-zinc-800"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={av.isActive}
                            onChange={() => toggleDayActive(index)}
                            id={`day-${av.dayOfWeek}`}
                            className="h-4 w-4 rounded border-secondary/50 text-primary focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                          />
                          <label
                            htmlFor={`day-${av.dayOfWeek}`}
                            className={`text-xs font-bold select-none ${
                              av.isActive ? "text-foreground dark:text-zinc-200" : "text-accent/80 dark:text-zinc-600"
                            }`}
                          >
                            {WEEKDAYS[av.dayOfWeek]}
                          </label>
                        </div>

                        {av.isActive ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={av.startTime}
                              onChange={(e) => updateDayTime(index, "startTime", e.target.value)}
                              className="h-8 w-28 text-xs border-border focus-visible:ring-primary dark:border-zinc-800"
                            />
                            <span className="text-accent/80 text-xs">la</span>
                            <Input
                              type="time"
                              value={av.endTime}
                              onChange={(e) => updateDayTime(index, "endTime", e.target.value)}
                              className="h-8 w-28 text-xs border-border focus-visible:ring-primary dark:border-zinc-800"
                            />
                          </div>
                        ) : (
                          <span className="text-[11px] text-accent/80 italic dark:text-zinc-600 py-1.5">
                            Nelucrător / Indisponibil
                          </span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* General Settings */}
                <Card className="border-border dark:border-zinc-800 dark:bg-zinc-950">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold">Parametri Calendar</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">
                        Durată Slot Apel (minute)
                      </label>
                      <Input
                        type="number"
                        value={settings.slotDuration}
                        onChange={(e) => setSettings(prev => ({ ...prev, slotDuration: Number(e.target.value) }))}
                        className="h-9 text-xs border-border dark:border-zinc-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">
                        Timp de repaus / Buffer (minute)
                      </label>
                      <Input
                        type="number"
                        value={settings.bufferTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, bufferTime: Number(e.target.value) }))}
                        className="h-9 text-xs border-border dark:border-zinc-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">
                        Interval Minim Notificare (ore)
                      </label>
                      <Input
                        type="number"
                        value={settings.noticePeriod}
                        onChange={(e) => setSettings(prev => ({ ...prev, noticePeriod: Number(e.target.value) }))}
                        className="h-9 text-xs border-border dark:border-zinc-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">
                        Zile Maxim Înainte Rezervări
                      </label>
                      <Input
                        type="number"
                        value={settings.maxDaysAhead}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxDaysAhead: Number(e.target.value) }))}
                        className="h-9 text-xs border-border dark:border-zinc-800"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={submittingSettings}
                    className="bg-primary text-foreground hover:bg-indigo-500 px-6 font-bold"
                  >
                    {submittingSettings ? "Se salvează..." : "Salvează Configurările"}
                  </Button>
                </div>
              </div>

              {/* Blocked Dates Management */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-border dark:border-zinc-800 dark:bg-zinc-950">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold">Blochează Zile Speciale</CardTitle>
                    <CardDescription className="text-[11px]">
                      Blochează complet date de concediu sau sărbători legale.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Input
                        type="date"
                        value={newBlockedDate}
                        onChange={(e) => setNewBlockedDate(e.target.value)}
                        className="h-9 text-xs border-border dark:border-zinc-800"
                      />
                      <Input
                        type="text"
                        placeholder="Motiv (ex: Concediu, Crăciun)"
                        value={newBlockedReason}
                        onChange={(e) => setNewBlockedReason(e.target.value)}
                        className="h-9 text-xs border-border dark:border-zinc-800"
                      />
                      <Button
                        onClick={addBlockedDate}
                        variant="secondary"
                        className="h-9 text-xs font-bold"
                      >
                        <Plus className="mr-1 size-3.5" />
                        Adaugă Dată Blocată
                      </Button>
                    </div>

                    <hr className="border-border dark:border-zinc-850" />

                    <h4 className="text-xs font-bold text-muted-foreground dark:text-zinc-400">
                      Zile Blocate Înregistrate
                    </h4>

                    {blockedDates.length === 0 ? (
                      <p className="text-[11px] text-accent/80 italic dark:text-zinc-600">
                        Nu sunt date blocate înregistrate.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {blockedDates.map((item, index) => {
                          const dateOnly = typeof item.date === 'string' ? item.date.split('T')[0] : format(new Date(item.date), "yyyy-MM-dd");
                          const dateObj = parseISO(dateOnly);
                          const dateStr = format(dateObj, "dd MMM yyyy", { locale: ro });
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-lg bg-background px-3 py-2 border border-border dark:bg-zinc-900/30 dark:border-zinc-800"
                            >
                              <div>
                                <span className="text-xs font-bold text-foreground dark:text-zinc-200">{dateStr}</span>
                                {item.reason && (
                                  <span className="text-[10px] block text-accent/80 dark:text-zinc-500">
                                    {item.reason}
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeBlockedDate(index)}
                                className="h-7 w-7 p-0 text-accent/80 hover:text-rose-500"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {loadingAnalytics || !analyticsData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-background rounded-xl dark:bg-zinc-900" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Status Metric Blocks */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-border dark:border-zinc-800 dark:bg-zinc-950">
                      <CardHeader className="p-4 pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-accent/80">Total Solicitări</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <span className="text-2xl font-bold text-foreground dark:text-zinc-50">
                          {analyticsData.metrics.total}
                        </span>
                      </CardContent>
                    </Card>
                    <Card className="border-border dark:border-zinc-800 dark:bg-zinc-950">
                      <CardHeader className="p-4 pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-accent/80">În așteptare</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <span className="text-2xl font-bold text-amber-500">
                          {analyticsData.metrics.pending}
                        </span>
                      </CardContent>
                    </Card>
                    <Card className="border-border dark:border-zinc-800 dark:bg-zinc-950">
                      <CardHeader className="p-4 pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-accent/80">Confirmate</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <span className="text-2xl font-bold text-emerald-500">
                          {analyticsData.metrics.approved}
                        </span>
                      </CardContent>
                    </Card>
                    <Card className="border-border dark:border-zinc-800 dark:bg-zinc-950">
                      <CardHeader className="p-4 pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-accent/80">Anulate / Respinse</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <span className="text-2xl font-bold text-rose-500">
                          {analyticsData.metrics.cancelled}
                        </span>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Volume Chart */}
                  <Card className="border-border dark:border-zinc-800 dark:bg-zinc-950">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Volum Programări (Ultimele 14 Zile)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-64 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                fontSize: "11px"
                              }}
                            />
                            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} name="Număr apeluri" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reschedule Modal Dialog */}
      <AnimatePresence>
        {reschedulingApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-border bg-secondary/10 backdrop-blur-md p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between border-b border-border pb-4 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-foreground dark:text-zinc-50">
                  Reprogramează Apelul cu {reschedulingApp.name}
                </h3>
                <button
                  onClick={() => setReschedulingApp(null)}
                  className="rounded-lg p-1 text-accent/80 hover:bg-background hover:text-muted-foreground dark:hover:bg-zinc-900"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">
                    Alege Noua Dată
                  </label>
                  <Input
                    required
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="h-10 text-xs border-border dark:border-zinc-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">
                    Alege Noua Oră
                  </label>
                  <Input
                    required
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="h-10 text-xs border-border dark:border-zinc-800"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-border mt-6 dark:border-zinc-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setReschedulingApp(null)}
                    className="h-10 text-xs font-bold"
                  >
                    Renunță
                  </Button>
                  <Button
                    type="submit"
                    className="h-10 bg-primary hover:bg-indigo-500 text-foreground text-xs font-bold px-4"
                  >
                    Confirmă Reprogramarea
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
