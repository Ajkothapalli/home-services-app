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
import { Diagnosis } from '../../models/job.model';

const DiagnosisScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { jobId } = route.params ?? {};

  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  useEffect(() => {
    // TODO: Subscribe to Firestore /jobs/{jobId} for real-time diagnosis updates
    // TODO: When diagnosis arrives and confidence >= threshold, stop loading
    const timer = setTimeout(() => setLoading(false), 2000); // placeholder
    return () => clearTimeout(timer);
  }, [jobId]);

  const handleProceedToQuote = () => {
    navigation.navigate('Quote', { jobId });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Analyzing your issue with AI...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Diagnosis Result</Text>
      {diagnosis ? (
        <View style={styles.card}>
          <Text style={styles.label}>Issue Summary</Text>
          <Text style={styles.value}>{diagnosis.summary}</Text>
          <Text style={styles.label}>Root Cause</Text>
          <Text style={styles.value}>{diagnosis.rootCause}</Text>
          <Text style={styles.label}>Complexity</Text>
          <Text style={styles.value}>{diagnosis.estimatedComplexity}</Text>
          <Text style={styles.confidence}>Confidence: {(diagnosis.confidence * 100).toFixed(0)}%</Text>
        </View>
      ) : (
        <Text style={styles.placeholder}>Diagnosis not available yet.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleProceedToQuote}>
        <Text style={styles.buttonText}>View Quote</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', color: '#6C757D', textTransform: 'uppercase', marginTop: 12 },
  value: { fontSize: 15, color: '#1A1A2E', marginTop: 4 },
  confidence: { marginTop: 12, fontSize: 13, color: '#2563EB', fontWeight: '600' },
  loadingText: { marginTop: 16, fontSize: 15, color: '#6C757D' },
  placeholder: { color: '#9CA3AF', fontSize: 15, textAlign: 'center', marginTop: 48 },
  button: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default DiagnosisScreen;
