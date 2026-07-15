import { Condition, RuleGroup, LogicOperator } from "./types";

/**
 * Evaluates a single condition against a provided answer.
 * 
 * @param condition The condition configuration (operator, values).
 * @param answer The active answer for the source question.
 * @returns boolean indicating if the condition is satisfied.
 */
export function evaluateCondition(condition: Condition, answer: any): boolean {
    const { operator, value, valueSecondary } = condition;

    // Handle empty checks first
    if (operator === "IS_EMPTY") {
        return (
            answer === undefined ||
            answer === null ||
            answer === "" ||
            (Array.isArray(answer) && answer.length === 0)
        );
    }
    if (operator === "IS_NOT_EMPTY") {
        return (
            answer !== undefined &&
            answer !== null &&
            answer !== "" &&
            (!Array.isArray(answer) || answer.length > 0)
        );
    }

    // For other operators, if answer is empty/missing, the condition is not met
    if (answer === undefined || answer === null || answer === "") {
        return false;
    }

    const answerStr = String(answer);
    const valStr = value || "";

    switch (operator) {
        case "EQUALS":
            return answerStr.toLowerCase() === valStr.toLowerCase();
        case "NOT_EQUALS":
            return answerStr.toLowerCase() !== valStr.toLowerCase();
        case "CONTAINS":
            return answerStr.toLowerCase().includes(valStr.toLowerCase());
        case "NOT_CONTAINS":
            return !answerStr.toLowerCase().includes(valStr.toLowerCase());
        case "GT": {
            const numAns = Number(answer);
            const numVal = Number(valStr);
            return !isNaN(numAns) && !isNaN(numVal) && numAns > numVal;
        }
        case "LT": {
            const numAns = Number(answer);
            const numVal = Number(valStr);
            return !isNaN(numAns) && !isNaN(numVal) && numAns < numVal;
        }
        case "BETWEEN": {
            const numAns = Number(answer);
            const numMin = Number(valStr);
            const numMax = Number(valueSecondary || "");
            return (
                !isNaN(numAns) &&
                !isNaN(numMin) &&
                !isNaN(numMax) &&
                numAns >= numMin &&
                numAns <= numMax
            );
        }
        case "INCLUDES": {
            if (Array.isArray(answer)) {
                return answer.some((ans) => String(ans).toLowerCase() === valStr.toLowerCase());
            }
            return answerStr
                .toLowerCase()
                .split(",")
                .map((s) => s.trim())
                .includes(valStr.toLowerCase());
        }
        case "EXCLUDES": {
            if (Array.isArray(answer)) {
                return !answer.some((ans) => String(ans).toLowerCase() === valStr.toLowerCase());
            }
            return !answerStr
                .toLowerCase()
                .split(",")
                .map((s) => s.trim())
                .includes(valStr.toLowerCase());
        }
        default:
            return false;
    }
}

/**
 * Evaluates a list of conditions for a rule group.
 * 
 * @param ruleGroups The array of rule groups configured for a question.
 * @param answers Key-value record of current answers.
 * @param combinationOperator The top-level logic operator (AND | OR) combining the groups.
 * @returns boolean indicating if the rules evaluate to true (visible).
 */
export function evaluateRuleGroups(
    ruleGroups: RuleGroup[],
    answers: Record<string, any>,
    combinationOperator: LogicOperator = "AND"
): boolean {
    if (!ruleGroups || ruleGroups.length === 0) {
        return true; // Visible by default
    }

    const groupResults = ruleGroups.map((group) => {
        if (!group.conditions || group.conditions.length === 0) {
            return true;
        }
        const conditionResults = group.conditions.map((cond) => {
            const ans = answers[cond.sourceQuestionId];
            return evaluateCondition(cond, ans);
        });

        if (group.logicOperator === "AND") {
            return conditionResults.every(Boolean);
        } else {
            return conditionResults.some(Boolean);
        }
    });

    if (combinationOperator === "AND") {
        return groupResults.every(Boolean);
    } else {
        return groupResults.some(Boolean);
    }
}

/**
 * Evaluates visibility for all questions in the questionnaire sequence.
 * Handles nested flows: if a question's parent/dependency is hidden, its downstream visibility is updated.
 * 
 * @param questions List of questions containing rules and rules operator.
 * @param answers Current answer states.
 * @returns Record of questionId keys to boolean visibility values.
 */
export function evaluateQuestionnaireVisibility(
    questions: Array<{ id: string; ruleGroups: RuleGroup[]; ruleGroupsOperator?: LogicOperator }>,
    answers: Record<string, any>
): Record<string, boolean> {
    const visibility: Record<string, boolean> = {};
    const activeAnswers = { ...answers };

    for (const q of questions) {
        if (q.ruleGroups && q.ruleGroups.length > 0) {
            // Filter answers to exclude answers from hidden questions
            const filteredAnswers: Record<string, any> = {};
            for (const [ansQId, ansVal] of Object.entries(activeAnswers)) {
                if (visibility[ansQId] !== false) {
                    filteredAnswers[ansQId] = ansVal;
                }
            }

            const isVisible = evaluateRuleGroups(q.ruleGroups, filteredAnswers, q.ruleGroupsOperator || "AND");
            visibility[q.id] = isVisible;

            if (!isVisible) {
                // Remove answer from active answers if it becomes hidden to disable downstream checks
                delete activeAnswers[q.id];
            }
        } else {
            visibility[q.id] = true;
        }
    }

    return visibility;
}