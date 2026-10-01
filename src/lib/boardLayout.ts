// Deterministic layout of a fictional dual-socket server motherboard.
// Board lies on the XZ plane: x ∈ [-W/2, W/2], z ∈ [-D/2, D/2], top surface at y = 0.

export const BOARD_W = 40;
export const BOARD_D = 60;
export const BOARD_T = 0.32;

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rect = { x: number; z: number; w: number; d: number; label?: string };

// ---- Component placement -------------------------------------------------

export const CPUS = [
  { x: -9.5, z: -9, label: 'CPU0' },
  { x: 9.5, z: -9, label: 'CPU1' },
];
export const SOCKET = 9.2;

/** DIMM slots run along Z, three per side of each socket. */
export const DIMM_LEN = 13;
export const DIMMS: { x: number; z: number; label: string; populated: boolean }[] = (() => {
  const out: { x: number; z: number; label: string; populated: boolean }[] = [];
  const letters = 'ABCDEFGHIJKL';
  let n = 0;
  CPUS.forEach((cpu, c) => {
    [-1, 1].forEach((side) => {
      for (let k = 0; k < 3; k++) {
        const x = cpu.x + side * (5.6 + k * 1.05);
        out.push({
          x,
          z: cpu.z,
          label: `DIMM_${letters[n]}${c}`,
          populated: k !== 2 || side === 1,
        });
        n++;
      }
    });
  });
  return out;
})();

export const VRM_Z = -20.5;
export const PCIE = [9.5, 13, 16.5, 20].map((z, i) => ({ x: -5, z, len: 19, label: `PCIE${i + 1}_X16` }));
export const PCH = { x: 6.5, z: 4, label: 'PCH' };
export const BMC = { x: -13.5, z: 4.5, label: 'BMC' };
export const M2 = { x: 12.5, z: 10.5, len: 7, label: 'M2_1' };
export const SATA = Array.from({ length: 4 }, (_, i) => ({ x: 17.4, z: 15 + i * 1.5, label: `SATA${i}` }));
export const ATX = { x: 17.3, z: 25, label: 'ATX_PWR' };
export const POST_CODE = { x: -16.2, z: 9.5 };
export const REAR_IO = (() => {
  const items: { kind: 'rj45' | 'usb' | 'vga' | 'mgmt'; x: number }[] = [];
  let x = -17;
  (['mgmt', 'rj45', 'rj45', 'usb', 'usb', 'vga'] as const).forEach((k) => {
    items.push({ kind: k, x });
    x += k === 'vga' ? 3.4 : k === 'usb' ? 2.2 : 2.4;
  });
  return items;
})();
export const REAR_IO_Z = -28.2;
export const BATTERY = { x: 12.5, z: 26.2 };
export const NIC_CARD = { slot: 3, x0: -14.2, len: 10.5 };

export const KEEP_OUT: Rect[] = [
  ...CPUS.map((c) => ({ x: c.x, z: c.z, w: SOCKET + 1, d: SOCKET + 1 })),
  ...DIMMS.map((d) => ({ x: d.x, z: d.z, w: 0.8, d: DIMM_LEN + 0.6 })),
  ...PCIE.map((p) => ({ x: p.x, z: p.z, w: p.len + 0.6, d: 1.2 })),
  { x: PCH.x, z: PCH.z, w: 5.4, d: 5.4 },
  { x: BMC.x, z: BMC.z, w: 3.4, d: 3.4 },
  { x: M2.x, z: M2.z, w: M2.len + 1.4, d: 2.2 },
  { x: -9.5, z: VRM_Z, w: 14, d: 3.6 },
  { x: 9.5, z: VRM_Z, w: 14, d: 3.6 },
  { x: -7, z: REAR_IO_Z, w: 26, d: 3.2 },
  { x: 17.4, z: 17.2, w: 2, d: 6.4 },
  { x: ATX.x, z: ATX.z, w: 2.6, d: 7 },
  { x: BATTERY.x, z: BATTERY.z, w: 2.4, d: 2.4 },
  { x: POST_CODE.x, z: POST_CODE.z, w: 1.8, d: 1.2 },
];

