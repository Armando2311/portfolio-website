'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { SECTIONS, PERSON } from '@/lib/content';
import { scrollStore, subscribe } from '@/lib/scrollStore';
import { scrollToId } from './SmoothScroll';

const useActive = () =>
  useSyncExternalStore(
    subscribe,
    () => scrollStore.active,
    () => 0,
  );

function Fps() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      frames++;
      if (t - last > 500) {
        if (ref.current) ref.current.textContent = String(Math.round((frames * 1000) / (t - last))).padStart(3, '0');
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={ref}>060</span>;
}

function Progress() {
  const bar = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = scrollStore.progress;
      if (bar.current) bar.current.style.transform = `scaleY(${p})`;
      if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <>
      <div className="relative h-40 w-px bg-white/10">
        <div ref={bar} className="absolute inset-0 origin-top bg-[var(--cyan)] shadow-[0_0_10px_var(--cyan)]" />
      </div>
      <span ref={pct} className="mt-3 block">000</span>
    </>
  );
}

export default function Hud() {
  const active = useActive();
  const [open, setOpen] = useState(false);
  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
        <button onClick={() => go('hero')} className="group flex items-center gap-3 text-left" aria-label="Back to top">
          <span className="chip-logo">ART</span>
          <span className="hidden font-mono text-[11px] uppercase leading-4 tracking-[0.2em] text-[var(--mute)] sm:block">
            {PERSON.name}
            <br />
            <span className="text-white/35">validation · integration</span>
          </span>
        </button>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
          {SECTIONS.slice(1).map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`nav-link ${active === i + 1 ? 'is-active' : ''}`}
              aria-current={active === i + 1 ? 'true' : undefined}
            >
              <span className="text-white/30">{String(i + 1).padStart(2, '0')}</span> {s.label}
            </button>
          ))}
        </nav>
        <button className="nav-link lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav">
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-black/90 px-8 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {SECTIONS.slice(1).map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => go(s.id)}
                className="flex items-baseline gap-4 text-left text-4xl font-semibold tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <span className="font-mono text-sm text-[var(--cyan)]">{String(i + 1).padStart(2, '0')}</span>
                {s.label}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Left rail: section readout + progress */}
      <div className="pointer-events-none fixed bottom-8 left-8 z-30 hidden flex-col items-start font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 md:flex">
        <Progress />
      </div>
      <div className="pointer-events-none fixed bottom-8 left-20 z-30 hidden font-mono text-[10px] uppercase tracking-[0.25em] md:block">
        <div className="text-white/35">POST</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="text-[var(--ink)]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <span className="text-[var(--amber)]">{SECTIONS[active]?.code}</span> · {SECTIONS[active]?.label}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right rail: render stats (real, measured in the browser) */}
      <div className="pointer-events-none fixed bottom-8 right-8 z-30 hidden text-right font-mono text-[10px] uppercase leading-5 tracking-[0.25em] text-white/35 md:block">
        <div>
          FPS <span className="text-[var(--ink)]"><Fps /></span>
        </div>
        <div className={`transition-opacity duration-500 ${active === 0 ? 'opacity-100' : 'opacity-0'}`}>Scroll to drive the camera</div>
      </div>

      {/* Frame corners */}
      <div className="hud-frame pointer-events-none fixed inset-3 z-20 hidden sm:block" aria-hidden />
    </>
  );
}
