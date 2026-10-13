'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { useToast } from '@/components/ui/Toast';
import { formatLongDate } from '@/lib/media';
import { formatRating, splitDate } from '@/lib/format';
import {
  addDiaryEntry, ratingWord, removeDiaryEntry, sortDiary, updateDiaryEntry, useHydrated, useUserData,
} from '@/services/user';
import type { DiaryEntry, TitleRef } from '@/types';
import { ReviewForm } from './ReviewForm';
import { SpoilerText } from './SpoilerText';
import styles from './review.module.css';

/** Evento que o botão "Registrar no diário" do topo dispara para abrir o formulário. */
export const COMPOSE_EVENT = 'cinevault:compose';

type Mode = { kind: 'view' } | { kind: 'new' } | { kind: 'edit'; entry: DiaryEntry };

/** "Sua opinião" na página do título: registrar, ver, editar e excluir sessões. */
export function YourReview({ title }: { title: TitleRef }) {
  const hydrated = useHydrated();
  const entries = useUserData((d) => d.diary.filter((e) => e.title.key === title.key));
  const sorted = sortDiary(entries);
  const [mode, setMode] = useState<Mode>({ kind: 'view' });
  const [confirming, setConfirming] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const toast = useToast();

  useEffect(() => {
    function open() {
      setMode({ kind: 'new' });
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => sectionRef.current?.querySelector<HTMLElement>('[data-composer-focus]')?.focus({ preventScroll: true }), 450);
    }
    window.addEventListener(COMPOSE_EVENT, open);
    return () => window.removeEventListener(COMPOSE_EVENT, open);
  }, []);

  const showForm = mode.kind !== 'view' || (hydrated && sorted.length === 0);
  const latest = sorted[0];
  const others = sorted.slice(1);

  return (
    <section id="opiniao" ref={sectionRef} className={styles.section} aria-labelledby="opiniao-h">
      <div className={styles.head}>
        <h2 id="opiniao-h" className={styles.h2}>
          Sua opinião
        </h2>
        {hydrated && sorted.length > 0 && mode.kind === 'view' && (
          <Button size="sm" icon="plus" onClick={() => setMode({ kind: 'new' })}>
            Registrar outra sessão
          </Button>
        )}
      </div>

      {!hydrated ? (
        <div className={styles.placeholder} aria-hidden="true" />
      ) : showForm ? (
        <>
          {sorted.length === 0 && mode.kind === 'view' && (
            <p className={styles.lead}>Registre quando assistiu e o que achou de {title.title}. Fica guardado no seu diário.</p>
          )}
          <ReviewForm
            key={mode.kind === 'edit' ? mode.entry.id : mode.kind}
            initial={mode.kind === 'edit' ? mode.entry : { rewatch: sorted.length > 0 }}
            submitLabel={mode.kind === 'edit' ? 'Salvar alterações' : 'Salvar no diário'}
            onCancel={sorted.length > 0 || mode.kind !== 'view' ? () => setMode({ kind: 'view' }) : undefined}
            onSave={(input) => {
              if (mode.kind === 'edit') {
                updateDiaryEntry(mode.entry.id, input);
                toast.show('Opinião atualizada.');
              } else {
                addDiaryEntry(title, input);
                toast.show('Guardado no seu diário.');
              }
              setMode({ kind: 'view' });
            }}
          />
        </>
      ) : (
        latest && (
          <>
            <EntryCard
              entry={latest}
              confirming={confirming === latest.id}
              onEdit={() => setMode({ kind: 'edit', entry: latest })}
              onAskDelete={() => setConfirming(latest.id)}
              onCancelDelete={() => setConfirming(null)}
              onDelete={() => {
                removeDiaryEntry(latest.id);
                setConfirming(null);
                toast.show('Sessão excluída do diário.');
              }}
            />
            {others.length > 0 && (
              <div className={styles.history}>
                <h3 className={styles.h3}>
                  Você também viu em {others.length === 1 ? 'outra sessão' : `outras ${others.length} sessões`}
                </h3>
                <ul className={styles.historyList}>
                  {others.map((e) => (
                    <li key={e.id} className={styles.historyRow}>
                      <time dateTime={e.watchedOn}>{formatLongDate(e.watchedOn)}</time>
                      <span>{e.rating ? `${formatRating(e.rating)} · ${ratingWord(e.rating)}` : 'Sem nota'}</span>
                      <span className={styles.historyNote}>{e.review ? (e.spoiler ? 'Opinião com spoiler' : e.review) : ''}</span>
                      <button type="button" className={styles.linkButton} onClick={() => setMode({ kind: 'edit', entry: e })}>
                        Editar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )
      )}
      {toast.node}
    </section>
  );
}

interface EntryCardProps {
  entry: DiaryEntry;
  confirming: boolean;
  onEdit: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
}

function EntryCard({ entry, confirming, onEdit, onAskDelete, onCancelDelete, onDelete }: EntryCardProps) {
  const { dia, mes } = splitDate(entry.watchedOn);
  return (
    <article className={styles.card}>
      <time className={styles.cardStub} dateTime={entry.watchedOn}>
        <span className={styles.stubMonth}>{mes}</span>
        <span className={styles.stubDay}>{dia}</span>
        <span className={styles.stubYear}>{entry.watchedOn.slice(0, 4)}</span>
      </time>
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          {entry.rating ? (
            <span className={styles.cardRating}>
              <Rating value={entry.rating} size={22} showValue />
              <span className={styles.word}>{ratingWord(entry.rating)}</span>
            </span>
          ) : (
            <span className={styles.muted}>Sem nota</span>
          )}
          {entry.rewatch && <span className={styles.tag}>Reassistido</span>}
        </div>
        {entry.review ? <SpoilerText text={entry.review} spoiler={entry.spoiler} /> : <p className={styles.muted}>Você não escreveu nada desta vez.</p>}
        {confirming ? (
          <div className={styles.confirm} role="alert">
            <span>Excluir esta sessão do diário?</span>
            <Button size="sm" variant="primary" onClick={onDelete}>
              Excluir
            </Button>
            <Button size="sm" onClick={onCancelDelete}>
              Manter
            </Button>
          </div>
        ) : (
          <div className={styles.cardActions}>
            <button type="button" className={styles.linkButton} onClick={onEdit}>
              Editar
            </button>
            <button type="button" className={styles.linkButton} onClick={onAskDelete}>
              Excluir
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
