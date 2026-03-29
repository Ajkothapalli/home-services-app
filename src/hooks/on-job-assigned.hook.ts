export const ON_JOB_ASSIGNED = 'on_job_assigned';

export interface OnJobAssignedPayload {
  jobId: string;
  userId: string;
  providerId: string;
  scheduledDate: string;
  scheduledTime: string;
}

/**
 * Fires when a provider is formally assigned to a job (status: ASSIGNED).
 * Triggers: provider app notification, homeowner update with provider details.
 */
export async function handleJobAssigned(payload: OnJobAssignedPayload): Promise<void> {
  const { jobId, providerId, scheduledDate, scheduledTime } = payload;
  // TODO: Notify provider: "New job assigned for {scheduledDate} at {scheduledTime}"
  // TODO: Notify homeowner with provider name and photo
  console.log(`[Hook:${ON_JOB_ASSIGNED}] Job ${jobId} assigned to provider ${providerId}`);
}

// eventBus.on(ON_JOB_ASSIGNED, handleJobAssigned);
