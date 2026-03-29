import { Booking } from '../models/booking.model';

export const ON_BOOKING_CONFIRMED = 'on_booking_confirmed';

export interface OnBookingConfirmedPayload {
  booking: Booking;
  userId: string;
}

/**
 * Fires when a booking is confirmed (provider matched + slot reserved).
 * Triggers: confirmation notifications to both homeowner and provider.
 */
export async function handleBookingConfirmed(payload: OnBookingConfirmedPayload): Promise<void> {
  const { booking, userId } = payload;
  // TODO: Send push + SMS to homeowner with booking details
  // TODO: Send push + SMS to provider with job details
  // TODO: Update job status to BOOKED
  console.log(`[Hook:${ON_BOOKING_CONFIRMED}] Booking ${booking.bookingId} confirmed for user ${userId} on ${booking.scheduledDate} at ${booking.scheduledTime}`);
}

// eventBus.on(ON_BOOKING_CONFIRMED, handleBookingConfirmed);
