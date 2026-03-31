import { Provider } from '../models/provider.model';
import { PROVIDER_SEARCH_RADIUS_KM, MIN_PROVIDER_RATING } from '../config/constants';

export interface ProviderMatchInput {
  serviceType: string;
  location: { lat: number; lng: number };
  radiusKm?: number;
  minRating?: number;
  scheduledDate: string;
}

export interface ProviderMatchOutput {
  providers: Provider[];
  totalFound: number;
}

/**
 * Finds providers within the specified radius who are verified, available on the
 * scheduled date, and meet the minimum rating requirement.
 */
export async function matchProviders(
  input: ProviderMatchInput,
): Promise<ProviderMatchOutput> {
  const radius = input.radiusKm ?? PROVIDER_SEARCH_RADIUS_KM;
  const minRating = input.minRating ?? MIN_PROVIDER_RATING;

  // TODO: Query geospatial index (e.g. Firestore GeoPoint or PostGIS) for providers
  //       within `radius` km of input.location
  // TODO: Filter by serviceType, isVerified=true, rating >= minRating
  // TODO: Filter by availability on input.scheduledDate

  return { providers: [], totalFound: 0 };
}
