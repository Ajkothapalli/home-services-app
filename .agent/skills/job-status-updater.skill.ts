import { JobStatus } from '../models/job.model';

export interface UpdateJobStatusInput {
  jobId: string;
  newStatus: JobStatus;
  notes?: string;
  updatedByProviderId?: string;
}

export interface UpdateJobStatusOutput {
  jobId: string;
  previousStatus: JobStatus;
  newStatus: JobStatus;
  updatedAt: Date;
}

/**
 * Updates the status field of a Job document.
 * Also appends an audit entry to the job's status history sub-collection.
 */
export async function updateJobStatus(
  input: UpdateJobStatusInput,
): Promise<UpdateJobStatusOutput> {
  // TODO: Firestore transaction: read current status, validate transition, write new status
  // TODO: Append to /jobs/{jobId}/statusHistory sub-collection
  throw new Error(`updateJobStatus not implemented for jobId: ${input.jobId}`);
}
