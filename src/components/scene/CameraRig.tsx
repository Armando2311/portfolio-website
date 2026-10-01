'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { scrollStore } from '@/lib/scrollStore';
import { SECTIONS } from '@/lib/content';

type Shot = { pos: [number, number, number]; look: [number, number, number] };

/** One camera shot per page section, in page order. */
export const SHOTS: Record<string, Shot> = {
  hero: { pos: [-7, 15, 31], look: [0, 0, -5] },
  profile: { pos: [-2.2, 5.2, 1.5], look: [-9.5, 0.4, -9.5] },
  capabilities: { pos: [0, 2.6, 6], look: [0, 1.2, -17] },
  line: { pos: [17, 7.5, -35], look: [4, 0, -19] },
  work: { pos: [7, 7.5, 31], look: [-6, 1, 14] },
  evidence: { pos: [0.01, 44, 7], look: [0, 0, 0.5] },
  toolchain: { pos: [-23, 5, 17], look: [-14, 0, 6] },
  lab: { pos: [16, 4.5, 4], look: [11, 0.5, 11] },
  contact: { pos: [26, 30, 40], look: [0, -2, -3] },
};

const ease = (f: number) => {
  // Hold briefly at each section, then glide.
  const x = THREE.MathUtils.clamp((f - 0.12) / 0.76, 0, 1);
  return x * x * (3 - 2 * x);
};

export default function CameraRig({ boardRef }: { boardRef: React.RefObject<THREE.Group | null> }) {
  const { camera } = useThree();
  const curves = useMemo(() => {
    const shots = SECTIONS.map((s) => SHOTS[s.id] ?? SHOTS.hero);
    return {
      pos: new THREE.CatmullRomCurve3(shots.map((s) => new THREE.Vector3(...s.pos)), false, 'centripetal', 0.5),
      look: new THREE.CatmullRomCurve3(shots.map((s) => new THREE.Vector3(...s.look)), false, 'centripetal', 0.5),
      n: shots.length,
    };
  }, []);

  const tmp = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      curLook: new THREE.Vector3(...SHOTS.hero.look),
      intro: new THREE.Vector3(0, 70, 60),
      intro_k: { v: 0 },
    }),
    [],
  );
  const started = useRef(false);

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.1);
    const { anchors, progress, reducedMotion } = scrollStore;
    const n = curves.n;

    // Map document progress → fractional shot index using the measured section anchors
    let u = 0;
    if (anchors.length === n) {
      let i = 0;
      while (i < n - 1 && progress >= anchors[i + 1].t) i++;
      if (i >= n - 1) u = 1;
      else {
        const span = Math.max(1e-4, anchors[i + 1].t - anchors[i].t);
        const f = THREE.MathUtils.clamp((progress - anchors[i].t) / span, 0, 1);
        u = (i + ease(f)) / (n - 1);
      }
    } else {
      u = progress;
    }

    curves.pos.getPoint(u, tmp.pos);
    curves.look.getPoint(u, tmp.look);

    // Gentle hand-held drift + pointer parallax
    if (!reducedMotion) {
      const t = state.clock.elapsedTime;
      tmp.pos.x += Math.sin(t * 0.21) * 0.35 + scrollStore.pointer.x * 1.4;
      tmp.pos.y += Math.sin(t * 0.17) * 0.25 + scrollStore.pointer.y * 0.8;
    }

    // Intro: fall in from high above once the boot screen clears
    if (scrollStore.booted) tmp.intro_k.v = Math.min(1, tmp.intro_k.v + dt * (reducedMotion ? 10 : 0.42));
    const k = tmp.intro_k.v;
    const ik = 1 - Math.pow(1 - k, 3);
    tmp.pos.lerp(tmp.intro, 1 - ik);

    if (!started.current) {
      camera.position.copy(tmp.pos);
      tmp.curLook.copy(tmp.look);
      started.current = true;
    }
    const lambda = reducedMotion ? 12 : 2.6;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tmp.pos.x, lambda, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, tmp.pos.y, lambda, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tmp.pos.z, lambda, dt);
    tmp.curLook.x = THREE.MathUtils.damp(tmp.curLook.x, tmp.look.x, lambda, dt);
    tmp.curLook.y = THREE.MathUtils.damp(tmp.curLook.y, tmp.look.y, lambda, dt);
    tmp.curLook.z = THREE.MathUtils.damp(tmp.curLook.z, tmp.look.z, lambda, dt);
    camera.lookAt(tmp.curLook);
    camera.userData.look = tmp.curLook;

    // The board banks slightly with scroll velocity
    const b = boardRef.current;
    if (b) {
      const v = reducedMotion ? 0 : THREE.MathUtils.clamp(scrollStore.velocity * 0.0016, -0.06, 0.06);
      b.rotation.z = THREE.MathUtils.damp(b.rotation.z, v, 3, dt);
      b.rotation.x = THREE.MathUtils.damp(b.rotation.x, -v * 0.5, 3, dt);
    }
  });

  return null;
}
