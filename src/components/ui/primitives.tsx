'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { scrollStore, subscribe } from '@/lib/scrollStore';

export const EASE = [0.16, 1, 0.3, 1] as const;

export const useBooted = () =>
  useSyncExternalStore(
    subscribe,
    () => scrollStore.booted,
    () => false,
  );

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const GLYPHS = 'ABCDEF0123456789#%&/<>=+*';

/** Text that resolves from random hex glyphs, left to right. */
export function Decode({ text, start = true, speed = 28, className }: { text: string; start?: boolean; speed?: number; className?: string }) {
  const [out, setOut] = useState(text.replace(/\S/g, ' '));
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!start || !visible) return;
    if (scrollStore.reducedMotion) {
      setOut(text);
      return;
    }
    let frame = 0;
    const total = text.length + 8;
    const id = window.setInterval(() => {
      frame++;
      setOut(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < frame - 6) return ch;
            if (i < frame) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            return ' ';
          })
          .join(''),
      );
      if (frame > total) {
        window.clearInterval(id);
        setOut(text);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [start, visible, text, speed]);
  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

export function SectionHead({
  index,
  label,
  title,
  sub,
  compact = false,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  sub?: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'mb-8' : 'mb-10 sm:mb-14'}>
      <Reveal>
        <div className="eyebrow mb-5">
          <span className="text-[var(--cyan)]">{index}</span>
          <span className="mx-3 inline-block h-px w-10 bg-white/25 align-middle" />
          <Decode text={label.toUpperCase()} />
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="display-2" style={compact ? { fontSize: 'clamp(2rem, 3.8vw, 3.4rem)' } : undefined}>
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--mute)] sm:text-lg">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Card that tilts toward the pointer and tracks a glare highlight. */
export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 160, damping: 18 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  return (
    <motion.div
      ref={ref}
      className={`tilt ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, ['--gx' as string]: gx, ['--gy' as string]: gy }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}
