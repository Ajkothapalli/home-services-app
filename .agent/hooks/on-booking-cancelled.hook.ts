export const ON_BOOKING_CANCELLED = 'on_booking_cancelled';

export interface OnBookingCancelledPayload {
  bookingId: string;
  jobId: string;
  userId: string;
  providerId?: string;
  cancelledBy: 'user' | 'provider' | 'system';
  reason: string;
}

/**
 * Fires when a booking is cancelled by any party.
 * Triggers: refund processing, notifications to both parties.
 */
export async function handleBookingCancelled(payload: OnBookingCancelledPayload): Promise<void> {
  const { bookingId, jobId, userId, cancelledBy, reason } = payload;
  // TODO: Evaluate refund eligibility per rule-013-cancellation-refund.rule
  // TODO: Initiate Razorpay refund if applicable
  // TODO: Notify homeowner and provider with cancellation details
  // TODO: Free up the provider's availability slot
  console.log(`[Hook:${ON_BOOKING_CANCELLED}] Booking ${bookingId} for job ${jobId} cancelled by ${cancelledBy}. Reason: ${reason}. User: ${userId}`);
}

// eventBus.on(ON_BOOKING_CANCELLED, handleBookingCancelled);
