import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { posterColor } from '@/lib/media';
import styles from './VaultHero.module.css';

interface VaultHeroProps {
  backdropUrl?: string;
  /** Semente da cor de fundo quando não há imagem. */
  seed: number | string;
  children: ReactNode;
  /**
   * Ponto de onde a íris abre (normalmente o centro do pôster). Também pode
   * vir do CSS da página, pelas variáveis --iris-x e --iris-y no className.
   */
  origin?: { x: string; y: string };
  className?: string;
  /** Altura menor, para usar como destaque dentro de outra página. */
  compact?: boolean;
}

/**
 * A abertura do cofre: o assinatura visual do CineVault.
 * Ao carregar, o fundo se abre em íris a partir do pôster, acompanhado de um
 * aro de latão que se expande, sobre os anéis gravados de um mostrador.
 * Tudo em CSS, uma vez por página; com "reduzir movimento" aparece pronto.
 */
export function VaultHero({ backdropUrl, seed, children, origin, className, compact }: VaultHeroProps) {
  const vars = {
    '--tint': posterColor(seed),
    ...(origin ? { '--iris-x': origin.x, '--iris-y': origin.y } : {}),
  } as CSSProperties;

  return (
    <section className={cx(styles.hero, compact && styles.compact, className)} style={vars}>
      <div className={styles.backdrop} aria-hidden="true">
        {backdropUrl && <Image src={backdropUrl} alt="" fill priority sizes="100vw" className={styles.image} />}
        <div className={styles.scrim} />
      </div>

      <svg className={styles.engraving} aria-hidden="true" focusable="false">
        <g className={styles.rings}>
          {[90, 180, 270, 360, 450].map((r) => (
            <circle key={r} r={r} />
          ))}
          {Array.from({ length: 72 }, (_, i) => (
            <line key={i} x1="0" y1={-450} x2="0" y2={i % 6 === 0 ? -430 : -440} transform={`rotate(${i * 5})`} />
          ))}
        </g>
      </svg>

      <span className={styles.seam} aria-hidden="true" />

      <div className={styles.content}>{children}</div>
    </section>
  );
}
