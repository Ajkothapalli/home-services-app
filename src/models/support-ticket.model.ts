export enum TicketSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  AWAITING_USER = 'awaiting_user',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export interface SupportTicket {
  ticketId: string;
  userId: string;
  jobId?: string;
  bookingId?: string;
  query: string;
  severity: TicketSeverity;
  status: TicketStatus;
  attemptCount: number;   // number of automated attempts before escalation
  assignedAgentId?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}
