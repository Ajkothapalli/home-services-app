import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Quote } from '../../models/quote.model';

// TODO: import QuoteCard from '../../components/QuoteCard';

const QuoteScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { jobId } = route.params ?? {};

  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // TODO: Subscribe to Firestore /jobs/{jobId} to get quoteId
    // TODO: Fetch /quotes/{quoteId} when quoteId is set
    setLoading(false); // placeholder
  }, [jobId]);

  const handleAccept = (quoteId: string) => {
    // TODO: Call QuotingAgent acceptance flow
    // TODO: Dispatch on-quote-accepted hook
    // TODO: Navigate to SchedulingScreen
    navigation.navigate('Scheduling', { jobId, quoteId });
  };

  const handleDecline = (_quoteId: string) => {
    Alert.alert('Quote Declined', 'You have declined this quote. Would you like to request a new one?', [
      { text: 'Yes', onPress: () => navigation.navigate('NewJob') },
      { text: 'No', style: 'cancel' },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Generating your quote...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Quote</Text>
      {quote ? (
        // TODO: <QuoteCard quote={quote} onAccept={handleAccept} onDecline={handleDecline} />
        <View style={styles.placeholder}>
          <Text>QuoteCard will render here</Text>
        </View>
      ) : (
        <Text style={styles.emptyText}>Quote is being prepared...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  loadingText: { marginTop: 16, fontSize: 15, color: '#6C757D' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 15, textAlign: 'center', marginTop: 48 },
});

export default QuoteScreen;
