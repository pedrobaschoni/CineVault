import Link from 'next/link';
import { formatRating, MEDIA_LABEL } from '@/lib/format';
import type { MediaType } from '@/types';
import { Poster } from './Poster';
import styles from './PosterCard.module.css';

interface PosterCardProps {
  href: string;
  title: string;
  type: MediaType;
  year: number;
  /** Nota da comunidade, de 0 a 10. */
  score?: number;
  posterUrl?: string;
  color?: string;
}

/** Pôster + título + nota. É o card usado em todas as grades do site. */
export function PosterCard({ href, title, type, year, score, posterUrl, color }: PosterCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <Poster title={title} src={posterUrl} color={color} meta={`${MEDIA_LABEL[type]} · ${year}`} />
      <span className={styles.row}>
        <span className={styles.title}>{title}</span>
        {score !== undefined && <span className={styles.score}>{formatRating(score)}</span>}
      </span>
    </Link>
  );
}
