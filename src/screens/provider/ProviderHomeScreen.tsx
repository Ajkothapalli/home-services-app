import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// TODO: import JobCard from '../../components/JobCard';

const ProviderHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isAvailable, setIsAvailable] = useState(false);

  const toggleAvailability = async (value: boolean) => {
    setIsAvailable(value);
    // TODO: Update provider availability in Firestore
    // TODO: Call notification-sender.skill to alert matched homeowners
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Provider Dashboard</Text>
          <Text style={styles.subtitle}>Manage your jobs and availability</Text>
        </View>
        <View style={styles.availabilityRow}>
          <Text style={styles.availabilityLabel}>{isAvailable ? 'Available' : 'Offline'}</Text>
          <Switch
            value={isAvailable}
            onValueChange={toggleAvailability}
            trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
            thumbColor={isAvailable ? '#16A34A' : '#9CA3AF'}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Assigned Jobs</Text>
      <FlatList
        data={[]} // TODO: replace with jobs from Redux store filtered by providerId
        keyExtractor={item => (item as any).jobId}
        renderItem={({ item }) => (
          // TODO: <JobCard job={item} onPress={() => navigation.navigate('JobDetail', { jobId: item.jobId })} />
          <TouchableOpacity
            style={styles.jobCard}
            onPress={() => navigation.navigate('JobDetail', { jobId: (item as any).jobId })}
          >
            <Text>Job placeholder</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No jobs assigned. Toggle availability to start receiving jobs.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: '#6C757D', marginTop: 2 },
  availabilityRow: { alignItems: 'center', gap: 4 },
  availabilityLabel: { fontSize: 12, fontWeight: '600', color: '#6C757D' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E', paddingHorizontal: 16, marginBottom: 8 },
  jobCard: { margin: 8, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 48, fontSize: 15, paddingHorizontal: 32 },
});

export default ProviderHomeScreen;
