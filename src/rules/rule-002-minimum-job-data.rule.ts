import { RuleResult } from './rule-001-user-identity.rule';
import { JobIntakeData } from '../agents/intake/intake.agent';

/**
 * RULE-002: Minimum Job Data Requirements
 * A job cannot proceed past intake without all required fields.
 */
export function validateMinimumJobData(data: Partial<JobIntakeData>): RuleResult {
  if (!data.serviceType) {
    return { passed: false, ruleId: 'rule-002', message: 'Service type is required.' };
  }
  if (!data.affectedArea || data.affectedArea.trim().length < 3) {
    return { passed: false, ruleId: 'rule-002', message: 'Affected area description is required (min 3 characters).' };
  }
  if (!data.urgency) {
    return { passed: false, ruleId: 'rule-002', message: 'Urgency level is required.' };
  }
  if (!data.locationCoords || !data.locationAddress) {
    return { passed: false, ruleId: 'rule-002', message: 'Service location is required.' };
  }
  return { passed: true, ruleId: 'rule-002' };
}
