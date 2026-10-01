'use client';

import { motion } from 'framer-motion';
import { HERO, PERSON } from '@/lib/content';
import { Decode, EASE, useBooted } from '../ui/primitives';
import { scrollToId } from '../SmoothScroll';

export default function Hero() {
  const booted = useBooted();
  const show = (d: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: booted ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.1, delay: 0.9 + d, ease: EASE },
  });

  return (
    <section id="hero" data-section="hero" className="relative flex min-h-[100svh] flex-col justify-end px-4 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-16">
      <motion.div {...show(0)} className="eyebrow mb-6 flex items-center gap-3">
        <span className="status-dot" /> {HERO.eyebrow}
      </motion.div>

      <h1 className="display-1 select-none">
        <span className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '105%' }}
            animate={booted ? { y: '0%' } : {}}
            transition={{ duration: 1.3, delay: 0.55, ease: EASE }}
          >
            <Decode text={PERSON.first} start={booted} speed={45} />
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span
            className="text-outline block"
            initial={{ y: '105%' }}
            animate={booted ? { y: '0%' } : {}}
            transition={{ duration: 1.3, delay: 0.7, ease: EASE }}
          >
            {PERSON.last}
          </motion.span>
        </span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <motion.p {...show(0.15)} className="max-w-2xl text-base leading-relaxed text-[var(--ink)]/80 sm:text-xl">
          {HERO.lede}
        </motion.p>
        <motion.div {...show(0.3)} className="flex flex-wrap gap-3">
          <button className="btn btn-primary" onClick={() => scrollToId('work')}>
            See the work <span aria-hidden>↓</span>
          </button>
          <a className="btn" href={PERSON.resume} download>
            Résumé <span className="font-mono text-[10px] text-white/40">PDF</span>
          </a>
        </motion.div>
      </div>

      <motion.dl {...show(0.45)} className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 font-mono text-[11px] uppercase tracking-[0.18em] sm:grid-cols-4">
        {[
          ['Role', PERSON.role],
          ['Employer', PERSON.employer],
          ['Based', PERSON.location],
          ['Track', 'RHCSA · in prep'],
        ].map(([k, v]) => (
          <div key={k} className="bg-black/70 px-4 py-3 backdrop-blur">
            <dt className="text-white/35">{k}</dt>
            <dd className="mt-1 text-[var(--ink)]">{v}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
