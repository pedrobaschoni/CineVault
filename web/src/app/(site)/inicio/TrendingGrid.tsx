'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PosterCard } from '@/components/media/PosterCard';
import type { SampleTitle } from '@/lib/sample';
import type { MediaType } from '@/types';
import styles from './inicio.module.css';

const FILTERS: Array<{ value: MediaType | 'tudo'; label: string }> = [
  { value: 'tudo', label: 'Tudo' },
  { value: 'filme', label: 'Filmes' },
  { value: 'serie', label: 'Séries' },
  { value: 'anime', label: 'Animes' },
  { value: 'dorama', label: 'Doramas' },
];

export function TrendingGrid({ titles }: { titles: SampleTitle[] }) {
  const [filter, setFilter] = useState<MediaType | 'tudo'>('tudo');
  const shown = filter === 'tudo' ? titles : titles.filter((t) => t.type === filter);

  return (
    <section aria-labelledby="em-alta">
      <SectionHeader
        id="em-alta"
        title="Em alta no cofre"
        aside={
          <div className={styles.filters} role="group" aria-label="Filtrar por tipo">
            {FILTERS.map((f) => (
              <Chip key={f.value} selected={filter === f.value} onClick={() => setFilter(f.value)}>
                {f.label}
              </Chip>
            ))}
          </div>
        }
      />
      {shown.length > 0 ? (
        <div className={styles.grid}>
          {shown.map((t) => (
            <PosterCard
              key={t.id}
              href={`/titulo/${t.type}/${t.id}`}
              title={t.title}
              type={t.type}
              year={t.year}
              score={t.score}
              color={t.color}
            />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nada em alta nessa categoria agora.</p>
      )}
    </section>
  );
}
