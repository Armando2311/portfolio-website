'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { EVIDENCE, TOOLCHAIN } from '@/lib/content';
import { EASE, Reveal, SectionHead } from '../ui/primitives';

const TONE: Record<string, string> = { ok: 'var(--ok)', warn: 'var(--amber)', info: 'var(--cyan)' };

function IsolationStack() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let id = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearInterval(id);
        if (!e.isIntersecting) return;
        let s = -1;
        id = window.setInterval(() => {
          s = s >= EVIDENCE.layers.length + 3 ? -1 : s + 1;
          setStep(s);
        }, 520);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);

  const n = EVIDENCE.layers.length;
  return (
    <div ref={ref} className="panel p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        <span>Fault isolation · top-down</span>
        <span className={step >= n - 1 ? 'text-[var(--amber)]' : ''}>{step >= n - 1 ? 'DUT under test' : step >= 0 ? `Ruling out ${step + 1}/${n - 1}` : 'Idle'}</span>
      </div>
      <ol className="space-y-1.5">
        {EVIDENCE.layers.map((l, i) => {
          const cleared = step > i && i < n - 1;
          const scanning = step === i;
          const dut = i === n - 1 && step >= n - 1;
          return (
            <li
              key={l}
              className={`layer ${cleared ? 'is-cleared' : ''} ${scanning ? 'is-scan' : ''} ${dut ? 'is-dut' : ''}`}
            >
              <span className="font-mono text-[10px] text-white/30">L{n - i}</span>
              <span className="flex-1">{l}</span>
              <span className="font-mono text-[10px] tracking-[0.2em]">
                {cleared ? 'CLEARED' : scanning ? 'CHECK' : dut ? 'SUSPECT' : ''}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-[15px] leading-relaxed text-[var(--mute)]">
        The device under test is the <span className="text-[var(--ink)]">last suspect</span>, not the first. Fixture, environment, script and
        configuration causes get ruled out before a unit is called defective.
      </p>
    </div>
  );
}

export function Evidence() {
  return (
    <section id="evidence" data-section="evidence" className="section">
      <div className="mx-auto max-w-6xl">
        <SectionHead index="05" label="Evidence discipline" title={EVIDENCE.title} sub={EVIDENCE.lede} />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="grid content-start gap-4">
            {EVIDENCE.classes.map((c, i) => (
              <Reveal key={c.k} delay={i * 0.08}>
                <div className="panel relative overflow-hidden p-6">
                  <div className="absolute inset-y-0 left-0 w-[3px]" style={{ background: TONE[c.color], boxShadow: `0 0 18px ${TONE[c.color]}` }} />
                  <div className="mb-2 font-mono text-xs tracking-[0.3em]" style={{ color: TONE[c.color] }}>
                    {c.k}
                  </div>
                  <p className="text-[15px] leading-relaxed text-[var(--ink)]/80">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <IsolationStack />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Toolchain() {
  const all = TOOLCHAIN.flatMap((g) => g.items);
  return (
    <section id="toolchain" data-section="toolchain" className="section">
      <div className="ml-auto max-w-5xl">
        <SectionHead
          index="06"
          label="Toolchain"
          title={
            <>
              The bench, <span className="text-[var(--cyan)]">populated.</span>
            </>
          }
          sub="What I reach for between a unit arriving on the bench and its record being closed."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOOLCHAIN.map((g, gi) => (
            <motion.div
              key={g.group}
              className="panel ic-pkg p-5"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7, delay: (gi % 2) * 0.08, ease: EASE }}
            >
              <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                <span className="text-[var(--ink)]">{g.group}</span>
                <span className="text-white/30">J{String(gi + 1).padStart(2, '0')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((t) => (
                  <span key={t} className="pin">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="marquee mt-16" aria-hidden>
        <div className="marquee-track">
          {[...all, ...all].map((t, i) => (
            <span key={i}>
              {t} <em>◆</em>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
