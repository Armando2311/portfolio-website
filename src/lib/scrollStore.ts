// Shared, non-React mutable state read every frame by the 3D scene.
// React components subscribe only to coarse changes (active section, boot).

export type Anchor = { id: string; t: number };

type Listener = () => void;

export const scrollStore = {
  progress: 0, // 0..1 over the whole document
  velocity: 0, // px/frame-ish, signed
  anchors: [] as Anchor[],
  active: 0,
  booted: false,
  pointer: { x: 0, y: 0 },
  reducedMotion: false,
};

const listeners = new Set<Listener>();

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function emit() {
  listeners.forEach((fn) => fn());
}

export function setActive(i: number) {
  if (i !== scrollStore.active) {
    scrollStore.active = i;
    emit();
  }
}

export function setBooted() {
  if (!scrollStore.booted) {
    scrollStore.booted = true;
    emit();
  }
}

/** Measure every [data-section] element and convert its top to a 0..1 scroll time. */
export function measureAnchors() {
  if (typeof window === 'undefined') return;
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scrollStore.anchors = els.map((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    return { id: el.dataset.section as string, t: Math.min(1, Math.max(0, top / max)) };
  });
}

export function updateFromScroll(scrollY: number, velocity: number) {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scrollStore.progress = Math.min(1, Math.max(0, scrollY / max));
  scrollStore.velocity = velocity;
  // Active section: the last anchor whose top has crossed 45% of the viewport.
  const probe = scrollY + window.innerHeight * 0.45;
  const els = document.querySelectorAll<HTMLElement>('[data-section]');
  let idx = 0;
  els.forEach((el, i) => {
    const top = el.getBoundingClientRect().top + scrollY;
    if (top <= probe) idx = i;
  });
  setActive(idx);
}
