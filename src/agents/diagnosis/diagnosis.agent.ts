import { DIAGNOSIS_CONFIDENCE_THRESHOLD } from '../../config/constants';
import { Diagnosis } from '../../models/job.model';

export interface DiagnosisInput {
  jobId: string;
  serviceType: string;
  affectedArea: string;
  photoUrls: string[];
  userDescription: string;
}

export interface DiagnosisOutput {
  jobId: string;
  diagnosis: Diagnosis;
  needsHumanReview: boolean;
  suggestedActions: string[];
}

export class DiagnosisAgent {
  private agentName = 'DiagnosisAgent';
  private confidenceThreshold = DIAGNOSIS_CONFIDENCE_THRESHOLD; // 0.70

  /**
   * Analyzes the job inputs (photos + description) to produce a diagnosis.
   * If confidence < threshold, flags the job for human review.
   */
  async analyzeJob(input: DiagnosisInput): Promise<DiagnosisOutput> {
    // TODO: Call photo-analyzer.skill with input.photoUrls
    // TODO: Call knowledge-base-lookup.skill with serviceType + userDescription
    // TODO: Aggregate results into a Diagnosis object

    const placeholderDiagnosis: Diagnosis = {
      summary: '',
      rootCause: '',
      confidence: 0,
      estimatedComplexity: 'medium',
      recommendedServiceType: input.serviceType,
    };

    const needsHumanReview =
      placeholderDiagnosis.confidence < this.confidenceThreshold;

    return {
      jobId: input.jobId,
      diagnosis: placeholderDiagnosis,
      needsHumanReview,
      suggestedActions: [],
    };
  }

  /** Checks if a diagnosis confidence score meets the minimum threshold. */
  meetsConfidenceThreshold(confidence: number): boolean {
    return confidence >= this.confidenceThreshold;
  }
}
