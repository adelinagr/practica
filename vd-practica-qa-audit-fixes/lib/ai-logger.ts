import * as Sentry from "@sentry/nextjs";
import { logger } from "./logger";

type AIRequestResult<T> = {
  data?: T;
  error?: any;
};

/**
 * A wrapper for AI API calls (e.g. OpenAI) to ensure consistent logging
 * and specific Sentry tagging for production alerts.
 */
export async function withAIMonitoring<T>(
  actionName: string,
  fn: () => Promise<T>
): Promise<AIRequestResult<T>> {
  const startTime = Date.now();
  logger.info({ action: actionName }, "Starting AI request");

  try {
    const data = await fn();
    const duration = Date.now() - startTime;
    logger.info({ action: actionName, duration }, "AI request succeeded");
    return { data };
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error({ action: actionName, duration, error }, "AI request failed");

    // Capture specifically for AI errors
    Sentry.withScope((scope) => {
      scope.setTag("type", "ai_request");
      scope.setExtra("actionName", actionName);
      scope.setExtra("durationMs", duration);
      Sentry.captureException(error);
    });

    return { error };
  }
}
