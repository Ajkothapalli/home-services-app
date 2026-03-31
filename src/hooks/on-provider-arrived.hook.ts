export const ON_PROVIDER_ARRIVED = 'on_provider_arrived';

export interface OnProviderArrivedPayload {
  jobId: string;
  userId: string;
  providerId: string;
  arrivedAt: Date;
}

/**
 * Fires when provider marks status as ARRIVED.
 * Triggers: homeowner notification, stop ETA tracking.
 */
export async function handleProviderArrived(payload: OnProviderArrivedPayload): Promise<void> {
  const { jobId, userId, providerId } = payload;
  // TODO: Stop ETA live tracking
  // TODO: Notify homeowner: "Your provider has arrived!"
  // TODO: Record actual arrival time vs scheduled time for SLA metrics
  console.log(`[Hook:${ON_PROVIDER_ARRIVED}] Provider ${providerId} arrived for job ${jobId}, user ${userId}`);
}

// eventBus.on(ON_PROVIDER_ARRIVED, handleProviderArrived);
