import { RuleResult } from './rule-001-user-identity.rule';

/**
 * RULE-014: Provider Photo Capture Requirement
 * Providers must upload at least one "before" photo and one "after" photo
 * before marking a job as COMPLETED_PENDING_REVIEW.
 */
export function validateProviderPhotos(
  beforePhotoUrls: string[],
  afterPhotoUrls: string[],
): RuleResult {
  if (beforePhotoUrls.length === 0) {
    return {
      passed: false,
      ruleId: 'rule-014',
      message: 'At least one "before" photo must be uploaded before completing the job.',
    };
  }
  if (afterPhotoUrls.length === 0) {
    return {
      passed: false,
      ruleId: 'rule-014',
      message: 'At least one "after" photo must be uploaded before marking the job complete.',
    };
  }
  return { passed: true, ruleId: 'rule-014' };
}
