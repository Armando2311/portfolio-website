'use client';

import { motion } from 'framer-motion';
import { LAB } from '@/lib/content';
import { EASE, Reveal, SectionHead, TiltCard } from '../ui/primitives';

export function Lab() {
  return (
    <section id="lab" data-section="lab" className="section">
      <SectionHead
        index="07"
        label="Lab & direction"
        title={
          <>
            {LAB.title[0]} <span className="text-[var(--cyan)]">{LAB.title[1]}</span>
          </>
        }
        sub={LAB.lede}
      />

      <div className="mb-10 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
        {['Systems / infrastructure', 'Infrastructure automation', 'Software + data pipelines', 'AI infrastructure / engineering'].map((s, i) => (
          <motion.span
            key={s}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: EASE }}
          >
            <span className={`border px-3 py-2 ${i === 0 ? 'border-[var(--cyan)]/50 text-[var(--ink)]' : 'border-white/15 text-white/55'}`}>{s}</span>
            {i < 3 && <span className="text-[var(--cyan)]">→</span>}
          </motion.span>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3" style={{ perspective: 1200 }}>
        {LAB.projects.map((p, i) => (
          <Reveal key={p.k} delay={i * 0.08}>
            <TiltCard className="panel flex h-full flex-col p-6 sm:p-7">
              <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                <span className="text-[var(--cyan)]">{p.k}</span>
                <span className="text-white/40">{p.status}</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight sm:text-2xl">{p.title}</h3>
              <p className="text-[15px] leading-relaxed text-[var(--mute)]">{p.body}</p>
              <p className="mt-4 text-[14px] leading-relaxed text-[var(--ink)]/80">{p.goal}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-6">
        <div className="panel term max-w-xl">
          <div className="term-bar">
            <span />
            <span />
            <span />
            <em>one result schema per unit</em>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-6 text-[var(--ink)]/85">{LAB.schema}</pre>
        </div>
      </Reveal>
    </section>
  );
}
