export type Sentiment = 'positive' | 'neutral' | 'negative' | 'angry';

export interface AnalyzeSentimentInput {
  text: string;
}

export interface AnalyzeSentimentOutput {
  sentiment: Sentiment;
  score: number;      // -1.0 (very negative) to 1.0 (very positive)
  isUrgent: boolean;  // true if the text indicates urgency or distress
}

/**
 * Analyzes the sentiment of user-provided text.
 * Used by the SupportAgent to detect frustrated or urgent users.
 */
export async function analyzeSentiment(
  input: AnalyzeSentimentInput,
): Promise<AnalyzeSentimentOutput> {
  // TODO: Call ClaudeService.sendMessage with a sentiment analysis prompt
  // TODO: Parse response into AnalyzeSentimentOutput
  throw new Error(`analyzeSentiment not implemented for text: "${input.text.slice(0, 50)}..."`);
}
