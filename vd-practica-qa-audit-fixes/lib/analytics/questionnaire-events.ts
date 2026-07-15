import { prisma } from "@/lib/db";

/**
 * Tracks when a conditional question is shown to a user based on rule triggering.
 * 
 * @param params Object containing questionnaireId, questionId, triggeredByRuleGroupId, and sessionId.
 */
export async function trackQuestionShown(params: {
    questionnaireId: string;
    questionId: string;
    triggeredByRuleGroupId: string;
    sessionId: string;
}) {
    await prisma.questionnaireAnalyticsEvent.create({
        data: {
            eventType: "QUESTION_SHOWN",
            questionnaireId: params.questionnaireId,
            questionId: params.questionId,
            ruleGroupId: params.triggeredByRuleGroupId,
            sessionId: params.sessionId,
        },
    });
}

/**
 * Tracks when a conditional question is hidden from a user because rules are no longer met.
 * 
 * @param params Object containing questionnaireId, questionId, and sessionId.
 */
export async function trackQuestionHidden(params: {
    questionnaireId: string;
    questionId: string;
    sessionId: string;
}) {
    await prisma.questionnaireAnalyticsEvent.create({
        data: {
            eventType: "QUESTION_HIDDEN",
            questionnaireId: params.questionnaireId,
            questionId: params.questionId,
            sessionId: params.sessionId,
        },
    });
}

/**
 * Tracks when a user completes a conditional transition branch from one question to another.
 * 
 * @param params Object containing questionnaireId, fromQuestionId, toQuestionId, ruleGroupId, and sessionId.
 */
export async function trackBranchTaken(params: {
    questionnaireId: string;
    fromQuestionId: string;
    toQuestionId: string;
    ruleGroupId: string;
    sessionId: string;
}) {
    await prisma.questionnaireAnalyticsEvent.create({
        data: {
            eventType: "BRANCH_TAKEN",
            questionnaireId: params.questionnaireId,
            questionId: params.toQuestionId,
            ruleGroupId: params.ruleGroupId,
            sessionId: params.sessionId,
            metadata: { fromQuestionId: params.fromQuestionId },
        },
    });
}

/**
 * Tracks when a user leaves the questionnaire before completing all visible steps.
 * 
 * @param params Object containing questionnaireId, lastVisibleQuestionId, sessionId, and completedPercent.
 */
export async function trackQuestionnaireAbandoned(params: {
    questionnaireId: string;
    lastVisibleQuestionId: string;
    sessionId: string;
    completedPercent: number;
}) {
    await prisma.questionnaireAnalyticsEvent.create({
        data: {
            eventType: "QUESTIONNAIRE_ABANDONED",
            questionnaireId: params.questionnaireId,
            questionId: params.lastVisibleQuestionId,
            sessionId: params.sessionId,
            metadata: { completedPercent: params.completedPercent },
        },
    });
}