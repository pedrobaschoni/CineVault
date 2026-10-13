import Link from 'next/link';
import { formatRating, MEDIA_LABEL } from '@/lib/format';
import type { TitleSummary } from '@/types';
import { Poster } from './Poster';
import styles from './PosterCard.module.css';

interface PosterCardProps {
  item: TitleSummary;
  sizes?: string;
  priority?: boolean;
}

/** Pôster + título + nota. É o card usado em todas as grades do site. */
export function PosterCard({ item, sizes = '(max-width: 560px) 45vw, (max-width: 1100px) 22vw, 200px', priority }: PosterCardProps) {
  const meta = [MEDIA_LABEL[item.type], item.year].filter(Boolean).join(' · ');
  return (
    <Link href={item.href} className={styles.card}>
      <Poster title={item.title} src={item.posterUrl} seed={item.id} meta={meta} sizes={sizes} priority={priority} />
      <span className={styles.row}>
        <span className={styles.title}>{item.title}</span>
        {item.score !== undefined && item.score > 0 && <span className={styles.score}>{formatRating(item.score)}</span>}
      </span>
    </Link>
  );
}
