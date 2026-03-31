import { RuleResult } from './rule-001-user-identity.rule';
import { GST_RATE } from '../config/constants';

/**
 * RULE-011: GST Compliance
 * All invoices and quotes must show GST separately at the correct rate (18%).
 * The gstAmount must equal subtotal * GST_RATE (within ₹1 rounding tolerance).
 */
export function validateGstCompliance(
  subtotal: number,
  gstAmount: number,
): RuleResult {
  const expectedGst = parseFloat((subtotal * GST_RATE).toFixed(2));
  const delta = Math.abs(gstAmount - expectedGst);

  if (delta > 1) {
    return {
      passed: false,
      ruleId: 'rule-011',
      message: `GST amount ₹${gstAmount} does not match expected ₹${expectedGst} (${GST_RATE * 100}% of ₹${subtotal}). Delta: ₹${delta.toFixed(2)}.`,
    };
  }
  return { passed: true, ruleId: 'rule-011' };
}
