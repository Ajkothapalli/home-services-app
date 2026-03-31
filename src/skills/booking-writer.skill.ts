import { Booking, BookingStatus, PaymentStatus } from '../models/booking.model';

export interface WriteBookingInput {
  jobId: string;
  quoteId: string;
  userId: string;
  providerId: string;
  scheduledDate: string;
  scheduledTime: string;
}

/**
 * Persists a new Booking record in Firestore and returns the created object.
 */
export async function writeBooking(
  input: WriteBookingInput,
): Promise<Booking> {
  // TODO: Generate a unique bookingId (UUID v4)
  // TODO: Write to Firestore /bookings/{bookingId}
  // TODO: Update the job record with the bookingId

  const booking: Booking = {
    bookingId: '', // TODO: uuid()
    jobId: input.jobId,
    quoteId: input.quoteId,
    userId: input.userId,
    providerId: input.providerId,
    scheduledDate: input.scheduledDate,
    scheduledTime: input.scheduledTime,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return booking;
}
