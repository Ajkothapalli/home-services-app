import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Job } from '../../models/job.model';
import { ProviderAgent } from '../../agents/provider/provider.agent';

const providerAgent = new ProviderAgent();

const JobDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { jobId } = route.params ?? {};

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // TODO: Fetch /jobs/{jobId} from Firestore or Redux store
    setLoading(false); // placeholder
  }, [jobId]);

  const handleStatusAdvance = async () => {
    if (!job) return;
    setUpdating(true);
    try {
      const result = await providerAgent.updateJobStatus({
        jobId: job.jobId,
        providerId: 'provider-id', // TODO: use real providerId from store
        currentStatus: job.status,
      });
      // TODO: Update local state / Redux store with result.newStatus
      navigation.navigate('JobStatus', { jobId });
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color="#2563EB" /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Job Details</Text>
        {job ? (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Service Type</Text>
              <Text style={styles.value}>{job.serviceType}</Text>
              <Text style={styles.label}>Affected Area</Text>
              <Text style={styles.value}>{job.affectedArea}</Text>
              <Text style={styles.label}>Urgency</Text>
              <Text style={styles.value}>{job.urgency}</Text>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{job.location.address}</Text>
              <Text style={styles.label}>Current Status</Text>
              <Text style={styles.statusBadge}>{job.status}</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, updating && styles.buttonDisabled]}
              onPress={handleStatusAdvance}
              disabled={updating || !providerAgent.getNextStatus(job.status)}
            >
              <Text style={styles.buttonText}>
                {updating ? 'Updating...' : `Mark as ${providerAgent.getNextStatus(job.status) ?? 'Completed'}`}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.emptyText}>Job not found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', color: '#6C757D', textTransform: 'uppercase', marginTop: 12 },
  value: { fontSize: 15, color: '#1A1A2E', marginTop: 4 },
  statusBadge: { marginTop: 4, fontSize: 13, fontWeight: '700', color: '#2563EB', textTransform: 'uppercase' },
  button: { backgroundColor: '#16A34A', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#86EFAC' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 48 },
});

export default JobDetailScreen;
