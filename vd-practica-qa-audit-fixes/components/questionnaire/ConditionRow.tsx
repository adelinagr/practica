import React from "react";
import { Condition, ConditionOperator } from "@/lib/conditional-logic/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface ConditionRowProps {
    questions: Array<{ id: string; text: string; order: number; options?: any; type: string }>;
    currentQuestionId: string;
    condition: Condition;
    onChange: (updated: Condition) => void;
    onRemove: () => void;
}

const OPERATORS: Array<{ value: ConditionOperator; label: string }> = [
    { value: "EQUALS", label: "este egal cu" },
    { value: "NOT_EQUALS", label: "nu este egal cu" },
    { value: "CONTAINS", label: "conține textul" },
    { value: "NOT_CONTAINS", label: "nu conține textul" },
    { value: "IS_EMPTY", label: "este gol" },
    { value: "IS_NOT_EMPTY", label: "nu este gol" },
    { value: "GT", label: "mai mare decât" },
    { value: "LT", label: "mai mic decât" },
    { value: "BETWEEN", label: "între" },
    { value: "INCLUDES", label: "include opțiunea" },
    { value: "EXCLUDES", label: "exclude opțiunea" },
];

export function ConditionRow({
    questions,
    currentQuestionId,
    condition,
    onChange,
    onRemove,
}: ConditionRowProps) {
    // Filter questions that precede the current question in order
    const currentQuestion = questions.find((q) => q.id === currentQuestionId);
    const currentOrder = currentQuestion?.order || 0;
    const eligibleSources = questions.filter((q) => q.order < currentOrder);

    const selectedSource = questions.find((q) => q.id === condition.sourceQuestionId);
    const sourceOptions = Array.isArray(selectedSource?.options)
        ? (selectedSource.options as string[])
        : typeof selectedSource?.options === "string"
            ? JSON.parse(selectedSource.options)
            : [];

    const handleSourceChange = (val: string) => {
        onChange({
            ...condition,
            sourceQuestionId: val,
            value: "",
            valueSecondary: "",
        });
    };

    const handleOperatorChange = (val: ConditionOperator) => {
        onChange({
            ...condition,
            operator: val,
            value: val === "IS_EMPTY" || val === "IS_NOT_EMPTY" ? null : "",
            valueSecondary: "",
        });
    };

    const showValueField = condition.operator !== "IS_EMPTY" && condition.operator !== "IS_NOT_EMPTY";
    const showSecondaryField = condition.operator === "BETWEEN";

    return (
        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center bg-card/40 p-3 rounded-xl border border-border/40 w-full">
            {/* 1. Source Question Selector */}
            <div className="flex-1 min-w-[200px] w-full">
                <Select value={condition.sourceQuestionId} onValueChange={handleSourceChange}>
                    <SelectTrigger className="bg-background rounded-xl">
                        <SelectValue placeholder="Alege întrebarea sursă..." />
                    </SelectTrigger>
                    <SelectContent>
                        {eligibleSources.map((q) => (
                            <SelectItem key={q.id} value={q.id}>
                                Q{q.order}: {q.text.substring(0, 50)}...
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 2. Operator Selector */}
            <div className="w-full md:w-[180px]">
                <Select value={condition.operator} onValueChange={handleOperatorChange}>
                    <SelectTrigger className="bg-background rounded-xl">
                        <SelectValue placeholder="Alege operatorul..." />
                    </SelectTrigger>
                    <SelectContent>
                        {OPERATORS.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                                {op.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 3. Primary Value Input / Selector */}
            {showValueField && (
                <div className="flex-1 min-w-[150px] w-full">
                    {sourceOptions.length > 0 &&
                        (condition.operator === "EQUALS" ||
                            condition.operator === "NOT_EQUALS" ||
                            condition.operator === "INCLUDES" ||
                            condition.operator === "EXCLUDES") ? (
                        <Select
                            value={condition.value || ""}
                            onValueChange={(val) => onChange({ ...condition, value: val })}
                        >
                            <SelectTrigger className="bg-background rounded-xl">
                                <SelectValue placeholder="Alege opțiunea..." />
                            </SelectTrigger>
                            <SelectContent>
                                {sourceOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            type={condition.operator === "GT" || condition.operator === "LT" || condition.operator === "BETWEEN" ? "number" : "text"}
                            placeholder="Valoare..."
                            value={condition.value || ""}
                            onChange={(e) => onChange({ ...condition, value: e.target.value })}
                            className="bg-background rounded-xl h-10"
                        />
                    )}
                </div>
            )}

            {/* 4. Secondary Value (Between Operator) */}
            {showSecondaryField && (
                <div className="w-full md:w-[120px]">
                    <Input
                        type="number"
                        placeholder="Valoare max..."
                        value={condition.valueSecondary || ""}
                        onChange={(e) => onChange({ ...condition, valueSecondary: e.target.value })}
                        className="bg-background rounded-xl h-10"
                    />
                </div>
            )}

            {/* 5. Delete Action Button */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="text-muted-foreground hover:text-destructive rounded-xl hover:bg-destructive/10"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}