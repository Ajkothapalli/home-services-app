export enum BookingStatus {
  CONFIRMED = 'confirmed',
  PROVIDER_ASSIGNED = 'provider_assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export interface Booking {
  bookingId: string;
  jobId: string;
  quoteId: string;
  userId: string;
  providerId?: string;
  scheduledDate: string;  // ISO date YYYY-MM-DD
  scheduledTime: string;  // HH:mm
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;           // Razorpay payment ID
  razorpayOrderId?: string;
  amountPaid?: number;          // in INR paise
  cancellationReason?: string;
  cancelledBy?: 'user' | 'provider' | 'system';
  createdAt: Date;
  updatedAt: Date;
}
