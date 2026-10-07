import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  /** Quantos itens foram concluídos. */
  value: number;
  max: number;
  /** Texto para leitores de tela, ex.: "Episódios vistos". */
  label: string;
  thick?: boolean;
}

export function ProgressBar({ value, max, label, thick }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      className={thick ? `${styles.bar} ${styles.thick}` : styles.bar}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} de ${max}`}
    >
      <span className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
