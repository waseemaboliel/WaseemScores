import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation';
import { FavoritesProvider, SettingsProvider, migrateFromAsyncStorage } from './src/stores';
import { registerForPushNotifications } from './src/services/notifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  useEffect(() => {
    migrateFromAsyncStorage();
    registerForPushNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <FavoritesProvider>
            <AppNavigator />
            <StatusBar style="light" />
          </FavoritesProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
