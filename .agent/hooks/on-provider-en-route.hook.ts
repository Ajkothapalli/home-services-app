export const ON_PROVIDER_EN_ROUTE = 'on_provider_en_route';

export interface OnProviderEnRoutePayload {
  jobId: string;
  userId: string;
  providerId: string;
  estimatedArrivalMinutes: number;
}

/**
 * Fires when provider updates status to EN_ROUTE.
 * Triggers: live-location-tracker start, homeowner ETA notification.
 */
export async function handleProviderEnRoute(payload: OnProviderEnRoutePayload): Promise<void> {
  const { jobId, userId, providerId, estimatedArrivalMinutes } = payload;
  // TODO: Start live location tracking for this provider-job pair
  // TODO: Notify homeowner: "Provider is on the way! ETA: ~{estimatedArrivalMinutes} min"
  console.log(`[Hook:${ON_PROVIDER_EN_ROUTE}] Provider ${providerId} en route to job ${jobId} for user ${userId}, ETA: ${estimatedArrivalMinutes}min`);
}

// eventBus.on(ON_PROVIDER_EN_ROUTE, handleProviderEnRoute);
