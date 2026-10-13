'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Provider, WatchProviders } from '@/types';
import styles from './WhereToWatch.module.css';

const TABS = [
  { key: 'flatrate', label: 'Assinatura', note: 'Incluso na assinatura' },
  { key: 'rent', label: 'Aluguel', note: 'Para alugar' },
  { key: 'buy', label: 'Compra', note: 'Para comprar' },
] as const;

/** Onde assistir no Brasil, separado por tipo de acesso. Dados do JustWatch via TMDB. */
export function WhereToWatch({ providers }: { providers: WatchProviders }) {
  const available = TABS.filter((t) => providers[t.key].length > 0);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>(available[0]?.key ?? 'flatrate');
  const current = TABS.find((t) => t.key === tab)!;
  const list: Provider[] = providers[tab];

  return (
    <section className={styles.panel} aria-labelledby="onde-assistir" id="onde-assistir-secao">
      <h2 id="onde-assistir" className={styles.h2}>
        Onde assistir no Brasil
      </h2>

      {available.length === 0 ? (
        <p className={styles.empty}>Ainda não está disponível em nenhum streaming no Brasil.</p>
      ) : (
        <>
          <div className={styles.seg} role="tablist" aria-label="Tipo de acesso">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                disabled={providers[t.key].length === 0}
                className={tab === t.key ? styles.on : undefined}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <ul className={styles.list} role="tabpanel" aria-label={current.label}>
            {list.map((p) => (
              <li key={p.id} className={styles.item}>
                <span className={styles.logo}>
                  {p.logoUrl ? <Image src={p.logoUrl} alt="" width={44} height={44} /> : p.name.slice(0, 1)}
                </span>
                <span className={styles.info}>
                  <span className={styles.name}>{p.name}</span>
                  <span className={styles.note}>{current.note}</span>
                </span>
              </li>
            ))}
          </ul>
          {providers.link && (
            <a href={providers.link} target="_blank" rel="noreferrer" className={styles.link}>
              Ver links para assistir
            </a>
          )}
        </>
      )}
      <p className={styles.credit}>Disponibilidade via JustWatch</p>
    </section>
  );
}
