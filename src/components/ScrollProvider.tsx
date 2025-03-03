'use client';

import { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { ScrollControls } from '@react-three/drei';

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