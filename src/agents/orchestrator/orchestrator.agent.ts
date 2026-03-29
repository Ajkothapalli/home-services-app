import { MAX_AGENT_HOPS } from '../../config/constants';

export type Intent =
  | 'job_request'
  | 'diagnosis_query'
  | 'quote_request'
  | 'booking_request'
  | 'support_query'
  | 'provider_update';

export interface AgentMessage {
  sessionId: string;
  userId: string;
  intent: Intent;
  payload: Record<string, unknown>;
  hopCount?: number;
}

export interface RoutingResult {
  targetAgent: string;
  message: AgentMessage;
}

const INTENT_ROUTING_MAP: Record<Intent, string> = {
  job_request: 'intake',
  diagnosis_query: 'diagnosis',
  quote_request: 'quoting',
  booking_request: 'scheduling',
  support_query: 'support',
  provider_update: 'provider',
};

export class OrchestratorAgent {
  private agentName = 'OrchestratorAgent';

  /**
   * Routes an incoming message to the appropriate sub-agent based on detected intent.
   * Enforces MAX_AGENT_HOPS to prevent infinite routing loops.
   */
  async routeMessage(message: AgentMessage): Promise<RoutingResult> {
    const hopCount = (message.hopCount ?? 0) + 1;

    if (hopCount > MAX_AGENT_HOPS) {
      throw new Error(
        `[${this.agentName}] Max agent hops (${MAX_AGENT_HOPS}) exceeded for session ${message.sessionId}`,
      );
    }

    const targetAgent = INTENT_ROUTING_MAP[message.intent];
    if (!targetAgent) {
      throw new Error(
        `[${this.agentName}] Unknown intent: ${message.intent}`,
      );
    }

    // TODO: Invoke the target agent via the agent registry or dependency injection
    return {
      targetAgent,
      message: { ...message, hopCount },
    };
  }

  /**
   * Classifies raw user text into a structured Intent using the intent-classifier skill.
   */
  async classifyIntent(rawText: string, sessionId: string): Promise<Intent> {
    // TODO: Call classifyIntent skill with rawText
    // import { classifyIntent } from '../../skills/intent-classifier.skill';
    throw new Error(
      `[${this.agentName}] classifyIntent not implemented. Input: "${rawText}", session: ${sessionId}`,
    );
  }
}
