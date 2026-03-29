import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

interface EarningEntry {
  jobId: string;
  date: string;
  serviceType: string;
  amount: number;
  status: 'paid' | 'pending' | 'processing';
}

const EarningsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningEntry[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    // TODO: Fetch earnings from Firestore /providers/{providerId}/earnings
    // TODO: Aggregate totalPaid and totalPending
    setLoading(false); // placeholder
  }, []);

  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color="#2563EB" /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Earnings</Text>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Paid</Text>
          <Text style={[styles.summaryAmount, styles.paidColor]}>₹{totalPaid.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={[styles.summaryAmount, styles.pendingColor]}>₹{totalPending.toFixed(2)}</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Transaction History</Text>
      <FlatList
        data={earnings}
        keyExtractor={item => item.jobId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowService}>{item.serviceType}</Text>
              <Text style={styles.rowDate}>{item.date}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowAmount}>₹{item.amount.toFixed(2)}</Text>
              <Text style={[styles.rowStatus, item.status === 'paid' ? styles.paidColor : styles.pendingColor]}>
                {item.status}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No earnings records yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', padding: 16 },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: '#6C757D', marginBottom: 4 },
  summaryAmount: { fontSize: 22, fontWeight: '700' },
  paidColor: { color: '#16A34A' },
  pendingColor: { color: '#F59E0B' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', paddingHorizontal: 16, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', marginHorizontal: 8, marginVertical: 4, borderRadius: 8, padding: 14 },
  rowLeft: {},
  rowRight: { alignItems: 'flex-end' },
  rowService: { fontSize: 15, fontWeight: '500', color: '#1A1A2E' },
  rowDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  rowAmount: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  rowStatus: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 48 },
});

export default EarningsScreen;
