"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  Rocket,
  Copy,
  Link2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Type,
  AlignLeft,
  CheckSquare,
  List,
  Star,
  ToggleLeft,
  Hash,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Loader2,
  Sparkles,
  MoreVertical,
  Pin,
  PinOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AccessDenied } from "@/components/admin/access-denied";
import { AiQuestionnaireSidebar } from "./ai-questionnaire-sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionType =
  | "TEXT"
  | "TEXTAREA"
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "DROPDOWN"
  | "RATING"
  | "YES_NO"
  | "NUMERIC"
  | "EMAIL"
  | "PHONE"
  | "DATE";

interface Validations {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  regex?: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: any[] | null;
  validations: any | null;
  required: boolean;
  order: number;
}

interface Questionnaire {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string;
  isPinned?: boolean;
  category: string | null;
  estimatedMinutes: number | null;
  resultInterpretations: any | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { leads: number };
  _questionCount?: number;
  ownerId?: string | null;
  allowedRoles?: string[];
  allowedUsers?: { id: string; name: string | null; email: string | null }[];
}

interface Props {
  initialData: Questionnaire[];
  currentUser: { id: string; role: string; name?: string | null; email?: string | null };
}

// ─── Question type config ─────────────────────────────────────────────────────

const QUESTION_TYPES: { value: QuestionType; label: string; icon: React.ElementType; hasOptions: boolean }[] = [
  { value: "TEXT", label: "Text scurt", icon: Type, hasOptions: false },
  { value: "TEXTAREA", label: "Text lung", icon: AlignLeft, hasOptions: false },
  { value: "SINGLE_CHOICE", label: "Alegere unică", icon: CheckSquare, hasOptions: true },
  { value: "MULTIPLE_CHOICE", label: "Alegere multiplă", icon: List, hasOptions: true },
  { value: "DROPDOWN", label: "Dropdown", icon: ChevronDown, hasOptions: true },
  { value: "RATING", label: "Rating (1-5)", icon: Star, hasOptions: false },
  { value: "YES_NO", label: "Da / Nu", icon: ToggleLeft, hasOptions: false },
  { value: "NUMERIC", label: "Numeric", icon: Hash, hasOptions: false },
  { value: "EMAIL", label: "Email", icon: Mail, hasOptions: false },
  { value: "PHONE", label: "Telefon", icon: Phone, hasOptions: false },
  { value: "DATE", label: "Dată", icon: Calendar, hasOptions: false },
];

function getTypeConfig(type: QuestionType) {
  return QUESTION_TYPES.find((t) => t.value === type) ?? QUESTION_TYPES[0];
}

// ─── Create/Edit Modal ────────────────────────────────────────────────────────

