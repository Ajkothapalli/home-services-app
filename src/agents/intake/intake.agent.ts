import { ServiceType, Urgency } from '../../models/job.model';

export type ConversationStep =
  | 'service_type'
  | 'affected_area'
  | 'urgency'
  | 'photos'
  | 'location';

export const INTAKE_STEPS: ConversationStep[] = [
  'service_type',
  'affected_area',
  'urgency',
  'photos',
  'location',
];

export interface IntakeSession {
  sessionId: string;
  userId: string;
  currentStep: ConversationStep;
  collectedData: Partial<JobIntakeData>;
}

export interface JobIntakeData {
  serviceType: ServiceType;
  affectedArea: string;
  urgency: Urgency;
  photoUrls: string[];
  locationCoords: { lat: number; lng: number };
  locationAddress: string;
}

export interface IntakeResult {
  complete: boolean;
  nextStep?: ConversationStep;
  collectedData: Partial<JobIntakeData>;
  promptForUser?: string;
}

export class IntakeAgent {
  private agentName = 'IntakeAgent';

  /**
   * Advances the intake conversation by one step, collecting job information
   * from the user. Returns whether collection is complete and what to ask next.
   */
  async collectJobInfo(
    session: IntakeSession,
    userInput: string,
  ): Promise<IntakeResult> {
    const { currentStep, collectedData } = session;

    switch (currentStep) {
      case 'service_type':
        // TODO: Parse userInput into ServiceType enum using NLP or keyword match
        return {
          complete: false,
          nextStep: 'affected_area',
          collectedData: { ...collectedData /* serviceType: parsed */ },
          promptForUser: 'Which area of your home is affected?',
        };

      case 'affected_area':
        // TODO: Store free-text affected area description
        return {
          complete: false,
          nextStep: 'urgency',
          collectedData: { ...collectedData, affectedArea: userInput },
          promptForUser: 'How urgent is this? (emergency / within_24h / flexible)',
        };

      case 'urgency':
        // TODO: Parse userInput into Urgency enum
        return {
          complete: false,
          nextStep: 'photos',
          collectedData: { ...collectedData /* urgency: parsed */ },
          promptForUser: 'Please upload up to 3 photos of the issue.',
        };

      case 'photos':
        // TODO: Photo URLs are provided by the PhotoUploader component, not raw text
        return {
          complete: false,
          nextStep: 'location',
          collectedData,
          promptForUser: 'Please confirm or select your service location.',
        };

      case 'location':
        // TODO: Location is captured by the LocationPicker component
        return {
          complete: true,
          collectedData,
          promptForUser: undefined,
        };

      default:
        throw new Error(`[${this.agentName}] Unknown intake step: ${currentStep}`);
    }
  }

  /** Returns the prompt string for a given conversation step. */
  getStepPrompt(step: ConversationStep): string {
    const prompts: Record<ConversationStep, string> = {
      service_type: 'What type of home service do you need? (e.g. plumbing, electrical, AC repair)',
      affected_area: 'Which area of your home is affected?',
      urgency: 'How urgent is this? (emergency / within_24h / flexible)',
      photos: 'Please upload up to 3 photos of the issue.',
      location: 'Please confirm your service address.',
    };
    return prompts[step];
  }
}
