'use client';

import React from 'react';

import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';

let browserQueryClient: QueryClient | undefined = undefined;

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
};

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider className="h-full min-h-full">{children}</NextUIProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
}
