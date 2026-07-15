import { RuleGroup, Condition } from "./types";

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

/**
 * Validates a single condition's operator rules and value configurations.
 * 
 * @param condition The condition schema.
 * @param index The condition's array index for errors.
 * @returns Array of ValidationErrors, empty if valid.
 */
export function validateCondition(
    condition: Condition,
    index: number
): ValidationError[] {
    const errors: ValidationError[] = [];
    const { operator, value, valueSecondary } = condition;

    if (operator !== "IS_EMPTY" && operator !== "IS_NOT_EMPTY") {
        if (!value || value.trim() === "") {
            errors.push({
                field: `conditions[${index}].value`,
                message: "Valoarea este obligatorie pentru operatorul selectat.",
                code: "VALUE_REQUIRED",
            });
        }
    }

    if (operator === "BETWEEN") {
        if (!valueSecondary || valueSecondary.trim() === "") {
            errors.push({
                field: `conditions[${index}].valueSecondary`,
                message: "Valoarea secundară este obligatorie pentru operatorul BETWEEN.",
                code: "SECONDARY_VALUE_REQUIRED",
            });
        } else {
            const numMin = Number(value);
            const numMax = Number(valueSecondary);
            if (isNaN(numMin) || isNaN(numMax)) {
                errors.push({
                    field: `conditions[${index}].valueSecondary`,
                    message: "Valorile pentru operatorul BETWEEN trebuie să fie numerice.",
                    code: "NUMERIC_VALUE_REQUIRED",
                });
            } else if (numMin >= numMax) {
                errors.push({
                    field: `conditions[${index}].valueSecondary`,
                    message: "Valoarea secundară trebuie să fie mai mare decât valoarea inițială.",
                    code: "BETWEEN_VALUE_RANGE_INVALID",
                });
            }
        }
    }

    return errors;
}

/**
 * Validates questionnaire rules for ordering constraints and circular dependency cycles.
 * 
 * @param questions List of questions ordered by questionnaire order.
 * @param allRuleGroups List of all rule groups inside the questionnaire.
 * @returns Array of validation errors, empty if config is correct.
 */
export function validateQuestionnaireRules(
    questions: Array<{ id: string; order: number }>,
    allRuleGroups: RuleGroup[]
): ValidationError[] {
    const errors: ValidationError[] = [];
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    // 1. Basic checks: order and self-reference
    for (const group of allRuleGroups) {
        const targetQ = questionMap.get(group.questionId);
        if (!targetQ) {
            errors.push({
                field: "questionId",
                message: `Întrebarea țintă ${group.questionId} nu există.`,
                code: "INVALID_TARGET_QUESTION",
            });
            continue;
        }

        if (!group.conditions) continue;

        group.conditions.forEach((cond, idx) => {
            // Validate operator values
            errors.push(...validateCondition(cond, idx));

            const sourceQ = questionMap.get(cond.sourceQuestionId);
            if (!sourceQ) {
                errors.push({
                    field: `conditions[${idx}].sourceQuestionId`,
                    message: "Întrebarea sursă nu există.",
                    code: "INVALID_SOURCE_QUESTION",
                });
                return;
            }

            if (cond.sourceQuestionId === group.questionId) {
                errors.push({
                    field: `conditions[${idx}].sourceQuestionId`,
                    message: "O întrebare nu se poate referi la ea însăși în reguli.",
                    code: "SELF_REFERENCING_RULE",
                });
            } else if (sourceQ.order >= targetQ.order) {
                errors.push({
                    field: `conditions[${idx}].sourceQuestionId`,
                    message: "Întrebarea sursă trebuie să preceadă întrebarea țintă în ordinea chestionarului.",
                    code: "INVALID_QUESTION_ORDER",
                });
            }
        });
    }

    // 2. Circular dependency check (graph DFS)
    // Build adjacency list: target -> source dependencies
    const adj = new Map<string, string[]>();
    for (const group of allRuleGroups) {
        if (!questionMap.has(group.questionId)) continue;
        if (!group.conditions) continue;

        const sources = group.conditions
            .map((c) => c.sourceQuestionId)
            .filter((srcId) => questionMap.has(srcId));

        adj.set(group.questionId, sources);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    function hasCycle(node: string): boolean {
        if (recStack.has(node)) return true;
        if (visited.has(node)) return false;

        visited.add(node);
        recStack.add(node);

        const neighbors = adj.get(node) || [];
        for (const neighbor of neighbors) {
            if (hasCycle(neighbor)) return true;
        }

        recStack.delete(node);
        return false;
    }

    for (const group of allRuleGroups) {
        visited.clear();
        recStack.clear();
        if (hasCycle(group.questionId)) {
            errors.push({
                field: "logicGraph",
                message: "A fost detectată o dependență circulară între reguli.",
                code: "CIRCULAR_DEPENDENCY",
            });
            break;
        }
    }

    return errors;
}