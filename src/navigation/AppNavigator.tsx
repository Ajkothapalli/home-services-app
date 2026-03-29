import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { UserType } from '../models/user.model';

import HomeownerNavigator from './HomeownerNavigator';
import ProviderNavigator from './ProviderNavigator';

// TODO: import { RootState } from '../store';

export type RootStackParamList = {
  Homeowner: undefined;
  Provider: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  // TODO: const { user } = useSelector((state: RootState) => state.user);
  // Placeholder: derive user type from store
  const userType: UserType | null = null; // TODO: replace with state.user.userType

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userType === UserType.PROVIDER ? (
          <RootStack.Screen name="Provider" component={ProviderNavigator} />
        ) : (
          // Default to homeowner flow (also covers unauthenticated / onboarding state)
          <RootStack.Screen name="Homeowner" component={HomeownerNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
