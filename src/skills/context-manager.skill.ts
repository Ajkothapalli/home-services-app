export interface ConversationContext {
  sessionId: string;
  userId: string;
  history: ContextMessage[];
  metadata: Record<string, unknown>;
  lastUpdated: Date;
}

export interface ContextMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentName?: string;
}

/**
 * Loads conversation context for a session from the session store.
 */
export async function loadContext(sessionId: string): Promise<ConversationContext | null> {
  // TODO: Read from Redis or Firestore /sessions/{sessionId}
  return null;
}

/**
 * Persists updated conversation context back to the session store.
 */
export async function saveContext(context: ConversationContext): Promise<void> {
  // TODO: Write to Redis or Firestore /sessions/{context.sessionId}
  // TODO: Set TTL of 24 hours for inactive sessions
}

/**
 * Appends a new message to the conversation context and saves it.
 */
export async function appendMessage(
  sessionId: string,
  message: Omit<ContextMessage, 'timestamp'>,
): Promise<ConversationContext> {
  // TODO: loadContext → append → saveContext
  throw new Error(`appendMessage not implemented for session: ${sessionId}`);
}
