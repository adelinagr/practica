import * as Sentry from "@sentry/nextjs";
import { logger } from "./logger";

type QueueJobResult<T> = {
  success: boolean;
  data?: T;
  error?: any;
};

/**
 * A generic wrapper for background jobs or queue processors
 * to ensure failures are caught and sent to Sentry with a specific tag.
 */
export async function withQueueMonitoring<T>(
  jobName: string,
  jobId: string,
  jobFn: () => Promise<T>
): Promise<QueueJobResult<T>> {
  const startTime = Date.now();
  logger.info({ jobName, jobId }, "Starting queue job");

  try {
    const data = await jobFn();
    const duration = Date.now() - startTime;
    logger.info({ jobName, jobId, duration }, "Queue job completed successfully");
    
    return { success: true, data };
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error({ jobName, jobId, duration, error }, "Queue job failed");

    // Capture specifically for queue/background job errors
    Sentry.withScope((scope) => {
      scope.setTag("type", "queue_job");
      scope.setExtra("jobName", jobName);
      scope.setExtra("jobId", jobId);
      scope.setExtra("durationMs", duration);
      Sentry.captureException(error);
    });

    return { success: false, error };
  }
}
