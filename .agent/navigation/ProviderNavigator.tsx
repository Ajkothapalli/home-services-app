import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProviderHomeScreen from '../screens/provider/ProviderHomeScreen';
import JobDetailScreen from '../screens/provider/JobDetailScreen';
import JobStatusScreen from '../screens/provider/JobStatusScreen';
import EarningsScreen from '../screens/provider/EarningsScreen';

export type ProviderStackParamList = {
  ProviderHome: undefined;
  JobDetail: { jobId: string };
  JobStatus: { jobId: string; currentStatus?: string };
  Earnings: undefined;
};

const Stack = createStackNavigator<ProviderStackParamList>();

const ProviderNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProviderHome"
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#1A1A2E',
        headerTitleStyle: { fontWeight: '700' },
        cardStyle: { backgroundColor: '#F8F9FA' },
      }}
    >
      <Stack.Screen name="ProviderHome" component={ProviderHomeScreen} options={{ title: 'My Jobs' }} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
      <Stack.Screen name="JobStatus" component={JobStatusScreen} options={{ title: 'Job Progress' }} />
      <Stack.Screen name="Earnings" component={EarningsScreen} options={{ title: 'Earnings' }} />
    </Stack.Navigator>
  );
};

export default ProviderNavigator;
