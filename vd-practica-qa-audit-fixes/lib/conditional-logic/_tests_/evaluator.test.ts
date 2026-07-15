import { describe, it, expect } from "vitest";
import { evaluateCondition, evaluateRuleGroups, evaluateQuestionnaireVisibility } from "../evaluator";
import { Condition, RuleGroup, ConditionOperator } from "../types";

describe("evaluateCondition", () => {
    it("evaluates EQUALS operator", () => {
        const cond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "EQUALS",
            value: "Yes",
        };
        expect(evaluateCondition(cond, "Yes")).toBe(true);
        expect(evaluateCondition(cond, "yes")).toBe(true); // case-insensitive
        expect(evaluateCondition(cond, "No")).toBe(false);
    });

    it("evaluates NOT_EQUALS operator", () => {
        const cond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "NOT_EQUALS",
            value: "Yes",
        };
        expect(evaluateCondition(cond, "No")).toBe(true);
        expect(evaluateCondition(cond, "Yes")).toBe(false);
    });

    it("evaluates CONTAINS and NOT_CONTAINS operators", () => {
        const containsCond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "CONTAINS",
            value: "retail",
        };
        const notContainsCond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "NOT_CONTAINS",
            value: "retail",
        };
        expect(evaluateCondition(containsCond, "Comerț / Retail")).toBe(true);
        expect(evaluateCondition(containsCond, "Servicii")).toBe(false);
        expect(evaluateCondition(notContainsCond, "Servicii")).toBe(true);
    });

    it("evaluates IS_EMPTY and IS_NOT_EMPTY operators", () => {
        const emptyCond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "IS_EMPTY",
        };
        const notEmptyCond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "IS_NOT_EMPTY",
        };
        expect(evaluateCondition(emptyCond, "")).toBe(true);
        expect(evaluateCondition(emptyCond, null)).toBe(true);
        expect(evaluateCondition(emptyCond, undefined)).toBe(true);
        expect(evaluateCondition(emptyCond, "some answer")).toBe(false);

        expect(evaluateCondition(notEmptyCond, "some answer")).toBe(true);
        expect(evaluateCondition(notEmptyCond, "")).toBe(false);
    });

    it("evaluates GT, LT, and BETWEEN numeric operators", () => {
        const gtCond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "GT",
            value: "10",
        };
        const ltCond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "LT",
            value: "10",
        };
        const betweenCond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "BETWEEN",
            value: "5",
            valueSecondary: "15",
        };

        expect(evaluateCondition(gtCond, 15)).toBe(true);
        expect(evaluateCondition(gtCond, 10)).toBe(false);

        expect(evaluateCondition(ltCond, 5)).toBe(true);
        expect(evaluateCondition(ltCond, 10)).toBe(false);

        expect(evaluateCondition(betweenCond, 10)).toBe(true);
        expect(evaluateCondition(betweenCond, 5)).toBe(true);
        expect(evaluateCondition(betweenCond, 15)).toBe(true);
        expect(evaluateCondition(betweenCond, 4)).toBe(false);
    });

    it("evaluates INCLUDES and EXCLUDES multi-choice operators", () => {
        const includesCond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "INCLUDES",
            value: "CRM",
        };
        const excludesCond: Condition = {
            ruleGroupId: "g1",
            sourceQuestionId: "q1",
            operator: "EXCLUDES",
            value: "CRM",
        };

        expect(evaluateCondition(includesCond, ["CRM", "Excel"])).toBe(true);
        expect(evaluateCondition(includesCond, ["Excel"])).toBe(false);

        expect(evaluateCondition(excludesCond, ["Excel"])).toBe(true);
        expect(evaluateCondition(excludesCond, ["CRM", "Excel"])).toBe(false);
    });
});

describe("evaluateRuleGroups", () => {
    it("evaluates AND / OR logic groups", () => {
        const groupAnd: RuleGroup = {
            questionId: "qTarget",
            logicOperator: "AND",
            conditions: [
                { ruleGroupId: "g1", sourceQuestionId: "q1", operator: "EQUALS", value: "Yes" },
                { ruleGroupId: "g1", sourceQuestionId: "q2", operator: "GT", value: "5" },
            ],
        };

        expect(evaluateRuleGroups([groupAnd], { q1: "Yes", q2: 8 }, "AND")).toBe(true);
        expect(evaluateRuleGroups([groupAnd], { q1: "Yes", q2: 3 }, "AND")).toBe(false);
    });
});

describe("evaluateQuestionnaireVisibility", () => {
    it("resolves nested conditional dependencies", () => {
        const questions = [
            { id: "q1", ruleGroups: [] },
            {
                id: "q2",
                ruleGroupsOperator: "AND" as const,
                ruleGroups: [
                    {
                        questionId: "q2",
                        logicOperator: "AND" as const,
                        conditions: [
                            { ruleGroupId: "g1", sourceQuestionId: "q1", operator: "EQUALS" as ConditionOperator, value: "Yes" },
                        ],
                    },
                ],
            },
            {
                id: "q3",
                ruleGroupsOperator: "AND" as const,
                ruleGroups: [
                    {
                        questionId: "q3",
                        logicOperator: "AND" as const,
                        conditions: [
                            { ruleGroupId: "g2", sourceQuestionId: "q2", operator: "EQUALS" as ConditionOperator, value: "Yes" },
                        ],
                    },
                ],
            },
        ];

        // Case 1: q1 answer satisfies q2 rule, and q2 answer satisfies q3 rule
        const vis1 = evaluateQuestionnaireVisibility(questions, { q1: "Yes", q2: "Yes" });
        expect(vis1.q1).toBe(true);
        expect(vis1.q2).toBe(true);
        expect(vis1.q3).toBe(true);

        // Case 2: q1 is "No", which hides q2. Even if answers contains q2: "Yes", q3 is hidden because its dependency q2 is hidden
        const vis2 = evaluateQuestionnaireVisibility(questions, { q1: "No", q2: "Yes" });
        expect(vis2.q1).toBe(true);
        expect(vis2.q2).toBe(false);
        expect(vis2.q3).toBe(false);
    });
});