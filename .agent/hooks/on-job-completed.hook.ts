export const ON_JOB_COMPLETED = 'on_job_completed';

export interface OnJobCompletedPayload {
  jobId: string;
  userId: string;
  providerId: string;
  workSummaryId: string;
}

/**
 * Fires when job status transitions to COMPLETED (post-review).
 * Triggers: payment capture, provider payout, review prompt.
 */
export async function handleJobCompleted(payload: OnJobCompletedPayload): Promise<void> {
  const { jobId, userId, providerId } = payload;
  // TODO: Capture Razorpay payment
  // TODO: Trigger provider payout workflow
  // TODO: Prompt homeowner to leave a review (navigates to ReviewScreen)
  // TODO: Update provider rating if review is submitted
  console.log(`[Hook:${ON_JOB_COMPLETED}] Job ${jobId} completed. User: ${userId}, Provider: ${providerId}`);
}

// eventBus.on(ON_JOB_COMPLETED, handleJobCompleted);
