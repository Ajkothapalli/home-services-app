import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_MODEL } from '../config/constants';
import { Env } from '../config/env';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeSendOptions {
  system?: string;
  maxTokens?: number;
  temperature?: number;
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: Env.CLAUDE_API_KEY });
  }
  return client;
}

/**
 * Sends a single-turn or multi-turn message to Claude and returns the full response.
 */
export async function sendMessage(
  messages: ClaudeMessage[],
  options: ClaudeSendOptions = {},
): Promise<string> {
  const response = await getClient().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: options.maxTokens ?? 1024,
    system: options.system,
    messages,
  });

  const block = response.content[0];
  if (block.type !== 'text') {
    throw new Error(`Unexpected content block type: ${block.type}`);
  }
  return block.text;
}

/**
 * Streams a response from Claude, invoking onChunk for each text delta.
 * Returns the fully accumulated response string.
 */
export async function streamMessage(
  messages: ClaudeMessage[],
  onChunk: (chunk: string) => void,
  options: ClaudeSendOptions = {},
): Promise<string> {
  const stream = await getClient().messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: options.maxTokens ?? 1024,
    system: options.system,
    messages,
  });

  let fullText = '';
  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      fullText += event.delta.text;
      onChunk(event.delta.text);
    }
  }
  return fullText;
}
