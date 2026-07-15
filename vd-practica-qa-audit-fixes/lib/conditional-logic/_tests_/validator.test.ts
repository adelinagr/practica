import { describe, it, expect } from "vitest";
import { validateQuestionnaireRules, validateCondition } from "../validator";
import { RuleGroup, Condition } from "../types";

describe("validateCondition", () => {
    it("validates value requirement", () => {
        const cond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "EQUALS",
            value: "",
        };
        const errors = validateCondition(cond, 0);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe("VALUE_REQUIRED");
    });

    it("validates BETWEEN operator secondary value and ranges", () => {
        const condNoSecondary: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "BETWEEN",
            value: "10",
            valueSecondary: "",
        };
        const errors1 = validateCondition(condNoSecondary, 0);
        expect(errors1.length).toBe(1);
        expect(errors1[0].code).toBe("SECONDARY_VALUE_REQUIRED");

        const condInvalidRange: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "BETWEEN",
            value: "20",
            valueSecondary: "10",
        };
        const errors2 = validateCondition(condInvalidRange, 0);
        expect(errors2.length).toBe(1);
        expect(errors2[0].code).toBe("BETWEEN_VALUE_RANGE_INVALID");
    });
});

describe("validateQuestionnaireRules", () => {
    const mockQuestions = [
        { id: "q1", order: 1 },
        { id: "q2", order: 2 },
        { id: "q3", order: 3 },
    ];

    it("fails if sourceQuestion is after targetQuestion in order", () => {
        const invalidGroup: RuleGroup = {
            questionId: "q1", // target Q1 (order 1)
            logicOperator: "AND",
            conditions: [
                {
                    ruleGroupId: "g1",
                    sourceQuestionId: "q2", // source Q2 (order 2)
                    operator: "EQUALS",
                    value: "Yes",
                },
            ],
        };

        const errors = validateQuestionnaireRules(mockQuestions, [invalidGroup]);
        expect(errors.length).toBe(1);
        expect(errors[0].code).toBe("INVALID_QUESTION_ORDER");
    });

    it("fails if targetQuestion references itself", () => {
        const selfReferencingGroup: RuleGroup = {
            questionId: "q2",
            logicOperator: "AND",
            conditions: [
                {
                    ruleGroupId: "g1",
                    sourceQuestionId: "q2",
                    operator: "EQUALS",
                    value: "Yes",
                },
            ],
        };

        const errors = validateQuestionnaireRules(mockQuestions, [selfReferencingGroup]);
        expect(errors.some(e => e.code === "SELF_REFERENCING_RULE")).toBe(true);
    });

    it("fails if circular dependency is detected", () => {
        // Build a dependency cycle: q3 depends on q2, and q2 depends on q3 (note: ordering constraint prevents this during normal saves, but let's test cycle logic separately)
        const questionsWithFlippedOrder = [
            { id: "q1", order: 1 },
            { id: "q2", order: 2 },
            { id: "q3", order: 2 }, // equal order to simulate cycle bypassing basic order check
        ];
        const rules: RuleGroup[] = [
            {
                questionId: "q3",
                logicOperator: "AND",
                conditions: [{ ruleGroupId: "g1", sourceQuestionId: "q2", operator: "EQUALS", value: "Yes" }],
            },
            {
                questionId: "q2",
                logicOperator: "AND",
                conditions: [{ ruleGroupId: "g2", sourceQuestionId: "q3", operator: "EQUALS", value: "Yes" }],
            },
        ];

        const errors = validateQuestionnaireRules(questionsWithFlippedOrder, rules);
        expect(errors.some(e => e.code === "CIRCULAR_DEPENDENCY")).toBe(true);
    });
});