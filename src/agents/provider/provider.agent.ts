import { JobStatus } from '../../models/job.model';

/** Valid job state transitions for the provider workflow. */
export const JOB_STATE_MACHINE: Record<JobStatus, JobStatus | null> = {
  [JobStatus.ASSIGNED]: JobStatus.ACCEPTED,
  [JobStatus.ACCEPTED]: JobStatus.EN_ROUTE,
  [JobStatus.EN_ROUTE]: JobStatus.ARRIVED,
  [JobStatus.ARRIVED]: JobStatus.IN_PROGRESS,
  [JobStatus.IN_PROGRESS]: JobStatus.COMPLETED_PENDING_REVIEW,
  [JobStatus.COMPLETED_PENDING_REVIEW]: JobStatus.COMPLETED,
  // Terminal and pre-provider states — no further transitions
  [JobStatus.PENDING]: null,
  [JobStatus.DIAGNOSED]: null,
  [JobStatus.QUOTED]: null,
  [JobStatus.BOOKED]: null,
  [JobStatus.COMPLETED]: null,
  [JobStatus.CANCELLED]: null,
};

export interface StatusUpdateInput {
  jobId: string;
  providerId: string;
  currentStatus: JobStatus;
  notes?: string;
  photoUrls?: string[];
}

export interface StatusUpdateResult {
  jobId: string;
  previousStatus: JobStatus;
  newStatus: JobStatus;
  updatedAt: Date;
}

export class ProviderAgent {
  private agentName = 'ProviderAgent';

  /**
   * Advances a job through the provider state machine.
   * Validates that the transition is legal before persisting.
   */
  async updateJobStatus(input: StatusUpdateInput): Promise<StatusUpdateResult> {
    const nextStatus = JOB_STATE_MACHINE[input.currentStatus];

    if (nextStatus === null || nextStatus === undefined) {
      throw new Error(
        `[${this.agentName}] No valid transition from status "${input.currentStatus}" for job ${input.jobId}`,
      );
    }

    // TODO: Call job-status-updater.skill to persist the new status
    // TODO: Call notification-sender.skill to notify homeowner of status change
    // TODO: If newStatus === COMPLETED_PENDING_REVIEW, call work-summary-writer.skill

    return {
      jobId: input.jobId,
      previousStatus: input.currentStatus,
      newStatus: nextStatus,
      updatedAt: new Date(),
    };
  }

  /** Returns the next valid status for a given current status, or null if terminal. */
  getNextStatus(current: JobStatus): JobStatus | null {
    return JOB_STATE_MACHINE[current] ?? null;
  }
}
