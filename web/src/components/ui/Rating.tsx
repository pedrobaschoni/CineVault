import { cx } from '@/lib/cx';
import { formatRating } from '@/lib/format';
import styles from './Rating.module.css';

type Fill = 'full' | 'half' | 'empty';

function Seal({ fill, size }: { fill: Fill; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {fill === 'full' && <circle cx="12" cy="12" r="10" className={styles.on} />}
      {fill !== 'full' && <circle cx="12" cy="12" r="9.2" className={styles.ring} />}
      {fill === 'half' && <path d="M12 2a10 10 0 0 0 0 20z" className={styles.on} />}
    </svg>
  );
}

/** Converte uma nota de 0 a 5 em cinco selos (cheio, metade ou vazio). */
export function sealsFor(value: number): Fill[] {
  return Array.from({ length: 5 }, (_, i) => {
    const rest = value - i;
    if (rest >= 1) return 'full';
    if (rest >= 0.5) return 'half';
    return 'empty';
  });
}

interface RatingProps {
  /** Nota de 0 a 5, em passos de 0,5. */
  value: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

/** Exibe uma nota em selos. Para o usuário avaliar, use RatingInput. */
export function Rating({ value, size = 20, showValue = false, className }: RatingProps) {
  return (
    <span className={cx(styles.rating, className)} role="img" aria-label={`Nota ${formatRating(value)} de 5`}>
      <span className={styles.seals}>
        {sealsFor(value).map((fill, i) => (
          <Seal key={i} fill={fill} size={size} />
        ))}
      </span>
      {showValue && <span className={styles.value}>{formatRating(value)}</span>}
    </span>
  );
}

export { Seal };
