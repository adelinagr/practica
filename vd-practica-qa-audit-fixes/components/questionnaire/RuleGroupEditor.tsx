import React from "react";
import { RuleGroup, Condition } from "@/lib/conditional-logic/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { ConditionRow } from "./ConditionRow";

interface RuleGroupEditorProps {
    questions: Array<{ id: string; text: string; order: number; options?: any; type: string }>;
    currentQuestionId: string;
    ruleGroup: RuleGroup;
    onChange: (updated: RuleGroup) => void;
    onRemove: () => void;
}

export function RuleGroupEditor({
    questions,
    currentQuestionId,
    ruleGroup,
    onChange,
    onRemove,
}: RuleGroupEditorProps) {
    const handleConditionChange = (idx: number, updatedCond: Condition) => {
        const nextConditions = [...ruleGroup.conditions];
        nextConditions[idx] = updatedCond;
        onChange({ ...ruleGroup, conditions: nextConditions });
    };

    const handleAddCondition = () => {
        // Find first preceding question as a default source
        const currentQuestion = questions.find((q) => q.id === currentQuestionId);
        const eligibleSources = questions.filter((q) => q.order < (currentQuestion?.order || 0));

        if (eligibleSources.length === 0) return;

        const newCond: Condition = {
            ruleGroupId: ruleGroup.id || "temp",
            sourceQuestionId: eligibleSources[0].id,
            operator: "EQUALS",
            value: "",
            valueSecondary: "",
        };

        onChange({
            ...ruleGroup,
            conditions: [...ruleGroup.conditions, newCond],
        });
    };

    const handleRemoveCondition = (idx: number) => {
        const nextConditions = ruleGroup.conditions.filter((_, i) => i !== idx);
        onChange({ ...ruleGroup, conditions: nextConditions });
    };

    return (
        <Card className="border border-border/80 bg-card/25 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 bg-muted/40 border-b border-border/30">
                <div className="flex items-center gap-3">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Grup Reguli
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Condiții conectate prin:</span>
                        <Select
                            value={ruleGroup.logicOperator}
                            onValueChange={(val: "AND" | "OR") => onChange({ ...ruleGroup, logicOperator: val })}
                        >
                            <SelectTrigger className="w-[80px] h-7 text-xs bg-background rounded-lg border-border/40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AND">AND</SelectItem>
                                <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-muted-foreground hover:text-destructive h-8 px-2 hover:bg-destructive/10 rounded-xl"
                >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Șterge Grup
                </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                {ruleGroup.conditions.length === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border/40 rounded-xl bg-card/10">
                        Nu există condiții în acest grup. Adaugă o condiție mai jos.
                    </div>
                ) : (
                    ruleGroup.conditions.map((cond, idx) => (
                        <ConditionRow
                            key={idx}
                            questions={questions}
                            currentQuestionId={currentQuestionId}
                            condition={cond}
                            onChange={(updated) => handleConditionChange(idx, updated)}
                            onRemove={() => handleRemoveCondition(idx)}
                        />
                    ))
                )}

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCondition}
                    className="w-full mt-2 border-dashed border-border/60 hover:border-zinc-500/40 rounded-xl hover:bg-muted/40 font-semibold"
                >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Adaugă Condiție
                </Button>
            </CardContent>
        </Card>
    );
}