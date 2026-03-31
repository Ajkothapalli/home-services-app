import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SupportAgent } from '../../agents/support/support.agent';

const supportAgent = new SupportAgent();

interface Message {
  role: 'user' | 'agent';
  text: string;
}

const SupportScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: 'Hi! How can I help you today? Describe your issue and I\'ll do my best to assist.' },
  ]);
  const [input, setInput] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setSending(true);

    try {
      const result = await supportAgent.handleQuery({
        sessionId: 'support-session', // TODO: use real session ID
        userId: 'user-id',             // TODO: use real user ID from store
        query: userText,
        attemptNumber: attemptCount + 1,
      });
      setAttemptCount(prev => prev + 1);
      setMessages(prev => [...prev, { role: 'agent', text: result.response || 'Let me look into that.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'agent', text: 'Sorry, I\'m having trouble right now. Please try again.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Support</Text>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            // TODO: <ChatBubble role={item.role} text={item.text} />
            <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.agentBubble]}>
              <Text style={[styles.bubbleText, item.role === 'user' && styles.userText]}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.chatContent}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your question..."
            editable={!sending}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={sending}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  flex: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', padding: 16 },
  chatContent: { padding: 16, gap: 12 },
  bubble: { maxWidth: '80%', borderRadius: 12, padding: 12 },
  agentBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#2563EB', alignSelf: 'flex-end' },
  bubbleText: { fontSize: 15, color: '#1A1A2E' },
  userText: { color: '#FFFFFF' },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15 },
  sendButton: { backgroundColor: '#2563EB', borderRadius: 24, paddingHorizontal: 18, justifyContent: 'center' },
  sendText: { color: '#FFFFFF', fontWeight: '600' },
});

export default SupportScreen;
