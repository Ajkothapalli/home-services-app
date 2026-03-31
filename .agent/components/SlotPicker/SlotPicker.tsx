import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AvailableSlot } from '../../skills/slot-finder.skill';
import { MAX_SLOTS_SHOWN } from '../../config/constants';

interface SlotPickerProps {
  slots: AvailableSlot[];
  selectedSlot: AvailableSlot | null;
  onSelect: (slot: AvailableSlot) => void;
}

const SlotPicker: React.FC<SlotPickerProps> = ({ slots, selectedSlot, onSelect }) => {
  const displaySlots = slots.slice(0, MAX_SLOTS_SHOWN);

  if (displaySlots.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No available slots found. Please try a different date.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Available Time Slots</Text>
      {displaySlots.map(slot => {
        const isSelected =
          selectedSlot?.slotId === slot.slotId && selectedSlot?.providerId === slot.providerId;
        return (
          <TouchableOpacity
            key={`${slot.providerId}-${slot.slotId}`}
            style={[styles.slot, isSelected && styles.slotSelected]}
            onPress={() => onSelect(slot)}
            activeOpacity={0.8}
          >
            <View style={styles.slotLeft}>
              <Text style={[styles.slotDate, isSelected && styles.selectedText]}>
                {new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Text>
              <Text style={[styles.slotTime, isSelected && styles.selectedText]}>
                {slot.startTime} – {slot.endTime}
              </Text>
            </View>
            <View style={styles.slotRight}>
              <Text style={[styles.providerName, isSelected && styles.selectedText]}>
                {slot.providerName}
              </Text>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 4 },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 12 },
  slot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: '#E5E7EB' },
  slotSelected: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  slotLeft: {},
  slotRight: { alignItems: 'flex-end' },
  slotDate: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  slotTime: { fontSize: 13, color: '#6C757D', marginTop: 2 },
  providerName: { fontSize: 13, color: '#6C757D' },
  selectedText: { color: '#2563EB' },
  checkmark: { fontSize: 16, color: '#2563EB', fontWeight: '700', marginTop: 4 },
  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 14, textAlign: 'center' },
});

export default SlotPicker;
