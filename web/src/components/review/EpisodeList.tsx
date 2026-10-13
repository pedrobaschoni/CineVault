'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Rating } from '@/components/ui/Rating';
import { useToast } from '@/components/ui/Toast';
import { cx } from '@/lib/cx';
import { formatLongDate } from '@/lib/media';
import { episodeKey, ratingWord, removeEpisode, saveEpisode, today, useHydrated, useUserData } from '@/services/user';
import type { SeasonDetail, TitleRef } from '@/types';
import { ReviewForm } from './ReviewForm';
import { SpoilerText } from './SpoilerText';
import styles from './review.module.css';

/**
 * Episódios de uma temporada. Cada um pode ser marcado como visto
 * e receber nota e opinião próprias.
 */
export function EpisodeList({ title, season }: { title: TitleRef; season: SeasonDetail }) {
  const hydrated = useHydrated();
  const logs = useUserData((d) => d.episodes.filter((e) => e.title.key === title.key && e.season === season.number));
  const [open, setOpen] = useState<number | null>(null);
  const toast = useToast();

  const byEpisode = new Map(logs.map((l) => [l.episode, l]));
  const watched = season.episodes.filter((e) => byEpisode.has(e.number)).length;

  function toggleWatched(number: number, name: string) {
    const key = episodeKey(title.key, season.number, number);
    if (byEpisode.has(number)) {
      removeEpisode(key);
      if (open === number) setOpen(null);
    } else {
      saveEpisode({ title, season: season.number, episode: number, episodeName: name, watchedOn: today() });
    }
  }

  return (
    <>
      {hydrated && watched > 0 && (
        <div className={styles.progress}>
          <ProgressBar value={watched} max={season.episodes.length} label={`Episódios vistos da temporada ${season.number}`} thick />
          <span>
            {watched} de {season.episodes.length} vistos
          </span>
        </div>
      )}

      <ol className={styles.episodes}>
        {season.episodes.map((e) => {
          const log = byEpisode.get(e.number);
          const isOpen = open === e.number;
          return (
            <li key={e.number} className={cx(styles.episode, log && styles.episodeSeen)}>
              <div className={styles.epRow}>
                <button
                  type="button"
                  className={cx(styles.epCheck, log && styles.epCheckOn)}
                  aria-pressed={Boolean(log)}
                  aria-label={log ? `Desmarcar episódio ${e.number} como visto` : `Marcar episódio ${e.number} como visto`}
                  onClick={() => toggleWatched(e.number, e.name)}
                >
                  {log && <Icon name="check" size={14} strokeWidth={3} />}
                </button>
                <span className={styles.epNum}>E{String(e.number).padStart(2, '0')}</span>
                <span className={styles.epText}>
                  <span className={styles.epName}>{e.name}</span>
                  {e.overview && <span className={styles.epOverview}>{e.overview}</span>}
                </span>
                <span className={styles.epMeta}>{[formatLongDate(e.date), e.runtime ? `${e.runtime} min` : null].filter(Boolean).join(' · ')}</span>
                <button
                  type="button"
                  className={styles.epRate}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : e.number)}
                >
                  {log?.rating || log?.review ? 'Editar opinião' : 'Avaliar'}
                </button>
              </div>

              {log && (log.rating || log.review) && !isOpen && (
                <div className={styles.epReview}>
                  {log.rating ? (
                    <span className={styles.cardRating}>
                      <Rating value={log.rating} size={16} showValue />
                      <span className={styles.word}>{ratingWord(log.rating)}</span>
                    </span>
                  ) : null}
                  {log.review && <SpoilerText text={log.review} spoiler={log.spoiler} />}
                </div>
              )}

              {isOpen && (
                <div className={styles.epForm}>
                  <ReviewForm
                    compact
                    autoFocus
                    initial={log}
                    submitLabel="Salvar episódio"
                    placeholder={`O que achou de “${e.name}”?`}
                    onCancel={() => setOpen(null)}
                    onSave={(input) => {
                      saveEpisode({
                        title,
                        season: season.number,
                        episode: e.number,
                        episodeName: e.name,
                        watchedOn: log?.watchedOn ?? today(),
                        rating: input.rating,
                        review: input.review,
                        spoiler: input.spoiler,
                      });
                      setOpen(null);
                      toast.show(`E${String(e.number).padStart(2, '0')} marcado como visto.`);
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {toast.node}
    </>
  );
}
