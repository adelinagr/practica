export type LogicOperator = "AND" | "OR";

export type ConditionOperator =
    | "EQUALS"
    | "NOT_EQUALS"
    | "CONTAINS"
    | "NOT_CONTAINS"
    | "IS_EMPTY"
    | "IS_NOT_EMPTY"
    | "GT"
    | "LT"
    | "BETWEEN"
    | "INCLUDES"
    | "EXCLUDES";

export interface Condition {
    id?: string;
    ruleGroupId: string;
    sourceQuestionId: string;
    operator: ConditionOperator;
    value?: string | null;
    valueSecondary?: string | null;
}

export interface RuleGroup {
    id?: string;
    questionId: string;
    logicOperator: LogicOperator;
    conditions: Condition[];
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}