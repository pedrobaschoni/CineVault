import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Chip.module.css';

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  /** Chip de filtro: alterna ligado/desligado (aria-pressed). */
  selected?: boolean;
}

/** Filtro clicável (tipo, gênero, temporada). */
export function Chip({ children, selected = false, className, type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cx(styles.chip, selected && styles.selected, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Marcador estático, sem ação (gêneros na página do título). */
export function Badge({ children }: { children: ReactNode }) {
  return <span className={cx(styles.chip, styles.static)}>{children}</span>;
}
