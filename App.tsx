import 'react-native-gesture-handler';
import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import RootStack from './src/navigation/RootStack';
import { toastConfig } from './src/config/toastConfig';
import { WeddingProvider } from './src/context/WeddingContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './src/store/authStore';

export default function App() {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        setAuth(null, token); // user can be fetched later
      }
    };

    loadToken();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WeddingProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </WeddingProvider>

        <Toast config={toastConfig} visibilityTime={2500} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}