function QuestionnaireModal({
  questionnaire,
  onClose,
  onSaved,
  currentUser,
}: {
  questionnaire?: Questionnaire | null;
  onClose: () => void;
  onSaved: (q: Questionnaire) => void;
  currentUser: { id: string; role: string; name?: string | null; email?: string | null };
}) {
  const [title, setTitle] = useState(questionnaire?.title ?? "");
  const [slug, setSlug] = useState(questionnaire?.slug ?? "");
  const [description, setDescription] = useState(questionnaire?.description ?? "");
  const [category, setCategory] = useState(questionnaire?.category ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    questionnaire?.estimatedMinutes?.toString() ?? ""
  );
  const [loading, setLoading] = useState(false);

  // Access Management States
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [allowedRoles, setAllowedRoles] = useState<string[]>(
    questionnaire?.allowedRoles ?? []
  );
  const [allowedUserIds, setAllowedUserIds] = useState<string[]>(
    questionnaire?.allowedUsers?.map((u) => u.id) ?? []
  );
  const [ownerId, setOwnerId] = useState<string>(
    questionnaire?.ownerId ?? currentUser.id
  );

  useEffect(() => {
    if (currentUser.role === "ADMIN") {
      fetch("/api/admin/team?t=" + Date.now())
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load team members");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setTeamMembers(data);
          }
        })
        .catch((err) => console.error("Error loading team:", err));
    }
  }, [currentUser.role]);

  const autoSlug = (t: string) =>
    t.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!questionnaire) setSlug(autoSlug(v));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Titlul și slug-ul sunt obligatorii.");
      return;
    }
    setLoading(true);
    try {
      const method = questionnaire ? "PATCH" : "POST";
      const url = questionnaire
        ? `/api/admin/questionnaires/${questionnaire.id}`
        : "/api/admin/questionnaires";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          category: category.trim() || null,
          estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : null,
          ...(currentUser.role === "ADMIN" && {
            allowedRoles,
            allowedUserIds,
            ownerId,
          }),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        toast.error(err || "Eroare la salvare.");
        return;
      }

      const saved = await res.json();
      toast.success(questionnaire ? "Chestionar actualizat!" : "Chestionar creat!");
      onSaved(saved);
      onClose();
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md shadow-2xl flex flex-col" style={{ maxHeight: "90vh" }}>
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-secondary/30 flex-shrink-0">
          <h2 className="text-[17px] font-bold text-foreground">
            {questionnaire ? "Editează Chestionar" : "Chestionar Nou"}
          </h2>
          <button onClick={onClose} className="text-accent/80 hover:text-muted-foreground ml-4">
            <X className="size-5" />
          </button>
        </div>
        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Titlu *</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Evaluare Maturitate Digitală"
              className="h-10 w-full rounded-lg border border-secondary/30 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Slug (URL) *</label>
            <input
              value={slug}
              onChange={(e) => setSlug(autoSlug(e.target.value))}
              placeholder="evaluare-maturitate-digitala"
              className="h-10 w-full rounded-lg border border-secondary/30 bg-accent/20 px-3 font-mono text-sm text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-[11px] text-accent/80">
              Accesibil la: /chestionare/{slug || "..."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categorie</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Digital Readiness"
                className="h-10 w-full rounded-lg border border-secondary/30 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Timp estimat (min)</label>
              <input
                type="number"
                min={1}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                placeholder="5"
                className="h-10 w-full rounded-lg border border-secondary/30 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Descriere <span className="font-normal normal-case">(opțional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Scurtă descriere..."
              className="w-full resize-none rounded-lg border border-secondary/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {currentUser.role === "ADMIN" && (
            <div className="rounded-xl border border-secondary/30 bg-accent/20/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Setări Acces (Access Management)</p>
              
              {/* Allowed Roles */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Roluri cu Acces</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={allowedRoles.includes("EDITOR")}
                      onChange={(e) => {
                        if (e.target.checked) setAllowedRoles([...allowedRoles, "EDITOR"]);
                        else setAllowedRoles(allowedRoles.filter(r => r !== "EDITOR"));
                      }}
                      className="rounded border-secondary/50 text-primary focus:ring-indigo-500"
                    />
                    <span>Toți Editorii</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={allowedRoles.includes("VIEWER")}
                      onChange={(e) => {
                        if (e.target.checked) setAllowedRoles([...allowedRoles, "VIEWER"]);
                        else setAllowedRoles(allowedRoles.filter(r => r !== "VIEWER"));
                      }}
                      className="rounded border-secondary/50 text-primary focus:ring-indigo-500"
                    />
                    <span>Toți Viewerii</span>
                  </label>
                </div>
              </div>

              {/* Allowed Users */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Membri Echipă cu Acces</label>
                <div className="max-h-36 overflow-y-auto border border-secondary/30 rounded-lg p-2.5 bg-secondary/10 backdrop-blur-md space-y-1.5">
                  {teamMembers
                    .filter(m => m.id !== currentUser.id && m.status !== "INACTIVE")
                    .map((member) => (
                      <label key={member.id} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:bg-accent/20 p-1.5 rounded transition-colors">
                        <input 
                          type="checkbox"
                          checked={allowedUserIds.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) setAllowedUserIds([...allowedUserIds, member.id]);
                            else setAllowedUserIds(allowedUserIds.filter(id => id !== member.id));
                          }}
                          className="rounded border-secondary/50 text-primary focus:ring-indigo-500"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{member.name || member.email.split("@")[0]}</span>
                          <span className="text-[10px] text-accent/80">{member.email} ({member.role})</span>
                        </div>
                      </label>
                    ))}
                  {teamMembers.filter(m => m.id !== currentUser.id && m.status !== "INACTIVE").length === 0 && (
                    <p className="text-[11px] text-accent/80 italic p-2 text-center">Nu există alți membri activi în echipă.</p>
                  )}
                </div>
              </div>

              {/* Owner Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Deținător Chestionar (Owner)</label>
                <select 
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="h-9 w-full rounded-lg border border-secondary/30 px-3 text-xs text-foreground bg-secondary/10 backdrop-blur-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {teamMembers
                    .filter(m => (m.role === "ADMIN" || m.role === "EDITOR") && m.status !== "INACTIVE")
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name || m.email.split("@")[0]} ({m.email} - {m.role})
                      </option>
                    ))}
                  {/* Ensure current owner is listed if not in teamMembers */}
                  {!teamMembers.some(m => m.id === ownerId) && (
                    <option value={ownerId}>Deținător Curent</option>
                  )}
                </select>
              </div>
            </div>
          )}
        </div>
        </div>
        {/* Sticky Footer */}
        <div className="px-6 py-4 border-t border-secondary/30 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Se salvează..." : questionnaire ? "Salvează Modificările" : "Crează Chestionar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Question Editor Panel ─────────────────────────────────────────────────────

