export interface MapRouteInput {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  mode?: 'driving' | 'walking' | 'transit';
}

export interface MapRouteOutput {
  distanceKm: number;
  durationMinutes: number;
  polyline: string;      // encoded polyline for map display
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distanceMetres: number;
  durationSeconds: number;
}

/**
 * Fetches a route between two coordinates using the Google Maps Directions API.
 */
export async function getMapRoute(
  input: MapRouteInput,
): Promise<MapRouteOutput> {
  // TODO: Call MapsService.getDirections with origin, destination, mode
  // TODO: Parse DirectionsResult into MapRouteOutput
  throw new Error(`getMapRoute not implemented. Origin: ${JSON.stringify(input.origin)}`);
}
