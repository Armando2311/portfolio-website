'use client';

import { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

interface ScrollProviderProps {
  children: ReactNode;
}

export function ScrollProvider({ children }: ScrollProviderProps) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
} 