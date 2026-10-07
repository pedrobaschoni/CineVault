import Image from 'next/image';
import { cx } from '@/lib/cx';
import styles from './Poster.module.css';

interface PosterProps {
  title: string;
  /** URL do pôster (TMDB). Sem ela, mostra um bloco de cor com o título. */
  src?: string;
  /** Linha de catálogo no topo do bloco provisório, ex.: "Série · 2021". */
  meta?: string;
  /** Cor do bloco provisório. */
  color?: string;
  /** Largura em CSS (o pôster sempre mantém a proporção 2:3). */
  width?: string;
  /** Tamanhos para o next/image; ajuste conforme o layout que usa o pôster. */
  sizes?: string;
  priority?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Pôster na proporção 2:3. O tamanho vem só do próprio componente
 * (width + aspect-ratio), então ele não depende do CSS da página
 * em que está, que era a causa do pôster desalinhado no site antigo.
 */
export function Poster({
  title,
  src,
  meta,
  color = 'var(--cv-chumbo)',
  width,
  sizes = '(max-width: 768px) 40vw, 200px',
  priority,
  size = 'md',
  className,
}: PosterProps) {
  return (
    <div className={cx(styles.poster, styles[size], className)} style={{ width, background: src ? undefined : color }}>
      {src ? (
        <Image src={src} alt={`Pôster de ${title}`} fill sizes={sizes} priority={priority} className={styles.img} />
      ) : (
        <div className={styles.placeholder} aria-label={`Pôster de ${title}`} role="img">
          {meta && <span className={styles.meta}>{meta}</span>}
          <span className={styles.title}>{title}</span>
        </div>
      )}
    </div>
  );
}
