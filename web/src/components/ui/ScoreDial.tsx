import { formatRating } from '@/lib/format';
import styles from './ScoreDial.module.css';

interface ScoreDialProps {
  /** Nota da comunidade, de 0 a 10. */
  score: number;
  size?: number;
  label?: string;
}

const R = 44;
const CIRC = 2 * Math.PI * R;

/** Nota da comunidade num mostrador de cofre. */
export function ScoreDial({ score, size = 132, label = 'CineVault Score' }: ScoreDialProps) {
  const clamped = Math.min(Math.max(score, 0), 10);
  const filled = (clamped / 10) * CIRC;

  return (
    <figure className={styles.dial}>
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`${label}: ${formatRating(clamped)} de 10`}>
        <circle cx="60" cy="60" r="54" className={styles.outer} />
        <circle cx="60" cy="60" r={R} className={styles.track} />
        <circle
          cx="60"
          cy="60"
          r={R}
          className={styles.fill}
          strokeDasharray={`${filled} ${CIRC}`}
          transform="rotate(-90 60 60)"
        />
        <path d="M60 2v6M60 112v6M2 60h6M112 60h6M19 19l4 4M97 97l4 4M101 19l-4 4M23 97l-4 4" className={styles.ticks} />
        <text x="60" y="68" textAnchor="middle" className={styles.number}>
          {formatRating(clamped)}
        </text>
      </svg>
      <figcaption className={styles.caption}>{label}</figcaption>
    </figure>
  );
}
