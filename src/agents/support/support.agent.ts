import { MAX_ESCALATION_ATTEMPTS } from '../../config/constants';
import { SupportTicket, TicketSeverity, TicketStatus } from '../../models/support-ticket.model';

export interface SupportQueryInput {
  sessionId: string;
  userId: string;
  jobId?: string;
  query: string;
  attemptNumber: number;
}

export interface SupportQueryResult {
  response: string;
  resolved: boolean;
  escalated: boolean;
  ticket?: SupportTicket;
}

export class SupportAgent {
  private agentName = 'SupportAgent';
  private maxAttempts = MAX_ESCALATION_ATTEMPTS; // 3

  /**
   * Handles a support query. After MAX_ESCALATION_ATTEMPTS failed self-service
   * attempts, automatically escalates to a human support ticket.
   */
  async handleQuery(input: SupportQueryInput): Promise<SupportQueryResult> {
    const shouldEscalate = input.attemptNumber >= this.maxAttempts;

    if (shouldEscalate) {
      // TODO: Call ticket-creator.skill to create a SupportTicket
      // TODO: Call notification-sender.skill to alert human support agent
      const ticket = await this.escalateToHuman(input);
      return {
        response: 'Your issue has been escalated to our support team. A human agent will contact you shortly.',
        resolved: false,
        escalated: true,
        ticket,
      };
    }

    // TODO: Call sentiment-analyzer.skill on input.query
    // TODO: Call knowledge-base-lookup.skill with the query for self-service answers
    // TODO: Call Claude service for conversational response if KB lookup fails

    return {
      response: '', // TODO: filled by KB lookup or Claude
      resolved: false,
      escalated: false,
    };
  }

  /** Creates a human-review support ticket after exhausting automated attempts. */
  private async escalateToHuman(input: SupportQueryInput): Promise<SupportTicket> {
    // TODO: Call ticket-creator.skill
    return {
      ticketId: '', // TODO: generate UUID
      userId: input.userId,
      jobId: input.jobId,
      query: input.query,
      severity: TicketSeverity.MEDIUM,
      status: TicketStatus.OPEN,
      attemptCount: input.attemptNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
