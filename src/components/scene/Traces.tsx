'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { TRACES } from '@/lib/boardLayout';
import { scrollStore } from '@/lib/scrollStore';

/** Build one merged ribbon mesh for every trace; arc length goes into aDist for the pulse shader. */
function buildGeometry() {
  const pos: number[] = [];
  const dist: number[] = [];
  const side: number[] = [];
  const seed: number[] = [];
  const pulse: number[] = [];
  const idx: number[] = [];
  let base = 0;
  const y = 0.012;

  for (const t of TRACES) {
    const p = t.pts;
    const hw = t.width / 2;
    let acc = 0;
    for (let i = 0; i < p.length; i++) {
      if (i > 0) acc += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      const prev = p[Math.max(0, i - 1)];
      const next = p[Math.min(p.length - 1, i + 1)];
      const a = i === 0 ? [next[0] - p[i][0], next[1] - p[i][1]] : [p[i][0] - prev[0], p[i][1] - prev[1]];
      const b = i === p.length - 1 ? a : [next[0] - p[i][0], next[1] - p[i][1]];
      const la = Math.hypot(a[0], a[1]) || 1;
      const lb = Math.hypot(b[0], b[1]) || 1;
      const n0 = [-a[1] / la, a[0] / la];
      const n1 = [-b[1] / lb, b[0] / lb];
      let mx = n0[0] + n1[0];
      let mz = n0[1] + n1[1];
      const ml = Math.hypot(mx, mz) || 1;
      mx /= ml;
      mz /= ml;
      const k = hw / Math.max(0.35, mx * n0[0] + mz * n0[1]);
      for (const s of [1, -1]) {
        pos.push(p[i][0] + mx * k * s, y, p[i][1] + mz * k * s);
        dist.push(acc);
        side.push(s);
        seed.push(t.seed);
        pulse.push(t.pulse ? 1 : 0);
      }
      if (i > 0) {
        const v = base + i * 2;
        idx.push(v - 2, v, v - 1, v - 1, v, v + 1);
      }
    }
    base += p.length * 2;
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aDist', new THREE.Float32BufferAttribute(dist, 1));
  g.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1));
  g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
  g.setAttribute('aPulse', new THREE.Float32BufferAttribute(pulse, 1));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

const vertex = /* glsl */ `
  attribute float aDist;
  attribute float aSide;
  attribute float aSeed;
  attribute float aPulse;
  varying float vDist;
  varying float vSide;
  varying float vSeed;
  varying float vPulse;
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vDist = aDist; vSide = aSide; vSeed = aSeed; vPulse = aPulse;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    vec4 mv = viewMatrix * w;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uPower;
  uniform float uBoost;
  uniform float uFog;
  uniform vec3 uCyan;
  uniform vec3 uAmber;
  uniform vec2 uFocus;
  varying float vDist;
  varying float vSide;
  varying float vSeed;
  varying float vPulse;
  varying vec3 vWorld;
  varying float vDepth;

  void main() {
    // Power-on wave radiating out of the sockets
    float r = min(length(vWorld.xz - vec2(-9.5, -9.0)), length(vWorld.xz - vec2(9.5, -9.0)));
    float lit = 1.0 - smoothstep(uPower * 70.0 - 6.0, uPower * 70.0, r);

    // Copper under green-black mask: dim, slightly lighter at the crown of the trace
    float crown = 1.0 - abs(vSide);
    vec3 copper = vec3(0.42, 0.28, 0.12) * (0.16 + 0.1 * crown);

    // Comet pulses travelling along the arc length
    float period = 9.0 + vSeed * 14.0;
    float speed = 0.18 + vSeed * 0.35 + uBoost * 0.5;
    float x = fract(vDist / period - uTime * speed + vSeed * 7.0);
    float head = pow(x, 18.0) + 0.6 * pow(x, 90.0);
    vec3 tint = mix(uCyan, uAmber, step(0.82, vSeed));
    float focus = 1.0 + 1.5 * (1.0 - smoothstep(4.0, 22.0, length(vWorld.xz - uFocus)));
    vec3 col = copper * (0.35 + 0.65 * lit);
    col += tint * head * vPulse * lit * (2.6 + uBoost * 3.0) * focus * (0.55 + 0.45 * crown);
    // Wavefront flash during power-on
    float front = smoothstep(6.0, 0.0, abs(r - uPower * 70.0 + 3.0)) * (1.0 - uPower);
    col += uCyan * front * 2.5;

    float fog = 1.0 - exp(-uFog * uFog * vDepth * vDepth);
    gl_FragColor = vec4(mix(col, vec3(0.0), fog), 1.0);
  }
`;

export default function Traces() {
  const geometry = useMemo(buildGeometry, []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPower: { value: 0 },
      uBoost: { value: 0 },
      uFog: { value: 0.017 },
      uCyan: { value: new THREE.Color('#36e6ff') },
      uAmber: { value: new THREE.Color('#ffb547') },
      uFocus: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  useFrame((state, dt) => {
    const u = uniforms;
    const rm = scrollStore.reducedMotion;
    u.uTime.value += dt * (rm ? 0.25 : 1);
    if (scrollStore.booted) u.uPower.value = Math.min(1, u.uPower.value + dt * (rm ? 4 : 0.45));
    const v = Math.min(1, Math.abs(scrollStore.velocity) / 40);
    u.uBoost.value = THREE.MathUtils.damp(u.uBoost.value, rm ? 0 : v, 4, dt);
    // Pulses get brighter where the camera is looking
    const focus = (state.camera.userData.look as THREE.Vector3 | undefined) ?? null;
    if (focus) u.uFocus.value.set(focus.x, focus.z);
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial side={THREE.DoubleSide} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} toneMapped={false} />
    </mesh>
  );
}
