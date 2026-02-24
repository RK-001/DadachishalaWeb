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
      // staleTime: per-query (set individually in hooks based on data volatility)
      staleTime: 30 * 1000, // 30 seconds default
      // gcTime: how long unused cache entries stay in memory before GC
      gcTime: 10 * 60 * 1000, // 10 minutes

      // Retry configuration
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch configuration
      refetchOnWindowFocus: true,  // ensures users see updates when they come back to the tab
      refetchOnReconnect: true,    // re-sync after network loss
      refetchOnMount: true,        // fetch fresh data on component mount

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
