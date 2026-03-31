export enum ServiceType {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  AC_REPAIR = 'ac_repair',
  CARPENTRY = 'carpentry',
  PAINTING = 'painting',
  CLEANING = 'cleaning',
  PEST_CONTROL = 'pest_control',
  APPLIANCE_REPAIR = 'appliance_repair',
  SECURITY_SYSTEMS = 'security_systems',
  OTHER = 'other',
}

export enum Urgency {
  EMERGENCY = 'emergency',       // needs same-day service
  WITHIN_24H = 'within_24h',
  FLEXIBLE = 'flexible',
}

export enum JobStatus {
  PENDING = 'pending',
  DIAGNOSED = 'diagnosed',
  QUOTED = 'quoted',
  BOOKED = 'booked',
  ASSIGNED = 'assigned',
  ACCEPTED = 'accepted',
  EN_ROUTE = 'en_route',
  ARRIVED = 'arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED_PENDING_REVIEW = 'completed_pending_review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Diagnosis {
  summary: string;
  rootCause: string;
  confidence: number; // 0.0 – 1.0
  estimatedComplexity: 'low' | 'medium' | 'high';
  recommendedServiceType: string;
}

export interface Job {
  jobId: string;
  userId: string;
  providerId?: string;
  serviceType: ServiceType;
  affectedArea: string;
  urgency: Urgency;
  description: string;
  photoUrls: string[];
  location: {
    address: string;
    coords: { lat: number; lng: number };
  };
  status: JobStatus;
  diagnosis?: Diagnosis;
  quoteId?: string;
  bookingId?: string;
  workSummary?: string;
  review?: JobReview;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobReview {
  rating: number;  // 1–5
  comment?: string;
  submittedAt: Date;
}
