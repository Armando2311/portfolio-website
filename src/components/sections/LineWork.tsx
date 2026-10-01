'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { LINE, WORK } from '@/lib/content';
import { EASE, Reveal, SectionHead, TiltCard } from '../ui/primitives';

export function Line() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="line" data-section="line" className="section">
      <div className="max-w-3xl">
        <SectionHead
          index="03"
          label="The line"
          title={
            <>
              Incoming parts in.
              <br />
              <span className="text-[var(--cyan)]">Traceable units out.</span>
            </>
          }
          sub="Every stage has an objective result and a piece of evidence that stays with the serial number. If it isn’t recorded, it didn’t pass."
        />
        <div ref={ref} className="relative pl-10 sm:pl-14">
          <div className="absolute bottom-3 left-[15px] top-3 w-px bg-white/10 sm:left-[23px]" />
          <motion.div
            className="absolute bottom-3 left-[15px] top-3 w-px origin-top bg-[var(--cyan)] shadow-[0_0_14px_var(--cyan)] sm:left-[23px]"
            style={{ scaleY: grow }}
          />
          <ol className="space-y-3">
            {LINE.map((s, i) => (
              <motion.li
                key={s.n}
                className="panel group relative grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:p-6"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
              >
                <span className="node absolute -left-[33px] top-6 sm:-left-[39px]" aria-hidden />
                <div>
                  <div className="mb-1 flex items-baseline gap-3">
                    <span className="font-mono text-xs text-[var(--cyan)]">{s.n}</span>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{s.title}</h3>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[var(--mute)]">{s.body}</p>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:text-right">
                  Evidence
                  <div className="mt-1 text-[11px] normal-case tracking-normal text-[var(--amber)]">{s.evidence}</div>
                </div>
                {i === LINE.length - 1 && (
                  <span className="absolute right-4 top-4 rounded-sm border border-[var(--ok)]/40 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-[var(--ok)] sm:static sm:hidden">
                    SHIP
                  </span>
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function WorkCard({ w, i }: { w: (typeof WORK)[number]; i: number }) {
  return (
    <TiltCard className="panel work-card flex h-full flex-col p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        <span>{w.kicker}</span>
        <span>
          {String(i + 1).padStart(2, '0')} / {String(WORK.length).padStart(2, '0')}
        </span>
      </div>
      <div className="mb-5 flex items-end gap-3">
        {w.stat.from && (
          <>
            <span className="stat text-white/30">{w.stat.from}</span>
            <span className="mb-3 font-mono text-[var(--cyan)]">→</span>
          </>
        )}
        <span className="stat">{w.stat.to}</span>
      </div>
      <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)]">{w.stat.unit}</div>
      <h3 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">{w.title}</h3>
      <p className="text-[15px] leading-relaxed text-[var(--mute)]">{w.body}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-8">
        {w.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
    </TiltCard>
  );
}

export function Work() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [wide, setWide] = useState(false);
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  useEffect(() => {
    const measure = () => {
      const isWide = window.innerWidth >= 1024;
      setWide(isWide);
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 64));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const head = (
    <SectionHead
      compact={wide}
      index="04"
      label="Selected work"
      title={
        <>
          Measured in <span className="text-[var(--amber)]">units shipped</span>,
          <br />
          not slides shown.
        </>
      }
    />
  );

  if (!wide) {
    return (
      <section id="work" data-section="work" className="section">
        {head}
        <div className="grid gap-4 sm:grid-cols-2" style={{ perspective: 1200 }}>
          {WORK.map((w, i) => (
            <Reveal key={w.id} delay={(i % 2) * 0.08}>
              <WorkCard w={w} i={i} />
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="work" data-section="work" ref={outer} className="relative" style={{ height: `${100 + WORK.length * 55}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16">
        <div className="px-16">{head}</div>
        <motion.div ref={track} className="flex gap-6 px-16" style={{ x, perspective: 1400 }}>
          {WORK.map((w, i) => (
            <div key={w.id} className="w-[30rem] shrink-0 xl:w-[34rem]">
              <WorkCard w={w} i={i} />
            </div>
          ))}
        </motion.div>
        <div className="mx-16 mt-10 h-px bg-white/10">
          <motion.div className="h-full origin-left bg-[var(--amber)] shadow-[0_0_10px_var(--amber)]" style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  );
}
