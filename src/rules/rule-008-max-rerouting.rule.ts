import { RuleResult } from './rule-001-user-identity.rule';
import { MAX_AGENT_HOPS } from '../config/constants';

/**
 * RULE-008: Maximum Agent Rerouting
 * A single user message may not be routed between agents more than
 * MAX_AGENT_HOPS times. Prevents infinite loops in the agent graph.
 */
export function validateReroutingLimit(hopCount: number): RuleResult {
  if (hopCount > MAX_AGENT_HOPS) {
    return {
      passed: false,
      ruleId: 'rule-008',
      message: `Agent hop count ${hopCount} exceeds maximum ${MAX_AGENT_HOPS}. Escalating to support.`,
    };
  }
  return { passed: true, ruleId: 'rule-008' };
}
