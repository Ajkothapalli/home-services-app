export interface WriteWorkSummaryInput {
  jobId: string;
  providerId: string;
  workDescription: string;
  partsUsed: { name: string; quantity: number; unitCost: number }[];
  beforePhotoUrls: string[];
  afterPhotoUrls: string[];
  durationMinutes: number;
}

export interface WorkSummary {
  jobId: string;
  summary: string;
  partsUsed: { name: string; quantity: number; unitCost: number }[];
  beforePhotoUrls: string[];
  afterPhotoUrls: string[];
  durationMinutes: number;
  generatedAt: Date;
}

/**
 * Generates a structured work-completion summary for homeowner and billing records.
 */
export async function writeWorkSummary(
  input: WriteWorkSummaryInput,
): Promise<WorkSummary> {
  // TODO: Use Claude to generate a concise prose summary from input.workDescription
  // TODO: Write to Firestore /jobs/{jobId}/workSummary
  throw new Error(`writeWorkSummary not implemented for jobId: ${input.jobId}`);
}
