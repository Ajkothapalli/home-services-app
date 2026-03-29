import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// TODO: Import RootState type from store
// TODO: Import JobCard component

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  // TODO: const { jobs } = useSelector((state: RootState) => state.jobs);
  // TODO: const { user } = useSelector((state: RootState) => state.user);

  const handleNewJob = () => {
    navigation.navigate('NewJob');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello 👋</Text>
        <Text style={styles.subtitle}>What needs fixing today?</Text>
      </View>

      <TouchableOpacity style={styles.newJobButton} onPress={handleNewJob}>
        <Text style={styles.newJobButtonText}>+ Request a Service</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Jobs</Text>
      <FlatList
        data={[]} // TODO: replace with jobs from Redux store
        keyExtractor={item => (item as any).jobId}
        renderItem={({ item }) => (
          // TODO: <JobCard job={item} onPress={() => navigation.navigate('JobDetail', { jobId: item.jobId })} />
          <View style={styles.jobCardPlaceholder}>
            <Text>Job Card Placeholder</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No jobs yet. Tap above to get started!</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 24, paddingBottom: 8 },
  greeting: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 16, color: '#6C757D', marginTop: 4 },
  newJobButton: {
    margin: 16,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  newJobButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E', paddingHorizontal: 16, marginBottom: 8 },
  jobCardPlaceholder: { margin: 8, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 48, fontSize: 15 },
});

export default HomeScreen;
