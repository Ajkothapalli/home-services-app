import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { startLiveTracking, LocationUpdate } from '../../skills/live-location-tracker.skill';

// TODO: import MapView, { Marker, Polyline } from 'react-native-maps';

const TrackingScreen: React.FC = () => {
  const route = useRoute<any>();
  const { jobId, providerId } = route.params ?? {};
  const stopTracking = useRef<(() => void) | null>(null);

  useEffect(() => {
    stopTracking.current = startLiveTracking(
      { providerId, jobId },
      (update: LocationUpdate) => {
        // TODO: Update map marker position with update.coords
        console.log('Provider location update:', update.coords);
      },
    );

    return () => {
      stopTracking.current?.();
    };
  }, [jobId, providerId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tracking Your Provider</Text>
      {/* TODO: Render MapView with provider marker and route polyline */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map View (react-native-maps)</Text>
        <Text style={styles.mapSubtext}>Provider location updates in real time</Text>
      </View>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>Provider is on the way</Text>
        <Text style={styles.etaText}>ETA: calculating...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', padding: 16 },
  mapPlaceholder: { flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  mapText: { fontSize: 16, color: '#6C757D' },
  mapSubtext: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  statusBar: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  statusText: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  etaText: { fontSize: 14, color: '#2563EB', marginTop: 4 },
});

export default TrackingScreen;
