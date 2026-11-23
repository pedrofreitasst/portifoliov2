'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forcedColors = window.matchMedia('(forced-colors: active)');
    if (!finePointer.matches || reducedMotion.matches || forcedColors.matches) return;

    const label = cursor.querySelector('span');
    const root = document.documentElement;
    let lastMode = '';
    let lastLabel = '';
    let lastArrow = '';

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      cursor.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursor.style.setProperty('--cursor-y', `${event.clientY}px`);
      cursor.dataset.visible = 'true';
      root.classList.add('custom-cursor-enabled');

      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>('a, button, [role="button"], summary, input, textarea, select, [contenteditable="true"]')
        : null;

      if (!target) {
        const textTarget = event.target instanceof Element
          ? event.target.closest('p, h1, h2, h3, h4, li, dt, dd, blockquote, figcaption, label, [data-cursor-text]')
          : null;
        lastMode = textTarget ? 'text' : 'default';
        lastLabel = '';
        cursor.dataset.mode = lastMode;
        cursor.style.setProperty('--cursor-width', textTarget ? '8px' : '20px');
        if (label) label.textContent = '';
        return;
      }

      if (target.matches('input, textarea, select, [contenteditable="true"]')) {
        cursor.dataset.visible = 'false';
        return;
      }

      const nextLabel = target.dataset.cursorLabel ?? '';
      const nextArrow = target.dataset.cursorArrow ?? '→';
      const nextMode = nextLabel ? 'link' : 'interactive';
      cursor.dataset.mode = nextMode;

      if (nextMode !== lastMode || nextLabel !== lastLabel || nextArrow !== lastArrow) {
        lastMode = nextMode;
        lastLabel = nextLabel;
        lastArrow = nextArrow;
        if (label) label.textContent = nextLabel ? `${nextLabel} ${nextArrow}` : '';
        const measuredWidth = label && nextLabel ? Math.min(label.scrollWidth + 36, 208) : 28;
        cursor.style.setProperty('--cursor-width', `${measuredWidth}px`);
      }
    };

    const leave = () => {
      cursor.dataset.visible = 'false';
      cursor.removeAttribute('data-pressed');
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      root.classList.remove('custom-cursor-enabled');
      leave();
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') cursor.dataset.pressed = 'true';
    };
    const up = () => cursor.removeAttribute('data-pressed');

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('keydown', keydown);
      root.classList.remove('custom-cursor-enabled');
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span /></div>;
}
