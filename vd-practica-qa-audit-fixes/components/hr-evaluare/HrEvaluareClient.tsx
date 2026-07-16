"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  User,
  Phone,
  Sparkles,
  TrendingUp,
  Loader2,
  AlertCircle,
  Building2,
  Printer,
  RefreshCw,
  Award,
  Users,
  Briefcase,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Save,
  BookOpenCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { hrModules } from "@/config/hr-questions";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts";

// Map sub-dimension IDs to Lucide Icons for aesthetic value in dashboard
const SUB_DIM_ICONS: Record<string, React.ComponentType<any>> = {
  positioning: Award,
  processes: Users,
  strategy: Briefcase,
  culture: BookOpen,
  planning: Clock,
  competencies: Sparkles,
  succession: Save,
  data: TrendingUp,
  rec_prep: Award,
  cand_attr: Users,
  sel_disc: Briefcase,
  cand_exp: BookOpenCheck,
  perf_framework: Award,
  perf_dialogue: Users,
  rewards: Briefcase,
  satisfaction: BookOpenCheck,
  lnd_strategy: Award,
  lnd_delivery: Users,
  lnd_culture: Briefcase,
  lnd_career: BookOpenCheck,
  exp_monitoring: Award,
  wellbeing: Users,
  ret_strategy: Briefcase,
  loyalty: BookOpenCheck,
  dig_infra_security: Save,
  dig_automation: Sparkles,
  dig_self_service_comm: Users,
  dig_analytics_readiness: TrendingUp,
  com_doc_legal: Award,
  com_relations: Users,
  com_health_safety: Clock,
  com_audit_ethics: BookOpenCheck,
};

// Define all sub-dimensions of Modules 1 to 8 with type tags
const ALL_SUB_DIMENSIONS = [
  { id: "positioning", name: "1.1 Poziționarea funcției HR", type: "governance" },
  { id: "processes", name: "1.2 Procese și politici", type: "governance" },
  { id: "strategy", name: "1.3 Strategie HR", type: "governance" },
  { id: "culture", name: "1.4 Cultura organizațională", type: "governance" },
  
  { id: "planning", name: "2.1 Planificarea personalului", type: "workforce" },
  { id: "competencies", name: "2.2 Structură și competențe", type: "workforce" },
  { id: "succession", name: "2.3 Succesiune și mobilitate", type: "workforce" },
  { id: "data", name: "2.4 Date și evidențe", type: "workforce" },

  { id: "rec_prep", name: "3.1 Pregătirea recrutării (Recruitment Preparation)", type: "recruitment" },
  { id: "cand_attr", name: "3.2 Atragerea candidaților (Candidate Attraction)", type: "recruitment" },
  { id: "sel_disc", name: "3.3 & 3.4 Disciplina selecției (Selection Discipline)", type: "recruitment" },
  { id: "cand_exp", name: "3.5 & 3.6 Experiența candidaților (Candidate Experience)", type: "recruitment" },

  { id: "perf_framework", name: "4.1 Cadru management performanță (Performance Framework)", type: "performance" },
  { id: "perf_dialogue", name: "4.2 Dialog & Feedback", type: "performance" },
  { id: "rewards", name: "4.3 & 4.4 Compensare și Motivare", type: "performance" },
  { id: "satisfaction", name: "4.5 & 4.6 Voce, Satisfacție & Meritocrație", type: "performance" },

  { id: "lnd_strategy", name: "5.1 & 5.2 Strategie & Analiză Nevoi", type: "learning" },
  { id: "lnd_delivery", name: "5.3 Formate & Livrare", type: "learning" },
  { id: "lnd_culture", name: "5.4 & 5.5 Cultură de învățare & Leadership", type: "learning" },
  { id: "lnd_career", name: "5.6 & 5.7 Carieră & Eficacitate", type: "learning" },

  { id: "exp_monitoring", name: "6.1 & 6.2 Monitorizare & Employee Voice", type: "experience" },
  { id: "wellbeing", name: "6.3 Wellbeing & Climat de lucru", type: "experience" },
  { id: "ret_strategy", name: "6.4 & 6.5 Strategie de Retenție", type: "experience" },
  { id: "loyalty", name: "6.6 & 6.7 Loialitate & Mobilitate", type: "experience" },

  { id: "dig_infra_security", name: "7.1 & 7.6 Infrastructură și Securitate", type: "digitalization" },
  { id: "dig_automation", name: "7.2 Procese și Automatizare", type: "digitalization" },
  { id: "dig_self_service_comm", name: "7.3 & 7.5 Self-Service și Comunicare", type: "digitalization" },
  { id: "dig_analytics_readiness", name: "7.4 & 7.7 Reporting, Analytics & Readiness", type: "digitalization" },

  { id: "com_doc_legal", name: "8.1 & 8.2 Documentație și Conformitate", type: "compliance" },
  { id: "com_relations", name: "8.3 Relații de Muncă și Disciplină", type: "compliance" },
  { id: "com_health_safety", name: "8.4 Sănătate, Securitate și Medicină", type: "compliance" },
  { id: "com_audit_ethics", name: "8.5 & 8.6 Audit, Prevenire Riscuri și Etică", type: "compliance" },
];

