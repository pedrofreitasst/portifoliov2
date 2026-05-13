'use client';

import { useEffect, useRef, useState } from 'react';

interface SkillBarProps {
  name: string;

  level: number;
  delay?: number;
}

export default function SkillBar({ name, level, delay = 0 }: SkillBarProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="group">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm tracking-wide text-cream">{name}</span>
      </div>
      <div className="h-px overflow-hidden bg-ink-200">
        <div
          className="h-full bg-gradient-to-r from-cream/40 via-cream/70 to-ember transition-[width] duration-1000 ease-out"
          style={{
            width: visible ? `${level}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
