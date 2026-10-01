'use client';

import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  ATX,
  BATTERY,
  BMC,
  CAPS,
  CPUS,
  DIMMS,
  DIMM_LEN,
  M2,
  NIC_CARD,
  PASSIVES,
  PCH,
  PCIE,
  POST_CODE,
  REAR_IO,
  REAR_IO_Z,
  SATA,
  SMALL_CHIPS,
  SOCKET,
  VRM_Z,
} from '@/lib/boardLayout';
import { scrollStore } from '@/lib/scrollStore';

type Item = { p: [number, number, number]; s: [number, number, number]; ry?: number; c?: THREE.ColorRepresentation };

const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 24);

function useMaterials() {
  return useMemo(
    () => ({
      plastic: new THREE.MeshStandardMaterial({ color: '#0e0f11', roughness: 0.55, metalness: 0.1 }),
      plasticLight: new THREE.MeshStandardMaterial({ color: '#c9cdd2', roughness: 0.5, metalness: 0.05 }),
      chip: new THREE.MeshStandardMaterial({ color: '#121316', roughness: 0.32, metalness: 0.25 }),
      ihs: new THREE.MeshStandardMaterial({ color: '#c3c7cc', roughness: 0.22, metalness: 1 }),
      steel: new THREE.MeshStandardMaterial({ color: '#8b9097', roughness: 0.35, metalness: 1 }),
      gold: new THREE.MeshStandardMaterial({ color: '#d4a84f', roughness: 0.28, metalness: 1 }),
      alu: new THREE.MeshStandardMaterial({ color: '#25282d', roughness: 0.38, metalness: 0.85 }),
      choke: new THREE.MeshStandardMaterial({ color: '#2c2e33', roughness: 0.6, metalness: 0.5 }),
      capBody: new THREE.MeshStandardMaterial({ color: '#17181b', roughness: 0.4, metalness: 0.7 }),
      capTop: new THREE.MeshStandardMaterial({ color: '#a7adb4', roughness: 0.3, metalness: 1 }),
      pcb: new THREE.MeshStandardMaterial({ color: '#0a120e', roughness: 0.6, metalness: 0.2 }),
      sticker: new THREE.MeshStandardMaterial({ color: '#d8dbde', roughness: 0.8, metalness: 0 }),
      passive: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5, metalness: 0.3 }),
      vga: new THREE.MeshStandardMaterial({ color: '#1b2a48', roughness: 0.5, metalness: 0.2 }),
    }),
    [],
  );
}

function Instanced({ items, geometry = BOX, material }: { items: Item[]; geometry?: THREE.BufferGeometry; material: THREE.Material }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      o.rotation.set(0, it.ry ?? 0, 0);
      o.scale.set(...it.s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      if (it.c !== undefined) m.setColorAt(i, col.set(it.c));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere();
  }, [items]);
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} castShadow receiveShadow />;
}

