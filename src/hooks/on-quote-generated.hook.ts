import { Quote } from '../models/quote.model';

export const ON_QUOTE_GENERATED = 'on_quote_generated';

export interface OnQuoteGeneratedPayload {
  jobId: string;
  userId: string;
  quote: Quote;
}

/**
 * Fires when a Quote is successfully generated.
 * Triggers: push notification to user, renders QuoteCard on QuoteScreen.
 */
export async function handleQuoteGenerated(payload: OnQuoteGeneratedPayload): Promise<void> {
  const { jobId, userId, quote } = payload;
  // TODO: Update job status to QUOTED
  // TODO: Send push notification: "Your quote is ready – ₹{quote.total}"
  // TODO: Schedule expiry check at quote.expiresAt
  console.log(`[Hook:${ON_QUOTE_GENERATED}] Quote ${quote.quoteId} generated for job ${jobId}, user ${userId}, total: ₹${quote.total}`);
}

// eventBus.on(ON_QUOTE_GENERATED, handleQuoteGenerated);
