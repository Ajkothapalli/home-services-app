import { JobReview } from '../models/job.model';

export const ON_REVIEW_SUBMITTED = 'on_review_submitted';

export interface OnReviewSubmittedPayload {
  jobId: string;
  userId: string;
  providerId: string;
  review: JobReview;
}

/**
 * Fires when a homeowner submits a review after job completion.
 * Triggers: provider rating update, thank-you notification.
 */
export async function handleReviewSubmitted(payload: OnReviewSubmittedPayload): Promise<void> {
  const { jobId, userId, providerId, review } = payload;
  // TODO: Update provider's aggregate rating in Firestore
  // TODO: Attach review to job record
  // TODO: Notify homeowner: "Thank you for your review!"
  console.log(`[Hook:${ON_REVIEW_SUBMITTED}] Review submitted for job ${jobId} by user ${userId}. Rating: ${review.rating}/5`);
}

// eventBus.on(ON_REVIEW_SUBMITTED, handleReviewSubmitted);
