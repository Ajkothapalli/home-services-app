export interface PickLocationInput {
  initialCoords?: { lat: number; lng: number };
  searchQuery?: string;
}

export interface PickLocationOutput {
  coords: { lat: number; lng: number };
  address: string;
  placeId?: string;
}

/**
 * UI skill: prompts the user to select a location via the LocationPicker component.
 * Geocodes the selected map point to a human-readable address.
 */
export async function pickLocation(
  input: PickLocationInput,
): Promise<PickLocationOutput> {
  // TODO: Show LocationPicker component to user
  // TODO: On pin drop or search selection, call MapsService.reverseGeocode
  throw new Error('pickLocation is a UI skill and must be invoked from a React component');
}
