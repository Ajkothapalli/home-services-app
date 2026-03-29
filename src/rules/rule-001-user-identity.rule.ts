import { User } from '../models/user.model';

export interface RuleResult {
  passed: boolean;
  ruleId: string;
  message?: string;
}

/**
 * RULE-001: User Identity Verification
 * Every user interacting with the system must be authenticated and verified.
 * Anonymous or unverified users may not create jobs or bookings.
 */
export function validateUserIdentity(user: User | null | undefined): RuleResult {
  if (!user) {
    return { passed: false, ruleId: 'rule-001', message: 'User must be authenticated.' };
  }
  if (!user.isVerified) {
    return { passed: false, ruleId: 'rule-001', message: 'User account must be verified before creating a job.' };
  }
  if (!user.phone) {
    return { passed: false, ruleId: 'rule-001', message: 'A verified phone number is required.' };
  }
  return { passed: true, ruleId: 'rule-001' };
}
