import { RuleResult } from './rule-001-user-identity.rule';
import { Provider } from '../models/provider.model';

/**
 * RULE-012: Provider Verification Gate
 * Only verified providers with valid background check documents
 * may be assigned to jobs.
 */
export function validateProviderVerification(provider: Provider): RuleResult {
  if (!provider.isVerified) {
    return {
      passed: false,
      ruleId: 'rule-012',
      message: `Provider ${provider.providerId} is not verified and cannot be assigned to jobs.`,
    };
  }

  const hasPoliceVerification = provider.documents.some(
    d => d.type === 'police_verification' && d.verifiedAt,
  );

  if (!hasPoliceVerification) {
    return {
      passed: false,
      ruleId: 'rule-012',
      message: `Provider ${provider.providerId} lacks a verified police verification document.`,
    };
  }

  return { passed: true, ruleId: 'rule-012' };
}
