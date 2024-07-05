'use client';

import React from 'react';

import { NextUIProvider } from '@nextui-org/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <NextUIProvider className="h-full min-h-full">{children}</NextUIProvider>;
}
