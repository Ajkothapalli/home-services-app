import { SupportTicket, TicketSeverity, TicketStatus } from '../models/support-ticket.model';

export interface CreateTicketInput {
  userId: string;
  jobId?: string;
  bookingId?: string;
  query: string;
  severity?: TicketSeverity;
  attemptCount: number;
}

/**
 * Creates a new SupportTicket in Firestore and notifies the support team.
 */
export async function createTicket(
  input: CreateTicketInput,
): Promise<SupportTicket> {
  // TODO: Generate ticketId (UUID v4)
  // TODO: Write to Firestore /supportTickets/{ticketId}
  // TODO: Trigger notification to on-call support agent

  const ticket: SupportTicket = {
    ticketId: '', // TODO: uuid()
    userId: input.userId,
    jobId: input.jobId,
    bookingId: input.bookingId,
    query: input.query,
    severity: input.severity ?? TicketSeverity.MEDIUM,
    status: TicketStatus.OPEN,
    attemptCount: input.attemptCount,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return ticket;
}
