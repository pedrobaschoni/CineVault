'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import {
  COUNTRIES, GENRES, MIN_SCORES, PROVIDERS, SORTS, TYPE_FILTERS, YEAR_RANGES,
  filtersToSearch, type CatalogFilters,
} from '@/services/catalog/taxonomy';
import styles from './explorar.module.css';

/**
 * Filtros do catálogo. Cada mudança vira um endereço novo (/explorar?genero=…),
 * então dá para voltar, compartilhar e salvar uma busca filtrada.
 */
export function FilterBar({ filters, total }: { filters: CatalogFilters; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function apply(change: Partial<CatalogFilters>) {
    const next = { ...filters, ...change };
    const qs = filtersToSearch(next).toString();
    startTransition(() => router.push(`${pathname}${qs ? `?${qs}` : ''}#catalogo`, { scroll: false }));
  }

  const active: Array<{ label: string; clear: Partial<CatalogFilters> }> = [];
  if (filters.genero) active.push({ label: GENRES.find((g) => g.slug === filters.genero)!.name, clear: { genero: undefined } });
  if (filters.pais) active.push({ label: COUNTRIES.find((c) => c.code === filters.pais)!.name, clear: { pais: undefined } });
  if (filters.ano) active.push({ label: YEAR_RANGES.find((y) => y.slug === filters.ano)!.name, clear: { ano: undefined } });
  if (filters.onde) active.push({ label: PROVIDERS.find((p) => p.id === filters.onde)!.name, clear: { onde: undefined } });
  if (filters.nota) active.push({ label: `Nota ${filters.nota}+`, clear: { nota: undefined } });
  if (filters.brasil) active.push({ label: 'Disponível no Brasil', clear: { brasil: undefined } });

  return (
    <div className={styles.filters} aria-busy={pending}>
      <div className={styles.filterRow}>
        <div className={styles.types} role="group" aria-label="Tipo">
          {TYPE_FILTERS.map((t) => (
            <Chip key={t.value} selected={filters.tipo === t.value} onClick={() => apply({ tipo: t.value })}>
              {t.label}
            </Chip>
          ))}
        </div>
        <label className={styles.sort}>
          <span className="visually-hidden">Ordenar</span>
          <select value={filters.ordem} onChange={(e) => apply({ ordem: e.target.value as CatalogFilters['ordem'] })}>
            {SORTS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" size={14} />
        </label>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.selects}>
          <Select label="Gênero" value={filters.genero ?? ''} onChange={(v) => apply({ genero: v || undefined })} options={GENRES.map((g) => [g.slug, g.name])} />
          <Select label="País" value={filters.pais ?? ''} onChange={(v) => apply({ pais: v || undefined })} options={COUNTRIES.map((c) => [c.code, c.name])} />
          <Select label="Ano" value={filters.ano ?? ''} onChange={(v) => apply({ ano: v || undefined })} options={YEAR_RANGES.map((y) => [y.slug, y.name])} />
          <Select label="Onde assistir" value={filters.onde ? String(filters.onde) : ''} onChange={(v) => apply({ onde: v ? Number(v) : undefined })} options={PROVIDERS.map((p) => [String(p.id), p.name])} />
          <Select label="Nota mínima" value={filters.nota ? String(filters.nota) : ''} onChange={(v) => apply({ nota: v ? Number(v) : undefined })} options={MIN_SCORES.map((n) => [String(n), `${n} ou mais`])} />
        </div>
        <label className={styles.check}>
          <input type="checkbox" checked={Boolean(filters.brasil)} onChange={(e) => apply({ brasil: e.target.checked || undefined })} />
          Só o que dá para ver no Brasil
        </label>
      </div>

      {(active.length > 0 || filters.lista) && (
        <div className={styles.activeRow}>
          {active.map((a) => (
            <button key={a.label} type="button" className={styles.activeChip} onClick={() => apply(a.clear)} aria-label={`Remover filtro ${a.label}`}>
              {a.label}
              <Icon name="close" size={12} strokeWidth={2.5} />
            </button>
          ))}
          <Link href="/explorar#catalogo" scroll={false} className={styles.clear}>
            Limpar filtros
          </Link>
          <span className={styles.count}>
            {pending ? 'Atualizando…' : `${total.toLocaleString('pt-BR')} ${total === 1 ? 'título' : 'títulos'}`}
          </span>
        </div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Array<[string, string]> }) {
  return (
    <label className={value ? `${styles.select} ${styles.selectOn}` : styles.select}>
      <span className="visually-hidden">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        <option value="">{label}</option>
        {options.map(([v, name]) => (
          <option key={v} value={v}>
            {name}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={14} />
    </label>
  );
}
