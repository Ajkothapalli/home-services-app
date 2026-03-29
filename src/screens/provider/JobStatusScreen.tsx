import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { JobStatus } from '../../models/job.model';
import { JOB_STATE_MACHINE } from '../../agents/provider/provider.agent';

const STATUS_LABELS: Record<JobStatus, string> = {
  [JobStatus.PENDING]: 'Pending',
  [JobStatus.DIAGNOSED]: 'Diagnosed',
  [JobStatus.QUOTED]: 'Quoted',
  [JobStatus.BOOKED]: 'Booked',
  [JobStatus.ASSIGNED]: 'Assigned to You',
  [JobStatus.ACCEPTED]: 'Accepted',
  [JobStatus.EN_ROUTE]: 'En Route',
  [JobStatus.ARRIVED]: 'Arrived',
  [JobStatus.IN_PROGRESS]: 'In Progress',
  [JobStatus.COMPLETED_PENDING_REVIEW]: 'Pending Review',
  [JobStatus.COMPLETED]: 'Completed',
  [JobStatus.CANCELLED]: 'Cancelled',
};

const PROVIDER_STEPS: JobStatus[] = [
  JobStatus.ASSIGNED,
  JobStatus.ACCEPTED,
  JobStatus.EN_ROUTE,
  JobStatus.ARRIVED,
  JobStatus.IN_PROGRESS,
  JobStatus.COMPLETED_PENDING_REVIEW,
  JobStatus.COMPLETED,
];

const JobStatusScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { jobId, currentStatus = JobStatus.ASSIGNED } = route.params ?? {};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Job Progress</Text>
      <ScrollView contentContainerStyle={styles.timeline}>
        {PROVIDER_STEPS.map((step, idx) => {
          const stepIndex = PROVIDER_STEPS.indexOf(currentStatus as JobStatus);
          const isPast = idx < stepIndex;
          const isCurrent = idx === stepIndex;
          return (
            <View key={step} style={styles.timelineRow}>
              <View style={[styles.dot, isPast && styles.dotPast, isCurrent && styles.dotCurrent]} />
              {idx < PROVIDER_STEPS.length - 1 && <View style={[styles.line, isPast && styles.linePast]} />}
              <Text style={[styles.stepLabel, isCurrent && styles.stepLabelCurrent]}>
                {STATUS_LABELS[step]}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('JobDetail', { jobId })}>
        <Text style={styles.buttonText}>Back to Job Details</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 24 },
  timeline: { paddingLeft: 8 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#E5E7EB', marginRight: 12, marginTop: 2, zIndex: 1 },
  dotPast: { backgroundColor: '#16A34A' },
  dotCurrent: { backgroundColor: '#2563EB', width: 20, height: 20, borderRadius: 10, marginTop: 0 },
  line: { position: 'absolute', left: 7, top: 18, width: 2, height: 32, backgroundColor: '#E5E7EB' },
  linePast: { backgroundColor: '#16A34A' },
  stepLabel: { fontSize: 15, color: '#6C757D', marginBottom: 32 },
  stepLabelCurrent: { fontSize: 16, fontWeight: '700', color: '#2563EB' },
  button: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default JobStatusScreen;
