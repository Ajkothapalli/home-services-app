import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AvailableSlot } from '../../skills/slot-finder.skill';

// TODO: import SlotPicker from '../../components/SlotPicker';

const SchedulingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { jobId, quoteId } = route.params ?? {};

  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  useEffect(() => {
    // TODO: Call SchedulingAgent (via slot-finder.skill) to fetch available slots
    setLoading(false); // placeholder
  }, [jobId]);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    // TODO: Call SchedulingAgent.matchAndBook with selectedSlot
    // TODO: Dispatch on-booking-confirmed hook
    navigation.navigate('Home');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Finding available providers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose a Time Slot</Text>
      {/* TODO: <SlotPicker slots={slots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} /> */}
      <View style={styles.slotPlaceholder}>
        <Text style={styles.placeholderText}>SlotPicker will render here ({slots.length} slots available)</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, !selectedSlot && styles.buttonDisabled]}
        onPress={handleConfirm}
        disabled={!selectedSlot}
      >
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  loadingText: { marginTop: 16, fontSize: 15, color: '#6C757D' },
  slotPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: '#FFFFFF', marginBottom: 16 },
  placeholderText: { color: '#9CA3AF' },
  button: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#93C5FD' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default SchedulingScreen;
