import { Job } from '../models/job.model';

export interface UpdateJobInput {
  jobId: string;
  updates: Partial<Omit<Job, 'jobId' | 'userId' | 'createdAt'>>;
}

/**
 * Applies a partial update to an existing Job record in Firestore.
 */
export async function updateJobRecord(
  input: UpdateJobInput,
): Promise<Job> {
  // TODO: Fetch existing job from Firestore /jobs/{jobId}
  // TODO: Merge input.updates and set updatedAt = new Date()
  // TODO: Write updated document back to Firestore
  throw new Error(`updateJobRecord not implemented for jobId: ${input.jobId}`);
}
