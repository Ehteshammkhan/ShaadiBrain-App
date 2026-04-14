import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import RootStack from './src/navigation/RootStack';
import { toastConfig } from './src/config/toastConfig';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>

      <Toast
        config={toastConfig}
        visibilityTime={2500}
      />
    </SafeAreaProvider>
  );
}
