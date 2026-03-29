import { Job } from '../models/job.model';

export const ON_JOB_CREATED = 'on_job_created';

export interface OnJobCreatedPayload {
  job: Job;
}

/**
 * Fires when a new Job record is created.
 * Triggers: DiagnosisAgent.analyzeJob, notification to user confirming intake.
 */
export async function handleJobCreated(payload: OnJobCreatedPayload): Promise<void> {
  const { job } = payload;
  // TODO: Dispatch to DiagnosisAgent to begin analysis
  // TODO: Call sendNotification to confirm job receipt to user
  console.log(`[Hook:${ON_JOB_CREATED}] Job created: ${job.jobId}`);
}

// Register on event bus
// eventBus.on(ON_JOB_CREATED, handleJobCreated);
