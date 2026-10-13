'use client';

import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { Poster } from '@/components/media/Poster';
import { TicketStub } from '@/components/media/TicketStub';
import { useDiaryItems } from '@/components/review/DiaryView';
import { MEDIA_LABEL } from '@/lib/format';
import { useHydrated, useUserData } from '@/services/user';
import type { EpisodeLog } from '@/types';
import styles from './inicio.module.css';

/** "Continue de onde parou": o último episódio marcado em cada série. */
export function ContinueWatching() {
  const hydrated = useHydrated();
  const episodes = useUserData((d) => d.episodes);
  if (!hydrated || episodes.length === 0) return null;

  const latest = new Map<string, EpisodeLog>();
  for (const log of episodes) {
    const current = latest.get(log.title.key);
    const ahead = !current || log.season > current.season || (log.season === current.season && log.episode > current.episode);
    if (ahead) latest.set(log.title.key, log);
  }
  const items = [...latest.values()].sort((a, b) => b.watchedOn.localeCompare(a.watchedOn)).slice(0, 4);

  return (
    <section aria-labelledby="continuar">
      <SectionHeader id="continuar" title="Continue de onde parou" link={{ href: '/diario', label: 'Ver diário' }} />
      <div className={styles.continue}>
        {items.map((log) => (
          <Link key={log.title.key} href={`${log.title.href}?temporada=${log.season}#temporadas`} className={styles.continueCard}>
            <Poster title={log.title.title} src={log.title.posterUrl} seed={log.title.id} size="sm" width="4rem" sizes="64px" />
            <span className={styles.continueInfo}>
              <span className={styles.continueTitle}>{log.title.title}</span>
              <Tag>{`Parou em T${log.season} · E${log.episode}`}</Tag>
              {log.episodeName && <span className={styles.continueEp}>{log.episodeName}</span>}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** "Seu diário": as três últimas coisas registradas. */
export function RecentDiary() {
  const hydrated = useHydrated();
  const items = useDiaryItems().slice(0, 3);

  return (
    <section aria-labelledby="diario">
      <SectionHeader id="diario" title="Seu diário" link={{ href: '/diario', label: 'Abrir diário' }} />
      {!hydrated ? null : items.length === 0 ? (
        <div className={styles.diaryEmpty}>
          <p>Seu diário está vazio.</p>
          <p className={styles.diaryEmptyText}>
            Abra um filme ou uma série e use <strong>Registrar no diário</strong> para guardar quando assistiu e o que achou.
          </p>
          <Link href="/explorar">Explorar o catálogo</Link>
        </div>
      ) : (
        <div className={styles.stack}>
          {items.map((item) =>
            item.kind === 'title' ? (
              <TicketStub
                key={item.entry.id}
                date={item.entry.watchedOn}
                title={item.entry.title.title}
                meta={[MEDIA_LABEL[item.entry.title.type], item.entry.title.year, item.entry.rewatch ? 'reassistido' : null].filter(Boolean).join(' · ')}
                rating={item.entry.rating}
                href={item.entry.title.href}
              />
            ) : (
              <TicketStub
                key={item.log.key}
                date={item.log.watchedOn}
                title={`${item.log.title.title} · T${item.log.season} E${item.log.episode}`}
                meta={item.log.episodeName ?? 'Episódio'}
                rating={item.log.rating}
                href={`${item.log.title.href}?temporada=${item.log.season}#temporadas`}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}