function overlaps(a: Rect, list: Rect[], pad = 0.3) {
  return list.some(
    (b) => Math.abs(a.x - b.x) * 2 < a.w + b.w + pad * 2 && Math.abs(a.z - b.z) * 2 < a.d + b.d + pad * 2,
  );
}

/** Small BGA/QFN packages scattered into free space. */
export const SMALL_CHIPS: Rect[] = (() => {
  const rnd = mulberry32(77);
  const out: Rect[] = [];
  const taken = [...KEEP_OUT];
  for (let i = 0; i < 900 && out.length < 34; i++) {
    const s = 0.9 + rnd() * 1.6;
    const r: Rect = {
      x: (rnd() - 0.5) * (BOARD_W - 4),
      z: (rnd() - 0.5) * (BOARD_D - 6),
      w: s * (0.8 + rnd() * 0.5),
      d: s,
    };
    if (!overlaps(r, taken, 0.6)) {
      out.push(r);
      taken.push(r);
    }
  }
  return out;
})();

/** Electrolytic / polymer capacitors, clustered near the VRMs and sockets. */
export const CAPS: { x: number; z: number; r: number; h: number }[] = (() => {
  const rnd = mulberry32(1337);
  const out: { x: number; z: number; r: number; h: number }[] = [];
  CPUS.forEach((c) => {
    for (let i = 0; i < 12; i++) out.push({ x: c.x - 6 + i * 1.1, z: VRM_Z + 2.6, r: 0.36, h: 0.9 });
  });
  const taken: Rect[] = [...KEEP_OUT, ...SMALL_CHIPS];
  for (let i = 0; i < 1200 && out.length < 70; i++) {
    const r = 0.25 + rnd() * 0.2;
    const c = { x: (rnd() - 0.5) * (BOARD_W - 3), z: (rnd() - 0.5) * (BOARD_D - 5), r, h: 0.5 + rnd() * 0.7 };
    const rect = { x: c.x, z: c.z, w: r * 2, d: r * 2 };
    if (!overlaps(rect, taken, 0.15)) {
      out.push(c);
      taken.push(rect);
    }
  }
  return out;
})();

/** Tiny SMD passives (0402/0603-ish) — instanced in the thousands. */
export const PASSIVES: { x: number; z: number; rot: number; tone: number }[] = (() => {
  const rnd = mulberry32(4242);
  const out: { x: number; z: number; rot: number; tone: number }[] = [];
  const taken: Rect[] = [...KEEP_OUT, ...SMALL_CHIPS];
  for (let i = 0; i < 9000 && out.length < 1400; i++) {
    const p = { x: (rnd() - 0.5) * (BOARD_W - 1.5), z: (rnd() - 0.5) * (BOARD_D - 1.5) };
    if (!overlaps({ ...p, w: 0.2, d: 0.2 }, taken, 0.05)) {
      out.push({ ...p, rot: rnd() < 0.5 ? 0 : Math.PI / 2, tone: rnd() });
    }
  }
  return out;
})();

// ---- Trace routing --------------------------------------------------------

export type Trace = {
  pts: [number, number][];
  width: number;
  seed: number;
  pulse: boolean;
};

