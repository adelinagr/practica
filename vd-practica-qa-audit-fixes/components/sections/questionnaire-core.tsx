"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Star,
    Mail,
    User,
    Phone,
    Sparkles,
    CheckCircle2,
    Building2,
    Calendar,
    AlertCircle,
    TrendingUp,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Question Definition structure
export interface QuestionData {
    id: string;
    type: "TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "RATING";
    text: string;
    options: string[] | null;
    required: boolean;
    order: number;
}

export interface QuestionnaireData {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    questions: QuestionData[];
}

interface QuestionnaireCoreProps {
    data: QuestionnaireData;
}

export function QuestionnaireCore({ data }: QuestionnaireCoreProps) {
    // Step navigation states: "start" | number (question index) | "lead" | "result"
    const [step, setStep] = useState<"start" | number | "lead" | "result">("start");

    // User answers map: { [questionId]: answerValue }
    const [answers, setAnswers] = useState<Record<string, any>>({});

    // Lead Capture info
    const [leadName, setLeadName] = useState("");
    const [leadEmail, setLeadEmail] = useState("");
    const [leadPhone, setLeadPhone] = useState("");

    // Client validation errors
    const [validationError, setValidationError] = useState<string | null>(null);

    // Submission & calculation response
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [report, setReport] = useState<{
        score: number;
        level: string;
        title: string;
        description: string;
        recommendations: string[];
    } | null>(null);

    const questions = data.questions;

    // Clear validation error when answers change
    useEffect(() => {
        setValidationError(null);
    }, [answers, step]);

    // Navigate back
    const handleBack = () => {
        if (step === "lead") {
            setStep(questions.length - 1);
        } else if (typeof step === "number") {
            if (step === 0) {
                setStep("start");
            } else {
                setStep(step - 1);
            }
        }
    };

    // Validate answer for the current question index
    const validateCurrentStep = (index: number): boolean => {
        const q = questions[index];
        if (!q.required) return true;

        const ans = answers[q.id];
        if (ans === undefined || ans === null || ans === "") {
            setValidationError("Acest răspuns este obligatoriu pentru a continua.");
            return false;
        }

        if (q.type === "MULTIPLE_CHOICE" && Array.isArray(ans) && ans.length === 0) {
            setValidationError("Vă rugăm să alegeți cel puțin o opțiune.");
            return false;
        }

        return true;
    };

    // Navigate forward
    const handleNext = () => {
        if (typeof step === "number") {
            if (!validateCurrentStep(step)) return;

            if (step === questions.length - 1) {
                setStep("lead");
            } else {
                setStep(step + 1);
            }
        }
    };

    // Quick choice auto-next (for SINGLE_CHOICE questions)
    const handleSingleChoiceSelect = (questionId: string, option: string, index: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));

        // Smooth delay before automatic slide for premium feel
        setTimeout(() => {
            if (index === questions.length - 1) {
                setStep("lead");
            } else {
                setStep(index + 1);
            }
        }, 300);
    };

    // Handle multiple choice toggle
    const handleMultipleChoiceToggle = (questionId: string, option: string) => {
        const currentAnswers = answers[questionId] || [];
        let newAnswers: string[];

        if (currentAnswers.includes(option)) {
            newAnswers = currentAnswers.filter((item: string) => item !== option);
        } else {
            newAnswers = [...currentAnswers, option];
        }

        setAnswers(prev => ({ ...prev, [questionId]: newAnswers }));
    };

    // Handle lead submission
    const handleSubmitLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // 1. Basic lead validations
        if (!leadName.trim()) {
            setValidationError("Numele complet este obligatoriu.");
            return;
        }

        if (!leadEmail.trim()) {
            setValidationError("Adresa de email este obligatorie.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(leadEmail)) {
            setValidationError("Vă rugăm să introduceți o adresă de email validă.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/chestionar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: leadName,
                    email: leadEmail,
                    phone: leadPhone,
                    source: "evaluare-maturitate-digitala",
                    questionnaireId: data.id,
                    responses: answers,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "A apărut o eroare la salvare.");
            }

            const result = await response.json();
            setReport(result);
            setStep("result");
            toast.success("Datele tale au fost trimise cu succes!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Eroare la procesarea chestionarului. Încearcă din nou.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset questionnaire
    const handleReset = () => {
        setAnswers({});
        setLeadName("");
        setLeadEmail("");
        setLeadPhone("");
        setReport(null);
        setStep("start");
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
            {/* Dynamic Background Premium Glows */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className={cn(
                    "absolute -left-10 top-1/4 h-[350px] w-[350px] rounded-full blur-[100px]",
                    step === "start"
                        ? "bg-blue-500/10 dark:bg-blue-500/5"
                        : "bg-zinc-500/10 dark:bg-zinc-500/5"
                )} />
                <div className={cn(
                    "absolute -right-10 top-1/2 h-[400px] w-[400px] rounded-full blur-[120px]",
                    step === "start"
                        ? "bg-cyan-500/10 dark:bg-cyan-500/5"
                        : "bg-slate-500/10 dark:bg-slate-500/5"
                )} />
            </div>

            {/* START STEP VIEW */}
            {step === "start" && (
                <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-border md:p-12">
                    <div className="flex flex-col items-center text-center">
                        {/* Pulsing Accent Badge */}
                        <div className="mb-6 flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                            Evaluare gratuită
                        </div>

                        <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-5xl bg-gradient-to-r from-foreground via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            {data.title}
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            {data.description}
                        </p>

                        {/* Structured Value Props */}
                        <div className="mt-10 grid w-full gap-4 sm:grid-cols-3 text-left">
                            <div className="rounded-2xl bg-card/40 border p-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 mb-3">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-foreground text-sm">3 Minute</h3>
                                <p className="text-xs text-muted-foreground mt-1">Completare rapidă, întrebări interactive extrem de intuitive.</p>
                            </div>
                            <div className="rounded-2xl bg-card/40 border p-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 mb-3">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-foreground text-sm">Raport Instant</h3>
                                <p className="text-xs text-muted-foreground mt-1">Află scorul de maturitate și unde te situezi pe piață pe loc.</p>
                            </div>
                            <div className="rounded-2xl bg-card/40 border p-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 mb-3">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-foreground text-sm">Recomandări</h3>
                                <p className="text-xs text-muted-foreground mt-1">Primești propuneri concrete de optimizare pentru CRM, cloud sau acte.</p>
                            </div>
                        </div>

                        <Button
                            onClick={() => setStep(0)}
                            size="lg"
                            className="mt-10 h-12 px-8 rounded-full font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 scale-100 hover:scale-[1.03]"
                        >
                            Începe Chestionarul
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* QUESTIONS FLOW VIEW */}
            {typeof step === "number" && (
                <div className="relative rounded-3xl border border-border/50 bg-background/50 p-6 shadow-2xl backdrop-blur-xl md:p-10 transition-all duration-500">
                    {/* Header Progress Tracker */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                            <span className="bg-muted px-2.5 py-1 rounded-full text-foreground/80">
                                Întrebarea {step + 1} din {questions.length}
                            </span>
                            <span>{Math.round(((step + 1) / questions.length) * 100)}% Completat</span>
                        </div>
                        <Progress value={((step + 1) / questions.length) * 100} className="h-1.5 bg-muted" />
                    </div>

                    {/* Question Text */}
                    <div className="min-h-[160px] flex flex-col justify-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                            {questions[step].type === "TEXT" && "Răspuns Text Liber"}
                            {questions[step].type === "RATING" && "Evaluare pe Scară"}
                            {questions[step].type === "SINGLE_CHOICE" && "Selecție Unică"}
                            {questions[step].type === "MULTIPLE_CHOICE" && "Selecție Multiplă (Alege opțiuni)"}
                            {questions[step].required && <span className="ml-1 text-rose-500">*Obligatorie</span>}
                        </span>
                        <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight">
                            {questions[step].text}
                        </h2>
                    </div>

                    {/* Inline Validation Warnings */}
                    {validationError && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-500">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    {/* INPUT FORMS BASED ON TYPE */}
                    <div className="mt-8 min-h-[220px]">
                        {/* 1. TEXT INPUT TYPE */}
                        {questions[step].type === "TEXT" && (
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Scrie răspunsul tău detaliat aici (opțional)..."
                                    className="min-h-[150px] resize-none rounded-2xl border-input/60 bg-card/30 p-4 focus:ring-zinc-500 focus-visible:ring-zinc-500 focus:border-zinc-500 focus-visible:border-zinc-500"
                                    value={answers[questions[step].id] || ""}
                                    onChange={(e) => setAnswers(prev => ({ ...prev, [questions[step].id]: e.target.value }))}
                                />
                                <p className="text-right text-xs text-muted-foreground">
                                    {(answers[questions[step].id] || "").length} caractere
                                </p>
                            </div>
                        )}

                        {/* 2. RATING TYPE */}
                        {questions[step].type === "RATING" && (
                            <div className="flex flex-col items-center justify-center space-y-4 py-4">
                                <div className="flex items-center gap-3">
                                    {[1, 2, 3, 4, 5].map((val) => {
                                        const currentRating = answers[questions[step].id];
                                        const isSelected = currentRating !== undefined && val <= currentRating;
                                        return (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setAnswers(prev => ({ ...prev, [questions[step].id]: val }))}
                                                className={cn(
                                                    "group relative flex h-14 w-14 items-center justify-center rounded-2xl border text-xl font-bold transition-all duration-300",
                                                    isSelected
                                                        ? "border-amber-400 bg-amber-400/10 text-amber-500 shadow-md scale-105"
                                                        : "border-border bg-card/20 text-muted-foreground hover:border-zinc-400/40 hover:text-zinc-500/80 hover:scale-105"
                                                )}
                                            >
                                                <Star className={cn("h-6 w-6 transition-transform group-hover:scale-110", isSelected ? "fill-amber-400 text-amber-400" : "text-muted-foreground/50")} />
                                                <span className="absolute bottom-1 text-[10px]">{val}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex w-full max-w-sm justify-between text-xs font-semibold text-muted-foreground px-2">
                                    <span>Hârtie / Manual</span>
                                    <span>100% Digitalizat</span>
                                </div>
                            </div>
                        )}

                        {/* 3. SINGLE CHOICE TYPE */}
                        {questions[step].type === "SINGLE_CHOICE" && questions[step].options && (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {questions[step].options!.map((opt) => {
                                    const isSelected = answers[questions[step].id] === opt;
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => handleSingleChoiceSelect(questions[step].id, opt, step)}
                                            className={cn(
                                                "flex items-center justify-between rounded-2xl border bg-card/20 p-4 text-left font-medium transition-all duration-300 group hover:scale-[1.02]",
                                                isSelected
                                                    ? "border-zinc-600 bg-zinc-500/5 text-zinc-800 dark:text-zinc-200 shadow-md dark:border-zinc-400"
                                                    : "border-border hover:border-zinc-500/40 hover:bg-card/40"
                                            )}
                                        >
                                            <span className="text-sm leading-snug">{opt}</span>
                                            <div className={cn(
                                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                                                isSelected ? "border-zinc-600 bg-zinc-600 dark:border-zinc-400 dark:bg-zinc-400 text-white" : "border-muted-foreground/30 group-hover:border-zinc-500/40"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* 4. MULTIPLE CHOICE TYPE */}
                        {questions[step].type === "MULTIPLE_CHOICE" && questions[step].options && (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {questions[step].options!.map((opt) => {
                                    const currentAnswers = answers[questions[step].id] || [];
                                    const isSelected = currentAnswers.includes(opt);
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => handleMultipleChoiceToggle(questions[step].id, opt)}
                                            className={cn(
                                                "flex items-center justify-between rounded-2xl border bg-card/20 p-4 text-left font-medium transition-all duration-300 group hover:scale-[1.02]",
                                                isSelected
                                                    ? "border-zinc-600 bg-zinc-500/5 text-zinc-800 dark:text-zinc-200 shadow-md dark:border-zinc-400"
                                                    : "border-border hover:border-zinc-500/40 hover:bg-card/40"
                                            )}
                                        >
                                            <span className="text-sm leading-snug">{opt}</span>
                                            <div className={cn(
                                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
                                                isSelected ? "border-zinc-600 bg-zinc-600 dark:border-zinc-400 dark:bg-zinc-400 text-white" : "border-muted-foreground/30 group-hover:border-zinc-500/40"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Navigation Controls */}
                    <div className="mt-10 flex items-center justify-between border-t border-border/40 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            className="rounded-full px-6 font-semibold"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Înapoi
                        </Button>

                        {/* Render Next button only if it's not single choice (since single choice auto-advances) or if validation requires it */}
                        <Button
                            type="button"
                            onClick={handleNext}
                            className="rounded-full px-6 font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-md"
                        >
                            {step === questions.length - 1 ? "Continuă spre contact" : "Înainte"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* LEAD CAPTURE STEP VIEW */}
            {step === "lead" && (
                <div className="relative rounded-3xl border border-border/50 bg-background/50 p-6 shadow-2xl backdrop-blur-xl md:p-10 transition-all duration-500">
                    <div className="text-center max-w-md mx-auto mb-8">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-500/10 text-zinc-500 dark:bg-zinc-400/10 dark:text-zinc-400 mb-4">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                            Aproape gata!
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            Introdu datele tale de contact pentru a genera raportul tău personalizat de maturitate digitală și a-ți stoca răspunsurile.
                        </p>
                    </div>

                    {/* Inline Errors */}
                    {validationError && (
                        <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-500">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmitLead} className="space-y-5 max-w-md mx-auto">
                        <div className="space-y-1.5">
                            <label htmlFor="lead-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Nume Complet <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/60" />
                                <Input
                                    id="lead-name"
                                    type="text"
                                    placeholder="ex: Andrei Popescu"
                                    className="h-11 pl-11 rounded-xl bg-card/20 border-input/60 focus:ring-zinc-500 focus-visible:ring-zinc-500 focus:border-zinc-500"
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="lead-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Adresă de Email <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/60" />
                                <Input
                                    id="lead-email"
                                    type="email"
                                    placeholder="ex: andrei@companie.ro"
                                    className="h-11 pl-11 rounded-xl bg-card/20 border-input/60 focus:ring-zinc-500 focus-visible:ring-zinc-500 focus:border-zinc-500"
                                    value={leadEmail}
                                    onChange={(e) => setLeadEmail(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="lead-phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Număr de Telefon <span className="text-muted-foreground/75">(Opțional)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/60" />
                                <Input
                                    id="lead-phone"
                                    type="tel"
                                    placeholder="ex: 0712 345 678"
                                    className="h-11 pl-11 rounded-xl bg-card/20 border-input/60 focus:ring-zinc-500 focus-visible:ring-zinc-500 focus:border-zinc-500"
                                    value={leadPhone}
                                    onChange={(e) => setLeadPhone(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 border-t border-border/40 pt-6 mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                className="rounded-full px-6 font-semibold"
                                disabled={isSubmitting}
                            >
                                Înapoi
                            </Button>

                            <Button
                                type="submit"
                                className="flex-1 rounded-full h-11 font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-md"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Se calculează raportul...
                                    </>
                                ) : (
                                    <>
                                        Generează Raportul
                                        <Check className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* RESULTS / REPORT STEP VIEW */}
            {step === "result" && report && (
                <div className="relative rounded-3xl border border-border/50 bg-background/50 p-6 shadow-2xl backdrop-blur-xl md:p-10 transition-all duration-500">
                    <div className="flex flex-col items-center text-center">
                        {/* Animated Score Gauge Container */}
                        <div className="relative flex h-36 w-36 items-center justify-center mb-6">
                            {/* Circular track */}
                            <svg className="absolute h-full w-full transform -rotate-90">
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="64"
                                    className="stroke-muted fill-none"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="64"
                                    className={cn(
                                        "stroke-current fill-none transition-all duration-1000 ease-out",
                                        report.score <= 35 && "text-rose-500",
                                        report.score > 35 && report.score <= 70 && "text-amber-500",
                                        report.score > 70 && "text-emerald-500"
                                    )}
                                    strokeWidth="10"
                                    strokeDasharray={2 * Math.PI * 64}
                                    strokeDashoffset={2 * Math.PI * 64 * (1 - report.score / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            {/* Number display inside gauge */}
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                                    {report.score}%
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                                    Maturitate
                                </span>
                            </div>
                        </div>

                        {/* Assessment Title */}
                        <div className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold shadow-sm border mb-4",
                            report.score <= 35 && "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
                            report.score > 35 && report.score <= 70 && "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                            report.score > 70 && "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        )}>
                            <TrendingUp className="h-3.5 w-3.5" />
                            {report.level}
                        </div>

                        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                            {report.title}
                        </h2>

                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                            {report.description}
                        </p>

                        {/* Recommendations segment */}
                        <div className="mt-8 w-full border-t border-border/40 pt-8 text-left">
                            <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground mb-4">
                                <Sparkles className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                                Recomandări Personalizate pentru Compania Ta:
                            </h3>

                            <div className="grid gap-3">
                                {report.recommendations.map((rec, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-4 items-start rounded-2xl border bg-card/20 p-4 transition-colors hover:bg-card/30"
                                    >
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-500/10 text-zinc-600 dark:bg-zinc-400/10 dark:text-zinc-300 font-bold text-xs">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm leading-relaxed text-foreground/90">
                                            {rec}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Success Action Steps */}
                        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
                            <div className="flex flex-col items-center rounded-2xl border bg-zinc-500/[0.02] border-zinc-500/20 dark:border-zinc-400/25 p-6">
                                <Calendar className="h-6 w-6 text-zinc-500 dark:text-zinc-400 mb-3" />
                                <h4 className="font-semibold text-foreground text-sm">Consultanță Gratuită</h4>
                                <p className="text-xs text-muted-foreground text-center mt-1">Stabilește o discuție de 15 min cu un specialist în digitalizare.</p>
                                <a href="/contact" className="mt-4 w-full flex justify-center">
                                    <Button size="sm" className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold w-full">
                                        Programează Apel
                                    </Button>
                                </a>
                            </div>

                            <div className="flex flex-col items-center rounded-2xl border bg-zinc-500/[0.02] border-zinc-500/20 dark:border-zinc-400/25 p-6">
                                <Building2 className="h-6 w-6 text-zinc-500 dark:text-zinc-400 mb-3" />
                                <h4 className="font-semibold text-foreground text-sm">Servicii Personalizate</h4>
                                <p className="text-xs text-muted-foreground text-center mt-1">Explorează cum putem construi automatizări adaptate 100%.</p>
                                <a href="/servicii" className="mt-4 w-full flex justify-center">
                                    <Button size="sm" variant="outline" className="rounded-full font-semibold border-zinc-500/30 dark:border-zinc-400/30 hover:bg-zinc-500/5 text-zinc-700 dark:text-zinc-300 w-full">
                                        Vezi Servicii
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <Button
                            variant="link"
                            onClick={handleReset}
                            className="mt-8 text-xs text-muted-foreground hover:text-zinc-600 dark:hover:text-zinc-300 font-semibold"
                        >
                            Repornește Chestionarul (Testeză din nou)
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}