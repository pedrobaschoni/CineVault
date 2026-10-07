import Link from 'next/link';
import { formatRating, splitDate } from '@/lib/format';
import styles from './TicketStub.module.css';

interface TicketStubProps {
  /** Data em que assistiu, AAAA-MM-DD. */
  date: string;
  title: string;
  meta: string;
  rating?: number;
  href?: string;
}

/** Entrada do diário em formato de canhoto de ingresso. */
export function TicketStub({ date, title, meta, rating, href }: TicketStubProps) {
  const { dia, mes } = splitDate(date);
  const body = (
    <>
      <time className={styles.date} dateTime={date}>
        <span className={styles.month}>{mes}</span>
        <span className={styles.day}>{dia}</span>
      </time>
      <span className={styles.body}>
        <span>
          <span className={styles.title}>{title}</span>
          <span className={styles.meta}>{meta}</span>
        </span>
        {rating !== undefined && <span className={styles.rating}>{formatRating(rating)}</span>}
      </span>
    </>
  );

  return href ? (
    <Link href={href} className={styles.stub}>
      {body}
    </Link>
  ) : (
    <div className={styles.stub}>{body}</div>
  );
}
