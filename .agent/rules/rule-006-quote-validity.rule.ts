import { RuleResult } from './rule-001-user-identity.rule';
import { QUOTE_VALIDITY_HOURS } from '../config/constants';

/**
 * RULE-006: Quote Validity Window
 * A quote may only be accepted before its expiresAt timestamp.
 * Expired quotes must be regenerated.
 */
export function validateQuoteValidity(expiresAt: Date, now: Date = new Date()): RuleResult {
  if (now > expiresAt) {
    return {
      passed: false,
      ruleId: 'rule-006',
      message: `Quote expired at ${expiresAt.toISOString()}. Validity window is ${QUOTE_VALIDITY_HOURS} hours.`,
    };
  }
  return { passed: true, ruleId: 'rule-006' };
}
