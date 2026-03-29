import { RuleResult } from './rule-001-user-identity.rule';
import { TicketSeverity } from '../models/support-ticket.model';

const SLA_HOURS: Record<TicketSeverity, number> = {
  [TicketSeverity.CRITICAL]: 1,
  [TicketSeverity.HIGH]: 4,
  [TicketSeverity.MEDIUM]: 24,
  [TicketSeverity.LOW]: 72,
};

/**
 * RULE-015: Complaint SLA Compliance
 * Support tickets must be responded to within the SLA window for their severity.
 */
export function validateComplaintSLA(
  severity: TicketSeverity,
  createdAt: Date,
  now: Date = new Date(),
): RuleResult {
  const slaHours = SLA_HOURS[severity];
  const elapsedHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  if (elapsedHours > slaHours) {
    return {
      passed: false,
      ruleId: 'rule-015',
      message: `SLA breach: ${severity} ticket open for ${elapsedHours.toFixed(1)}h exceeds ${slaHours}h SLA. Escalate immediately.`,
    };
  }
  return { passed: true, ruleId: 'rule-015' };
}

export { SLA_HOURS };
