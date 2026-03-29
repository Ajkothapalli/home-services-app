import { RuleResult } from './rule-001-user-identity.rule';

const PII_PATTERNS = [
  /\b\d{12}\b/,               // Aadhaar number
  /\b[A-Z]{5}[0-9]{4}[A-Z]\b/, // PAN card
  /\b\d{10}\b/,               // Mobile number (10 digit)
];

/**
 * RULE-003: Data Privacy
 * AI agents must not log, persist, or transmit raw PII in conversation history.
 * Scans text for common Indian PII patterns before storing in context.
 */
export function validateDataPrivacy(text: string): RuleResult {
  for (const pattern of PII_PATTERNS) {
    if (pattern.test(text)) {
      return {
        passed: false,
        ruleId: 'rule-003',
        message: 'Message contains potential PII (Aadhaar/PAN/phone). Strip before persisting.',
      };
    }
  }
  return { passed: true, ruleId: 'rule-003' };
}
