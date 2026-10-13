'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RatingInput } from '@/components/ui/RatingInput';
import { cx } from '@/lib/cx';
import { splitDate } from '@/lib/format';
import { today, type DiaryInput } from '@/services/user';
import styles from './review.module.css';

interface ReviewFormProps {
  initial?: Partial<DiaryInput>;
  onSave: (input: DiaryInput) => void;
  onCancel?: () => void;
  /** Versão menor, para episódios: sem data nem "reassistido". */
  compact?: boolean;
  /** Texto do botão de salvar. */
  submitLabel?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

const MAX = 2000;

/**
 * Formulário de opinião: nota em selos, texto, aviso de spoiler, data e
 * "já tinha visto". A data aparece num canhoto de ingresso que muda junto.
 */
export function ReviewForm({
  initial,
  onSave,
  onCancel,
  compact = false,
  submitLabel = 'Salvar no diário',
  placeholder = 'O que você achou? Personagens, final, trilha, o que ficou na cabeça…',
  autoFocus,
}: ReviewFormProps) {
  const id = useId();
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [review, setReview] = useState(initial?.review ?? '');
  const [spoiler, setSpoiler] = useState(initial?.spoiler ?? false);
  const [watchedOn, setWatchedOn] = useState(initial?.watchedOn ?? today());
  const [rewatch, setRewatch] = useState(initial?.rewatch ?? false);

  const empty = !rating && !review.trim();
  const { dia, mes } = splitDate(watchedOn || today());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!compact && !watchedOn) return;
    onSave({ watchedOn: watchedOn || today(), rewatch, rating: rating || undefined, review, spoiler });
  }

  return (
    <form className={cx(styles.form, compact && styles.formCompact)} onSubmit={submit}>
      {!compact && (
        <div className={styles.formStub} aria-hidden="true">
          <span className={styles.stubMonth}>{mes}</span>
          <span className={styles.stubDay}>{dia}</span>
          <span className={styles.stubYear}>{watchedOn.slice(0, 4)}</span>
        </div>
      )}

      <div className={styles.formBody}>
        <RatingInput value={rating} onChange={setRating} label={compact ? 'Nota' : 'Sua nota'} size={compact ? 22 : 28} showWord clearable />

        <div className={styles.field}>
          <label htmlFor={`${id}-texto`} className="visually-hidden">
            Sua opinião
          </label>
          <textarea
            id={`${id}-texto`}
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, MAX))}
            placeholder={placeholder}
            rows={compact ? 3 : 5}
            autoFocus={autoFocus}
            data-composer-focus
            className={styles.textarea}
          />
          {review.length > MAX * 0.8 && (
            <span className={styles.counter}>
              {review.length}/{MAX}
            </span>
          )}
        </div>

        <div className={styles.options}>
          <label className={styles.check}>
            <input type="checkbox" checked={spoiler} onChange={(e) => setSpoiler(e.target.checked)} disabled={!review.trim()} />
            Contém spoiler
          </label>
          {!compact && (
            <>
              <label className={styles.check}>
                <input type="checkbox" checked={rewatch} onChange={(e) => setRewatch(e.target.checked)} />
                Já tinha visto antes
              </label>
              <label className={styles.date}>
                Assisti em
                <input type="date" value={watchedOn} max={today()} onChange={(e) => setWatchedOn(e.target.value)} required />
              </label>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <Button type="submit" variant="primary" size={compact ? 'sm' : 'md'} disabled={compact && empty}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button size={compact ? 'sm' : 'md'} onClick={onCancel}>
              Cancelar
            </Button>
          )}
          {!compact && empty && <span className={styles.hint}>Pode salvar só a data, se quiser. Nota e opinião são opcionais.</span>}
        </div>
      </div>
    </form>
  );
}
