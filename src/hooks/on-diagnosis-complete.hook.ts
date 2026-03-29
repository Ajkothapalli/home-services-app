import { Diagnosis } from '../models/job.model';

export const ON_DIAGNOSIS_COMPLETE = 'on_diagnosis_complete';

export interface OnDiagnosisCompletePayload {
  jobId: string;
  userId: string;
  diagnosis: Diagnosis;
}

/**
 * Fires when DiagnosisAgent completes analysis above the confidence threshold.
 * Triggers: QuotingAgent to generate a quote.
 */
export async function handleDiagnosisComplete(payload: OnDiagnosisCompletePayload): Promise<void> {
  const { jobId, diagnosis } = payload;
  // TODO: Update job status to DIAGNOSED
  // TODO: Dispatch to QuotingAgent.generateQuote
  // TODO: Notify user that diagnosis is ready
  console.log(`[Hook:${ON_DIAGNOSIS_COMPLETE}] Diagnosis complete for job ${jobId}, confidence: ${diagnosis.confidence}`);
}

// eventBus.on(ON_DIAGNOSIS_COMPLETE, handleDiagnosisComplete);
