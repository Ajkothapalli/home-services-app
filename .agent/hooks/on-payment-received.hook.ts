export const ON_PAYMENT_RECEIVED = 'on_payment_received';

export interface OnPaymentReceivedPayload {
  bookingId: string;
  jobId: string;
  userId: string;
  providerId: string;
  amountPaise: number;
  razorpayPaymentId: string;
}

/**
 * Fires when a Razorpay payment is successfully captured.
 * Triggers: payment receipt notification, job status finalization.
 */
export async function handlePaymentReceived(payload: OnPaymentReceivedPayload): Promise<void> {
  const { bookingId, jobId, userId, amountPaise, razorpayPaymentId } = payload;
  const amountINR = (amountPaise / 100).toFixed(2);
  // TODO: Update booking paymentStatus to CAPTURED
  // TODO: Generate and send payment receipt to user (email/SMS)
  // TODO: Trigger provider payout scheduling
  console.log(`[Hook:${ON_PAYMENT_RECEIVED}] ₹${amountINR} received for booking ${bookingId}, job ${jobId}, user ${userId}. Razorpay ID: ${razorpayPaymentId}`);
}

// eventBus.on(ON_PAYMENT_RECEIVED, handlePaymentReceived);
