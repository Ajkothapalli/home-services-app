import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IntakeAgent, IntakeSession, ConversationStep } from '../../agents/intake/intake.agent';

// TODO: Import ChatBubble, PhotoUploader, LocationPicker components

const intakeAgent = new IntakeAgent();

const NewJobScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState<ConversationStep>('service_type');
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string }[]>([
    { role: 'agent', text: intakeAgent.getStepPrompt('service_type') },
  ]);

  const handleUserInput = async (userText: string) => {
    // TODO: Append user message to messages
    // TODO: Call intakeAgent.collectJobInfo with current session and userText
    // TODO: On completion, dispatch writeJobRecord and navigate to DiagnosisScreen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>New Service Request</Text>
      <Text style={styles.stepIndicator}>
        Step {['service_type', 'affected_area', 'urgency', 'photos', 'location'].indexOf(currentStep) + 1} of 5
      </Text>
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {messages.map((msg, idx) => (
          // TODO: <ChatBubble key={idx} role={msg.role} text={msg.text} />
          <View key={idx} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.agentBubble]}>
            <Text style={styles.bubbleText}>{msg.text}</Text>
          </View>
        ))}
        {/* TODO: Render PhotoUploader when currentStep === 'photos' */}
        {/* TODO: Render LocationPicker when currentStep === 'location' */}
      </ScrollView>
      {/* TODO: Add text input bar at bottom for user messages */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', padding: 16 },
  stepIndicator: { fontSize: 13, color: '#6C757D', paddingHorizontal: 16, marginBottom: 8 },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, gap: 12 },
  bubble: { maxWidth: '80%', borderRadius: 12, padding: 12 },
  agentBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#2563EB', alignSelf: 'flex-end' },
  bubbleText: { fontSize: 15, color: '#1A1A2E' },
});

export default NewJobScreen;
