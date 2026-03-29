import { RuleResult } from './rule-001-user-identity.rule';

const MIN_QUOTE_AMOUNT_INR = 200;
const MAX_QUOTE_AMOUNT_INR = 500_000;

/**
 * RULE-005: Quote Price Bounds
 * A generated quote total (incl. GST) must fall within acceptable bounds.
 * Prevents accidental zero-price or runaway pricing bugs from reaching users.
 */
export function validateQuotePriceBounds(totalAmountINR: number): RuleResult {
  if (totalAmountINR < MIN_QUOTE_AMOUNT_INR) {
    return {
      passed: false,
      ruleId: 'rule-005',
      message: `Quote total ₹${totalAmountINR} is below minimum ₹${MIN_QUOTE_AMOUNT_INR}.`,
    };
  }
  if (totalAmountINR > MAX_QUOTE_AMOUNT_INR) {
    return {
      passed: false,
      ruleId: 'rule-005',
      message: `Quote total ₹${totalAmountINR} exceeds maximum ₹${MAX_QUOTE_AMOUNT_INR}. Requires manual approval.`,
    };
  }
  return { passed: true, ruleId: 'rule-005' };
}
