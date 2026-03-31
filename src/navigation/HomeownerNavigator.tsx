import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/homeowner/HomeScreen';
import NewJobScreen from '../screens/homeowner/NewJobScreen';
import DiagnosisScreen from '../screens/homeowner/DiagnosisScreen';
import QuoteScreen from '../screens/homeowner/QuoteScreen';
import SchedulingScreen from '../screens/homeowner/SchedulingScreen';
import TrackingScreen from '../screens/homeowner/TrackingScreen';
import ReviewScreen from '../screens/homeowner/ReviewScreen';
import SupportScreen from '../screens/homeowner/SupportScreen';

export type HomeownerStackParamList = {
  Home: undefined;
  NewJob: undefined;
  Diagnosis: { jobId: string };
  Quote: { jobId: string };
  Scheduling: { jobId: string; quoteId: string };
  Tracking: { jobId: string; providerId: string };
  Review: { jobId: string; providerId: string };
  Support: { jobId?: string };
};

const Stack = createStackNavigator<HomeownerStackParamList>();

const HomeownerNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#1A1A2E',
        headerTitleStyle: { fontWeight: '700' },
        cardStyle: { backgroundColor: '#F8F9FA' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'HomeServ AI' }} />
      <Stack.Screen name="NewJob" component={NewJobScreen} options={{ title: 'New Request' }} />
      <Stack.Screen name="Diagnosis" component={DiagnosisScreen} options={{ title: 'Diagnosis' }} />
      <Stack.Screen name="Quote" component={QuoteScreen} options={{ title: 'Your Quote' }} />
      <Stack.Screen name="Scheduling" component={SchedulingScreen} options={{ title: 'Book a Slot' }} />
      <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Track Provider' }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Rate Service' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
    </Stack.Navigator>
  );
};

export default HomeownerNavigator;
