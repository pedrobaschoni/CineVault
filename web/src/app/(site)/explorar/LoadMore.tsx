'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PosterCard } from '@/components/media/PosterCard';
import type { TitleSummary } from '@/types';
import styles from './explorar.module.css';

interface LoadMoreProps {
  /** Parâmetros da busca/filtros atuais, já em formato de URL. */
  query: string;
  totalPages: number;
  /** Chaves dos títulos já mostrados, para não repetir. */
  seen: string[];
}

/** Acrescenta as próximas páginas do catálogo na mesma grade. */
export function LoadMore({ query, totalPages, seen }: LoadMoreProps) {
  const [items, setItems] = useState<TitleSummary[]>([]);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [known] = useState(() => new Set(seen));

  async function load() {
    setState('loading');
    try {
      const res = await fetch(`/api/catalogo?${query}${query ? '&' : ''}pagina=${page + 1}`);
      if (!res.ok) throw new Error();
      const data: { results: TitleSummary[] } = await res.json();
      const fresh = data.results.filter((t) => {
        const key = `${t.kind}-${t.id}`;
        if (known.has(key)) return false;
        known.add(key);
        return true;
      });
      setItems((prev) => [...prev, ...fresh]);
      setPage((p) => p + 1);
      setState('idle');
    } catch {
      setState('error');
    }
  }

  return (
    <>
      {items.length > 0 && (
        <div className={styles.grid}>
          {items.map((t, i) => (
            <div key={`${t.kind}-${t.id}`} className={styles.appear} style={{ '--i': i % 12 } as React.CSSProperties}>
              <PosterCard item={t} />
            </div>
          ))}
        </div>
      )}
      {page < totalPages && (
        <div className={styles.more}>
          <Button onClick={load} disabled={state === 'loading'}>
            {state === 'loading' ? 'Carregando…' : 'Carregar mais'}
          </Button>
          {state === 'error' && <p className={styles.error}>O catálogo não respondeu. Tente de novo.</p>}
        </div>
      )}
    </>
  );
}
