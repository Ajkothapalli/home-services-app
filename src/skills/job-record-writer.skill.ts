import { Job, JobStatus } from '../models/job.model';
import { JobIntakeData } from '../agents/intake/intake.agent';

export interface WriteJobInput extends JobIntakeData {
  userId: string;
}

/**
 * Creates a new Job record in Firestore from completed intake data.
 */
export async function writeJobRecord(
  input: WriteJobInput,
): Promise<Job> {
  // TODO: Generate a unique jobId (UUID v4)
  // TODO: Write to Firestore /jobs/{jobId}

  const job: Job = {
    jobId: '', // TODO: uuid()
    userId: input.userId,
    serviceType: input.serviceType,
    affectedArea: input.affectedArea,
    urgency: input.urgency,
    description: '',
    photoUrls: input.photoUrls,
    location: {
      address: input.locationAddress,
      coords: input.locationCoords,
    },
    status: JobStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return job;
}
