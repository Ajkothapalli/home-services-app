import { RuleResult } from './rule-001-user-identity.rule';

/**
 * RULE-007: No Unsolicited Contact
 * Providers may not contact homeowners outside of the platform or before
 * job acceptance. All communication must go through the in-app chat or
 * platform-mediated channels.
 */
export function validateContactPermission(
  initiatorRole: 'provider' | 'homeowner' | 'system',
  jobStatus: string,
): RuleResult {
  const allowedStatuses = ['assigned', 'accepted', 'en_route', 'arrived', 'in_progress'];

  if (initiatorRole === 'provider' && !allowedStatuses.includes(jobStatus)) {
    return {
      passed: false,
      ruleId: 'rule-007',
      message: `Provider may not initiate contact when job status is "${jobStatus}". Allowed from: ${allowedStatuses.join(', ')}.`,
    };
  }
  return { passed: true, ruleId: 'rule-007' };
}
