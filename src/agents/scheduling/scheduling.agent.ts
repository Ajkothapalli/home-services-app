import { PROVIDER_SEARCH_RADIUS_KM, MIN_PROVIDER_RATING } from '../../config/constants';
import { Booking, BookingStatus, PaymentStatus } from '../../models/booking.model';
import { Provider } from '../../models/provider.model';

export interface SchedulingInput {
  jobId: string;
  userId: string;
  serviceType: string;
  location: { lat: number; lng: number };
  preferredSlot?: { date: string; time: string };
}

export interface SchedulingResult {
  booking: Booking;
  assignedProvider: Provider;
  confirmedSlot: { date: string; time: string };
}

export class SchedulingAgent {
  private agentName = 'SchedulingAgent';
  private searchRadiusKm = PROVIDER_SEARCH_RADIUS_KM; // 20
  private minRating = MIN_PROVIDER_RATING;             // 3.5

  /**
   * Finds the best available provider within radius and minimum rating,
   * selects a time slot, and creates a Booking record.
   */
  async matchAndBook(input: SchedulingInput): Promise<SchedulingResult> {
    // TODO: Call provider-matcher.skill with location, serviceType, searchRadiusKm, minRating
    // TODO: Call slot-finder.skill with matched providers + preferredSlot
    // TODO: Call booking-writer.skill to persist the Booking
    // TODO: Trigger on-booking-confirmed hook

    throw new Error(`[${this.agentName}] matchAndBook not yet implemented for job ${input.jobId}`);
  }

  /** Filters providers by radius and minimum rating. */
  filterEligibleProviders(providers: Provider[], userLat: number, userLng: number): Provider[] {
    // TODO: Compute haversine distance for each provider and filter by this.searchRadiusKm + this.minRating
    return providers.filter(p => p.rating >= this.minRating);
  }
}
