import { RuleResult } from './rule-001-user-identity.rule';
import { DIAGNOSIS_CONFIDENCE_THRESHOLD } from '../config/constants';

/**
 * RULE-004: Diagnosis Confidence Gate
 * A diagnosis must meet the minimum confidence threshold (0.70) before
 * automatically proceeding to quote generation. Below threshold requires
 * human expert review.
 */
export function validateDiagnosisConfidence(confidence: number): RuleResult {
  if (confidence < DIAGNOSIS_CONFIDENCE_THRESHOLD) {
    return {
      passed: false,
      ruleId: 'rule-004',
      message: `Diagnosis confidence ${confidence.toFixed(2)} is below threshold ${DIAGNOSIS_CONFIDENCE_THRESHOLD}. Human review required.`,
    };
  }
  return { passed: true, ruleId: 'rule-004' };
}
