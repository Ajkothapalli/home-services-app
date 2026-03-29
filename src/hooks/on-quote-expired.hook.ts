import { Quote } from '../models/quote.model';

export const ON_QUOTE_EXPIRED = 'on_quote_expired';

export interface OnQuoteExpiredPayload {
  jobId: string;
  userId: string;
  quote: Quote;
}

/**
 * Fires when a quote's validity window (48h) has passed without acceptance.
 * Triggers: notification to user, option to regenerate quote.
 */
export async function handleQuoteExpired(payload: OnQuoteExpiredPayload): Promise<void> {
  const { jobId, userId, quote } = payload;
  // TODO: Update quote status to EXPIRED
  // TODO: Notify user: "Your quote has expired. Would you like a new one?"
  console.log(`[Hook:${ON_QUOTE_EXPIRED}] Quote ${quote.quoteId} expired for job ${jobId}, user ${userId}`);
}

// eventBus.on(ON_QUOTE_EXPIRED, handleQuoteExpired);
