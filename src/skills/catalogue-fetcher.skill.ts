import { ServiceType } from '../models/job.model';

export interface CatalogueItem {
  itemId: string;
  serviceType: ServiceType;
  name: string;
  description: string;
  basePrice: number;   // INR excl. GST
  unit: string;
  isActive: boolean;
}

export interface FetchCatalogueInput {
  serviceType: ServiceType;
  includeInactive?: boolean;
}

/**
 * Fetches the service catalogue items applicable to the given service type.
 */
export async function fetchCatalogue(
  input: FetchCatalogueInput,
): Promise<CatalogueItem[]> {
  // TODO: Query Firestore or REST API for catalogue items filtered by serviceType
  // TODO: Filter out inactive items unless includeInactive is true
  throw new Error(`fetchCatalogue not implemented for serviceType: ${input.serviceType}`);
}