/** Route a→b as straight / 45° / straight (classic PCB look). */
function route45(ax: number, az: number, bx: number, bz: number, firstAxis: 'x' | 'z', bias: number) {
  const dx = bx - ax;
  const dz = bz - az;
  const diag = Math.min(Math.abs(dx), Math.abs(dz));
  const sx = Math.sign(dx);
  const sz = Math.sign(dz);
  const pts: [number, number][] = [[ax, az]];
  if (firstAxis === 'z') {
    const run = (Math.abs(dz) - diag) * bias;
    const p1: [number, number] = [ax, az + sz * run];
    const p2: [number, number] = [p1[0] + sx * diag, p1[1] + sz * diag];
    pts.push(p1, p2);
  } else {
    const run = (Math.abs(dx) - diag) * bias;
    const p1: [number, number] = [ax + sx * run, az];
    const p2: [number, number] = [p1[0] + sx * diag, p1[1] + sz * diag];
    pts.push(p1, p2);
  }
  pts.push([bx, bz]);
  // Drop zero-length segments.
  return pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-4);
}

/** Offset a polyline sideways by `o` using mitered normals (keeps buses parallel through bends). */
export function offsetPolyline(pts: [number, number][], o: number): [number, number][] {
  return pts.map((p, i) => {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const d0 = norm(p[0] - prev[0], p[1] - prev[1]) ?? norm(next[0] - p[0], next[1] - p[1])!;
    const d1 = norm(next[0] - p[0], next[1] - p[1]) ?? d0;
    const n0: [number, number] = [-d0[1], d0[0]];
    const n1: [number, number] = [-d1[1], d1[0]];
    const m = norm(n0[0] + n1[0], n0[1] + n1[1]) ?? n0;
    const k = 1 / Math.max(0.35, m[0] * n0[0] + m[1] * n0[1]);
    return [p[0] + m[0] * o * k, p[1] + m[1] * o * k];
  });
}

function norm(x: number, z: number): [number, number] | null {
  const l = Math.hypot(x, z);
  return l < 1e-6 ? null : [x / l, z / l];
}

function bus(
  out: Trace[],
  rnd: () => number,
  a: [number, number],
  b: [number, number],
  count: number,
  spacing: number,
  firstAxis: 'x' | 'z',
  pulseRatio = 0.5,
  width = 0.07,
) {
  const center = route45(a[0], a[1], b[0], b[1], firstAxis, 0.3 + rnd() * 0.4);
  for (let i = 0; i < count; i++) {
    const o = (i - (count - 1) / 2) * spacing;
    out.push({ pts: offsetPolyline(center, o), width, seed: rnd(), pulse: rnd() < pulseRatio });
  }
}

