'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import Substrate from './Substrate';
import Traces from './Traces';
import Components from './Components';
import CameraRig from './CameraRig';
import { scrollStore } from '@/lib/scrollStore';

function Sparks({ count = 260 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = Math.random() * 18;
      p[i * 3 + 2] = (Math.random() - 0.5) * 70;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return g;
  }, [count]);
  useFrame((_, dt) => {
    if (!ref.current || scrollStore.reducedMotion) return;
    const a = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = a.getY(i) + dt * (0.25 + (i % 7) * 0.05);
      if (y > 18) y = 0;
      a.setY(i, y);
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.06}
        color={new THREE.Color(1.2, 3.2, 3.6)}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function ScanLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(({ clock, camera }) => {
    const l = ref.current;
    const look = camera.userData.look as THREE.Vector3 | undefined;
    if (!l || !look) return;
    const t = clock.elapsedTime * 0.5;
    l.position.set(look.x + Math.sin(t) * 7, 5, look.z + Math.cos(t) * 7);
  });
  return <pointLight ref={ref} color="#36e6ff" intensity={60} distance={26} decay={2} />;
}

function World({ mobile }: { mobile: boolean }) {
  const board = useRef<THREE.Group>(null);
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fogExp2 attach="fog" args={['#000000', 0.017]} />
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[-18, 30, 14]}
        intensity={1.5}
        color="#dfe8ff"
        castShadow={!mobile}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-bias={-0.0004}
      />
      <spotLight position={[24, 9, -40]} angle={0.5} penumbra={1} intensity={170} color="#ffb547" distance={70} />
      <spotLight position={[-22, 10, 34]} angle={0.7} penumbra={1} intensity={300} color="#36e6ff" distance={70} />
      <ScanLight />
      <Environment resolution={256} environmentIntensity={0.55}>
        <Lightformer intensity={2.2} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[30, 3, 1]} />
        <Lightformer intensity={1.2} position={[-12, 6, 8]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} color="#9fe9ff" />
        <Lightformer intensity={1.0} position={[12, 4, -10]} rotation-y={-Math.PI / 2} scale={[16, 2, 1]} color="#ffd29a" />
      </Environment>
      <group ref={board}>
        <Substrate maxTexture={mobile ? 2048 : 4096} />
        <Traces />
        <Components detail={mobile ? 0.45 : 1} />
      </group>
      <Sparks count={mobile ? 120 : 260} />
      <CameraRig boardRef={board} />
      <EffectComposer multisampling={mobile ? 0 : 4}>
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={1.15} radius={0.72} />
        <ChromaticAberration offset={new THREE.Vector2(0.0007, 0.0005)} radialModulation modulationOffset={0.35} />
        <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} />
        <Vignette darkness={0.78} offset={0.22} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}

export default function Scene() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 768px), (pointer: coarse)').matches);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        flat
        shadows={!mobile}
        dpr={mobile ? [1, 1.5] : [1, 1.75]}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
        camera={{ fov: 38, near: 0.1, far: 220, position: [0, 70, 60] }}
      >
        <Suspense fallback={null}>
          <World mobile={mobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
