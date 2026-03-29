import { Env } from '../config/env';

// TODO: import RazorpayCheckout from 'react-native-razorpay';

export interface CreateOrderInput {
  amountPaise: number;   // amount in INR paise (e.g. 50000 = ₹500)
  currency?: string;
  receipt: string;       // e.g. bookingId
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentResult {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

/**
 * Creates a Razorpay order via your backend API.
 * The backend uses the Razorpay secret key to create the order server-side.
 */
export async function createOrder(input: CreateOrderInput): Promise<RazorpayOrder> {
  // TODO: POST to your backend /api/payments/create-order with input
  // TODO: Backend calls Razorpay API and returns { orderId, amount, currency }
  throw new Error(`createOrder not implemented. Receipt: ${input.receipt}`);
}

/**
 * Opens the Razorpay checkout sheet and returns payment result on success.
 */
export async function initiatePayment(order: RazorpayOrder, userId: string): Promise<PaymentResult> {
  // TODO: RazorpayCheckout.open({
  //   key: Env.RAZORPAY_KEY_ID,
  //   amount: order.amount,
  //   currency: order.currency,
  //   order_id: order.orderId,
  //   ...
  // })
  throw new Error(`initiatePayment not implemented for orderId: ${order.orderId}`);
}

/**
 * Verifies the Razorpay payment signature via your backend to confirm authenticity.
 */
export async function verifyPayment(result: PaymentResult): Promise<boolean> {
  // TODO: POST to backend /api/payments/verify with result
  // TODO: Backend verifies HMAC signature and returns { verified: boolean }
  throw new Error(`verifyPayment not implemented for paymentId: ${result.razorpayPaymentId}`);
}
