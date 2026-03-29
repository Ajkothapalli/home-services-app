export interface StartTrackingInput {
  providerId: string;
  jobId: string;
  intervalMs?: number; // default 10000 (10 seconds)
}

export interface LocationUpdate {
  providerId: string;
  coords: { lat: number; lng: number };
  timestamp: Date;
  accuracyMetres: number;
}

export type LocationUpdateCallback = (update: LocationUpdate) => void;

/**
 * Starts real-time location tracking of a provider for a given job.
 * Publishes location updates to Firestore for homeowner live map view.
 * Returns a stop function to cancel tracking.
 */
export function startLiveTracking(
  input: StartTrackingInput,
  onUpdate: LocationUpdateCallback,
): () => void {
  // TODO: Call Geolocation.watchPosition or react-native-maps tracking API
  // TODO: On each update, write to Firestore /jobs/{jobId}/providerLocation
  // TODO: Call onUpdate callback with the new coords
  const intervalId = setInterval(() => {
    // TODO: replace with real geolocation
  }, input.intervalMs ?? 10000);

  return () => clearInterval(intervalId);
}
