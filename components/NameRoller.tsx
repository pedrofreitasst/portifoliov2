'use client';

/**
 * Dual-layer vertical roller (2000ms). Baseline-aligned with surrounding H1 text.
 * Figma Y units → % of the viewport line box.
 */
export default function NameRoller() {
  return (
    <span className="name-roller" aria-label="Pedro">
      <span className="name-roller__viewport" aria-hidden="true">
        <span className="name-roller__track name-roller__track--pedro">Pedro</span>
        <span className="name-roller__track name-roller__track--sani">Sani</span>
      </span>
    </span>
  );
}
