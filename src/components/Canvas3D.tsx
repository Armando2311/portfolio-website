'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import Background3D from './Background3D';
import { ScrollControls } from '@react-three/drei';
import LoadingAnimation from './LoadingAnimation';

export default function Canvas3D() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time and then hide the loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingAnimation />}
      
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#6666ff" />
          <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" />
          
          <Suspense fallback={null}>
            <ScrollControls pages={3} damping={0.25}>
              <Background3D />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
} 