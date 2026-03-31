import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Job, JobStatus } from '../../models/job.model';

interface JobCardProps {
  job: Job;
  onPress: (jobId: string) => void;
}

const STATUS_COLORS: Record<JobStatus, string> = {
  [JobStatus.PENDING]: '#F59E0B',
  [JobStatus.DIAGNOSED]: '#8B5CF6',
  [JobStatus.QUOTED]: '#3B82F6',
  [JobStatus.BOOKED]: '#10B981',
  [JobStatus.ASSIGNED]: '#0EA5E9',
  [JobStatus.ACCEPTED]: '#0EA5E9',
  [JobStatus.EN_ROUTE]: '#F97316',
  [JobStatus.ARRIVED]: '#F97316',
  [JobStatus.IN_PROGRESS]: '#EF4444',
  [JobStatus.COMPLETED_PENDING_REVIEW]: '#84CC16',
  [JobStatus.COMPLETED]: '#16A34A',
  [JobStatus.CANCELLED]: '#9CA3AF',
};

const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(job.jobId)} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.serviceType}>{job.serviceType.replace(/_/g, ' ')}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[job.status] + '20' }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[job.status] }]}>
            {job.status.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>
      <Text style={styles.area}>{job.affectedArea}</Text>
      <Text style={styles.address} numberOfLines={1}>{job.location.address}</Text>
      <Text style={styles.date}>{new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginHorizontal: 12, marginVertical: 6, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  serviceType: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', textTransform: 'capitalize' },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  area: { fontSize: 14, color: '#374151', marginBottom: 4 },
  address: { fontSize: 13, color: '#9CA3AF', marginBottom: 4 },
  date: { fontSize: 12, color: '#D1D5DB' },
});

export default JobCard;
