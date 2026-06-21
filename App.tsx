import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation';
import { FavoritesProvider } from './src/stores';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </FavoritesProvider>
    </QueryClientProvider>
  );
}
