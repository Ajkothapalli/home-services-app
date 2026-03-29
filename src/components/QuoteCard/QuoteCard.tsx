import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Quote } from '../../models/quote.model';
import { LineItem } from '../../models/quote.model';

interface QuoteCardProps {
  quote: Quote;
  onAccept: (quoteId: string) => void;
  onDecline: (quoteId: string) => void;
}

const LineItemRow: React.FC<{ item: LineItem }> = ({ item }) => (
  <View style={styles.lineItemRow}>
    <View style={styles.lineItemLeft}>
      <Text style={styles.lineItemDesc}>{item.description}</Text>
      <Text style={styles.lineItemMeta}>{item.quantity} {item.unit}</Text>
    </View>
    <Text style={styles.lineItemPrice}>₹{item.totalPrice.toFixed(2)}</Text>
  </View>
);

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onAccept, onDecline }) => {
  const hoursLeft = Math.max(
    0,
    Math.floor((quote.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)),
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Service Quote</Text>
      <Text style={styles.validity}>Valid for {hoursLeft}h · Expires {quote.expiresAt.toLocaleString()}</Text>

      <FlatList
        data={quote.lineItems}
        keyExtractor={item => item.itemId}
        renderItem={({ item }) => <LineItemRow item={item} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Subtotal</Text>
        <Text style={styles.totalValue}>₹{quote.subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>GST ({(quote.gstRate * 100).toFixed(0)}%)</Text>
        <Text style={styles.totalValue}>₹{quote.gstAmount.toFixed(2)}</Text>
      </View>
      <View style={[styles.totalRow, styles.grandTotalRow]}>
        <Text style={styles.grandTotalLabel}>Total</Text>
        <Text style={styles.grandTotalValue}>₹{quote.total.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => onDecline(quote.quoteId)}
        >
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => onAccept(quote.quoteId)}
        >
          <Text style={styles.acceptText}>Accept & Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, margin: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  title: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
  validity: { fontSize: 12, color: '#F59E0B', marginBottom: 16 },
  lineItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  lineItemLeft: { flex: 1 },
  lineItemDesc: { fontSize: 14, color: '#1A1A2E', fontWeight: '500' },
  lineItemMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  lineItemPrice: { fontSize: 14, color: '#1A1A2E', fontWeight: '600' },
  separator: { height: 1, backgroundColor: '#F3F4F6' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  totalLabel: { fontSize: 14, color: '#6C757D' },
  totalValue: { fontSize: 14, color: '#1A1A2E' },
  grandTotalRow: { marginTop: 8 },
  grandTotalLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  grandTotalValue: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  declineButton: { flex: 1, borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  declineText: { color: '#EF4444', fontWeight: '600', fontSize: 15 },
  acceptButton: { flex: 2, backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  acceptText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});

export default QuoteCard;
