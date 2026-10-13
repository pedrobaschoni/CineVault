'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PosterCard } from '@/components/media/PosterCard';
import { TYPE_FILTERS, type TypeFilter } from '@/services/catalog/taxonomy';
import type { TitleSummary } from '@/types';
import styles from './inicio.module.css';

export function TrendingGrid({ titles }: { titles: TitleSummary[] }) {
  const [filter, setFilter] = useState<TypeFilter>('tudo');
  const shown = (filter === 'tudo' ? titles : titles.filter((t) => t.type === filter)).slice(0, 12);

  return (
    <section aria-labelledby="em-alta">
      <SectionHeader
        id="em-alta"
        title="Em alta esta semana"
        aside={
          <div className={styles.filters} role="group" aria-label="Filtrar por tipo">
            {TYPE_FILTERS.map((f) => (
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
            <PosterCard key={`${t.kind}-${t.id}`} item={t} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          Nada desse tipo entre os mais vistos da semana.{' '}
          <a href={`/explorar?tipo=${filter}#catalogo`}>Ver {TYPE_FILTERS.find((f) => f.value === filter)?.label.toLowerCase()} no Explorar</a>
        </p>
      )}
    </section>
  );
}
