import { ServiceType } from './job.model';

export interface Provider {
  providerId: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  profilePhotoUrl?: string;
  serviceTypes: ServiceType[];
  rating: number;          // 0.0 – 5.0
  totalJobsCompleted: number;
  isVerified: boolean;
  isAvailable: boolean;
  currentLocation?: { lat: number; lng: number };
  serviceRadiusKm: number;
  availabilityCalendar: AvailabilitySlot[];
  bankDetails?: BankDetails;
  documents: ProviderDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilitySlot {
  slotId: string;
  date: string;   // ISO date string YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  isBooked: boolean;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface ProviderDocument {
  docId: string;
  type: 'aadhaar' | 'pan' | 'police_verification' | 'skill_certificate';
  url: string;
  verifiedAt?: Date;
}
