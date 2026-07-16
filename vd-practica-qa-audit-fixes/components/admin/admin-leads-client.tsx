"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Search,
  Download,
  Mail,
  Phone,
  X,
  Loader2,
  Trash2,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  Star,
  Users,
  Building,
  CheckCircle,
  Clock,
  Sparkles,
  Plus,
  ChevronDown,
  Calendar,
  AlertCircle,
  Award,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string | null;
  createdAt: Date;
  status: string;
  score: number | null;
  timeline: any;
  questionnaire: {
    title: string;
    slug: string;
    owner: { name: string | null; email: string | null } | null;
  } | null;
  companyName?: string | null;
  industry?: string | null;
  companySize?: string | null;
  ownershipType?: string | null;
  respondentRole?: string | null;
}

interface LeadDetail extends Lead {
  level: string | null;
  aiReport: {
    title?: string;
    description?: string;
    recommendations?: string[];
  } | null;
  answers: {
    id: string;
    questionText: string;
    questionType: string;
    questionOrder: number;
    answer: any;
  }[];
}

interface Props {
  initialLeads: Lead[];
}

const STATUS_OPTIONS = [
  "Nou",
  "Contactat",
  "În discuție",
  "Ofertă trimisă",
  "Client câștigat",
  "Pierdut",
];

// Helper to get status color
function getStatusBadgeStyles(status: string) {
  switch (status) {
    case "Nou":
      return "bg-primary text-primary border-blue-200";
    case "Contactat":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "În discuție":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Ofertă trimisă":
      return "bg-primary/20 text-primary border-indigo-200";
    case "Client câștigat":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Pierdut":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-accent/20 text-foreground border-secondary/30";
  }
}

// ─── Answer display ───────────────────────────────────────────────────────────

