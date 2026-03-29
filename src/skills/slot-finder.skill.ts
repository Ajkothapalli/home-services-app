import { Provider, AvailabilitySlot } from '../models/provider.model';
import { MAX_SLOTS_SHOWN } from '../config/constants';

export interface SlotFinderInput {
  providers: Provider[];
  preferredDate?: string;
  preferredTime?: string;
}

export interface AvailableSlot {
  providerId: string;
  providerName: string;
  date: string;
  startTime: string;
  endTime: string;
  slotId: string;
}

export interface SlotFinderOutput {
  slots: AvailableSlot[];
}

/**
 * Returns up to MAX_SLOTS_SHOWN available time slots across the matched providers.
 * Prioritises slots matching the user's preferred date and time if provided.
 */
export async function findAvailableSlots(
  input: SlotFinderInput,
): Promise<SlotFinderOutput> {
  const allSlots: AvailableSlot[] = [];

  for (const provider of input.providers) {
    const freeSlots = provider.availabilityCalendar.filter(
      (slot: AvailabilitySlot) => !slot.isBooked,
    );
    for (const slot of freeSlots) {
      allSlots.push({
        providerId: provider.providerId,
        providerName: provider.name,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotId: slot.slotId,
      });
    }
  }

  // TODO: Sort by preferred date/time proximity
  return { slots: allSlots.slice(0, MAX_SLOTS_SHOWN) };
}
