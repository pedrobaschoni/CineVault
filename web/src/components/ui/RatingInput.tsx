'use client';

import { useId, useState } from 'react';
import { formatRating } from '@/lib/format';
import { ratingWord } from '@/services/user';
import { Seal, sealsFor } from './Rating';
import styles from './Rating.module.css';

interface RatingInputProps {
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  size?: number;
  /** Mostra a palavra da nota ("Muito bom") ao lado do número. */
  showWord?: boolean;
  /** Mostra o botão para tirar a nota. */
  clearable?: boolean;
}

/**
 * Campo para o usuário dar nota de 0,5 a 5.
 * Por baixo é um <input type="range">: funciona com mouse, toque e teclado
 * (setas mudam de 0,5 em 0,5), e leitores de tela anunciam o valor.
 * O selo escolhido "carimba" ao ser marcado.
 */
export function RatingInput({ value, onChange, label = 'Sua nota', size = 26, showWord = false, clearable = false }: RatingInputProps) {
  const id = useId();
  const [internal, setInternal] = useState(value ?? 0);
  const [hover, setHover] = useState<number | null>(null);
  const current = value ?? internal;
  const shown = hover ?? current;
  const stampIndex = current ? Math.ceil(current) - 1 : -1;

  function commit(next: number) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function valueFromPointer(e: React.PointerEvent<HTMLInputElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    return Math.max(0.5, Math.ceil(ratio * 10) / 2);
  }

  return (
    <div className={styles.input}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <span className={styles.field}>
        <span className={styles.seals} aria-hidden="true">
          {sealsFor(shown).map((fill, i) => (
            <span key={i === stampIndex && hover === null ? `stamp-${current}` : i} className={i === stampIndex && hover === null ? styles.stamp : styles.sealWrap}>
              <Seal fill={fill} size={size} />
            </span>
          ))}
        </span>
        <input
          id={id}
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={current || 0.5}
          aria-valuetext={current ? `${formatRating(current)} de 5, ${ratingWord(current)}` : 'Sem nota'}
          onChange={(e) => commit(Number(e.target.value))}
          onPointerMove={(e) => setHover(valueFromPointer(e))}
          onPointerLeave={() => setHover(null)}
          onPointerDown={(e) => commit(valueFromPointer(e))}
          className={styles.range}
        />
      </span>
      <span className={styles.value}>{shown ? formatRating(shown) : '—'}</span>
      {showWord && <span className={styles.word}>{ratingWord(shown)}</span>}
      {clearable && current > 0 && (
        <button type="button" className={styles.clear} onClick={() => commit(0)}>
          Tirar nota
        </button>
      )}
    </div>
  );
}
