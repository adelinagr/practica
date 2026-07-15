import React, { useState, useEffect } from "react";
import { RuleGroup, LogicOperator, ValidationError } from "@/lib/conditional-logic/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, Plus, HelpCircle } from "lucide-react";
import { RuleGroupEditor } from "./RuleGroupEditor";
import { Separator } from "@/components/ui/separator";

interface ConditionalRuleBuilderProps {
    questionnaireId: string;
    questionId: string;
    questions: Array<{ id: string; text: string; order: number; options?: any; type: string }>;
    onSaveSuccess?: () => void;
}

export default function ConditionalRuleBuilder({
    questionnaireId,
    questionId,
    questions,
    onSaveSuccess,
}: ConditionalRuleBuilderProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([]);
    const [groupsOperator, setGroupsOperator] = useState<LogicOperator>("AND");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Load questionnaire rules
    useEffect(() => {
        async function loadRules() {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/questionnaires/${questionnaireId}/rules`);
                if (res.ok) {
                    const allGroups: RuleGroup[] = await res.json();
                    // Filter groups for this specific question
                    const questionGroups = allGroups.filter((g) => g.questionId === questionId);
                    setRuleGroups(questionGroups);
                    setIsEnabled(questionGroups.length > 0);

                    // Fetch target question operator
                    const targetQ = questions.find((q) => q.id === questionId);
                    if (targetQ) {
                        // Assume logic operator comes from the backend or question schema
                        // For now default to AND
                        setGroupsOperator("AND");
                    }
                }
            } catch (err) {
                console.error("Failed to load rules:", err);
            } finally {
                setIsLoading(false);
            }
        }

        loadRules();
    }, [questionnaireId, questionId, questions]);

    const handleToggleEnable = (checked: boolean) => {
        setIsEnabled(checked);
        if (checked && ruleGroups.length === 0) {
            // Add one initial empty group
            setRuleGroups([
                {
                    questionId,
                    logicOperator: "AND",
                    conditions: [],
                },
            ]);
        } else if (!checked) {
            setRuleGroups([]);
            setErrors([]);
        }
    };

    const handleAddGroup = () => {
        setRuleGroups([
            ...ruleGroups,
            {
                questionId,
                logicOperator: "AND",
                conditions: [],
            },
        ]);
    };

    const handleGroupChange = (idx: number, updatedGroup: RuleGroup) => {
        const nextGroups = [...ruleGroups];
        nextGroups[idx] = updatedGroup;
        setRuleGroups(nextGroups);
    };

    const handleRemoveGroup = (idx: number) => {
        const nextGroups = ruleGroups.filter((_, i) => i !== idx);
        setRuleGroups(nextGroups);
        if (nextGroups.length === 0) {
            setIsEnabled(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrors([]);
        setSuccessMessage(null);

        try {
            // 1. Dry run validation on all rules first
            const dryRunRes = await fetch(`/api/questionnaires/${questionnaireId}/validate-rules`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ruleGroups),
            });

            const dryRunData = await dryRunRes.json();
            if (!dryRunData.valid) {
                setErrors(dryRunData.errors || []);
                setIsSaving(false);
                return;
            }

            // 2. Perform save operation
            // Delete existing groups first, then write new ones (simplifies code-logic API endpoints)
            // Call POST for each group in ruleGroups
            // First, get currently persisted groups
            const currentRes = await fetch(`/api/questionnaires/${questionnaireId}/rules`);
            const allPersisted: RuleGroup[] = await currentRes.json();
            const thisQuestionPersisted = allPersisted.filter((g) => g.questionId === questionId);

            // Delete all current ones
            for (const g of thisQuestionPersisted) {
                if (g.id) {
                    await fetch(`/api/questionnaires/${questionnaireId}/rules/${g.id}`, {
                        method: "DELETE",
                    });
                }
            }

            // Create new ones
            for (const g of ruleGroups) {
                await fetch(`/api/questionnaires/${questionnaireId}/rules`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        questionId: g.questionId,
                        logicOperator: g.logicOperator,
                        conditions: g.conditions.map((c) => ({
                            sourceQuestionId: c.sourceQuestionId,
                            operator: c.operator,
                            value: c.value,
                            valueSecondary: c.valueSecondary,
                        })),
                    }),
                });
            }

            setSuccessMessage("Regulile de vizibilitate au fost salvate cu succes!");
            onSaveSuccess?.();
        } catch (err) {
            console.error("Save rules error:", err);
            setErrors([{ field: "general", message: "Eroare la comunicarea cu serverul.", code: "SERVER_ERROR" }]);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Se încarcă regulile de vizibilitate...
            </div>
        );
    }

    // Find if there is an order error to prevent creating rules if it's the first question
    const currentQ = questions.find((q) => q.id === questionId);
    const precedingQuestionsCount = questions.filter((q) => q.order < (currentQ?.order || 0)).length;

    if (precedingQuestionsCount === 0) {
        return (
            <div className="p-4 bg-muted/30 rounded-2xl text-center text-sm text-muted-foreground border border-border/40">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                Aceasta este prima întrebare din chestionar. Nu puteți crea reguli de vizibilitate deoarece nu există răspunsuri anterioare.
            </div>
        );
    }

    return (
        <div className="space-y-5 p-4 bg-background/50 rounded-2xl border border-border/60 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-foreground">Afișează condiționat întrebarea</Label>
                    <p className="text-xs text-muted-foreground">
                        Afișează această întrebare doar dacă sunt îndeplinite anumite condiții anterioare.
                    </p>
                </div>
                <Switch checked={isEnabled} onCheckedChange={handleToggleEnable} disabled={isSaving} />
            </div>

            {isEnabled && (
                <div className="space-y-4 pt-3 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
                    {ruleGroups.length > 1 && (
                        <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border/40">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Combină grupurile cu:
                            </span>
                            <Select
                                value={groupsOperator}
                                onValueChange={(val: LogicOperator) => setGroupsOperator(val)}
                            >
                                <SelectTrigger className="w-[85px] h-8 text-xs bg-background rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AND">AND (Toate)</SelectItem>
                                    <SelectItem value="OR">OR (Oricare)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-4">
                        {ruleGroups.map((group, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && (
                                    <div className="relative py-2 flex items-center justify-center">
                                        <Separator className="absolute w-full" />
                                        <span className="relative px-3 bg-background text-xs font-bold text-muted-foreground uppercase border border-border/40 rounded-full py-0.5">
                                            {groupsOperator}
                                        </span>
                                    </div>
                                )}
                                <RuleGroupEditor
                                    questions={questions}
                                    currentQuestionId={questionId}
                                    ruleGroup={group}
                                    onChange={(updated) => handleGroupChange(idx, updated)}
                                    onRemove={() => handleRemoveGroup(idx)}
                                />
                            </React.Fragment>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddGroup}
                        className="w-full rounded-xl hover:bg-muted/40 font-semibold"
                        disabled={isSaving}
                    >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Adaugă Grup Nou de Reguli
                    </Button>
                </div>
            )}

            {errors.length > 0 && (
                <Alert variant="destructive" className="rounded-xl border-destructive/30 bg-destructive/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Eroare de Validare</AlertTitle>
                    <AlertDescription className="text-xs space-y-1">
                        {errors.map((err, idx) => (
                            <div key={idx}>• {err.message}</div>
                        ))}
                    </AlertDescription>
                </Alert>
            )}

            {successMessage && (
                <Alert className="rounded-xl border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <AlertTitle>Succes</AlertTitle>
                    <AlertDescription className="text-xs">{successMessage}</AlertDescription>
                </Alert>
            )}

            {isEnabled && (
                <div className="flex justify-end gap-3 border-t border-border/40 pt-4">
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-full px-6 font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-sm"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Se salvează...
                            </>
                        ) : (
                            "Salvează Regulile"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}