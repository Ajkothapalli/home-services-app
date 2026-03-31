import { GST_RATE, QUOTE_VALIDITY_HOURS } from '../../config/constants';
import { Quote, QuoteStatus, LineItem } from '../../models/quote.model';
import { Diagnosis } from '../../models/job.model';

export interface QuoteInput {
  jobId: string;
  userId: string;
  diagnosis: Diagnosis;
  serviceType: string;
  location: { lat: number; lng: number };
}

export class QuotingAgent {
  private agentName = 'QuotingAgent';
  private gstRate = GST_RATE;           // 0.18
  private validityHours = QUOTE_VALIDITY_HOURS; // 48

  /**
   * Generates a Quote for a diagnosed job.
   * Applies GST at 18% and sets validity to 48 hours from now.
   */
  async generateQuote(input: QuoteInput): Promise<Quote> {
    // TODO: Call catalogue-fetcher.skill to retrieve applicable service catalogue items
    // TODO: Call pricing-calculator.skill with diagnosis complexity + location
    // TODO: Build LineItem array from catalogue + pricing results

    const lineItems: LineItem[] = [
      // TODO: populated by pricing-calculator.skill
    ];

    const subtotal = lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const gstAmount = parseFloat((subtotal * this.gstRate).toFixed(2));
    const total = parseFloat((subtotal + gstAmount).toFixed(2));

    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.validityHours * 60 * 60 * 1000);

    const quote: Quote = {
      quoteId: '', // TODO: generate UUID
      jobId: input.jobId,
      userId: input.userId,
      lineItems,
      subtotal,
      gstRate: this.gstRate,
      gstAmount,
      total,
      status: QuoteStatus.PENDING,
      createdAt: now,
      expiresAt,
      validityHours: this.validityHours,
    };

    return quote;
  }

  /** Calculates the expiry timestamp from the current time. */
  calcExpiryTime(from: Date = new Date()): Date {
    return new Date(from.getTime() + this.validityHours * 60 * 60 * 1000);
  }
}
