import { RuleResult } from './rule-001-user-identity.rule';

/**
 * RULE-010: No Fabrication
 * AI agents must not fabricate pricing, availability, provider details,
 * or any factual information not returned by a skill or database call.
 * All agent responses must cite their data source.
 */
export function validateResponseHasDataSource(
  response: string,
  dataSource?: string,
): RuleResult {
  if (!dataSource || dataSource.trim().length === 0) {
    return {
      passed: false,
      ruleId: 'rule-010',
      message: 'Agent response must reference a verified data source. No hallucinated facts allowed.',
    };
  }
  // TODO: Cross-check response content against dataSource for factual consistency
  return { passed: true, ruleId: 'rule-010' };
}
