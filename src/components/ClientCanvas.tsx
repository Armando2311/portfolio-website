'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Canvas3D component with client-side only rendering
const Canvas3D = dynamic(() => import('./Canvas3D'), {
  ssr: false,
});

export default function ClientCanvas() {
  return <Canvas3D />;
} 