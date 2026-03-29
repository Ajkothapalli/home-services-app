// Supports GPT-4o Vision (OpenAI) or Gemini Vision (Google) for photo analysis.
// Primary: GPT-4o Vision via OpenAI API.
// Fallback: Gemini Vision via Google Generative AI SDK.

export interface AnalyzeImageInput {
  imageUrls: string[];
  prompt: string;
  maxTokens?: number;
}

export interface VisionAnalysisResult {
  description: string;
  detectedObjects: string[];
  issues: string[];
  severity: 'low' | 'medium' | 'high' | 'unknown';
  rawResponse: string;
}

/**
 * Sends images to GPT-4o Vision (or Gemini Vision as fallback) for analysis.
 * Returns structured issue detection results.
 */
export async function analyzeImages(
  input: AnalyzeImageInput,
): Promise<VisionAnalysisResult> {
  // TODO: Build OpenAI chat completion request with vision content blocks:
  //   { role: 'user', content: [
  //     ...input.imageUrls.map(url => ({ type: 'image_url', image_url: { url } })),
  //     { type: 'text', text: input.prompt }
  //   ]}
  // TODO: Parse response into VisionAnalysisResult
  // TODO: Fallback to Gemini Vision if OpenAI call fails
  throw new Error(`analyzeImages not implemented. Prompt: "${input.prompt.slice(0, 60)}..."`);
}