const module1 = hrModules.find((m) => m.id === "module_1");
const module2 = hrModules.find((m) => m.id === "module_2");
const module3 = hrModules.find((m) => m.id === "module_3");
const module4 = hrModules.find((m) => m.id === "module_4");
const module5 = hrModules.find((m) => m.id === "module_5");
const module6 = hrModules.find((m) => m.id === "module_6");
const module7 = hrModules.find((m) => m.id === "module_7");
const module8 = hrModules.find((m) => m.id === "module_8");

interface CompanyData {
  companyName: string;
  industry: string;
  companySize: string;
  ownershipType: string;
  respondentRole: string;
  email: string;
  name: string;
  phone: string;
}

export function HrEvaluareClient({ type }: { type: "governance" | "workforce" | "recruitment" | "performance" | "learning" | "experience" | "digitalization" | "compliance" }) {
  const [step, setStep] = useState<"restore" | "register" | "brief" | "quiz" | "result">("register");

  // Dynamically filter questions and sub-dimensions based on the questionnaire type
  const allQuestions = React.useMemo(() => {
    if (type === "governance") {
      return module1 ? module1.questions.map((q) => ({ ...q, moduleName: module1.name, moduleWeight: module1.weight })) : [];
    } else if (type === "workforce") {
      return module2 ? module2.questions.map((q) => ({ ...q, moduleName: module2.name, moduleWeight: module2.weight })) : [];
    } else if (type === "recruitment") {
      return module3 ? module3.questions.map((q) => ({ ...q, moduleName: module3.name, moduleWeight: module3.weight })) : [];
    } else if (type === "performance") {
      return module4 ? module4.questions.map((q) => ({ ...q, moduleName: module4.name, moduleWeight: module4.weight })) : [];
    } else if (type === "learning") {
      return module5 ? module5.questions.map((q) => ({ ...q, moduleName: module5.name, moduleWeight: module5.weight })) : [];
    } else if (type === "experience") {
      return module6 ? module6.questions.map((q) => ({ ...q, moduleName: module6.name, moduleWeight: module6.weight })) : [];
    } else if (type === "digitalization") {
      return module7 ? module7.questions.map((q) => ({ ...q, moduleName: module7.name, moduleWeight: module7.weight })) : [];
    } else {
      return module8 ? module8.questions.map((q) => ({ ...q, moduleName: module8.name, moduleWeight: module8.weight })) : [];
    }
  }, [type]);

  const SUB_DIMENSIONS = React.useMemo(() => {
    return ALL_SUB_DIMENSIONS.filter((dim) => dim.type === type);
  }, [type]);

  const storageKey = `hr_assessment_state_${type}`;
  
  // Registration and answers states
  const [company, setCompany] = useState<CompanyData>({
    companyName: "",
    industry: "",
    companySize: "",
    ownershipType: "",
    respondentRole: "",
    email: "",
    name: "",
    phone: "",
  });

  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Result state returned from API
  const [report, setReport] = useState<{
    score: number;
    level: string;
    description: string;
    moduleScores: Record<string, number>;
    recommendations: {
      moduleId: string;
      moduleName: string;
      score: number;
      status: "critical" | "improvement" | "strength";
      items: string[];
    }[];
    strongestAreas: string[];
    weakestAreas: string[];
    roadmap: {
      phase: string;
      title: string;
      actions: string[];
    }[];
  } | null>(null);

  // Auto-Save feature: Check for saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.company && parsed.responses && Object.keys(parsed.responses).length > 0) {
          setStep("restore");
        }
      } catch (e) {
        console.error("Error parsing saved state:", e);
      }
    }
  }, [storageKey]);

  // Save state to localStorage on changes
  const saveCurrentProgress = (currResponses: Record<string, number>, currIndex: number) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        company,
        responses: currResponses,
        currentQuestionIndex: currIndex,
      })
    );
  };

  const handleRestore = () => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setCompany(parsed.company);
        setResponses(parsed.responses);
        setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
        setStep("quiz");
        toast.success("Progresul tău a fost restaurat!");
      } catch (e) {
        console.error("Error restoring state:", e);
        setStep("register");
      }
    }
  };

  const handleClearSavedState = () => {
    localStorage.removeItem(storageKey);
    setCompany({
      companyName: "",
      industry: "",
      companySize: "",
      ownershipType: "",
      respondentRole: "",
      email: "",
      name: "",
      phone: "",
    });
    setResponses({});
    setCurrentQuestionIndex(0);
    setStep("register");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate fields
    if (!company.companyName.trim()) return setValidationError("Numele companiei este obligatoriu.");
    if (!company.industry) return setValidationError("Vă rugăm să selectați industria.");
    if (!company.companySize) return setValidationError("Vă rugăm să selectați dimensiunea companiei.");
    if (!company.ownershipType) return setValidationError("Vă rugăm să selectați tipul de proprietate.");
    if (!company.respondentRole) return setValidationError("Vă rugăm să selectați rolul dvs.");
    if (!company.name.trim()) return setValidationError("Numele dvs. este obligatoriu.");
    if (!company.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
      return setValidationError("Introduceți o adresă de email validă.");
    }

    setStep("brief");
  };

  const handleSelectOption = (questionId: string, val: number) => {
    const updated = { ...responses, [questionId]: val };
    setResponses(updated);
    setValidationError(null);

    // Auto-save
    saveCurrentProgress(updated, currentQuestionIndex);

    // Auto-advance to the next question after a tiny delay
    if (currentQuestionIndex < allQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handleNext = () => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    if (responses[currentQuestion.id] === undefined) {
      setValidationError("Vă rugăm să selectați o opțiune pentru a continua.");
      return;
    }
    setValidationError(null);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const unanswered = allQuestions.filter(q => responses[q.id] === undefined);
    if (unanswered.length > 0) {
      toast.error(`Te rugăm să răspunzi la toate întrebările. Mai ai ${unanswered.length} întrebări rămase.`);
      const firstUnansweredIndex = allQuestions.findIndex(q => responses[q.id] === undefined);
      if (firstUnansweredIndex !== -1) {
        setCurrentQuestionIndex(firstUnansweredIndex);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...company,
        responses,
        type,
      };

      const res = await fetch("/api/evaluare-hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Eroare la trimitere.");
      }

      const data = await res.json();
      setReport(data);
      setStep("result");
      localStorage.removeItem(storageKey); // Clear save progress on success
      toast.success("Evaluare finalizată! Raportul tău este gata.");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "A apărut o eroare la salvarea răspunsurilor. Încearcă din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    handleClearSavedState();
  };

  // Calculations for progress bar
  const answeredCount = Object.keys(responses).length;
  const progressPercent = allQuestions.length > 0 ? Math.round((answeredCount / allQuestions.length) * 100) : 0;

  // Prepare radar chart data
  const radarData = report
    ? SUB_DIMENSIONS.map((dim) => ({
        subject: dim.name,
        A: report.moduleScores[dim.id] || 0,
        fullMark: 100,
      }))
    : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 relative">
      {/* Background Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-500/5 dark:bg-violet-500/5 blur-[120px]" />
      </div>

      {/* RESTORE STATE DIALOG */}
      {step === "restore" && (
        <div className="rounded-3xl border border-border bg-background/50 p-8 shadow-2xl backdrop-blur-xl text-center max-w-md mx-auto">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 mb-6">
            <Save className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Continuă evaluarea?</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Am găsit un progres salvat anterior pe acest dispozitiv. Dorești să continui de unde ai rămas sau să începi un chestionar nou?
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button onClick={handleRestore} className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-foreground font-semibold">
              Continuă evaluarea salvată
            </Button>
            <Button onClick={handleClearSavedState} variant="outline" className="w-full rounded-full border-border hover:bg-muted font-semibold">
              Începe una nouă (șterge progresul)
            </Button>
          </div>
        </div>
      )}

      {/* STEP 1: COMPANY REGISTRATION */}
      {step === "register" && (
        <div className="rounded-3xl border border-border bg-background/40 p-6 md:p-10 shadow-xl backdrop-blur-md max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600">
              <Building2 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Înregistrarea Companiei
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Completează datele de bază pentru a începe {
                type === "governance" ? "Evaluarea Maturității HR (Guvernanță)" : 
                type === "workforce" ? "Evaluarea Planificării Resurselor Umane (Workforce Planning)" : 
                type === "recruitment" ? "Evaluarea Recrutării și Selecției HR" :
                type === "performance" ? "Evaluarea Performanței și Recompense HR" :
                type === "learning" ? "Evaluarea Learning & Development HR" :
                type === "experience" ? "Evaluarea Experienței și Retenției Angajaților" :
                type === "digitalization" ? "Evaluarea Digitalizării HR" :
                "Evaluarea Compliance & Risk Management HR"
              }.
            </p>
          </div>

          {validationError && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nume Companie *</label>
                <Input
                  type="text"
                  placeholder="ex: Acme SRL"
                  value={company.companyName}
                  onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                  className="rounded-xl border-input/60 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Industrie *</label>
                <select
                  value={company.industry}
                  onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-input/60 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selectează industria</option>
                  <option value="Servicii">Servicii</option>
                  <option value="Comerț / Retail">Comerț / Retail</option>
                  <option value="Producție">Producție</option>
                  <option value="Construcții">Construcții</option>
                  <option value="Horeca">Horeca</option>
                  <option value="IT / Tehnologie">IT / Tehnologie</option>
                  <option value="Altul">Altul</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dimensiune Companie *</label>
                <select
                  value={company.companySize}
                  onChange={(e) => setCompany({ ...company, companySize: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-input/60 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Alege numărul de angajați</option>
                  <option value="1-9 angajați">1-9 angajați (Micro)</option>
                  <option value="10-49 angajați">10-49 angajați (Mică)</option>
                  <option value="50-249 angajați">50-249 angajați (Medie)</option>
                  <option value="Peste 250 angajați">Peste 250 angajați (Mare)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tip Proprietate *</label>
                <select
                  value={company.ownershipType}
                  onChange={(e) => setCompany({ ...company, ownershipType: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-input/60 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Alege tipul de capital</option>
                  <option value="Privată (Românească)">Privată (Capital Românesc)</option>
                  <option value="Privată (Multinațională)">Privată (Capital Străin/Multinațională)</option>
                  <option value="De Stat">De Stat / Publică</option>
                  <option value="ONG / Non-profit">ONG / Sectorul 3</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nume Respondent *</label>
                <Input
                  type="text"
                  placeholder="Nume și prenume"
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  className="rounded-xl border-input/60 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rol în Organizație *</label>
                <select
                  value={company.respondentRole}
                  onChange={(e) => setCompany({ ...company, respondentRole: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-input/60 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Selectează rolul tău</option>
                  <option value="Manager HR">Manager / Director HR</option>
                  <option value="Specialist HR">Specialist / Recruter HR</option>
                  <option value="Director General / CEO">Director General / CEO / Fondator</option>
                  <option value="Manager Operațional">Manager Operațional / Departament</option>
                  <option value="Consultant HR">Consultant HR / Extern</option>
                  <option value="Altul">Altul</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email de contact *</label>
                <Input
                  type="email"
                  placeholder="ex: manager@companie.ro"
                  value={company.email}
                  onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  className="rounded-xl border-input/60 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Telefon (Opțional)</label>
                <Input
                  type="tel"
                  placeholder="ex: 07xx xxx xxx"
                  value={company.phone}
                  onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  className="rounded-xl border-input/60 focus:ring-indigo-500"
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-foreground font-bold h-11 transition-all">
              Mergi la pasul următor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* STEP 2: BRIEFING & INITIAL PREP */}
      {step === "brief" && (
        <div className="rounded-3xl border border-border bg-background/50 p-8 shadow-2xl backdrop-blur-md max-w-xl mx-auto text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 mb-6">
            <Clock className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            {type === "governance" ? "Audit Guvernanță HR" : 
             type === "workforce" ? "Audit Planificare Resurse Umane" : 
             type === "recruitment" ? "Audit Recrutare și Selecție" : 
             type === "performance" ? "Audit Performanță și Recompense" : 
             type === "learning" ? "Audit Learning & Development" : 
             type === "experience" ? "Audit Experiență & Retenție Angajați" :
             type === "digitalization" ? "Audit Digitalizare HR" :
             "Audit Compliance & Risc HR"}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-sm">
            {type === "governance" ? (
              <>
                Acest audit cuprinde exact <strong>{allQuestions.length} întrebări esențiale</strong> structurate pe <strong>Guvernanța HR și Poziționarea Strategică</strong>. Răspunsurile tale vor ajuta la stabilirea exactă a nivelului de maturitate HR și la generarea unui plan de recomandări concrete pe 90 de zile.
              </>
            ) : type === "workforce" ? (
              <>
                Acest audit cuprinde exact <strong>{allQuestions.length} întrebări esențiale</strong> structurate pe <strong>Planificarea Resurselor Umane (Workforce Planning)</strong>. Răspunsurile tale vor ajuta la stabilirea exactă a nivelului de maturitate în workforce planning și la generarea unui plan de recomandări concrete pe 90 de zile.
              </>
            ) : type === "recruitment" ? (
              <>
                Acest audit cuprinde exact <strong>{allQuestions.length} întrebări esențiale</strong> structurate pe <strong>Recrutare și Selecție (Recruitment & Selection)</strong>. Răspunsurile tale vor ajuta la stabilirea exactă a nivelului de maturitate în recrutare, selecție și integrare și la generarea unui plan de recomandări concrete pe 90 de zile.
              </>
            ) : type === "performance" ? (
              <>
                Acest audit cuprinde exact <strong>{allQuestions.length} întrebări esențiale</strong> structurate pe <strong>Managementul Performanței, Motivație și Recompense</strong>. Răspunsurile tale vor ajuta la stabilirea exactă a nivelului de maturitate în evaluarea performanței și motivare și la generarea unui plan de recomandări concrete pe 90 de zile.
              </>
            ) : type === "learning" ? (
              <>
                Acest audit cuprinde exact <strong>{allQuestions.length} întrebări esențiale</strong> structurate pe <strong>Learning & Development (L&D)</strong>. Răspunsurile tale vor ajuta la stabilirea exactă a nivelului de maturitate în training, formare continuă și leadership și la generarea unui plan de recomandări concrete pe 90 de zile.
              </>
            ) : type === "experience" ? (
              <>
                Acest audit cuprinde exact <strong>{allQuestions.length} întrebări esențiale</strong> structurate pe <strong>Experiența Angajaților și Retenție (Employee Experience & Retention)</strong>. Răspunsurile tale vor ajuta la stabilirea exactă a nivelului de engagement, climat de lucru și retenție și la generarea unui plan de recomandări concrete pe 90 de zile.
              </>
            ) : type === "digitalization" ? (
              <>
                Acest audit cuprinde exact <strong>{allQuestions.length} întrebări esențiale</strong> structurate pe <strong>Digitalizarea HR și Automatizare</strong>. Răspunsurile tale vor ajuta la stabilirea exactă a nivelului de maturitate digitală în HR și la generarea unui plan de recomandări concrete pe 90 de zile.
              </>
            ) : (
              <>
                Acest audit cuprinde exact <strong>{allQuestions.length} întrebări esențiale</strong> structurate pe <strong>Conformitate Legală și Risc HR (Compliance)</strong>. Răspunsurile tale vor ajuta la stabilirea exactă a nivelului de risc legal în departamentul tău de personal și la generarea unui plan de recomandări concrete pe 90 de zile.
              </>
            )}
          </p>

          <div className="my-8 rounded-2xl bg-card border border-border p-4 text-left space-y-2">
            <div className="flex gap-2.5 text-xs text-muted-foreground">
              <span className="font-bold text-indigo-600">Durată estimată:</span> 10 - 15 minute.
            </div>
            <div className="flex gap-2.5 text-xs text-muted-foreground">
              <span className="font-bold text-indigo-600">Salvare automată:</span> Răspunsurile se salvează automat. Poți închide fereastra și reveni oricând.
            </div>
            <div className="flex gap-2.5 text-xs text-muted-foreground">
              <span className="font-bold text-indigo-600">Logică de scoring:</span> Pentru fiecare întrebare, selectează opțiunea de la 1 (Reactiv/Inexistent) la 5 (Matur/Optimizat).
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("register")} className="rounded-xl flex-1 border-border font-semibold">
              Înapoi
            </Button>
            <Button
              onClick={() => {
                setStep("quiz");
                saveCurrentProgress(responses, currentQuestionIndex);
              }}
              className="rounded-xl flex-1 bg-indigo-600 hover:bg-indigo-700 text-foreground font-bold"
            >
              Începe evaluarea
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: QUESTIONNAIRE ENGINE */}
      {step === "quiz" && allQuestions.length > 0 && (
        <div className="rounded-3xl border border-border bg-background/50 p-6 md:p-10 shadow-2xl backdrop-blur-xl transition-all duration-300">
          
          {/* Header Progress */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                {allQuestions[currentQuestionIndex].moduleName}
              </span>
              <p className="text-xs text-muted-foreground font-semibold">
                Întrebarea {currentQuestionIndex + 1} din {allQuestions.length} ({progressPercent}% completat)
              </p>
            </div>
            <div className="w-full md:max-w-[240px]">
              <Progress value={progressPercent} className="h-2 bg-muted rounded-full" />
            </div>
          </div>

          {validationError && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Question Text */}
          <div className="min-h-[120px] flex flex-col justify-center mb-8 border-l-4 border-indigo-600 pl-4">
            <span className="text-xs font-bold text-muted-foreground/70 tracking-wider">COD: {allQuestions[currentQuestionIndex].id}</span>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground leading-snug mt-1">
              {allQuestions[currentQuestionIndex].question_text}
            </h2>
          </div>

          {/* Option Selector */}
          <div className="grid gap-3">
            {allQuestions[currentQuestionIndex].options.map((opt) => {
              const isSelected = responses[allQuestions[currentQuestionIndex].id] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectOption(allQuestions[currentQuestionIndex].id, opt.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition-all duration-200",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-50 shadow-md scale-[1.01]"
                      : "border-border bg-card/20 text-foreground hover:bg-card/40 hover:border-zinc-400/30"
                  )}
                >
                  <span className="pr-4">{opt.label}</span>
                  <div className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                    isSelected 
                      ? "border-indigo-600 bg-indigo-600 text-foreground dark:border-indigo-500 dark:bg-indigo-500" 
                      : "border-muted-foreground/40"
                  )}>
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-border/40 pt-6 mt-8">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className="rounded-xl px-4 hover:bg-muted"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Înapoi
            </Button>

            {currentQuestionIndex === allQuestions.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 text-foreground font-bold shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se calculează raportul...
                  </>
                ) : (
                  <>
                    Finalizează Evaluarea
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={responses[allQuestions[currentQuestionIndex].id] === undefined}
                className="rounded-xl px-5 bg-indigo-600 hover:bg-indigo-700 text-foreground font-semibold"
              >
                Înainte
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* STEP 4 & 5: RESULTS & PRINTABLE DASHBOARD */}
      {step === "result" && report && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Action Header */}
          <div className="flex justify-between items-center gap-3 print:hidden">
            <Button
              onClick={() => window.print()}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-foreground font-semibold flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Printează sau Salvează PDF
            </Button>
            <Button variant="outline" onClick={handleReset} className="rounded-xl border-border hover:bg-muted text-muted-foreground flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Repornește Chestionarul
            </Button>
          </div>

          {/* Printable Report Header */}
          <div className="hidden print:block border-b border-border pb-6 mb-6">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              {type === "governance" ? "RAPORT DE EVALUARE MATURITATE HR (GUVERNANȚĂ)" : 
               type === "workforce" ? "RAPORT DE EVALUARE PLANIFICARE RESURSE UMANE (WORKFORCE PLANNING)" : 
               type === "recruitment" ? "RAPORT DE EVALUARE RECRUTARE ȘI SELECȚIE HR" :
               type === "performance" ? "RAPORT DE EVALUARE PERFORMANȚĂ ȘI RECOMPENSE HR" :
               type === "learning" ? "RAPORT DE EVALUARE LEARNING & DEVELOPMENT HR" :
               type === "experience" ? "RAPORT DE EVALUARE EXPERIENȚĂ ȘI RETENȚIE ANGAJAȚI" :
               type === "digitalization" ? "RAPORT DE EVALUARE DIGITALIZARE HR" :
               "RAPORT DE EVALUARE COMPLIANCE ȘI RISC HR"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Generat pentru: <strong>{company.companyName}</strong> ({company.industry})</p>
            <p className="text-xs text-muted-foreground">Dată: {new Date().toLocaleDateString('ro-RO')} | Email: {company.email}</p>
          </div>

          {/* Score & Maturity Level Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-background/50 p-6 shadow-md flex flex-col items-center justify-center text-center">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="absolute h-full w-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="stroke-muted fill-none" strokeWidth="8" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className={cn(
                      "stroke-current fill-none transition-all duration-1000 ease-out",
                      report.score <= 40 ? "text-rose-500" : report.score <= 79 ? "text-amber-500" : "text-emerald-500"
                    )}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - report.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">{report.score}%</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Scor Maturitate</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background/50 p-6 shadow-md md:col-span-2 flex flex-col justify-center">
              <div className={cn(
                "inline-flex self-start items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border mb-3",
                report.score <= 40 ? "border-rose-500/20 bg-rose-500/10 text-rose-500" : 
                report.score <= 79 ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-500" : 
                "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
              )}>
                <TrendingUp className="h-3.5 w-3.5" />
                Nivel Maturitate: {report.level}
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">Rezumatul Maturității HR</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{report.description}</p>
            </div>
          </div>

          {/* Visual Output: Radar Chart */}
          <div className="rounded-3xl border border-border bg-background/50 p-6 md:p-8 shadow-md">
            <h3 className="text-lg font-bold text-foreground tracking-tight mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Vizualizare Grafică: Profil HR vs Benchmark Ideal
            </h3>
            <div className="h-[380px] w-full bg-card/10 rounded-2xl border border-border/40 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Radar
                    name="Benchmark Ideal"
                    dataKey="fullMark"
                    stroke="#cbd5e1"
                    fill="#cbd5e1"
                    fillOpacity={0.1}
                    isAnimationActive={false}
                  />
                  <Radar
                    name="Profil Companie"
                    dataKey="A"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.25}
                    dot={{ r: 3.5, fill: "#4f46e5" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Module-by-Module Progress Breakdown */}
          <div className="rounded-3xl border border-border bg-background/50 p-6 md:p-8 shadow-md space-y-6">
            <h3 className="text-lg font-bold text-foreground tracking-tight border-b border-border/50 pb-3">Scoruri Detaliate pe Dimensiuni</h3>
            <div className="grid gap-5">
              {SUB_DIMENSIONS.map((dim) => {
                const score = report.moduleScores[dim.id] || 0;
                const IconComponent = SUB_DIM_ICONS[dim.id] || Award;
                return (
                  <div key={dim.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-foreground font-semibold">
                        <IconComponent className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span>{dim.name}</span>
                      </div>
                      <span className="font-extrabold text-indigo-600">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2 bg-muted rounded-full" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.01] p-6 shadow-sm">
              <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-2 border-b border-emerald-500/10 pb-3 mb-4">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Puncte Forte
              </h3>
              <ul className="space-y-3">
                {report.strongestAreas.map((area, idx) => (
                  <li key={idx} className="flex gap-2.5 text-sm text-foreground/90 leading-relaxed align-top">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/[0.01] p-6 shadow-sm">
              <h3 className="text-base font-bold text-rose-600 dark:text-rose-500 flex items-center gap-2 border-b border-rose-500/10 pb-3 mb-4">
                <AlertCircle className="h-5 w-5 shrink-0" />
                Vulnerabilități
              </h3>
              <ul className="space-y-3">
                {report.weakestAreas.map((area, idx) => (
                  <li key={idx} className="flex gap-2.5 text-sm text-foreground/90 leading-relaxed align-top">
                    <span className="text-rose-500 mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations Engine Section */}
          <div className="rounded-3xl border border-border bg-background/50 p-6 md:p-8 shadow-md">
            <h3 className="text-lg font-bold text-foreground tracking-tight border-b border-border/50 pb-3 mb-6 flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-indigo-500" />
              Recomandări Strategice Per Dimensiune
            </h3>
            
            <div className="space-y-6">
              {report.recommendations.map((rec, idx) => {
                const IconComponent = SUB_DIM_ICONS[rec.moduleId] || Award;
                return (
                  <div key={idx} className="rounded-2xl border border-border/60 bg-card/30 p-5 space-y-3">
                    <div className="flex justify-between items-center border-b border-border/30 pb-2">
                      <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                        <IconComponent className="h-4.5 w-4.5 text-indigo-500" />
                        <span>{rec.moduleName}</span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        rec.status === "critical" ? "border-rose-500/20 bg-rose-500/10 text-rose-500" :
                        rec.status === "improvement" ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-500" :
                        "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                      )}>
                        {rec.status === "critical" ? "Riscuri Critice" : rec.status === "improvement" ? "Prioritate Îmbunătățire" : "Punct Forte"}
                      </span>
                    </div>

                    <ul className="space-y-2 pt-1">
                      {rec.items.map((item, keyIdx) => (
                        <li key={keyIdx} className="flex gap-2 items-start text-xs text-muted-foreground leading-relaxed">
                          <ArrowUpRight className={cn(
                            "h-3.5 w-3.5 shrink-0 mt-0.5",
                            rec.status === "critical" ? "text-rose-500" : rec.status === "improvement" ? "text-amber-500" : "text-emerald-500"
                          )} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 90-Day Suggested Action Roadmap */}
          <div className="rounded-3xl border border-border bg-background/50 p-6 md:p-8 shadow-md">
            <h3 className="text-lg font-bold text-foreground tracking-tight border-b border-border/50 pb-3 mb-6">
              Foaie de parcurs sugerată pentru acțiune pe 90 de zile
            </h3>

            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-100 dark:before:bg-indigo-950">
              {report.roadmap.map((phase, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute left-0 top-1 h-7.5 w-7.5 rounded-full bg-indigo-50 dark:bg-zinc-900 border-2 border-indigo-600 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {idx + 1}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">{phase.phase}</span>
                    <h4 className="font-bold text-foreground text-sm leading-tight">{phase.title}</h4>
                    <ul className="space-y-1.5 pt-1">
                      {phase.actions.map((act, actIdx) => (
                        <li key={actIdx} className="flex gap-2 items-start text-xs text-muted-foreground leading-relaxed">
                          <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call-to-action Section */}
          <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/[0.02] p-8 shadow-md text-center max-w-xl mx-auto print:hidden">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Ai nevoie de ajutor în implementare?</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Consultanții noștri HR te pot ajuta să construiești procedurile, să dezvolți sistemul de indicatori sau să structurezi evaluările de performanță.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contact?subject=Consiliere%20HR" className="flex-1 max-w-[200px]">
                <Button className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-foreground font-semibold shadow-md">
                  Programează apel gratuit
                </Button>
              </a>
              <a href="/servicii" className="flex-1 max-w-[200px]">
                <Button variant="outline" className="w-full rounded-full border-indigo-500/20 hover:bg-muted font-semibold">
                  Vezi Serviciile HR
                </Button>
              </a>
            </div>
          </div>
          
          {/* Printable Footer */}
          <div className="hidden print:block border-t border-border pt-6 text-center text-xs text-muted-foreground mt-12">
            © {new Date().getFullYear()} VreauDigitalizare. Toate drepturile rezervate. Evaluarea este orientativă și reprezintă proprietatea intelectuală a vreaudigitalizare.eu.
          </div>
        </div>
      )}
    </div>
  );
}
