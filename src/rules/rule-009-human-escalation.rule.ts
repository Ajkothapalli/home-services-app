import { RuleResult } from './rule-001-user-identity.rule';
import { MAX_ESCALATION_ATTEMPTS } from '../config/constants';

/**
 * RULE-009: Human Escalation Trigger
 * After MAX_ESCALATION_ATTEMPTS failed automated support attempts,
 * the system MUST escalate to a human agent rather than continuing automated replies.
 */
export function validateEscalationRequired(attemptCount: number): RuleResult {
  if (attemptCount >= MAX_ESCALATION_ATTEMPTS) {
    return {
      passed: false,
      ruleId: 'rule-009',
      message: `Support attempt ${attemptCount} reached limit of ${MAX_ESCALATION_ATTEMPTS}. Human escalation required.`,
    };
  }
  return { passed: true, ruleId: 'rule-009' };
}
