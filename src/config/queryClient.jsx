/**
 * React Query Configuration and Provider
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure Query Client with optimized settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache configuration
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection (formerly cacheTime)
      
      // Retry configuration
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch configuration
      refetchOnWindowFocus: false, // Don't refetch on window focus (reduces calls)
      refetchOnReconnect: true, // Refetch when reconnecting
      refetchOnMount: false, // Don't refetch on component mount if data exists
      
      // Error handling
      throwOnError: false,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

// Query Client Provider Component
export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
