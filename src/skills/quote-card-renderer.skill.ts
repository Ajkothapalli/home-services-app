import { Quote } from '../models/quote.model';

export interface RenderQuoteCardInput {
  quote: Quote;
  onAccept: (quoteId: string) => void;
  onDecline: (quoteId: string) => void;
}

/**
 * UI skill: renders a QuoteCard component with the provided quote data.
 * This is a presentational helper — actual rendering happens in QuoteCard.tsx.
 */
export function buildQuoteCardProps(input: RenderQuoteCardInput): RenderQuoteCardInput {
  // Validate quote has required fields before rendering
  if (!input.quote.quoteId) throw new Error('Quote must have a quoteId before rendering');
  if (input.quote.lineItems.length === 0) throw new Error('Quote must have at least one line item');
  return input;
}
