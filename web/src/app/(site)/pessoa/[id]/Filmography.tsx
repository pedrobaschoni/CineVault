'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { Poster } from '@/components/media/Poster';
import { formatRating, MEDIA_LABEL } from '@/lib/format';
import type { PersonCredit } from '@/types';
import styles from './pessoa.module.css';

const INITIAL = 30;

/** Filmografia agrupada por ano, com filtro por função. */
export function Filmography({ credits }: { credits: PersonCredit[] }) {
  const roles = useMemo(() => {
    const count = new Map<string, number>();
    for (const c of credits) for (const r of c.roles) count.set(r, (count.get(r) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([r]) => r);
  }, [credits]);

  const [role, setRole] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = role ? credits.filter((c) => c.roles.includes(role)) : credits;
  const shown = showAll ? filtered : filtered.slice(0, INITIAL);

  const byYear: Array<[string, PersonCredit[]]> = [];
  for (const c of shown) {
    const year = c.title.year ? String(c.title.year) : 'Sem data';
    const last = byYear.at(-1);
    if (last && last[0] === year) last[1].push(c);
    else byYear.push([year, [c]]);
  }

  return (
    <div>
      <div className={styles.filmHead}>
        <h2 className={styles.h2}>Filmografia</h2>
        {roles.length > 1 && (
          <div className={styles.roleFilter} role="group" aria-label="Filtrar por função">
            <Chip selected={role === null} onClick={() => setRole(null)}>
              Tudo
            </Chip>
            {roles.map((r) => (
              <Chip key={r} selected={role === r} onClick={() => setRole(r)}>
                {r}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <ol className={styles.years}>
        {byYear.map(([year, items]) => (
          <li key={year} className={styles.yearRow}>
            <span className={styles.year}>{year}</span>
            <ul className={styles.yearItems}>
              {items.map((c) => (
                <li key={`${c.title.kind}-${c.title.id}`}>
                  <Link href={c.title.href} className={styles.credit}>
                    <Poster title={c.title.title} src={c.title.posterUrl} seed={c.title.id} size="sm" width="2.5rem" sizes="40px" />
                    <span className={styles.creditText}>
                      <span className={styles.creditTitle}>{c.title.title}</span>
                      <span className={styles.creditRole}>
                        {[MEDIA_LABEL[c.title.type], c.character ? `como ${c.character}` : null].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                    <span className={styles.creditJobs}>{c.roles.join(', ')}</span>
                    {c.title.score ? <span className={styles.creditScore}>{formatRating(c.title.score)}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {filtered.length > INITIAL && (
        <button type="button" className={styles.more} onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Mostrar menos' : `Mostrar todos os ${filtered.length} trabalhos`}
        </button>
      )}
    </div>
  );
}
