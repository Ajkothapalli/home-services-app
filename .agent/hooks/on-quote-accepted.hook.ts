import { Quote } from '../models/quote.model';

export const ON_QUOTE_ACCEPTED = 'on_quote_accepted';

export interface OnQuoteAcceptedPayload {
  jobId: string;
  userId: string;
  quote: Quote;
}

/**
 * Fires when the user accepts a quote.
 * Triggers: SchedulingAgent.matchAndBook to begin provider matching.
 */
export async function handleQuoteAccepted(payload: OnQuoteAcceptedPayload): Promise<void> {
  const { jobId, userId, quote } = payload;
  // TODO: Update quote status to ACCEPTED
  // TODO: Initiate Razorpay payment authorization
  // TODO: Dispatch to SchedulingAgent.matchAndBook
  console.log(`[Hook:${ON_QUOTE_ACCEPTED}] Quote ${quote.quoteId} accepted for job ${jobId} by user ${userId}`);
}

// eventBus.on(ON_QUOTE_ACCEPTED, handleQuoteAccepted);
