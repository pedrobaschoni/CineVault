import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import { formatRating } from '@/lib/format';
import styles from './ScoreDial.module.css';

interface ScoreDialProps {
  /** Nota de 0 a 10. */
  score: number;
  size?: number;
  label?: string;
  /**
   * Gira o mostrador até a nota ao aparecer, em cliques, como a combinação
   * de um cofre. Só CSS: sem JavaScript a nota final aparece normalmente.
   */
  animated?: boolean;
  /** Atraso da animação, em ms (para sincronizar com a abertura da página). */
  delay?: number;
}

const R = 44;
const CIRC = 2 * Math.PI * R;

/** Nota num mostrador de cofre. */
export function ScoreDial({ score, size = 132, label = 'CineVault Score', animated = false, delay = 0 }: ScoreDialProps) {
  const clamped = Math.min(Math.max(score, 0), 10);
  const vars = {
    '--dash': `${(clamped / 10) * CIRC}px`,
    '--angle': `${(clamped / 10) * 360}deg`,
    '--delay': `${delay}ms`,
  } as CSSProperties;

  return (
    <figure className={cx(styles.dial, animated && styles.animated)} style={vars}>
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`${label}: ${formatRating(clamped)} de 10`}>
        <circle cx="60" cy="60" r="54" className={styles.outer} />
        <path d="M60 2v6M60 112v6M2 60h6M112 60h6M19 19l4 4M97 97l4 4M101 19l-4 4M23 97l-4 4" className={styles.ticks} />
        <circle cx="60" cy="60" r={R} className={styles.track} />
        <circle cx="60" cy="60" r={R} className={styles.fill} transform="rotate(-90 60 60)" />
        <g className={styles.notch}>
          <path d="M60 3.5l3.2 5.4h-6.4z" />
        </g>
        <text x="60" y="68" textAnchor="middle" className={styles.number}>
          {formatRating(clamped)}
        </text>
      </svg>
      <figcaption className={styles.caption}>{label}</figcaption>
    </figure>
  );
}