function makeLabelTexture(lines: { t: string; size: number; weight?: number }[], w = 512, h = 512, color = 'rgba(40,44,50,0.85)') {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = color;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const total = lines.reduce((a, l) => a + l.size * 1.35, 0);
  let y = h / 2 - total / 2;
  for (const l of lines) {
    g.font = `${l.weight ?? 700} ${l.size}px ui-monospace, Menlo, Consolas, monospace`;
    y += (l.size * 1.35) / 2;
    g.fillText(l.t, w / 2, y);
    y += (l.size * 1.35) / 2;
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function Cpu({ x, z, label, mats }: { x: number; z: number; label: string; mats: ReturnType<typeof useMaterials> }) {
  const tex = useMemo(
    () =>
      makeLabelTexture([
        { t: 'ART', size: 92, weight: 800 },
        { t: 'VALIDATION', size: 34 },
        { t: '& INTEGRATION', size: 34 },
        { t: '—', size: 24 },
        { t: `${label} · SR-26`, size: 26, weight: 500 },
        { t: 'BATCH 20–100 · TRACEABLE', size: 22, weight: 500 },
      ]),
    [label],
  );
  const s = SOCKET;
  return (
    <group position={[x, 0, z]}>
      <mesh position-y={0.18} material={mats.plastic} castShadow receiveShadow>
        <boxGeometry args={[s, 0.36, s]} />
      </mesh>
      {/* Independent loading mechanism frame */}
      {[
        [0, -s / 2 + 0.35, s - 0.2, 0.7],
        [0, s / 2 - 0.35, s - 0.2, 0.7],
        [-s / 2 + 0.35, 0, 0.7, s - 1.6],
        [s / 2 - 0.35, 0, 0.7, s - 1.6],
      ].map(([px, pz, w, d], i) => (
        <mesh key={i} position={[px, 0.5, pz]} material={mats.steel} castShadow>
          <boxGeometry args={[w, 0.18, d]} />
        </mesh>
      ))}
      {/* Load lever */}
      <mesh position={[s / 2 + 0.25, 0.55, 0]} rotation-x={Math.PI / 2} material={mats.steel} castShadow>
        <cylinderGeometry args={[0.09, 0.09, s - 0.5, 12]} />
      </mesh>
      {/* Integrated heat spreader */}
      <mesh position-y={0.62} material={mats.ihs} castShadow receiveShadow>
        <boxGeometry args={[6.4, 0.42, 7.4]} />
      </mesh>
      <mesh position-y={0.836} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[5.6, 6.6]} />
        <meshStandardMaterial map={tex} transparent roughness={0.5} metalness={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Leds() {
  const refs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const leds = useMemo(() => {
    const out: { p: [number, number, number]; color: string; mode: 'beat' | 'act' | 'link' | 'pwr' }[] = [];
    out.push({ p: [BMC.x + 2.1, 0.08, BMC.z - 0.6], color: '#3dff8a', mode: 'beat' });
    REAR_IO.forEach((io) => {
      if (io.kind === 'rj45' || io.kind === 'mgmt') {
        out.push({ p: [io.x - 0.6, 1.1, REAR_IO_Z - 1.22], color: '#3dff8a', mode: 'link' });
        out.push({ p: [io.x + 0.6, 1.1, REAR_IO_Z - 1.22], color: '#ffb547', mode: 'act' });
      }
    });
    out.push({ p: [ATX.x - 1.6, 0.08, ATX.z - 3.8], color: '#36e6ff', mode: 'pwr' });
    return out;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const on = scrollStore.booted;
    leds.forEach((l, i) => {
      const m = refs.current[i];
      if (!m) return;
      let k = 0;
      if (on) {
        if (l.mode === 'beat') k = Math.pow(Math.max(0, Math.sin(t * 3.2)), 8) + Math.pow(Math.max(0, Math.sin(t * 3.2 - 0.9)), 8);
        else if (l.mode === 'act') k = Math.sin(t * 23 + i * 7) * Math.sin(t * 5.3 + i) > 0.15 ? 1 : 0.05;
        else k = 1;
      }
      m.color.set(l.color).multiplyScalar(0.15 + k * 5);
    });
  });
  return (
    <group>
      {leds.map((l, i) => (
        <mesh key={i} position={l.p}>
          <boxGeometry args={[0.28, 0.14, 0.18]} />
          <meshBasicMaterial ref={(m) => { refs.current[i] = m; }} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function PostCode() {
  const { tex, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return { tex: t, canvas: c };
  }, []);
  const last = useRef('');
  useFrame(({ clock }) => {
    let code = '--';
    if (scrollStore.booted) {
      code = clock.elapsedTime % 1 < 0.05 && !scrollStore.reducedMotion ? 'A0' : (0xa0 + scrollStore.active).toString(16).toUpperCase();
    }
    if (code === last.current) return;
    last.current = code;
    const g = canvas.getContext('2d')!;
    g.fillStyle = '#120202';
    g.fillRect(0, 0, 256, 128);
    g.font = '800 104px ui-monospace, Menlo, Consolas, monospace';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = 'rgba(255,60,40,0.12)';
    g.fillText('88', 128, 68);
    g.fillStyle = '#ff4a2e';
    g.fillText(code, 128, 68);
    tex.needsUpdate = true;
  });
  return (
    <group position={[POST_CODE.x, 0, POST_CODE.z]}>
      <mesh position-y={0.15}>
        <boxGeometry args={[1.7, 0.3, 1.0]} />
        <meshStandardMaterial color="#111" roughness={0.4} />
      </mesh>
      <mesh position-y={0.302} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshBasicMaterial map={tex} toneMapped={false} color={new THREE.Color(2.2, 2.2, 2.2)} />
      </mesh>
    </group>
  );
}

export default function Components({ detail = 1 }: { detail?: number }) {
  const m = useMaterials();

  const data = useMemo(() => {
    const plastic: Item[] = [];
    const plasticLight: Item[] = [];
    const chips: Item[] = [];
    const gold: Item[] = [];
    const alu: Item[] = [];
    const chokes: Item[] = [];
    const steel: Item[] = [];
    const pcb: Item[] = [];
    const sticker: Item[] = [];
    const capBody: Item[] = [];
    const capTop: Item[] = [];

    // DIMM slots + modules
    DIMMS.forEach((d) => {
      plastic.push({ p: [d.x, 0.35, d.z], s: [0.55, 0.7, DIMM_LEN] });
      plasticLight.push({ p: [d.x, 0.55, d.z - DIMM_LEN / 2 - 0.25], s: [0.5, 1.1, 0.4] });
      plasticLight.push({ p: [d.x, 0.55, d.z + DIMM_LEN / 2 + 0.25], s: [0.5, 1.1, 0.4] });
      if (d.populated) {
        const h = 3.1;
        pcb.push({ p: [d.x, 0.6 + h / 2, d.z], s: [0.09, h, DIMM_LEN - 0.5] });
        gold.push({ p: [d.x, 0.66, d.z], s: [0.1, 0.12, DIMM_LEN - 0.9] });
        for (const sx of [-1, 1]) {
          for (let i = 0; i < 9; i++) {
            const cz = d.z - DIMM_LEN / 2 + 0.95 + i * ((DIMM_LEN - 1.9) / 8);
            chips.push({ p: [d.x + sx * 0.09, 0.6 + h * 0.55, cz], s: [0.08, 0.95, 1.0] });
          }
        }
        sticker.push({ p: [d.x + 0.135, 0.6 + h * 0.2, d.z + 2.2], s: [0.01, 0.45, 2.6] });
        chips.push({ p: [d.x + 0.09, 0.6 + h * 0.2, d.z - 0.2], s: [0.07, 0.35, 0.5] }); // SPD/PMIC
      }
    });

    // VRM: chokes, MOSFET heatsink with fins
    CPUS.forEach((c) => {
      for (let i = 0; i < 12; i++) chokes.push({ p: [c.x - 6 + i * 1.1, 0.38, VRM_Z + 0.75], s: [0.92, 0.76, 0.92] });
      alu.push({ p: [c.x, 0.32, VRM_Z - 1.0], s: [13.4, 0.24, 1.8] });
      for (let i = 0; i < 34; i++) alu.push({ p: [c.x - 6.5 + i * 0.394, 1.05, VRM_Z - 1.0], s: [0.09, 1.3, 1.8] });
    });
    CAPS.forEach((cp) => {
      capBody.push({ p: [cp.x, cp.h / 2, cp.z], s: [cp.r, cp.h, cp.r] });
      capTop.push({ p: [cp.x, cp.h + 0.01, cp.z], s: [cp.r * 0.92, 0.02, cp.r * 0.92] });
    });

    // PCIe slots
    PCIE.forEach((p, i) => {
      plastic.push({ p: [p.x, 0.38, p.z], s: [p.len, 0.76, 0.72] });
      gold.push({ p: [p.x + 0.4, 0.765, p.z], s: [p.len - 1.6, 0.012, 0.1] });
      plasticLight.push({ p: [p.x + p.len / 2 - 0.2, 0.5, p.z], s: [0.5, 1.0, 0.8] });
      if (i === NIC_CARD.slot) {
        const len = NIC_CARD.len;
        const cx = NIC_CARD.x0 + len / 2;
        pcb.push({ p: [cx, 0.85 + 1.9, p.z], s: [len, 3.8, 0.1] });
        chips.push({ p: [cx + 1, 2.6, p.z - 0.09], s: [2.0, 2.0, 0.08] });
        alu.push({ p: [cx + 1, 2.6, p.z - 0.35], s: [2.6, 2.6, 0.5] });
        for (let f = 0; f < 9; f++) alu.push({ p: [cx - 0.2 + f * 0.3, 2.6, p.z - 0.8], s: [0.07, 2.6, 0.5] });
        steel.push({ p: [NIC_CARD.x0 - 0.05, 2.8, p.z], s: [0.08, 4.6, 0.9] }); // bracket
        steel.push({ p: [NIC_CARD.x0 + 0.7, 3.3, p.z - 0.45], s: [1.3, 0.9, 0.7] }); // SFP cage
        steel.push({ p: [NIC_CARD.x0 + 0.7, 1.95, p.z - 0.45], s: [1.3, 0.9, 0.7] });
      }
    });

    // PCH + heatsink
    chips.push({ p: [PCH.x, 0.12, PCH.z], s: [3.6, 0.24, 3.6] });
    alu.push({ p: [PCH.x, 0.42, PCH.z], s: [5, 0.2, 5] });
    for (let i = 0; i < 16; i++) alu.push({ p: [PCH.x - 2.3 + i * 0.307, 0.95, PCH.z], s: [0.08, 0.9, 5] });

    // BMC
    chips.push({ p: [BMC.x, 0.12, BMC.z], s: [2.6, 0.24, 2.6] });
    steel.push({ p: [BMC.x - 0.9, 0.245, BMC.z - 0.9], s: [0.2, 0.01, 0.2] });

    // M.2 NVMe
    plastic.push({ p: [M2.x - M2.len / 2 - 0.2, 0.22, M2.z], s: [0.6, 0.44, 1.8] });
    pcb.push({ p: [M2.x + 0.15, 0.34, M2.z], s: [M2.len, 0.06, 1.6] });
    chips.push({ p: [M2.x - 2.2, 0.42, M2.z], s: [1.4, 0.12, 1.3] });
    chips.push({ p: [M2.x + 0.2, 0.42, M2.z], s: [1.7, 0.12, 1.3] });
    chips.push({ p: [M2.x + 2.4, 0.42, M2.z], s: [1.7, 0.12, 1.3] });
    sticker.push({ p: [M2.x + 1.3, 0.49, M2.z], s: [3.6, 0.01, 1.2] });
    steel.push({ p: [M2.x + M2.len / 2 + 0.4, 0.3, M2.z], s: [0.5, 0.6, 0.5] });

    // SATA + ATX + battery
    SATA.forEach((s) => plastic.push({ p: [s.x, 0.45, s.z], s: [1.4, 0.9, 0.85] }));
    plastic.push({ p: [ATX.x, 0.6, ATX.z], s: [1.7, 1.2, 6.2] });

    // Rear I/O shields
    REAR_IO.forEach((io) => {
      if (io.kind === 'rj45' || io.kind === 'mgmt') steel.push({ p: [io.x, 0.8, REAR_IO_Z], s: [2.0, 1.6, 2.4] });
      if (io.kind === 'usb') {
        steel.push({ p: [io.x, 0.75, REAR_IO_Z], s: [1.6, 1.5, 2.2] });
      }
    });

    // Scattered packages
    SMALL_CHIPS.forEach((r) => chips.push({ p: [r.x, 0.09, r.z], s: [r.w, 0.18, r.d] }));

    const passives: Item[] = PASSIVES.slice(0, Math.floor(PASSIVES.length * detail)).map((p) => ({
      p: [p.x, 0.035, p.z],
      s: [0.2, 0.07, 0.1],
      ry: p.rot,
      c: p.tone < 0.55 ? '#1a1a1a' : p.tone < 0.85 ? '#a48a5b' : '#6f7680',
    }));

    return { plastic, plasticLight, chips, gold, alu, chokes, steel, pcb, sticker, capBody, capTop, passives };
  }, [detail]);

  const vgaX = REAR_IO.find((r) => r.kind === 'vga')!.x;

  return (
    <group>
      {CPUS.map((c) => (
        <Cpu key={c.label} x={c.x} z={c.z} label={c.label} mats={m} />
      ))}
      <Instanced items={data.plastic} material={m.plastic} />
      <Instanced items={data.plasticLight} material={m.plasticLight} />
      <Instanced items={data.chips} material={m.chip} />
      <Instanced items={data.gold} material={m.gold} />
      <Instanced items={data.alu} material={m.alu} />
      <Instanced items={data.chokes} material={m.choke} />
      <Instanced items={data.steel} material={m.steel} />
      <Instanced items={data.pcb} material={m.pcb} />
      <Instanced items={data.sticker} material={m.sticker} />
      <Instanced items={data.capBody} geometry={CYL} material={m.capBody} />
      <Instanced items={data.capTop} geometry={CYL} material={m.capTop} />
      <Instanced items={data.passives} material={m.passive} />
      <mesh position={[BATTERY.x, 0.18, BATTERY.z]} material={m.steel} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 0.32, 40]} />
      </mesh>
      <mesh position={[vgaX, 0.6, REAR_IO_Z]} material={m.vga} castShadow>
        <boxGeometry args={[3.0, 1.2, 1.6]} />
      </mesh>
      <Leds />
      <PostCode />
    </group>
  );
}
