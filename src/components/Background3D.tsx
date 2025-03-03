'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll } from 'framer-motion';

// Generate random points in a 3D space
function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface ParticlesProps {
  count: number;
}

function Particles({ count = 2000 }: ParticlesProps) {
  const points = useRef<THREE.Points>(null!);
  const scroll = useScroll();
  
  // Create a Float32Array to store the positions of the particles
  const positions = useRef<Float32Array | null>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  
  // Generate random positions for the particles
  useEffect(() => {
    positions.current = new Float32Array(count * 3);
    originalPositions.current = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = random(-10, 10);
      const y = random(-10, 10);
      const z = random(-10, 10);
      
      positions.current[i3] = x;
      positions.current[i3 + 1] = y;
      positions.current[i3 + 2] = z;
      
      originalPositions.current[i3] = x;
      originalPositions.current[i3 + 1] = y;
      originalPositions.current[i3 + 2] = z;
    }
  }, [count]);
  
  // Update the particles on each frame
  useFrame((state, delta) => {
    if (!positions.current || !originalPositions.current || !points.current) return;
    
    // Get the current scroll progress
    const scrollY = scroll.scrollY.get();
    const scrollYProgress = scroll.scrollYProgress.get();
    
    // Rotate the points based on time and scroll
    points.current.rotation.x = scrollYProgress * 0.5;
    points.current.rotation.y = scrollYProgress * 0.3;
    
    // Move particles based on scroll
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply some movement based on scroll
      positions.current[i3] = originalPositions.current[i3] + Math.sin(scrollY * 0.001 + i * 0.01) * 0.5;
      positions.current[i3 + 1] = originalPositions.current[i3 + 1] + Math.cos(scrollY * 0.001 + i * 0.01) * 0.5;
      positions.current[i3 + 2] = originalPositions.current[i3 + 2] + Math.sin(scrollY * 0.001 + i * 0.02) * 0.5;
    }
    
    // Update the geometry
    points.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <Points ref={points} limit={count}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
      />
      {positions.current && (
        <bufferAttribute
          attach="geometry.attributes.position"
          count={count}
          array={positions.current}
          itemSize={3}
          args={[positions.current, 3]}
        />
      )}
    </Points>
  );
}

function AnimatedCube() {
  const cubeRef = useRef<THREE.Group>(null!);
  const cubeMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const scroll = useScroll();
  const time = useRef(0);
  const [initialAnimation, setInitialAnimation] = useState(true);
  
  // Initial animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialAnimation(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update the cube on each frame
  useFrame((state, delta) => {
    if (!cubeRef.current || !cubeMaterialRef.current) return;
    
    // Increment time
    time.current += delta;
    
    // Get the current scroll progress
    const scrollY = scroll.scrollY.get();
    const scrollYProgress = scroll.scrollYProgress.get();
    
    if (initialAnimation) {
      // Initial animation - cube appears from nowhere and grows
      const progress = Math.min(time.current / 2, 1); // 2 seconds animation
      const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      cubeRef.current.scale.set(easeOutProgress, easeOutProgress, easeOutProgress);
      cubeRef.current.rotation.x = easeOutProgress * Math.PI * 4;
      cubeRef.current.rotation.y = easeOutProgress * Math.PI * 4;
      cubeRef.current.position.z = (1 - easeOutProgress) * 10;
      
      // Fade in the material
      cubeMaterialRef.current.opacity = easeOutProgress;
    } else {
      // Regular scroll-based animation
      // Rotate the cube based on scroll and time
      cubeRef.current.rotation.x = scrollYProgress * Math.PI * 2 + time.current * 0.1;
      cubeRef.current.rotation.y = scrollYProgress * Math.PI * 2 + time.current * 0.15;
      
      // Move the cube based on scroll
      cubeRef.current.position.x = Math.sin(scrollYProgress * Math.PI * 2) * 3;
      cubeRef.current.position.y = Math.cos(scrollYProgress * Math.PI * 2) * 3;
      cubeRef.current.position.z = Math.sin(scrollYProgress * Math.PI) * 2;
      
      // Scale the cube based on scroll
      const scale = 1 + Math.sin(scrollYProgress * Math.PI) * 0.3;
      cubeRef.current.scale.set(scale, scale, scale);
      
      // Update material properties
      cubeMaterialRef.current.wireframe = scrollYProgress > 0.5;
      cubeMaterialRef.current.emissive.setRGB(
        0.5 + Math.sin(time.current) * 0.5,
        0.5 + Math.cos(time.current * 0.5) * 0.5,
        0.5 + Math.sin(time.current * 0.3) * 0.5
      );
    }
  });
  
  return (
    <group ref={cubeRef} position={[0, 0, 0]}>
      {/* Main cube */}
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          ref={cubeMaterialRef}
          color="#ffffff" 
          wireframe={false}
          metalness={0.8}
          roughness={0.2}
          emissive="#ffffff"
          emissiveIntensity={0.2}
          transparent
          opacity={1}
        />
      </mesh>
      
      {/* Outer wireframe cube */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshBasicMaterial color="#ffffff" wireframe={true} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function Background3D() {
  return (
    <>
      <Particles count={2000} />
      <AnimatedCube />
    </>
  );
} 