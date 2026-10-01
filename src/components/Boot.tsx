'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { setBooted } from '@/lib/scrollStore';

const LINES: [string, string][] = [
  ['ART-SRV // V&I PLATFORM  REV 2.6', ''],
  ['Power rails', 'OK'],
  ['CPU0 / CPU1', 'OK'],
  ['Memory training', 'OK'],
  ['PCIe enumeration', 'OK'],
  ['BMC heartbeat', 'OK'],
  ['Baseline compare', 'MATCH'],
  ['Evidence log', 'OPEN'],
];

export default function Boot() {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let quick = false;
    try {
      quick = sessionStorage.getItem('art-booted') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      quick = false;
    }
    const step = quick ? 30 : 190;
    const timers: number[] = [];
    LINES.forEach((_, i) => timers.push(window.setTimeout(() => setShown(i + 1), 250 + i * step)));
    timers.push(window.setTimeout(() => finish(), 250 + LINES.length * step + (quick ? 100 : 450)));
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    function finish() {
      setDone(true);
      setBooted();
      try {
        sessionStorage.setItem('art-booted', '1');
      } catch {
        /* storage unavailable — boot runs in full next time */
      }
    }
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-6"
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
        >
          <div className="w-full max-w-md font-mono text-[12px] leading-6 tracking-wide text-[var(--mute)] sm:text-[13px]">
            {LINES.slice(0, shown).map(([k, v], i) => (
              <div key={k} className={`flex justify-between gap-4 ${i === 0 ? 'mb-3 text-[var(--ink)]' : ''}`}>
                <span>{i === 0 ? k : `› ${k}`}</span>
                {v && <span className={v === 'OK' || v === 'MATCH' ? 'text-[var(--ok)]' : 'text-[var(--cyan)]'}>[ {v} ]</span>}
              </div>
            ))}
            <div className="mt-6 h-px w-full overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-[var(--cyan)] shadow-[0_0_12px_var(--cyan)]"
                initial={{ width: '0%' }}
                animate={{ width: `${(shown / LINES.length) * 100}%` }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
              />
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-white/30">Click or press any key to skip</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
