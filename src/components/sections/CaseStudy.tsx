'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CaseStudy as CS } from '@/lib/content';
import { EASE } from '../ui/primitives';

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 py-6">
      <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--cyan)]">{label}</h4>
      {children}
    </section>
  );
}

export default function CaseStudy({ cs, onClose }: { cs: CS | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!cs) return;
    const prev = document.activeElement as HTMLElement | null;
    window.__lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      window.__lenis?.start();
      prev?.focus();
    };
  }, [cs, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {cs && (
        <motion.div
          key={cs.id}
          className="fixed inset-0 z-[80] flex justify-end bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby={`cs-${cs.id}`}
            data-lenis-prevent
            className="panel h-full w-full max-w-2xl overflow-y-auto overscroll-contain px-6 pb-16 pt-6 sm:px-10"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-6 mb-6 flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4 backdrop-blur sm:-mx-10 sm:px-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Case study · {cs.kicker}</span>
              <button ref={closeRef} onClick={onClose} className="nav-link" aria-label="Close case study">
                Close ✕
              </button>
            </div>

            <h3 id={`cs-${cs.id}`} className="display-2" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)' }}>
              {cs.title}
            </h3>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)]">{cs.theme}</p>

            <Block label="Problem">
              <p className="text-[16px] leading-relaxed text-[var(--ink)]/85">{cs.problem}</p>
            </Block>

            <Block label="Constraints">
              <div className="flex flex-wrap gap-2">
                {cs.constraints.map((c) => (
                  <span key={c} className="tag">
                    {c}
                  </span>
                ))}
              </div>
            </Block>

            <Block label="What I did">
              <ol className="space-y-3">
                {cs.did.map((d, i) => (
                  <li key={i} className="grid grid-cols-[2rem_1fr] text-[15px] leading-relaxed text-[var(--ink)]/80">
                    <span className="font-mono text-xs text-[var(--cyan)]">{String(i + 1).padStart(2, '0')}</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ol>
            </Block>

            {cs.commands && (
              <Block label="Representative commands · sanitized">
                <pre className="overflow-x-auto border border-white/10 bg-black/60 p-4 font-mono text-[12px] leading-6 text-[var(--ink)]/85">
                  {cs.commands.map((c) => `$ ${c}`).join('\n')}
                </pre>
              </Block>
            )}

            <Block label="Outcome">
              <p className="text-[16px] leading-relaxed text-[var(--ink)]/85">{cs.outcome}</p>
              {cs.credit && (
                <p className="mt-4 border-l-2 border-[var(--amber)] pl-4 text-[14px] leading-relaxed text-[var(--mute)]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--amber)]">Credit · </span>
                  {cs.credit}
                </p>
              )}
            </Block>

            <Block label="Takeaway">
              <p className="text-xl font-semibold leading-snug tracking-tight">{cs.takeaway}</p>
            </Block>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