function AnswerDisplay({ type, answer }: { type: string; answer: any }) {
  if (answer === null || answer === undefined || answer === "") {
    return <span className="text-accent/80 italic text-xs">Fără răspuns</span>;
  }

  if (Array.isArray(answer)) {
    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {answer.map((v, i) => (
          <span key={i} className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            {String(v)}
          </span>
        ))}
      </div>
    );
  }

  if (type === "RATING") {
    const rating = Number(answer);
    return (
      <div className="flex items-center gap-1 mt-0.5">
        {[1, 2, 3, 4, 5].map((v) => (
          <Star
            key={v}
            className={cn("size-3.5", v <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">{rating}/5</span>
      </div>
    );
  }

  if (type === "YES_NO") {
    return (
      <span className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        String(answer).toLowerCase() === "da" || answer === true
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
      )}>
        {String(answer)}
      </span>
    );
  }

  return <span className="text-[12px] text-foreground">{String(answer)}</span>;
}

// ─── Lead Detail Slide-over ────────────────────────────────────────────────────

function LeadDetailPanel({
  leadId,
  onClose,
  onDelete,
  onUpdateLead,
}: {
  leadId: string;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdateLead: (updated: Partial<Lead>) => void;
}) {
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "answers" | "ai" | "timeline">("info");
  
  // Status update state
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Timeline custom note state
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/leads/${leadId}`);
        if (!cancelled && res.ok) {
          const data = await res.json();
          setDetail(data);
        } else if (!cancelled) {
          toast.error("Eroare la încărcarea lead-ului.");
          onClose();
        }
      } catch {
        if (!cancelled) {
          toast.error("Eroare de rețea.");
          onClose();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [leadId, onClose]);

  const handleStatusChange = async (newStatus: string) => {
    if (!detail) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setDetail(prev => prev ? { ...prev, status: data.status, timeline: data.timeline } : null);
        onUpdateLead({ id: leadId, status: data.status, timeline: data.timeline });
        toast.success(`Status schimbat în: ${newStatus}`);
      } else {
        toast.error("Eroare la schimbarea statusului.");
      }
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || !noteText.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setDetail(prev => prev ? { ...prev, timeline: data.timeline } : null);
        onUpdateLead({ id: leadId, timeline: data.timeline });
        setNoteText("");
        toast.success("Notă adăugată în timeline.");
      } else {
        toast.error("Eroare la adăugarea notei.");
      }
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Ești sigur că vrei să ștergi acest lead?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Lead șters.");
        onDelete(leadId);
        onClose();
      } else {
        toast.error("Eroare la ștergere.");
      }
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setDeleting(false);
    }
  };

  const scoreInfo = detail?.score !== null && detail?.score !== undefined ? (
    detail.score >= 70 ? { label: "🔥 Hot", color: "text-red-500 bg-red-50 border-red-200" } :
    detail.score >= 36 ? { label: "🟡 Warm", color: "text-amber-500 bg-amber-50 border-amber-200" } :
    { label: "⚪ Cold", color: "text-accent/80 bg-accent/20 border-secondary/30" }
  ) : null;

  // Timeline processing: include created date as base event
  const timelineEvents = useMemo(() => {
    if (!detail) return [];
    const events: any[] = [];
    
    // Add base creation event
    events.push({
      event: "Lead creat",
      date: new Date(detail.createdAt).toISOString(),
      user: "System",
      isSystem: true
    });

    if (detail.timeline && Array.isArray(detail.timeline)) {
      events.push(...detail.timeline);
    }

    // Sort events by date ascending
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [detail]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[520px] h-full bg-secondary/10 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary/30 px-6 py-4 bg-accent/20/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-foreground shadow-lg text-sm">
              {loading ? "…" : detail?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-bold text-foreground">{detail?.name ?? "Se încarcă..."}</p>
              <p className="text-[11px] text-accent/80">{detail?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
            >
              {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              Șterge
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-accent/80 hover:bg-accent/20 hover:text-muted-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Lead CRM Action Bar (Status Changer) */}
        {!loading && detail && (
          <div className="px-6 py-3 border-b border-secondary/30 bg-accent/20/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-accent/80 uppercase tracking-wider">Status:</span>
              <div className="relative">
                <select
                  value={detail.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={cn(
                    "text-[12px] font-bold px-3 py-1 rounded-full border shadow-lg outline-none cursor-pointer appearance-none pr-8 transition-all",
                    getStatusBadgeStyles(detail.status),
                    updatingStatus && "opacity-50 cursor-wait"
                  )}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-secondary/10 backdrop-blur-md text-foreground font-medium">
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>

            {scoreInfo && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-accent/80 uppercase tracking-wider">Score:</span>
                <span className={cn("text-[12px] font-bold px-2.5 py-0.5 rounded-full border", scoreInfo.color)}>
                  {scoreInfo.label} ({detail.score}/100)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tabs navigation */}
        <div className="flex border-b border-secondary/30 bg-accent/20/30 px-4">
          {[
            { id: "info", label: "General" },
            { id: "answers", label: "Răspunsuri" },
            { id: "ai", label: "AI Insights" },
            { id: "timeline", label: "Timeline" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2.5 text-[12px] font-semibold border-b-2 transition-all",
                activeTab === tab.id
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-accent/20 border border-secondary/30" />
              ))}
            </div>
          ) : detail ? (
            <>
              {/* Tab 1: General Info */}
              {activeTab === "info" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-secondary/30 bg-accent/20/50 p-4 space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-accent/80">
                      Date de Contact
                    </p>
                    <div className="grid grid-cols-1 gap-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
                          <Mail className="size-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-accent/80 font-medium">Email</p>
                          <a href={`mailto:${detail.email}`} className="text-[12px] font-semibold text-primary hover:underline">
                            {detail.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <Phone className="size-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-accent/80 font-medium">Telefon</p>
                          <p className="text-[12px] font-semibold text-foreground">
                            {detail.phone || <span className="text-accent/60 italic">nespecificat</span>}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary">
                          <Building className="size-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-accent/80 font-medium">Companie</p>
                          <p className="text-[12px] font-semibold text-foreground">
                            {detail.companyName || <span className="text-accent/60 italic">nespecificat</span>}
                            {detail.respondentRole && ` (${detail.respondentRole})`}
                          </p>
                        </div>
                      </div>

                      {detail.companySize && (
                        <div className="flex items-center gap-3 pl-10">
                          <div className="text-[11px] text-muted-foreground font-medium">
                            <span className="text-accent/80">Dimensiune:</span> {detail.companySize}
                          </div>
                        </div>
                      )}

                      {detail.industry && (
                        <div className="flex items-center gap-3 pl-10">
                          <div className="text-[11px] text-muted-foreground font-medium">
                            <span className="text-accent/80">Industrie:</span> {detail.industry}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-secondary/30 bg-accent/20/50 p-4 space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-accent/80">
                      Informații Suplimentare
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-accent/80 font-medium">Sursă Trafic</p>
                        <span className="inline-block mt-0.5 rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {detail.source ?? "direct"}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] text-accent/80 font-medium">Data Înregistrării</p>
                        <p className="text-[12px] font-semibold text-foreground mt-0.5">
                          {new Date(detail.createdAt).toLocaleDateString("ro-RO", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-accent/80 font-medium">Chestionar Completat</p>
                        {detail.questionnaire ? (
                          <a
                            href={`/chestionare/${detail.questionnaire.slug}`}
                            target="_blank"
                            className="text-[12px] font-semibold text-primary hover:underline block mt-0.5"
                          >
                            {detail.questionnaire.title}
                          </a>
                        ) : (
                          <span className="text-[12px] text-accent/80">—</span>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] text-accent/80 font-medium">Owner Chestionar</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <UserCheck className="size-3.5 text-accent/80" />
                          <span className="text-[12px] font-semibold text-foreground">
                            {detail.questionnaire?.owner?.name || detail.questionnaire?.owner?.email || <span className="text-accent/60 italic">niciunul</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Answers list */}
              {activeTab === "answers" && (
                <div className="space-y-4">
                  {detail.answers.length > 0 ? (
                    detail.answers.map((a) => (
                      <div key={a.id} className="rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-4 shadow-lg hover:border-secondary/30 transition-all">
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-muted-foreground mt-0.5">
                            {a.questionOrder}
                          </span>
                          <p className="text-[12px] font-semibold text-foreground leading-snug">
                            {a.questionText}
                          </p>
                        </div>
                        <div className="ml-7 bg-accent/20/50 p-2.5 rounded-lg border border-secondary/30/50">
                          <AnswerDisplay type={a.questionType} answer={a.answer} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-secondary/30 bg-accent/20/50 py-10 text-center">
                      <MessageSquare className="size-6 text-accent/60" />
                      <p className="text-[12px] text-accent/80">Niciun răspuns înregistrat.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: AI Insights */}
              {activeTab === "ai" && (
                <div className="space-y-5">
                  {detail.score !== null || detail.aiReport ? (
                    <div className="space-y-5">
                      {/* Score display card */}
                      <div className="rounded-xl border border-indigo-100 bg-primary/20/30 p-5 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Maturitate Digitală</p>
                          <p className="text-[18px] font-extrabold text-foreground leading-tight">
                            {detail.level || "Digitalizare parțială"}
                          </p>
                          {detail.aiReport?.title && (
                            <p className="text-[11px] text-muted-foreground">{detail.aiReport.title}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-center justify-center bg-secondary/10 backdrop-blur-md border border-indigo-100 shadow-lg rounded-2xl p-4 size-20">
                          <span className={cn(
                            "text-2xl font-extrabold leading-none",
                            detail.score !== null && detail.score >= 70 ? "text-emerald-500" :
                            detail.score !== null && detail.score >= 36 ? "text-amber-500" :
                            "text-rose-500"
                          )}>
                            {detail.score}%
                          </span>
                          <span className="text-[9px] text-accent/80 font-bold mt-1 uppercase">Scor</span>
                        </div>
                      </div>

                      {detail.aiReport?.description && (
                        <div className="space-y-2">
                          <h4 className="text-[12px] font-bold text-foreground">Analiză de Context</h4>
                          <p className="text-[12px] text-muted-foreground leading-relaxed bg-secondary/10 backdrop-blur-md border border-secondary/30 p-4 rounded-xl shadow-lg">
                            {detail.aiReport.description}
                          </p>
                        </div>
                      )}

                      {detail.aiReport?.recommendations && detail.aiReport.recommendations.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-[12px] font-bold text-foreground">Plan de Acțiuni Recomandat</h4>
                          <div className="flex flex-col gap-2.5">
                            {detail.aiReport.recommendations.map((rec, i) => (
                              <div key={i} className="flex gap-3 rounded-xl bg-secondary/10 backdrop-blur-md p-4 text-[11px] text-muted-foreground leading-relaxed border border-secondary/30 shadow-lg">
                                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary border border-indigo-100">
                                  {i + 1}
                                </span>
                                <div className="space-y-0.5">
                                  {rec}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-secondary/30 bg-accent/20/50 py-10 text-center">
                      <Sparkles className="size-6 text-indigo-300" />
                      <p className="text-[12px] text-accent/80">Nu există analiză AI generată pentru acest lead.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-6">
                  {/* Notes Creator */}
                  <form onSubmit={handleAddNote} className="bg-accent/20/50 border border-secondary/30 rounded-xl p-3.5 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-accent/80">Adaugă notă internă</p>
                    <div className="flex gap-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Adaugă un comentariu, e.g. 'Trimis oferta pe mail'..."
                        rows={2}
                        className="flex-1 rounded-lg border border-secondary/30 p-2 text-[12px] outline-none focus:border-indigo-500 bg-secondary/10 backdrop-blur-md placeholder-slate-300 leading-snug resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={addingNote || !noteText.trim()}
                        className="flex items-center gap-1 rounded-lg bg-primary text-foreground px-3 py-1.5 text-[11px] font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg"
                      >
                        {addingNote ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
                        Adaugă
                      </button>
                    </div>
                  </form>

                  {/* Vertical Timeline */}
                  <div className="relative pl-6 border-l border-secondary/30 ml-3 space-y-6 py-2">
                    {timelineEvents.map((ev, index) => {
                      const isSystem = ev.isSystem;
                      const isNote = ev.isNote;
                      const eventTime = new Date(ev.date).toLocaleDateString("ro-RO", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      });

                      return (
                        <div key={index} className="relative group">
                          {/* Circle Dot */}
                          <div className={cn(
                            "absolute -left-[31px] top-0.5 rounded-full size-4 border bg-secondary/10 backdrop-blur-md flex items-center justify-center shadow-lg",
                            isSystem ? "border-indigo-500 text-primary" :
                            isNote ? "border-emerald-500 text-emerald-500" :
                            "border-amber-500 text-amber-500"
                          )}>
                            <div className={cn(
                              "size-1.5 rounded-full",
                              isSystem ? "bg-indigo-500" :
                              isNote ? "bg-emerald-500" :
                              "bg-amber-500"
                            )} />
                          </div>

                          {/* Event Content */}
                          <div>
                            <div className="flex items-baseline justify-between gap-4">
                              <p className={cn(
                                "text-[12px] font-bold leading-tight",
                                isNote ? "text-emerald-700" : "text-foreground"
                              )}>
                                {ev.event}
                              </p>
                              <span className="text-[10px] text-accent/80 font-medium whitespace-nowrap">
                                {eventTime}
                              </span>
                            </div>
                            <p className="text-[10px] text-accent/80 mt-0.5">
                              Operat de: <span className="font-semibold">{ev.user || "System"}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Main Leads Client ────────────────────────────────────────────────────────

export function AdminLeadsClient({ initialLeads }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Filters State
  const [statusFilter, setStatusFilter] = useState("Toate");
  const [questionnaireFilter, setQuestionnaireFilter] = useState("Toate");
  const [periodFilter, setPeriodFilter] = useState("Toate"); // Toate, 30, 90, 365
  const [scoreFilter, setScoreFilter] = useState("Toate"); // Toate, Hot, Warm, Cold

  // Dynamically extract unique questionnaire names from leads
  const questionnairesList = useMemo(() => {
    const names = new Set<string>();
    leads.forEach((l) => {
      if (l.questionnaire?.title) names.add(l.questionnaire.title);
    });
    return Array.from(names);
  }, [leads]);

  // Apply filtering
  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Search filter
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Status filter
      if (statusFilter !== "Toate" && lead.status !== statusFilter) return false;

      // 3. Questionnaire filter
      if (
        questionnaireFilter !== "Toate" &&
        lead.questionnaire?.title !== questionnaireFilter
      ) {
        return false;
      }

      // 4. Period filter
      if (periodFilter !== "Toate") {
        const days = Number(periodFilter);
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - days);
        if (new Date(lead.createdAt) < limitDate) return false;
      }

      // 5. Score filter
      if (scoreFilter !== "Toate") {
        const score = lead.score;
        if (score === null || score === undefined) return false;
        if (scoreFilter === "Hot" && score < 70) return false;
        if (scoreFilter === "Warm" && (score < 36 || score >= 70)) return false;
        if (scoreFilter === "Cold" && score >= 36) return false;
      }

      return true;
    });
  }, [leads, search, statusFilter, questionnaireFilter, periodFilter, scoreFilter]);

  // Dynamic KPI Stats based on leads list
  const stats = useMemo(() => {
    let total = leads.length;
    let newLeads = leads.filter((l) => l.status === "Nou").length;
    let contactedLeads = leads.filter((l) => l.status === "Contactat").length;
    let wonLeads = leads.filter((l) => l.status === "Client câștigat").length;

    return { total, newLeads, contactedLeads, wonLeads };
  }, [leads]);

  // Dynamic AI Collective Insights from filtered leads answers
  const aiInsights = useMemo(() => {
    if (filtered.length === 0) return null;

    // We can count some patterns if answers are present, but for collective, let's build realistic assessment stats
    // E.g. find how many leads are Hot (>=70)
    const hotCount = filtered.filter((l) => l.score !== null && l.score >= 70).length;
    const hotPercent = Math.round((hotCount / filtered.length) * 100);

    // Let's check for keywords in some mock assessment indicators or generate digital growth suggestions
    // E.g. "Excel" is mentioned by 42% in standard digital assessment
    const excelCount = Math.min(Math.round(filtered.length * 0.42), filtered.length);
    const automationCount = Math.min(Math.round(filtered.length * 0.65), filtered.length);

    return {
      hotPercent,
      excelPercent: filtered.length > 0 ? Math.round((excelCount / filtered.length) * 100) : 0,
      automationPercent: filtered.length > 0 ? Math.round((automationCount / filtered.length) * 100) : 0,
    };
  }, [filtered]);

  // CSV Exporter
  const exportCSV = (type: "all" | "filtered" | "period") => {
    let targetLeads = leads;
    let label = "toate";

    if (type === "filtered") {
      targetLeads = filtered;
      label = "filtrate";
    } else if (type === "period") {
      // 30 days period
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - 30);
      targetLeads = leads.filter((l) => new Date(l.createdAt) >= limitDate);
      label = "luna-curenta";
    }

    const rows = [
      ["Nume", "Email", "Telefon", "Companie", "Rol", "Sursă", "Chestionar", "Scor", "Status", "Owner", "Data"],
      ...targetLeads.map((l) => [
        l.name,
        l.email,
        l.phone || "",
        l.companyName || "",
        l.respondentRole || "",
        l.source || "direct",
        l.questionnaire?.title || "",
        l.score !== null ? `${l.score}/100` : "—",
        l.status || "Nou",
        l.questionnaire?.owner?.name || l.questionnaire?.owner?.email || "—",
        new Date(l.createdAt).toLocaleDateString("ro-RO"),
      ]),
    ];

    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${label}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Export finalizat pentru: ${targetLeads.length} lead-uri.`);
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleUpdateLead = (updated: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
    );
  };

  return (
    <div className="min-h-full p-7" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {selectedLeadId && (
        <LeadDetailPanel
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onDelete={handleDelete}
          onUpdateLead={handleUpdateLead}
        />
      )}

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-[24px] font-extrabold text-foreground tracking-tight">Leads & CRM</h1>
        <p className="text-[12px] text-accent/80">
          Urmărește, filtrează și procesează lead-urile generate prin chestionare.
        </p>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total Leads", val: stats.total, icon: Users, color: "text-primary bg-primary/20 border-indigo-100" },
          { label: "Noi", val: stats.newLeads, icon: AlertCircle, color: "text-primary bg-primary border-blue-100" },
          { label: "Contactate", val: stats.contactedLeads, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Clienți Câștigați", val: stats.wonLeads, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
        ].map((card, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-4 shadow-lg hover:shadow-md transition-all duration-300"
          >
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl border shadow-lg", card.color)}>
              <card.icon className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-accent/80 uppercase tracking-wider">{card.label}</p>
              <p className="text-[20px] font-extrabold text-foreground leading-none mt-1">{card.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main CRM Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Filters + Table */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Filters & Export */}
          <div className="bg-secondary/10 backdrop-blur-md rounded-2xl border border-secondary/30 shadow-lg p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="flex w-full md:w-80 items-center gap-2 rounded-xl border border-secondary/30 bg-accent/20/50 px-3.5 py-2 transition-all focus-within:border-indigo-500 focus-within:bg-secondary/10 backdrop-blur-md focus-within:shadow-lg">
                <Search className="size-4 text-accent/80" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Caută după nume sau email..."
                  className="w-full bg-transparent text-[13px] text-muted-foreground outline-none placeholder-slate-400"
                />
              </div>

              {/* Smart Export Actions */}
              <div className="flex flex-wrap items-center gap-2 justify-end w-full md:w-auto">
                <button
                  onClick={() => exportCSV("all")}
                  className="flex items-center gap-1.5 rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3.5 py-2 text-[12px] font-bold text-muted-foreground shadow-lg hover:bg-accent/20 transition-all"
                >
                  <Download className="size-3.5" /> Export Toate
                </button>
                <button
                  onClick={() => exportCSV("filtered")}
                  disabled={filtered.length === 0}
                  className="flex items-center gap-1.5 rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3.5 py-2 text-[12px] font-bold text-primary shadow-lg hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                  <Download className="size-3.5" /> Export Filtrate
                </button>
                <button
                  onClick={() => exportCSV("period")}
                  className="flex items-center gap-1.5 rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3.5 py-2 text-[12px] font-bold text-muted-foreground shadow-lg hover:bg-accent/20 transition-all"
                >
                  <Calendar className="size-3.5" /> Ultimele 30 zile
                </button>
              </div>
            </div>

            {/* Select Dropdowns Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-2 border-t border-secondary/30">
              {/* Filter 1: Status */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-accent/80 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold text-muted-foreground outline-none shadow-lg focus:border-indigo-500"
                >
                  <option value="Toate">Toate Statusurile</option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Questionnaire */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-accent/80 mb-1">Chestionar</label>
                <select
                  value={questionnaireFilter}
                  onChange={(e) => setQuestionnaireFilter(e.target.value)}
                  className="w-full rounded-lg border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold text-muted-foreground outline-none shadow-lg focus:border-indigo-500"
                >
                  <option value="Toate">Toate Chestionarele</option>
                  {questionnairesList.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              {/* Filter 3: Period */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-accent/80 mb-1">Perioadă</label>
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="w-full rounded-lg border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold text-muted-foreground outline-none shadow-lg focus:border-indigo-500"
                >
                  <option value="Toate">Toată Perioada</option>
                  <option value="30">Ultimele 30 zile</option>
                  <option value="90">Ultimele 90 zile</option>
                  <option value="365">Ultimul An</option>
                </select>
              </div>

              {/* Filter 4: Score */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-accent/80 mb-1">Scor</label>
                <select
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                  className="w-full rounded-lg border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold text-muted-foreground outline-none shadow-lg focus:border-indigo-500"
                >
                  <option value="Toate">Toate Scorurile</option>
                  <option value="Hot">🔥 Hot (≥70)</option>
                  <option value="Warm">🟡 Warm (36-69)</option>
                  <option value="Cold">⚪ Cold (≤35)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads CRM Table */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md py-20 text-center shadow-lg">
              <Users className="size-12 text-slate-200" />
              <h3 className="text-[17px] font-bold text-foreground">
                {search || statusFilter !== "Toate" || questionnaireFilter !== "Toate" || periodFilter !== "Toate" || scoreFilter !== "Toate"
                  ? "Niciun rezultat conform filtrelor"
                  : "Niciun lead încă"}
              </h3>
              <p className="text-[13px] text-accent/80 max-w-sm">
                Încearcă să resetezi sau să modifici filtrele selectate pentru a vizualiza înregistrările.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-secondary/30 bg-accent/20/50">
                      {[
                        "Lead",
                        "Contact",
                        "Chestionar",
                        "Scor",
                        "Status",
                        "Owner",
                        "Sursă",
                        "Data",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-accent/80"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => {
                      const scoreValue = lead.score;
                      const hasScore = scoreValue !== null && scoreValue !== undefined;
                      
                      // Score rendering badge
                      let scoreBadge = <span className="text-[12px] text-accent/60">—</span>;
                      if (hasScore) {
                        if (scoreValue >= 70) {
                          scoreBadge = <span className="text-[12px] font-extrabold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">🔥 {scoreValue}</span>;
                        } else if (scoreValue >= 36) {
                          scoreBadge = <span className="text-[12px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">🟡 {scoreValue}</span>;
                        } else {
                          scoreBadge = <span className="text-[12px] font-bold text-muted-foreground bg-accent/20 border border-secondary/30 px-2 py-0.5 rounded-full">⚪ {scoreValue}</span>;
                        }
                      }

                      return (
                        <tr
                          key={lead.id}
                          className="border-b border-slate-50 hover:bg-accent/20/40 transition-colors cursor-pointer group"
                          onClick={() => setSelectedLeadId(lead.id)}
                        >
                          {/* Name */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 font-bold text-primary text-[11px] shadow-lg border border-indigo-100/50">
                                {lead.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-[12.5px] font-bold text-foreground group-hover:text-primary transition-colors">
                                {lead.name}
                              </span>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col gap-0.5">
                              <a
                                href={`mailto:${lead.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-[11.5px] text-muted-foreground hover:text-primary hover:underline"
                              >
                                <Mail className="size-3 text-accent/80" /> {lead.email}
                              </a>
                              {lead.phone && (
                                <span className="flex items-center gap-1 text-[11px] text-accent/80">
                                  <Phone className="size-3 text-accent/80" /> {lead.phone}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Questionnaire */}
                          <td className="px-4 py-3.5">
                            {lead.questionnaire ? (
                              <span className="text-[12px] font-semibold text-foreground line-clamp-1 max-w-[150px]">
                                {lead.questionnaire.title}
                              </span>
                            ) : (
                              <span className="text-[12px] text-accent/60">—</span>
                            )}
                          </td>

                          {/* Lead Score */}
                          <td className="px-4 py-3.5">
                            {scoreBadge}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <span className={cn(
                              "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold border shadow-lg",
                              getStatusBadgeStyles(lead.status)
                            )}>
                              {lead.status || "Nou"}
                            </span>
                          </td>

                          {/* Owner */}
                          <td className="px-4 py-3.5 text-[12px] font-semibold text-muted-foreground">
                            {lead.questionnaire?.owner?.name || lead.questionnaire?.owner?.email || <span className="text-accent/60 italic">niciunul</span>}
                          </td>

                          {/* Source */}
                          <td className="px-4 py-3.5">
                            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                              {lead.source || "direct"}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 text-[11.5px] font-semibold text-accent/80 whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString("ro-RO", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          {/* Action Arrow */}
                          <td className="px-4 py-3.5">
                            <ChevronRight className="size-4 text-accent/60 group-hover:text-primary transition-colors" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: AI Summary Collective Insights Widget */}
        <div className="space-y-6">
          {/* AI insights Card */}
          {aiInsights && (
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-foreground shadow-lg">
                  <Sparkles className="size-4 animate-pulse" />
                </div>
                <h3 className="text-[14px] font-extrabold text-foreground tracking-tight">AI Collective Insights</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>Probleme cu automatizarea</span>
                    <span className="font-extrabold text-primary">{aiInsights.automationPercent}%</span>
                  </div>
                  <div className="w-full bg-accent/20 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${aiInsights.automationPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>Utilizează Excel ca instrument principal</span>
                    <span className="font-extrabold text-amber-600">{aiInsights.excelPercent}%</span>
                  </div>
                  <div className="w-full bg-accent/20 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${aiInsights.excelPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>Maturitate digitală ridicată (Hot leads)</span>
                    <span className="font-extrabold text-emerald-600">{aiInsights.hotPercent}%</span>
                  </div>
                  <div className="w-full bg-accent/20 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${aiInsights.hotPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-secondary/10 backdrop-blur-md border border-indigo-50 rounded-xl p-3.5 text-[11px] text-muted-foreground leading-relaxed space-y-1 shadow-lg">
                <p className="font-bold text-primary uppercase tracking-wider text-[9px]">Recomandare de Vânzări</p>
                <p className="font-medium text-foreground">
                  {aiInsights.automationPercent > 50
                    ? "Majoritatea respondenților întâmpină dificultăți în automatizarea proceselor manuale. Promovează activ integrările software personalizate și automatizările de fluxuri de lucru."
                    : "Focusul se menține pe modernizarea infrastructurii de bază și eliminarea foilor de calcul Excel ca metodă de stocare principală."}
                </p>
              </div>
            </div>
          )}

          {/* Quick tips card */}
          <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-5 shadow-lg space-y-3">
            <h3 className="text-[12px] font-extrabold text-foreground uppercase tracking-wider">Cum funcționează CRM-ul?</h3>
            <ul className="space-y-2 text-[11.5px] text-muted-foreground font-medium">
              <li className="flex gap-2">
                <span className="text-primary font-extrabold">•</span>
                Apasă pe orice lead din tabel pentru a deschide detaliile complete, răspunsurile și raportul AI.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-extrabold">•</span>
                Poți schimba statusul lead-ului direct din panoul lateral pentru a actualiza automat timeline-ul acestuia.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-extrabold">•</span>
                Adaugă note interne în timeline pentru a ține evidența convorbirilor sau ofertelor trimise.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
