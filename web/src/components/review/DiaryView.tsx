'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Rating } from '@/components/ui/Rating';
import { Poster } from '@/components/media/Poster';
import { MEDIA_LABEL, formatRating, splitDate } from '@/lib/format';
import { sortDiary, useHydrated, useUserData } from '@/services/user';
import type { DiaryEntry, EpisodeLog } from '@/types';
import { SpoilerText } from './SpoilerText';
import styles from './diary.module.css';

type Item =
  | { kind: 'title'; date: string; sort: string; entry: DiaryEntry }
  | { kind: 'episode'; date: string; sort: string; log: EpisodeLog };

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function monthLabel(iso: string) {
  const [y, m] = iso.split('-').map(Number);
  return `${MESES[m - 1]} de ${y}`;
}

/** Junta sessões e episódios numa linha do tempo, mais recente primeiro. */
export function useDiaryItems(): Item[] {
  const diary = useUserData((d) => d.diary);
  const episodes = useUserData((d) => d.episodes);
  const items: Item[] = [
    ...sortDiary(diary).map((entry) => ({ kind: 'title' as const, date: entry.watchedOn, sort: entry.watchedOn + entry.createdAt, entry })),
    ...episodes.map((log) => ({ kind: 'episode' as const, date: log.watchedOn, sort: log.watchedOn + log.key, log })),
  ];
  return items.sort((a, b) => b.sort.localeCompare(a.sort));
}

/** Página do diário: tudo o que a pessoa registrou, por mês. */
export function DiaryView() {
  const hydrated = useHydrated();
  const items = useDiaryItems();
  const [onlyReviews, setOnlyReviews] = useState(false);

  if (!hydrated) return <div className={styles.placeholder} aria-hidden="true" />;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Seu diário está vazio.</p>
        <p className={styles.emptyText}>
          Abra um filme, série ou episódio e use <strong>Registrar no diário</strong> para guardar quando assistiu e o que achou.
        </p>
        <Button href="/explorar" variant="primary">
          Explorar o catálogo
        </Button>
      </div>
    );
  }

  const ratings = items.map((i) => (i.kind === 'title' ? i.entry.rating : i.log.rating)).filter((r): r is number => !!r);
  const average = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  const titleCount = items.filter((i) => i.kind === 'title').length;
  const episodeCount = items.length - titleCount;

  const shown = onlyReviews ? items.filter((i) => (i.kind === 'title' ? i.entry.review : i.log.review)) : items;
  const groups: Array<[string, Item[]]> = [];
  for (const item of shown) {
    const month = item.date.slice(0, 7);
    const last = groups.at(-1);
    if (last && last[0] === month) last[1].push(item);
    else groups.push([month, [item]]);
  }

  return (
    <>
      <dl className={styles.stats}>
        <div>
          <dt>Sessões</dt>
          <dd>{titleCount}</dd>
        </div>
        <div>
          <dt>Episódios</dt>
          <dd>{episodeCount}</dd>
        </div>
        <div>
          <dt>Nota média</dt>
          <dd>{average ? formatRating(average) : '—'}</dd>
        </div>
      </dl>

      <div className={styles.filters} role="group" aria-label="Filtrar diário">
        <Chip selected={!onlyReviews} onClick={() => setOnlyReviews(false)}>
          Tudo
        </Chip>
        <Chip selected={onlyReviews} onClick={() => setOnlyReviews(true)}>
          Só com opinião
        </Chip>
      </div>

      {groups.length === 0 && <p className={styles.emptyText}>Você ainda não escreveu nenhuma opinião.</p>}

      {groups.map(([month, list]) => (
        <section key={month} className={styles.month} aria-label={monthLabel(month + '-01')}>
          <h2 className={styles.monthTitle}>{monthLabel(month + '-01')}</h2>
          <ol className={styles.list}>
            {list.map((item) => (
              <DiaryRow key={item.kind === 'title' ? item.entry.id : item.log.key} item={item} />
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}

function DiaryRow({ item }: { item: Item }) {
  const { dia, mes } = splitDate(item.date);
  const title = item.kind === 'title' ? item.entry.title : item.log.title;
  const rating = item.kind === 'title' ? item.entry.rating : item.log.rating;
  const review = item.kind === 'title' ? item.entry.review : item.log.review;
  const spoiler = item.kind === 'title' ? item.entry.spoiler : item.log.spoiler;
  const label =
    item.kind === 'title'
      ? [MEDIA_LABEL[title.type], title.year, item.entry.rewatch ? 'reassistido' : null].filter(Boolean).join(' · ')
      : `T${item.log.season} · E${String(item.log.episode).padStart(2, '0')}${item.log.episodeName ? ` · ${item.log.episodeName}` : ''}`;

  return (
    <li className={styles.row}>
      <time className={styles.date} dateTime={item.date}>
        <span className={styles.month3}>{mes}</span>
        <span className={styles.day}>{dia}</span>
      </time>
      <Link href={title.href} className={styles.thumb} aria-hidden="true" tabIndex={-1}>
        <Poster title={title.title} src={title.posterUrl} seed={title.id} size="sm" sizes="56px" />
      </Link>
      <div className={styles.body}>
        <div className={styles.top}>
          <Link href={title.href} className={styles.title}>
            {title.title}
          </Link>
          {rating ? <Rating value={rating} size={16} showValue /> : null}
        </div>
        <span className={styles.label}>{label}</span>
        {review && <SpoilerText text={review} spoiler={spoiler} />}
      </div>
    </li>
  );
}
