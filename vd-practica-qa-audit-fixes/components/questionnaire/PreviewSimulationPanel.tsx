import React from "react";
import { RuleGroup, LogicOperator } from "@/lib/conditional-logic/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Eye, EyeOff, CheckCircle2, XCircle, Info } from "lucide-react";

interface PreviewSimulationPanelProps {
    questions: Array<{ id: string; text: string; order: number; ruleGroups: RuleGroup[]; ruleGroupsOperator?: LogicOperator }>;
    answers: Record<string, any>;
    visibility: Record<string, boolean>;
    onReset: () => void;
}

export default function PreviewSimulationPanel({
    questions,
    answers,
    visibility,
    onReset,
}: PreviewSimulationPanelProps) {
    const conditionalQuestions = questions.filter((q) => q.ruleGroups && q.ruleGroups.length > 0);

    return (
        <Card className="h-full border-l border-border/80 bg-background/95 backdrop-blur-md rounded-none shadow-xl flex flex-col w-80">
            <CardHeader className="py-4 px-4 border-b border-border/40 bg-muted/30">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                    <Info className="h-4 w-4 text-blue-500" />
                    Control Simulare Reguli
                </CardTitle>
                <p className="text-[11px] text-muted-foreground leading-snug">
                    Monitorizează starea răspunsurilor și vizibilitatea dinamică în timp real.
                </p>
            </CardHeader>

            <ScrollArea className="flex-1 px-4 py-3 space-y-4">
                {/* Answers State */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Răspunsuri Curente
                    </h3>
                    {Object.keys(answers).length === 0 ? (
                        <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl border border-dashed border-border/40 text-center">
                            Niciun răspuns înregistrat.
                        </div>
                    ) : (
                        <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                            {Object.entries(answers).map(([qId, val]) => {
                                const question = questions.find((q) => q.id === qId);
                                const qNum = question?.order ? `Q${question.order}` : "Start";
                                return (
                                    <div
                                        key={qId}
                                        className="text-xs p-2 rounded-lg bg-card border border-border/30 flex items-center justify-between gap-2"
                                    >
                                        <span className="font-semibold text-muted-foreground whitespace-nowrap">{qNum}:</span>
                                        <span className="text-foreground truncate max-w-[180px]">
                                            {Array.isArray(val) ? val.join(", ") : String(val)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <Separator className="my-4" />

                {/* Rule Evaluations */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Stare Reguli de Ramificare
                    </h3>
                    {conditionalQuestions.length === 0 ? (
                        <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl border border-dashed border-border/40 text-center">
                            Nu există întrebări cu reguli configurate.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {conditionalQuestions.map((q) => {
                                const isVisible = visibility[q.id] !== false;
                                return (
                                    <div
                                        key={q.id}
                                        className="p-3 rounded-xl bg-card border border-border/40 space-y-2 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-xs font-bold text-foreground line-clamp-2">
                                                Q{q.order}: {q.text}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isVisible ? (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] rounded-lg px-1.5 py-0.5 flex items-center gap-1 font-semibold"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    Afișată (Regulă îndeplinită)
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] rounded-lg px-1.5 py-0.5 flex items-center gap-1 font-semibold"
                                                >
                                                    <EyeOff className="h-3 w-3" />
                                                    Ascunsă (Regulă neîndeplinită)
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Show conditions */}
                                        <div className="space-y-1 pl-1 border-l-2 border-muted">
                                            {q.ruleGroups.map((g, gIdx) => (
                                                <div key={gIdx} className="text-[10px] text-muted-foreground space-y-0.5">
                                                    <div className="font-semibold uppercase tracking-wider text-[8px] text-muted-foreground/80">
                                                        Grup ({g.logicOperator})
                                                    </div>
                                                    {g.conditions.map((c, cIdx) => {
                                                        const srcQ = questions.find((sq) => sq.id === c.sourceQuestionId);
                                                        const srcAns = answers[c.sourceQuestionId];
                                                        const condPassed =
                                                            srcAns !== undefined &&
                                                            (c.operator === "IS_EMPTY" ||
                                                                c.operator === "IS_NOT_EMPTY" ||
                                                                srcAns !== "");

                                                        return (
                                                            <div key={cIdx} className="flex items-center gap-1.5 leading-snug">
                                                                {condPassed ? (
                                                                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                                                                ) : (
                                                                    <XCircle className="h-2.5 w-2.5 text-rose-400 shrink-0" />
                                                                )}{" "}
                                                                <span className="truncate">
                                                                    Q{srcQ?.order || "?"} {c.operator.toLowerCase().replace("_", " ")}{" "}
                                                                    {c.value && `"${c.value}"`}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/40 bg-muted/20">
                <Button
                    onClick={onReset}
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full border-border/60 hover:bg-muted font-semibold flex items-center justify-center gap-2"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Resetare Simulare
                </Button>
            </div>
        </Card>
    );
}