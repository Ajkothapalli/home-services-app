import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface ChatBubbleProps {
  role: 'user' | 'agent';
  text: string;
  timestamp?: Date;
  agentName?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, text, timestamp, agentName }) => {
  const isUser = role === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.agentWrapper]}>
      {!isUser && agentName ? (
        <Text style={styles.agentName}>{agentName}</Text>
      ) : null}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.agentBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.agentText]}>
          {text}
        </Text>
      </View>
      {timestamp ? (
        <Text style={styles.timestamp}>
          {timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { maxWidth: '82%', marginVertical: 4 },
  userWrapper: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  agentWrapper: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  agentName: { fontSize: 11, color: '#9CA3AF', marginBottom: 2, marginLeft: 4, fontWeight: '600' },
  bubble: { borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 },
  userBubble: { backgroundColor: '#2563EB', borderBottomRightRadius: 4 },
  agentBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  text: { fontSize: 15, lineHeight: 21 },
  userText: { color: '#FFFFFF' },
  agentText: { color: '#1A1A2E' },
  timestamp: { fontSize: 11, color: '#9CA3AF', marginTop: 2, marginHorizontal: 4 },
});

export default ChatBubble;
