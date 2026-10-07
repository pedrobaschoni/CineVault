import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Tag.module.css';

interface TagProps {
  children: ReactNode;
  tone?: 'muted' | 'accent' | 'hot';
  className?: string;
}

/**
 * Etiqueta de catálogo em fonte mono e caixa alta,
 * como "CV-0427 · SÉRIE · 2021". Use · como separador.
 */
export function Tag({ children, tone = 'muted', className }: TagProps) {
  return <span className={cx(styles.tag, styles[tone], className)}>{children}</span>;
}
