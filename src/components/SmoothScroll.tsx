'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { measureAnchors, scrollStore, subscribe, updateFromScroll } from '@/lib/scrollStore';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: scrollStore.reducedMotion ? 'auto' : 'smooth' });
}

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollStore.reducedMotion = reduced;

    const measure = () => {
      measureAnchors();
      updateFromScroll(window.scrollY, 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('load', measure);

    const onPointer = (e: PointerEvent) => {
      scrollStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let lenis: Lenis | null = null;
    let raf = 0;
    let unsub = () => {};
    let lastY = window.scrollY;
    const onNative = () => {
      const y = window.scrollY;
      updateFromScroll(y, y - lastY);
      lastY = y;
    };

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on('scroll', (l: Lenis) => updateFromScroll(l.scroll, l.velocity));
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      if (!scrollStore.booted) lenis.stop();
      unsub = subscribe(() => {
        if (scrollStore.booted) lenis?.start();
      });
    } else {
      window.addEventListener('scroll', onNative, { passive: true });
    }

    return () => {
      ro.disconnect();
      window.removeEventListener('load', measure);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onNative);
      cancelAnimationFrame(raf);
      unsub();
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}