export const TRACES: Trace[] = (() => {
  const rnd = mulberry32(2024);
  const out: Trace[] = [];

  // CPU ↔ DIMM fan-outs (memory channels)
  CPUS.forEach((c) => {
    [-1, 1].forEach((side) => {
      for (let lane = 0; lane < 3; lane++) {
        const zEdge = c.z + (lane - 1) * 2.6;
        bus(out, rnd, [c.x + side * 4.7, zEdge], [c.x + side * (5.6 + lane * 1.05) - side * 0.45, c.z + (lane - 1) * 4.2], 4, 0.16, 'x', 0.55, 0.06);
      }
    });
  });

  // UPI link between sockets
  bus(out, rnd, [-4.8, -11], [4.8, -11], 10, 0.2, 'x', 0.9, 0.07);
  bus(out, rnd, [-4.8, -6.5], [4.8, -6.5], 8, 0.2, 'x', 0.9, 0.07);

  // CPU → PCIe slots (long lanes, the money shot)
  PCIE.forEach((p, i) => {
    const cpu = CPUS[i % 2];
    bus(out, rnd, [cpu.x + (i - 1.5) * 1.3, cpu.z + 4.7], [p.x - p.len / 2 + 2 + i * 2.2, p.z - 0.62], 8, 0.17, 'z', 0.7, 0.06);
  });

  // CPU → PCH (DMI), PCH → BMC, PCH → M.2, PCH → SATA
  bus(out, rnd, [CPUS[1].x - 2, CPUS[1].z + 4.7], [PCH.x, PCH.z - 2.4], 6, 0.18, 'z', 0.8);
  bus(out, rnd, [PCH.x - 2.4, PCH.z + 0.6], [BMC.x + 1.6, BMC.z + 0.4], 5, 0.18, 'x', 0.8);
  bus(out, rnd, [PCH.x + 2.4, PCH.z + 1], [M2.x - M2.len / 2 - 0.6, M2.z], 6, 0.17, 'x', 0.8);
  bus(out, rnd, [PCH.x + 1.5, PCH.z + 2.4], [SATA[0].x - 0.9, SATA[1].z], 4, 0.3, 'z', 0.8);

  // BMC → rear management port and → POST code display
  bus(out, rnd, [BMC.x - 0.5, BMC.z - 1.6], [REAR_IO[0].x, REAR_IO_Z + 1.4], 4, 0.18, 'z', 0.9);
  bus(out, rnd, [BMC.x - 1.6, BMC.z + 0.8], [POST_CODE.x, POST_CODE.z - 0.7], 3, 0.18, 'z', 0.9);

  // CPU → rear NICs
  REAR_IO.forEach((io, i) => {
    if (io.kind === 'rj45' || io.kind === 'usb') {
      bus(out, rnd, [CPUS[0].x + (i - 2.5) * 1.2, CPUS[0].z - 4.7], [io.x, REAR_IO_Z + 1.4], 4, 0.16, 'z', 0.6, 0.06);
    }
  });

  // VRM power planes → sockets (fat traces)
  CPUS.forEach((c) => {
    bus(out, rnd, [c.x - 4, VRM_Z + 1.7], [c.x - 3, c.z - 4.7], 3, 0.42, 'z', 0.35, 0.28);
    bus(out, rnd, [c.x + 4, VRM_Z + 1.7], [c.x + 3, c.z - 4.7], 3, 0.42, 'z', 0.35, 0.28);
  });

  // ATX power → VRM rail
  bus(out, rnd, [ATX.x - 1.2, ATX.z - 3.2], [CPUS[1].x + 6.5, VRM_Z + 1.7], 3, 0.45, 'z', 0.4, 0.3);

  // Filler: random-walk traces in the empty areas (keeps the board dense)
  const blocked = [...KEEP_OUT, ...SMALL_CHIPS];
  const dirs: [number, number][] = [
    [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
  ].map(([x, z]) => {
    const l = Math.hypot(x, z);
    return [x / l, z / l];
  });
  for (let t = 0; t < 170; t++) {
    let x = (rnd() - 0.5) * (BOARD_W - 2);
    let z = (rnd() - 0.5) * (BOARD_D - 2);
    if (blocked.some((b) => Math.abs(x - b.x) * 2 < b.w && Math.abs(z - b.z) * 2 < b.d)) continue;
    let di = Math.floor(rnd() * 4) * 2;
    const pts: [number, number][] = [[x, z]];
    const segs = 2 + Math.floor(rnd() * 4);
    for (let s = 0; s < segs; s++) {
      const len = 0.8 + rnd() * 4;
      const nx = x + dirs[di][0] * len;
      const nz = z + dirs[di][1] * len;
      if (Math.abs(nx) > BOARD_W / 2 - 0.6 || Math.abs(nz) > BOARD_D / 2 - 0.6) break;
      if (blocked.some((b) => Math.abs(nx - b.x) * 2 < b.w && Math.abs(nz - b.z) * 2 < b.d)) break;
      x = nx;
      z = nz;
      pts.push([x, z]);
      di = (di + (rnd() < 0.5 ? 1 : 7)) % 8;
    }
    if (pts.length < 2) continue;
    const n = 1 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      out.push({ pts: offsetPolyline(pts, (i - (n - 1) / 2) * 0.17), width: 0.05, seed: rnd(), pulse: rnd() < 0.25 });
    }
  }
  return out;
})();

/** Via positions = trace endpoints (drawn into the board texture). */
export const VIAS: [number, number][] = TRACES.flatMap((t) => [t.pts[0], t.pts[t.pts.length - 1]]);
