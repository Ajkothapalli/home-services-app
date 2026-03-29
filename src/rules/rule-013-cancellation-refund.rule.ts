import { RuleResult } from './rule-001-user-identity.rule';

export interface RefundDecision {
  eligible: boolean;
  refundPercent: number;  // 0–100
  reason: string;
}

/**
 * RULE-013: Cancellation and Refund Policy
 * - Cancel >24h before scheduled time: 100% refund
 * - Cancel 2–24h before: 50% refund
 * - Cancel <2h before or no-show: 0% refund
 * - Provider cancellation: 100% refund always
 */
export function validateCancellationRefund(
  scheduledAt: Date,
  cancelledAt: Date,
  cancelledBy: 'user' | 'provider' | 'system',
): RefundDecision & { ruleResult: RuleResult } {
  if (cancelledBy === 'provider' || cancelledBy === 'system') {
    return {
      eligible: true,
      refundPercent: 100,
      reason: 'Provider/system cancellation — full refund.',
      ruleResult: { passed: true, ruleId: 'rule-013' },
    };
  }

  const hoursUntilService = (scheduledAt.getTime() - cancelledAt.getTime()) / (1000 * 60 * 60);

  if (hoursUntilService > 24) {
    return { eligible: true, refundPercent: 100, reason: 'Cancelled more than 24 hours before service.', ruleResult: { passed: true, ruleId: 'rule-013' } };
  } else if (hoursUntilService >= 2) {
    return { eligible: true, refundPercent: 50, reason: 'Cancelled 2–24 hours before service.', ruleResult: { passed: true, ruleId: 'rule-013' } };
  } else {
    return { eligible: false, refundPercent: 0, reason: 'Cancelled less than 2 hours before service — no refund.', ruleResult: { passed: true, ruleId: 'rule-013' } };
  }
}
