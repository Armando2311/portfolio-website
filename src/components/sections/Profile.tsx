'use client';

import { motion } from 'framer-motion';
import { CAPABILITIES, PROFILE } from '@/lib/content';
import { EASE, Reveal, SectionHead, TiltCard } from '../ui/primitives';

export function Profile() {
  return (
    <section id="profile" data-section="profile" className="section">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div className="panel p-6 sm:p-10">
          <SectionHead
            index="01"
            label="System profile"
            title={
              <>
                {PROFILE.title[0]}
                <br />
                <span className="text-[var(--cyan)]">{PROFILE.title[1]}</span>
              </>
            }
          />
          <div className="space-y-5 text-base leading-relaxed text-[var(--ink)]/80 sm:text-lg">
            {PROFILE.body.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="self-end">
          <div className="panel term">
            <div className="term-bar">
              <span />
              <span />
              <span />
              <em>root@line:~# dmidecode -t operator</em>
            </div>
            <div className="p-5 font-mono text-[12px] leading-7 sm:p-6 sm:text-[13px]">
              <div className="text-white/40">Handle 0x0001, DMI type 1, 27 bytes</div>
              <div className="mb-2 text-[var(--ink)]">Operator Information</div>
              {PROFILE.spec.map(([k, v], i) => (
                <motion.div
                  key={k}
                  className="grid grid-cols-[9.5rem_1fr] gap-2 pl-4 sm:grid-cols-[11rem_1fr]"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: EASE }}
                >
                  <span className="text-white/45">{k}:</span>
                  <span className={v === 'ACTIVE' ? 'text-[var(--ok)]' : 'text-[var(--ink)]'}>{v}</span>
                </motion.div>
              ))}
              <div className="mt-2 text-white/40">
                root@line:~# <span className="caret" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Capabilities() {
  return (
    <section id="capabilities" data-section="capabilities" className="section">
      <SectionHead
        index="02"
        label="Capabilities"
        title={
          <>
            Six disciplines,
            <br />
            one standard: <span className="text-[var(--amber)]">repeatable.</span>
          </>
        }
        sub="Different kinds of work on the same production line — each held to the same rule: two qualified people, following the same method, get the same result."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1200 }}>
        {CAPABILITIES.map((c, i) => (
          <Reveal key={c.k} delay={(i % 3) * 0.08}>
            <TiltCard className="panel h-full p-6 sm:p-7">
              <div className="mb-8 flex items-start justify-between">
                <span className="ic">{c.k}</span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-white/30">U{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight sm:text-2xl">{c.title}</h3>
              <p className="text-[15px] leading-relaxed text-[var(--mute)]">{c.body}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
