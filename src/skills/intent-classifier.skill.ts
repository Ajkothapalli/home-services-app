import { Intent } from '../agents/orchestrator/orchestrator.agent';

export interface ClassifyIntentInput {
  text: string;
  sessionId: string;
  conversationHistory?: { role: 'user' | 'agent'; content: string }[];
}

export interface ClassifyIntentOutput {
  intent: Intent;
  confidence: number;
  entities: Record<string, string>;
}

/**
 * Classifies raw user text into one of the supported agent intents.
 * Uses Claude to perform zero-shot intent classification.
 */
export async function classifyIntent(
  input: ClassifyIntentInput,
): Promise<ClassifyIntentOutput> {
  // TODO: Build a classification prompt with the supported Intent types
  // TODO: Call ClaudeService.sendMessage with the prompt
  // TODO: Parse the JSON response into ClassifyIntentOutput
  throw new Error(`classifyIntent not implemented. Input text: "${input.text}"`);
}