function QuestionEditor({
  question,
  onChange,
  onDelete,
}: {
  question: Question;
  onChange: (updated: Question) => void;
  onDelete: () => void;
}) {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const typeConfig = getTypeConfig(question.type);

  const updateField = (field: keyof Question, value: any) => {
    onChange({ ...question, [field]: value });
  };

  const addOption = () => {
    const opts = question.options ?? [];
    onChange({ ...question, options: [...opts, `Opțiunea ${opts.length + 1}`] });
  };

  const updateOption = (idx: number, val: string) => {
    const opts = [...(question.options ?? [])];
    const isObj = typeof opts[idx] === "object" && opts[idx] !== null;
    opts[idx] = isObj ? { ...opts[idx], label: val } : val;
    onChange({ ...question, options: opts });
  };

  const updateOptionScore = (idx: number, score: number) => {
    const opts = [...(question.options ?? [])];
    const current = opts[idx];
    const label = typeof current === "object" && current !== null ? current.label : current;
    opts[idx] = { label, value: score };
    onChange({ ...question, options: opts });
  };

  const removeOption = (idx: number) => {
    const opts = (question.options ?? []).filter((_, i) => i !== idx);
    onChange({ ...question, options: opts });
  };

  const moveOption = (idx: number, dir: -1 | 1) => {
    const opts = [...(question.options ?? [])];
    const swap = idx + dir;
    if (swap < 0 || swap >= opts.length) return;
    [opts[idx], opts[swap]] = [opts[swap], opts[idx]];
    onChange({ ...question, options: opts });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Type selector */}
      <div className="relative">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tip întrebare</label>
        <button
          onClick={() => setShowTypeMenu((v) => !v)}
          className="flex h-10 w-full items-center justify-between rounded-lg border border-secondary/30 bg-accent/20 px-3 text-sm text-foreground hover:border-indigo-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            <typeConfig.icon className="size-4 text-primary" />
            {typeConfig.label}
          </span>
          <ChevronDown className="size-4 text-accent/80" />
        </button>
        {showTypeMenu && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md shadow-xl">
            <div className="grid grid-cols-2 gap-0.5 p-2">
              {QUESTION_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => {
                      updateField("type", t.value);
                      if (!t.hasOptions) updateField("options", null);
                      else if (!question.options?.length)
                        onChange({ ...question, type: t.value, options: ["Opțiunea 1", "Opțiunea 2"] });
                      setShowTypeMenu(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors",
                      question.type === t.value
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:bg-accent/20"
                    )}
                  >
                    <Icon className="size-3.5 flex-shrink-0" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Question text */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Textul întrebării *</label>
        <textarea
          value={question.text}
          onChange={(e) => updateField("text", e.target.value)}
          rows={2}
          placeholder="Scrie întrebarea ta..."
          className="w-full resize-none rounded-lg border border-secondary/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Category for Radar Chart */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Categorie Radar Chart <span className="font-normal normal-case">(pt. rezultate)</span>
        </label>
        <input
          value={question.validations?.category ?? ""}
          onChange={(e) =>
            onChange({
              ...question,
              validations: {
                ...question.validations,
                category: e.target.value,
              },
            })
          }
          placeholder="Ex: Recrutare, Evaluare..."
          className="h-10 w-full rounded-lg border border-secondary/30 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Options (for choice types) */}
      {typeConfig.hasOptions && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Opțiuni de răspuns
          </label>
          <div className="flex flex-col gap-1.5">
            {(question.options ?? []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveOption(idx, -1)}
                    disabled={idx === 0}
                    className="p-0.5 text-accent/60 hover:text-muted-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="size-3" />
                  </button>
                  <button
                    onClick={() => moveOption(idx, 1)}
                    disabled={idx === (question.options?.length ?? 0) - 1}
                    className="p-0.5 text-accent/60 hover:text-muted-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="size-3" />
                  </button>
                </div>
                <input
                  value={typeof opt === "object" && opt !== null ? opt.label : opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Opțiunea ${idx + 1}`}
                  className="flex-1 h-8 rounded-md border border-secondary/30 px-2.5 text-xs text-foreground outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/20"
                />
                <input
                  type="number"
                  placeholder="Scor"
                  value={typeof opt === "object" && opt !== null ? opt.value : ""}
                  onChange={(e) => updateOptionScore(idx, parseFloat(e.target.value) || 0)}
                  className="w-16 h-8 rounded-md border border-secondary/30 px-2 text-xs text-foreground outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/20"
                  title="Punctaj (pentru Radar Chart)"
                />
                <button
                  onClick={() => removeOption(idx)}
                  className="p-1 text-accent/60 hover:text-red-500 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary transition-colors"
            >
              <Plus className="size-3.5" /> Adaugă opțiune
            </button>
          </div>
        </div>
      )}

      {/* Validations */}
      <div className="rounded-lg border border-secondary/30 bg-accent/20 p-3">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-accent/80">Validări</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => updateField("required", e.target.checked)}
              className="rounded border-secondary/50 text-primary focus:ring-indigo-500"
            />
            <span className="text-xs text-foreground">Câmp obligatoriu</span>
          </label>
          {(question.type === "TEXT" || question.type === "TEXTAREA") && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">Lungime min.</label>
                <input
                  type="number"
                  min={0}
                  value={question.validations?.minLength ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...question,
                      validations: {
                        ...question.validations,
                        minLength: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="h-7 w-full rounded border border-secondary/30 px-2 text-xs outline-none focus:border-primary/80"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">Lungime max.</label>
                <input
                  type="number"
                  min={0}
                  value={question.validations?.maxLength ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...question,
                      validations: {
                        ...question.validations,
                        maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="h-7 w-full rounded border border-secondary/30 px-2 text-xs outline-none focus:border-primary/80"
                />
              </div>
            </div>
          )}
          {question.type === "NUMERIC" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">Valoare min.</label>
                <input
                  type="number"
                  value={question.validations?.minValue ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...question,
                      validations: {
                        ...question.validations,
                        minValue: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="h-7 w-full rounded border border-secondary/30 px-2 text-xs outline-none focus:border-primary/80"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">Valoare max.</label>
                <input
                  type="number"
                  value={question.validations?.maxValue ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...question,
                      validations: {
                        ...question.validations,
                        maxValue: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="h-7 w-full rounded border border-secondary/30 px-2 text-xs outline-none focus:border-primary/80"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
      >
        <Trash2 className="size-3.5" /> Șterge întrebarea
      </button>
    </div>
  );
}

// ─── Question Builder (full page view) ────────────────────────────────────────

function QuestionnaireBuilder({
  questionnaire,
  onBack,
}: {
  questionnaire: Questionnaire;
  onBack: () => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [addTypeMenuOpen, setAddTypeMenuOpen] = useState(false);
  const [showAiSidebar, setShowAiSidebar] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const counterRef = useRef(0);
  const newId = () => `new_${Date.now()}_${counterRef.current++}`;

  // Load questions on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/questionnaires/${questionnaire.id}/questions`);
        if (res.status === 401 || res.status === 403) {
          if (!cancelled) setAccessDenied(true);
          return;
        }
        if (!cancelled && res.ok) {
          const data = await res.json();
          setQuestions(data);
          if (data.length > 0) setSelectedIdx(0);
        }
      } catch {
        if (!cancelled) toast.error("Eroare la încărcarea întrebărilor.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [questionnaire.id]);

  const addQuestion = (type: QuestionType) => {
    const typeConf = getTypeConfig(type);
    const newQ: Question = {
      id: newId(),
      type,
      text: "",
      options: typeConf.hasOptions ? ["Opțiunea 1", "Opțiunea 2"] : null,
      validations: null,
      required: false,
      order: questions.length,
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    setSelectedIdx(updated.length - 1);
    setDirty(true);
    setAddTypeMenuOpen(false);
  };

  const updateQuestion = useCallback((idx: number, updated: Question) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
    setDirty(true);
  }, []);

  const deleteQuestion = (idx: number) => {
    setQuestions((prev) => {
      const next = prev.filter((_, i) => i !== idx).map((q, i) => ({ ...q, order: i }));
      return next;
    });
    setSelectedIdx((prev) => {
      if (prev === null) return null;
      if (prev >= idx) return Math.max(0, prev - 1);
      return prev;
    });
    setDirty(true);
  };

  const moveQuestion = (from: number, to: number) => {
    if (to < 0 || to >= questions.length) return;
    const updated = [...questions];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    const reordered = updated.map((q, i) => ({ ...q, order: i }));
    setQuestions(reordered);
    setSelectedIdx(to);
    setDirty(true);
  };

  const handleSave = async () => {
    // Validate
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        toast.error(`Întrebarea #${i + 1} nu are text.`);
        setSelectedIdx(i);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/questionnaires/${questionnaire.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      if (!res.ok) {
        toast.error("Eroare la salvare.");
        return;
      }

      const saved = await res.json();
      setQuestions(saved.map((q: any) => ({
        ...q,
        options: q.options ?? null,
        validations: q.validations ?? null,
      })));
      setDirty(false);
      toast.success("Întrebările au fost salvate!");
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setSaving(false);
    }
  };

  if (accessDenied) {
    return <AccessDenied />;
  }

  return (
    <div className="flex h-full flex-col" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-secondary/30 bg-secondary/10 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" /> Înapoi
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <h1 className="text-[15px] font-bold text-foreground">{questionnaire.title}</h1>
            <p className="text-[11px] text-accent/80">
              {questions.length} {questions.length === 1 ? "întrebare" : "întrebări"}
              {dirty && <span className="ml-2 text-amber-500">● Nesalvat</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiSidebar(!showAiSidebar)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-bold transition-colors",
              showAiSidebar 
                ? "border-indigo-200 bg-primary/20 text-primary shadow-lg" 
                : "border-secondary/30 bg-secondary/10 backdrop-blur-md text-muted-foreground hover:bg-accent/20"
            )}
          >
            <Sparkles className="size-3.5" /> AI Assistant
          </button>
          <a
            href={`/chestionare/${questionnaire.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-2 text-[12px] font-medium text-muted-foreground hover:bg-accent/20 transition-colors"
          >
            <Eye className="size-3.5" /> Previzualizare
          </a>
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[12px] font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            {saving ? "Se salvează..." : "Salvează"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Questions list */}
        <div className="flex w-[280px] flex-shrink-0 flex-col border-r border-secondary/30 bg-accent/20">
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-200" />
                ))}
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <div className="text-3xl">📝</div>
                <p className="text-[12px] font-medium text-muted-foreground">Nicio întrebare încă</p>
                <p className="text-[11px] text-accent/80">Adaugă prima întrebare mai jos</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {questions.map((q, idx) => {
                  const typeConf = getTypeConfig(q.type);
                  const Icon = typeConf.icon;
                  return (
                    <div
                      key={q.id}
                      onClick={() => setSelectedIdx(idx)}
                      draggable
                      onDragStart={() => setDragIdx(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIdx !== null && dragIdx !== idx) {
                          moveQuestion(dragIdx, idx);
                        }
                        setDragIdx(null);
                      }}
                      className={cn(
                        "group flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-all",
                        selectedIdx === idx
                          ? "border-indigo-200 bg-secondary/10 backdrop-blur-md shadow-lg"
                          : "border-transparent hover:border-secondary/30 hover:bg-secondary/10 backdrop-blur-md"
                      )}
                    >
                      <GripVertical className="mt-0.5 size-3.5 flex-shrink-0 text-accent/60 cursor-grab" />
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-primary/20">
                        <Icon className="size-3 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          "line-clamp-2 text-[12px] leading-tight",
                          q.text ? "font-medium text-foreground" : "text-accent/80 italic"
                        )}>
                          {q.text || "Întrebare fără text..."}
                        </p>
                        <p className="mt-0.5 text-[10px] text-accent/80">
                          #{idx + 1} · {typeConf.label}
                          {q.required && " · *obligatoriu"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveQuestion(idx, idx - 1); }}
                          disabled={idx === 0}
                          className="p-0.5 text-accent/80 hover:text-muted-foreground disabled:opacity-30"
                        >
                          <ChevronUp className="size-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveQuestion(idx, idx + 1); }}
                          disabled={idx === questions.length - 1}
                          className="p-0.5 text-accent/80 hover:text-muted-foreground disabled:opacity-30"
                        >
                          <ChevronDown className="size-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add question */}
          <div className="relative border-t border-secondary/30 p-3">
            <button
              onClick={() => setAddTypeMenuOpen((v) => !v)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-300 bg-primary/20 py-2.5 text-[12px] font-semibold text-primary hover:bg-primary/30 transition-colors"
            >
              <Plus className="size-3.5" /> Adaugă Întrebare
            </button>
            {addTypeMenuOpen && (
              <div className="absolute bottom-full left-3 right-3 z-50 mb-1 rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-2 shadow-xl">
                <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-accent/80">Alege tipul</p>
                <div className="grid grid-cols-2 gap-0.5">
                  {QUESTION_TYPES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.value}
                        onClick={() => addQuestion(t.value)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium text-muted-foreground hover:bg-accent/20 transition-colors text-left"
                      >
                        <Icon className="size-3.5 text-primary flex-shrink-0" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Question editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedIdx !== null && questions[selectedIdx] ? (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                  {selectedIdx + 1}
                </span>
                <span className="text-[13px] font-semibold text-foreground">Editează întrebarea</span>
              </div>
              <QuestionEditor
                question={questions[selectedIdx]}
                onChange={(updated) => updateQuestion(selectedIdx, updated)}
                onDelete={() => deleteQuestion(selectedIdx)}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="text-5xl">👈</div>
              <p className="text-[14px] font-semibold text-muted-foreground">
                {questions.length === 0
                  ? "Adaugă prima întrebare din panoul stâng"
                  : "Selectează o întrebare din stânga pentru a o edita"}
              </p>
            </div>
          )}
        </div>

        {/* AI Sidebar Column */}
        {showAiSidebar && (
          <div className="w-[320px] flex-shrink-0 border-l border-secondary/30 bg-[#F8F9FC] z-10">
            <AiQuestionnaireSidebar 
              onGenerate={(newQuestions) => {
                const updated = [
                  ...questions,
                  ...newQuestions.map((q, idx) => ({
                    ...q,
                    id: newId(),
                    order: questions.length + idx,
                    validations: null,
                  }))
                ];
                setQuestions(updated);
                setDirty(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Result Interpretations Builder ─────────────────────────────────────────────

function ResultInterpretationsBuilder({
  questionnaire,
  onBack,
}: {
  questionnaire: Questionnaire;
  onBack: () => void;
}) {
  const [interpretations, setInterpretations] = useState<any[]>(
    Array.isArray(questionnaire.resultInterpretations) ? questionnaire.resultInterpretations : []
  );
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const addInterpretation = () => {
    setInterpretations((prev) => [
      ...prev,
      { minScore: 0, maxScore: 100, level: "Nivel Nou", title: "", description: "", recommendations: ["Recomandare 1"] },
    ]);
    setDirty(true);
  };

  const updateInterp = (idx: number, field: string, value: any) => {
    const next = [...interpretations];
    next[idx] = { ...next[idx], [field]: value };
    setInterpretations(next);
    setDirty(true);
  };

  const updateRecommendation = (idx: number, recIdx: number, value: string) => {
    const next = [...interpretations];
    const recs = [...next[idx].recommendations];
    recs[recIdx] = value;
    next[idx].recommendations = recs;
    setInterpretations(next);
    setDirty(true);
  };

  const addRecommendation = (idx: number) => {
    const next = [...interpretations];
    next[idx].recommendations = [...next[idx].recommendations, ""];
    setInterpretations(next);
    setDirty(true);
  };

  const removeRecommendation = (idx: number, recIdx: number) => {
    const next = [...interpretations];
    next[idx].recommendations = next[idx].recommendations.filter((_: any, i: number) => i !== recIdx);
    setInterpretations(next);
    setDirty(true);
  };

  const removeInterpretation = (idx: number) => {
    setInterpretations((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/questionnaires/${questionnaire.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultInterpretations: interpretations }),
      });

      if (!res.ok) throw new Error("Eroare la salvare");

      toast.success("Grilele au fost salvate cu succes!");
      setDirty(false);
    } catch (err) {
      toast.error("Eroare la salvarea grilelor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-accent/20" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-secondary/30 bg-secondary/10 backdrop-blur-md px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" /> Înapoi
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <h1 className="text-[15px] font-bold text-foreground">Grile Interpretare: {questionnaire.title}</h1>
            <p className="text-[11px] text-accent/80">
              Definește rezultatele afișate în funcție de scorul obținut.
              {dirty && <span className="ml-2 text-amber-500 font-bold">● Nesalvat</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            {saving ? "Se salvează..." : "Salvează Grile"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        {interpretations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="text-5xl">📊</div>
            <h3 className="text-[17px] font-bold text-foreground">Nicio grilă definită</h3>
            <p className="text-[13px] text-muted-foreground">Adaugă un interval de scor pentru a personaliza rezultatul afișat respondentului.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {interpretations.map((interp, idx) => (
              <div key={idx} className="rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-foreground text-[14px]">Grilă #{idx + 1}</h3>
                  <button onClick={() => removeInterpretation(idx)} className="text-red-500 hover:text-red-600 text-xs font-semibold flex items-center gap-1">
                    <Trash2 className="size-3.5" /> Șterge Grilă
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scor Minim (%)</label>
                    <input type="number" min={0} max={100} value={interp.minScore} onChange={e => updateInterp(idx, 'minScore', Number(e.target.value))} className="h-9 w-full rounded-lg border border-secondary/30 px-3 text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scor Maxim (%)</label>
                    <input type="number" min={0} max={100} value={interp.maxScore} onChange={e => updateInterp(idx, 'maxScore', Number(e.target.value))} className="h-9 w-full rounded-lg border border-secondary/30 px-3 text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nivel (ex: Avansat)</label>
                    <input type="text" value={interp.level} onChange={e => updateInterp(idx, 'level', e.target.value)} className="h-9 w-full rounded-lg border border-secondary/30 px-3 text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Titlu Mesaj (ex: Performanță Excelentă)</label>
                    <input type="text" value={interp.title} onChange={e => updateInterp(idx, 'title', e.target.value)} className="h-9 w-full rounded-lg border border-secondary/30 px-3 text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descriere Detaliată</label>
                  <textarea rows={3} value={interp.description} onChange={e => updateInterp(idx, 'description', e.target.value)} className="w-full rounded-lg border border-secondary/30 p-3 text-sm resize-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none" />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recomandări Strategice</label>
                  <div className="flex flex-col gap-2">
                    {interp.recommendations.map((rec: string, recIdx: number) => (
                      <div key={recIdx} className="flex gap-2 items-center">
                        <div className="h-6 w-6 flex items-center justify-center bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex-shrink-0">{recIdx + 1}</div>
                        <input type="text" value={rec} onChange={e => updateRecommendation(idx, recIdx, e.target.value)} className="h-9 flex-1 rounded-lg border border-secondary/30 px-3 text-sm focus:border-emerald-400 outline-none" />
                        <button onClick={() => removeRecommendation(idx, recIdx)} className="p-1.5 text-accent/60 hover:text-red-500"><X className="size-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => addRecommendation(idx)} className="self-start mt-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                      <Plus className="size-3.5" /> Adaugă Recomandare
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={addInterpretation}
          className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 py-4 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          <Plus className="size-4" /> Adaugă Interval Scor Nou
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdminQuestionnairesClient({ initialData, currentUser }: Props) {
  const router = useRouter();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(initialData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingQ, setEditingQ] = useState<Questionnaire | null>(null);
  const [builderQ, setBuilderQ] = useState<Questionnaire | null>(null);
  const [interpretationsQ, setInterpretationsQ] = useState<Questionnaire | null>(null);
  const [isPending, startTransition] = useTransition();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // If builder is open, show builder view
  if (builderQ) {
    return (
      <div className="h-full">
        <QuestionnaireBuilder
          questionnaire={builderQ}
          onBack={() => {
            setBuilderQ(null);
            startTransition(() => router.refresh());
          }}
        />
      </div>
    );
  }

  // If interpretations is open, show interpretations view
  if (interpretationsQ) {
    return (
      <div className="h-full">
        <ResultInterpretationsBuilder
          questionnaire={interpretationsQ}
          onBack={() => {
            setInterpretationsQ(null);
            startTransition(() => router.refresh());
          }}
        />
      </div>
    );
  }

  const getCategory = (q: Questionnaire) => {
    if (q.category) return q.category;
    if (q.slug && q.slug.includes("hr")) return "HR";
    if (q.slug && q.slug.includes("digital")) return "Digital";
    return "Altele";
  };

  const filtered = questionnaires
    .filter((q) => {
      const matchSearch = q.title?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filter === "all" || q.status?.toLowerCase() === filter;
      const matchCategory = categoryFilter === "all" || getCategory(q) === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    })
    .sort((a, b) => {
      // Pinned primele
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      // Principale primele
      const aMain = (a.slug || "").includes("evaluare-maturitate") ? 1 : 0;
      const bMain = (b.slug || "").includes("evaluare-maturitate") ? 1 : 0;
      if (aMain !== bMain) return bMain - aMain;
      
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const counts = {
    all: questionnaires.length,
    published: questionnaires.filter((q) => q.status === "PUBLISHED").length,
    draft: questionnaires.filter((q) => q.status === "DRAFT").length,
  };

  const categoryCounts = {
    all: questionnaires.length,
    HR: questionnaires.filter((q) => getCategory(q) === "HR").length,
    Digital: questionnaires.filter((q) => getCategory(q) === "Digital").length,
  };

  const handlePublish = async (id: string, status: "PUBLISHED" | "DRAFT") => {
    const res = await fetch(`/api/admin/questionnaires/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setQuestionnaires((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status } : q))
      );
      toast.success(status === "PUBLISHED" ? "Chestionar publicat!" : "Chestionar mutat în draft.");
    } else {
      toast.error("Eroare la actualizare.");
    }
  };

  const handleTogglePin = async (id: string, currentPinStatus: boolean) => {
    const newStatus = !currentPinStatus;
    const res = await fetch(`/api/admin/questionnaires/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: newStatus }),
    });
    if (res.ok) {
      setQuestionnaires((prev) =>
        prev.map((q) => (q.id === id ? { ...q, isPinned: newStatus } : q))
      );
      toast.success(newStatus ? "Chestionar fixat!" : "Chestionar defixat.");
    } else {
      toast.error("Eroare la actualizare.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ești sigur că vrei să ștergi acest chestionar? Toate datele asociate vor fi pierdute.")) return;
    const res = await fetch(`/api/admin/questionnaires/${id}`, { method: "DELETE" });
    if (res.ok) {
      setQuestionnaires((prev) => prev.filter((q) => q.id !== id));
      toast.success("Chestionar șters.");
    } else {
      toast.error("Eroare la ștergere.");
    }
  };

  const handleDuplicate = async (id: string) => {
    const res = await fetch(`/api/admin/questionnaires/${id}/duplicate`, { method: "POST" });
    if (res.ok) {
      const copy = await res.json();
      setQuestionnaires((prev) => [copy, ...prev]);
      toast.success("Chestionar duplicat!");
    } else {
      toast.error("Eroare la duplicare.");
    }
  };

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/chestionare/${slug}`);
    toast.success("Link copiat!");
  };

  const handleModalSaved = (saved: any) => {
    if (editingQ) {
      setQuestionnaires((prev) =>
        prev.map((q) => (q.id === saved.id ? { ...q, ...saved } : q))
      );
    } else {
      setQuestionnaires((prev) => [{ ...saved, _count: { leads: 0 } }, ...prev]);
    }
    setEditingQ(null);
    startTransition(() => router.refresh());
  };

  return (
    <div className="min-h-full p-7" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {(showModal || editingQ) && (
        <QuestionnaireModal
          questionnaire={editingQ}
          onClose={() => { setShowModal(false); setEditingQ(null); }}
          onSaved={handleModalSaved}
          currentUser={currentUser}
        />
      )}

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Chestionare</h1>
          <p className="text-[12px] text-accent/80">{questionnaires.length} chestionare total</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-2 shadow-lg">
            <Search className="size-3.5 text-accent/80" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută chestionare..."
              className="w-44 bg-transparent text-[13px] text-muted-foreground outline-none placeholder:text-accent/80"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        {currentUser.role !== "VIEWER" && (
          <button
            onClick={() => { setEditingQ(null); setShowModal(true); }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Plus className="size-3.5" /> Chestionar Nou
          </button>
        )}

        <div className="flex gap-0.5 rounded-lg bg-accent/20 p-0.5">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
                filter === f
                  ? "bg-secondary/10 backdrop-blur-md text-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? "Toate" : f === "published" ? "Publicate" : "Draft"}
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                filter === f ? "bg-primary/20 text-primary" : "bg-slate-200 text-muted-foreground"
              )}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <div className="flex gap-0.5 rounded-lg bg-accent/20 p-0.5">
          {(["all", "HR", "Digital"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
                categoryFilter === c
                  ? "bg-secondary/10 backdrop-blur-md text-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c === "all" ? "Toate Categoriile" : c}
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                categoryFilter === c ? "bg-primary/20 text-primary" : "bg-slate-200 text-muted-foreground"
              )}>
                {categoryCounts[c]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md py-20 text-center shadow-lg">
          <div className="text-5xl">📋</div>
          <h3 className="text-[17px] font-bold text-foreground">Niciun chestionar</h3>
          <p className="text-[13px] text-accent/80">
            {search ? "Niciun rezultat pentru căutarea ta." : "Apasă \"Chestionar Nou\" pentru a crea primul."}
          </p>
          {!search && currentUser.role !== "VIEWER" && (
            <button
              onClick={() => { setEditingQ(null); setShowModal(true); }}
              className="mt-1 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:bg-primary/90"
            >
              <Plus className="size-3.5" /> Chestionar Nou
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-visible rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-secondary/30 bg-accent/20">
                {["Titlu", "Întrebări", "Leads", "Status", "Creat", "Acțiuni"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-accent/80"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id} className="border-b border-slate-50 hover:bg-accent/20/60 transition-colors">
                  <td className="px-3 py-2">
                    <p className="font-semibold text-[13px] text-foreground">{q.title}</p>
                    {q.description && (
                      <p className="mt-0.5 text-[11px] text-accent/80 line-clamp-1">{q.description}</p>
                    )}
                    <p className="mt-0.5 font-mono text-[10px] text-accent/60">/chestionare/{q.slug}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-[13px] font-semibold text-muted-foreground">
                      {q._questionCount ?? "—"}
                    </span>
                  </td>
                  
                  {/* Leads count */}
                  <td className="px-3 py-2 text-foreground text-[13px] font-semibold">
                    {q._count?.leads ?? 0}
                  </td>
                  
                  {/* Status */}
                  <td className="px-3 py-2">
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold inline-block",
                      q.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}>
                      {q.status === "PUBLISHED" ? "Publicat" : "Draft"}
                    </span>
                  </td>
                  
                  {/* Creat Date */}
                  <td className="px-3 py-2 text-[12px] text-accent/80">
                    {new Date(q.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  
                  {/* Acțiuni (Actions) */}
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setBuilderQ(q)}
                        title={currentUser.role === "VIEWER" ? "Vizualizează întrebări" : "Editează întrebări"}
                        className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Pencil className="size-3" /> {currentUser.role === "VIEWER" ? "Vizualizează" : "Întrebări"}
                      </button>
                      
                      {currentUser.role !== "VIEWER" && (
                        <>
                          <button
                            onClick={() => setInterpretationsQ(q)}
                            title="Editează grilele de rezultate"
                            className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Settings className="size-3" /> Grile
                          </button>
                          
                          <button
                            onClick={() => setEditingQ(q)}
                            title="Editează detalii și acces"
                            className="rounded-md p-1.5 text-accent/80 hover:bg-accent/20 hover:text-foreground transition-colors"
                          >
                            <Settings className="size-3.5" />
                          </button>
                        </>
                      )}

                      {/* Dropdown Menu for More Actions */}
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === q.id ? null : q.id)}
                          className="rounded-md p-1.5 text-accent/80 hover:bg-accent/20 hover:text-foreground transition-colors"
                          title="Mai multe acțiuni"
                        >
                          <MoreVertical className="size-3.5" />
                        </button>
                        
                        {menuOpenId === q.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setMenuOpenId(null)} 
                            />
                            <div className="absolute right-0 mt-1 w-44 rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-1 shadow-lg z-20 animate-in fade-in slide-in-from-top-1 duration-100 dark:border-slate-800 dark:bg-slate-900">
                              <button
                                onClick={() => {
                                  handleTogglePin(q.id, q.isPinned || false);
                                  setMenuOpenId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-accent/20 dark:text-slate-200 dark:hover:bg-slate-800"
                              >
                                {q.isPinned ? <PinOff className="size-3.5 text-accent/80" /> : <Pin className="size-3.5 text-accent/80" />}
                                <span>{q.isPinned ? "Defixează (Unpin)" : "Fixează (Pin)"}</span>
                              </button>
                              
                              {currentUser.role !== "VIEWER" && (
                                <>
                                  <button
                                    onClick={() => {
                                      handlePublish(q.id, q.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
                                      setMenuOpenId(null);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-accent/20 dark:text-slate-200 dark:hover:bg-slate-800"
                                  >
                                    {q.status === "PUBLISHED" ? (
                                      <>
                                        <EyeOff className="size-3.5 text-amber-500" />
                                        <span>Mută în Draft</span>
                                      </>
                                    ) : (
                                      <>
                                        <Rocket className="size-3.5 text-emerald-500" />
                                        <span>Publică</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    onClick={() => {
                                      handleDuplicate(q.id);
                                      setMenuOpenId(null);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-accent/20 dark:text-slate-200 dark:hover:bg-slate-800"
                                  >
                                    <Copy className="size-3.5 text-accent/80" />
                                    <span>Duplică</span>
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => {
                                  handleCopyLink(q.slug);
                                  setMenuOpenId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-accent/20 dark:text-slate-200 dark:hover:bg-slate-800"
                              >
                                <Link2 className="size-3.5 text-accent/80" />
                                <span>Copiază link</span>
                              </button>

                              {currentUser.role === "ADMIN" && (
                                <div className="my-1 border-t border-secondary/30 dark:border-slate-800" />
                              )}

                              {currentUser.role === "ADMIN" && (
                                <button
                                  onClick={() => {
                                    handleDelete(q.id);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="size-3.5 text-red-500" />
                                  <span>Șterge</span>
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// We need Settings icon too
function Settings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
