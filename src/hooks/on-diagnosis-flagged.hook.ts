import { Diagnosis } from '../models/job.model';

export const ON_DIAGNOSIS_FLAGGED = 'on_diagnosis_flagged';

export interface OnDiagnosisFlaggedPayload {
  jobId: string;
  userId: string;
  diagnosis: Diagnosis;
  reason: string;
}

/**
 * Fires when diagnosis confidence is below threshold and requires human review.
 * Triggers: support ticket creation, human expert notification.
 */
export async function handleDiagnosisFlagged(payload: OnDiagnosisFlaggedPayload): Promise<void> {
  const { jobId, diagnosis, reason } = payload;
  // TODO: Create a support ticket with severity HIGH for expert review
  // TODO: Notify operations team
  // TODO: Inform user of slight delay
  console.log(`[Hook:${ON_DIAGNOSIS_FLAGGED}] Job ${jobId} flagged: ${reason}, confidence: ${diagnosis.confidence}`);
}

// eventBus.on(ON_DIAGNOSIS_FLAGGED, handleDiagnosisFlagged);
