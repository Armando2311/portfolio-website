'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import {
  BOARD_D,
  BOARD_T,
  BOARD_W,
  BMC,
  CPUS,
  DIMMS,
  DIMM_LEN,
  M2,
  PCH,
  PCIE,
  POST_CODE,
  SATA,
  ATX,
  SMALL_CHIPS,
  SOCKET,
  VIAS,
  VRM_Z,
  mulberry32,
} from '@/lib/boardLayout';

const PX = 64; // texels per world unit (max 4096 on the long side)

function makeBoardTexture(maxSize: number) {
  const scale = Math.min(PX, maxSize / BOARD_D);
  const cw = Math.round(BOARD_W * scale);
  const ch = Math.round(BOARD_D * scale);
  const c = document.createElement('canvas');
  c.width = cw;
  c.height = ch;
  const g = c.getContext('2d')!;
  const X = (x: number) => (x + BOARD_W / 2) * scale;
  const Z = (z: number) => (z + BOARD_D / 2) * scale;
  const S = (v: number) => v * scale;
  const rnd = mulberry32(9);

  // Solder mask: near-black with a faint blue-green cast and grain.
  g.fillStyle = '#06080a';
  g.fillRect(0, 0, cw, ch);
  const img = g.getImageData(0, 0, cw, ch);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rnd() - 0.5) * 7;
    img.data[i] += n;
    img.data[i + 1] += n + 1;
    img.data[i + 2] += n + 2;
  }
  g.putImageData(img, 0, 0);

  // Copper pour under the mask: cross-hatch zones
  g.save();
  g.strokeStyle = 'rgba(120, 140, 150, 0.035)';
  g.lineWidth = Math.max(1, S(0.04));
  for (let i = -ch; i < cw + ch; i += S(0.35)) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i + ch, ch);
    g.stroke();
  }
  g.restore();

  // Ground stitching via grid along the board perimeter
  g.fillStyle = 'rgba(160, 130, 70, 0.35)';
  for (let x = -BOARD_W / 2 + 0.8; x < BOARD_W / 2; x += 0.9) {
    for (const z of [-BOARD_D / 2 + 0.6, BOARD_D / 2 - 0.6]) {
      g.beginPath();
      g.arc(X(x), Z(z), S(0.09), 0, Math.PI * 2);
      g.fill();
    }
  }
  for (let z = -BOARD_D / 2 + 0.8; z < BOARD_D / 2; z += 0.9) {
    for (const x of [-BOARD_W / 2 + 0.6, BOARD_W / 2 - 0.6]) {
      g.beginPath();
      g.arc(X(x), Z(z), S(0.09), 0, Math.PI * 2);
      g.fill();
    }
  }

  // Vias at trace endpoints: gold annular ring + dark drill
  for (const [x, z] of VIAS) {
    g.fillStyle = '#7a6436';
    g.beginPath();
    g.arc(X(x), Z(z), S(0.11), 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#020202';
    g.beginPath();
    g.arc(X(x), Z(z), S(0.05), 0, Math.PI * 2);
    g.fill();
  }

  // Silkscreen
  const silk = 'rgba(225, 230, 235, 0.62)';
  g.strokeStyle = silk;
  g.fillStyle = silk;
  g.lineWidth = Math.max(1, S(0.05));
  g.textBaseline = 'middle';
  const font = (size: number, weight = 600) => `${weight} ${S(size)}px ui-monospace, Menlo, Consolas, monospace`;
  const outline = (x: number, z: number, w: number, d: number, notch = false) => {
    g.strokeRect(X(x - w / 2), Z(z - d / 2), S(w), S(d));
    if (notch) {
      g.beginPath();
      g.moveTo(X(x - w / 2), Z(z - d / 2) + S(0.6));
      g.lineTo(X(x - w / 2) + S(0.6), Z(z - d / 2));
      g.stroke();
    }
  };
  const label = (t: string, x: number, z: number, size = 0.42, align: CanvasTextAlign = 'left') => {
    g.font = font(size);
    g.textAlign = align;
    g.fillText(t, X(x), Z(z));
  };

  CPUS.forEach((cpu) => {
    outline(cpu.x, cpu.z, SOCKET + 0.6, SOCKET + 0.6, true);
    label(cpu.label, cpu.x - SOCKET / 2 - 0.2, cpu.z - SOCKET / 2 - 0.65, 0.55);
    // Socket mounting holes
    [-1, 1].forEach((sx) =>
      [-1, 1].forEach((sz) => {
        g.beginPath();
        g.arc(X(cpu.x + sx * (SOCKET / 2 + 1)), Z(cpu.z + sz * (SOCKET / 2 + 1)), S(0.35), 0, Math.PI * 2);
        g.stroke();
      }),
    );
  });
  DIMMS.forEach((d) => {
    outline(d.x, d.z, 0.7, DIMM_LEN + 0.4);
    g.save();
    g.translate(X(d.x), Z(d.z + DIMM_LEN / 2 + 0.9));
    g.rotate(-Math.PI / 2);
    g.font = font(0.3);
    g.textAlign = 'left';
    g.fillText(d.label, 0, 0);
    g.restore();
  });
  PCIE.forEach((p) => {
    outline(p.x, p.z, p.len + 0.4, 1.0);
    label(p.label, p.x + p.len / 2 + 0.5, p.z, 0.36);
  });
  outline(PCH.x, PCH.z, 5.6, 5.6, true);
  label(PCH.label, PCH.x - 2.8, PCH.z + 3.3, 0.45);
  outline(BMC.x, BMC.z, 3.2, 3.2, true);
  label('BMC', BMC.x - 1.6, BMC.z + 2.1, 0.45);
  label('HEARTBEAT', BMC.x + 2.1, BMC.z - 1.2, 0.26);
  outline(M2.x, M2.z, M2.len + 0.6, 1.9);
  label(M2.label, M2.x - M2.len / 2, M2.z + 1.45, 0.34);
  SATA.forEach((s) => label(s.label, s.x - 1.1, s.z, 0.26, 'right'));
  outline(ATX.x, ATX.z, 2.2, 6.6);
  label(ATX.label, ATX.x - 1.4, ATX.z + 3.7, 0.3);
  label('POST', POST_CODE.x - 0.9, POST_CODE.z + 1.1, 0.3);
  [-9.5, 9.5].forEach((x, i) => label(`VRM_CPU${i}`, x - 6.5, VRM_Z - 2.2, 0.32));
  SMALL_CHIPS.forEach((r, i) => {
    outline(r.x, r.z, r.w + 0.3, r.d + 0.3);
    if (i % 2 === 0) label(`U${100 + i * 7}`, r.x - r.w / 2 - 0.15, r.z + r.d / 2 + 0.45, 0.24);
  });

  // Board identity block (bottom-left)
  g.font = font(0.9, 800);
  g.textAlign = 'left';
  g.fillText('ART-SRV // V&I PLATFORM', X(-18.6), Z(26.4));
  g.font = font(0.38);
  g.fillText('REV 2.6  ·  12L  ·  VALIDATED BY HAND, PROVEN BY LOG', X(-18.6), Z(27.6));
  g.fillText('S/N ____________   W/O ____________   QA ☐', X(-18.6), Z(28.5));
  // Fiducials
  [[-18.8, -28.8], [18.8, -28.8], [-18.8, 28.8], [18.8, 28.8]].forEach(([x, z]) => {
    g.fillStyle = '#b89650';
    g.beginPath();
    g.arc(X(x), Z(z), S(0.25), 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = silk;
    g.beginPath();
    g.arc(X(x), Z(z), S(0.5), 0, Math.PI * 2);
    g.stroke();
  });
  // Mounting holes
  [[-18, -18], [18, -18], [-18, 6], [18, 6], [-18, 24], [10, 28]].forEach(([x, z]) => {
    g.fillStyle = '#9b8048';
    g.beginPath();
    g.arc(X(x), Z(z), S(0.7), 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#000';
    g.beginPath();
    g.arc(X(x), Z(z), S(0.42), 0, Math.PI * 2);
    g.fill();
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export default function Substrate({ maxTexture = 4096 }: { maxTexture?: number }) {
  const tex = useMemo(() => makeBoardTexture(maxTexture), [maxTexture]);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[BOARD_W, BOARD_D]} />
        <meshStandardMaterial map={tex} roughness={0.62} metalness={0.25} />
      </mesh>
      <mesh position-y={-BOARD_T / 2 - 0.001}>
        <boxGeometry args={[BOARD_W, BOARD_T, BOARD_D]} />
        <meshStandardMaterial color="#0b0d0f" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Thin copper edge line */}
      <mesh position-y={-BOARD_T - 0.02}>
        <boxGeometry args={[BOARD_W - 0.1, 0.04, BOARD_D - 0.1]} />
        <meshStandardMaterial color="#5a4422" roughness={0.4} metalness={0.9} />
      </mesh>
    </group>
  );
}
