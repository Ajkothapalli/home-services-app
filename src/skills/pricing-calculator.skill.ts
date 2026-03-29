import { LineItem } from '../models/quote.model';
import { GST_RATE } from '../config/constants';

export interface PricingInput {
  serviceType: string;
  complexity: 'low' | 'medium' | 'high';
  locationTier: 'metro' | 'tier1' | 'tier2';
  catalogueItemIds: string[];
}

export interface PricingOutput {
  lineItems: LineItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
}

/**
 * Calculates pricing for a job based on complexity, location tier, and catalogue items.
 * Applies GST_RATE (18%) on top of the subtotal.
 */
export async function calculatePricing(
  input: PricingInput,
): Promise<PricingOutput> {
  // TODO: Fetch base prices from the service catalogue by input.catalogueItemIds
  // TODO: Apply complexity multiplier (low: 1.0, medium: 1.25, high: 1.5)
  // TODO: Apply location tier multiplier (metro: 1.2, tier1: 1.0, tier2: 0.85)
  // TODO: Build LineItem array and compute totals

  const lineItems: LineItem[] = [];
  const subtotal = 0;
  const gstAmount = parseFloat((subtotal * GST_RATE).toFixed(2));
  const total = parseFloat((subtotal + gstAmount).toFixed(2));

  return { lineItems, subtotal, gstAmount, total };
}
