'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { PERSON } from '@/lib/content';
import { Reveal, SectionHead } from '../ui/primitives';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErr('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (ex) {
      setStatus('error');
      setErr(ex instanceof Error ? ex.message : 'Unknown error');
    }
  };

  const field = (k: keyof typeof form, label: string, type = 'text') => (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{label}</span>
      {k === 'message' ? (
        <textarea
          required
          rows={5}
          maxLength={5000}
          value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className="field resize-none"
          placeholder="Program, platform, batch size — what needs validating?"
        />
      ) : (
        <input
          required
          type={type}
          maxLength={200}
          value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className="field"
          autoComplete={k === 'email' ? 'email' : 'name'}
        />
      )}
    </label>
  );

  return (
    <section id="contact" data-section="contact" className="section">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <SectionHead
            index="08"
            label="Open a ticket"
            title={
              <>
                Hardware that has to
                <br />
                <span className="text-[var(--cyan)]">work every time?</span>
              </>
            }
            sub="Systems integration, infrastructure, test & automation, or technical operations roles — or a failure nobody has pinned down yet."
          />
          <Reveal delay={0.1}>
            <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 font-mono text-sm">
              {[
                ['Email', PERSON.email, `mailto:${PERSON.email}`],
                ['Phone', PERSON.phone, `tel:${PERSON.phone.replace(/[^\d+]/g, '')}`],
                ['Location', PERSON.location, ''],
                ...(PERSON.resume ? [['Résumé', 'Download PDF', PERSON.resume]] : []),
              ].map(([k, v, href]) => (
                <div key={k} className="flex items-center justify-between gap-4 bg-black/70 px-5 py-4 backdrop-blur">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">{k}</span>
                  {href ? (
                    <a className="link-u text-right text-[var(--ink)]" href={href} {...(k === 'Résumé' ? { download: true } : {})}>
                      {v}
                    </a>
                  ) : (
                    <span className="text-[var(--ink)]">{v}</span>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <form onSubmit={submit} className="panel term">
            <div className="term-bar">
              <span />
              <span />
              <span />
              <em>new-ticket --to armando</em>
            </div>
            <div className="space-y-5 p-6 sm:p-8">
              {field('name', 'Name')}
              {field('email', 'Email', 'email')}
              {field('message', 'Message')}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Transmitting…' : 'Transmit'} <span aria-hidden>→</span>
                </button>
                <AnimatePresence mode="wait">
                  {status === 'sent' && (
                    <motion.span key="ok" className="font-mono text-xs text-[var(--ok)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      [ OK ] Message delivered.
                    </motion.span>
                  )}
                  {status === 'error' && (
                    <motion.span key="err" className="font-mono text-xs text-[#ff6b5a]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      [ FAIL ] {err}. Email me directly instead.
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </Reveal>
      </div>

      <footer className="mt-28 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 sm:flex-row">
        <span>© {new Date().getFullYear()} {PERSON.name}</span>
        <span>Built with Next.js · React Three Fiber · a lot of serial numbers</span>
        <span className="text-[var(--ok)]">● All checks passed</span>
      </footer>
    </section>
  );
}
