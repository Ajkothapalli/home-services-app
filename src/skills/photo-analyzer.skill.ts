export interface AnalyzePhotoInput {
  photoUrls: string[];
  serviceType: string;
  userDescription?: string;
}

export interface PhotoAnalysisResult {
  detectedIssues: string[];
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  rawDescription: string;
}

/**
 * Sends photos to a vision model (GPT-4o Vision or Gemini Vision)
 * and extracts issue descriptions relevant to the service type.
 */
export async function analyzePhotos(
  input: AnalyzePhotoInput,
): Promise<PhotoAnalysisResult> {
  // TODO: Call VisionService.analyzeImages with input.photoUrls and context prompt
  // TODO: Parse structured JSON response from vision model
  throw new Error(`analyzePhotos not implemented for serviceType: ${input.serviceType}`);
}
