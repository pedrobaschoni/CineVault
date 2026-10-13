import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { VaultDial } from '@/components/ui/Logo';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Poster } from '@/components/media/Poster';
import { PosterCard } from '@/components/media/PosterCard';
import { MEDIA_LABEL } from '@/lib/format';
import { formatLongDate } from '@/lib/media';
import { discover, getListPreview, getNowPlaying, getUpcoming, search } from '@/services/catalog';
import { VAULT_LISTS, filtersToSearch, parseFilters, type CatalogFilters } from '@/services/catalog/taxonomy';
import type { Page, TitleSummary } from '@/types';
import { FilterBar } from './FilterBar';
import { LoadMore } from './LoadMore';
import styles from './explorar.module.css';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';
  const list = VAULT_LISTS.find((l) => l.slug === sp.lista);
  return { title: q ? `Busca: ${q}` : list ? list.name : 'Explorar' };
}

export default async function ExplorarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim().slice(0, 80) : '';
  if (q) return <SearchResultsView query={q} />;

  const filters = parseFilters(sp);
  const list = VAULT_LISTS.find((l) => l.slug === filters.lista);
  const showcase = !list;

  const [catalog, previews, nowPlaying, upcoming] = await Promise.all([
    discover(filters),
    showcase ? Promise.all(VAULT_LISTS.map((l) => getListPreview(l))) : Promise.resolve([]),
    showcase ? getNowPlaying().catch(() => []) : Promise.resolve([]),
    showcase ? getUpcoming().catch(() => []) : Promise.resolve([]),
  ]);

  return (
    <div className={`container ${styles.page}`}>
      {list ? (
        <header className={styles.listHeader}>
          <Link href="/explorar" className={styles.back}>
            Explorar
          </Link>
          <h1 className={styles.h1}>{list.name}</h1>
          <p className={styles.lead}>{list.description}</p>
        </header>
      ) : (
        <header className={styles.header}>
          <div>
            <h1 className={styles.h1}>Explorar</h1>
            <p className={styles.lead}>Filtre por tipo, gênero, país e ano, ou deixe o cofre escolher por você.</p>
          </div>
          <Link href="/explorar/surpresa" prefetch={false} className={styles.surprise}>
            <span className={styles.surpriseDial}>
              <VaultDial size={22} />
            </span>
            Surpreenda-me
          </Link>
        </header>
      )}

      {showcase && (
        <section aria-labelledby="listas">
          <SectionHeader id="listas" title="Listas do cofre" />
          <div className={styles.lists}>
            {VAULT_LISTS.map((l, i) => (
              <Link key={l.slug} href={`/explorar?lista=${l.slug}`} className={styles.listCard}>
                <span className={styles.fan} aria-hidden="true">
                  {(previews[i] ?? []).map((t, j) => (
                    <span key={t.id} className={styles.fanItem} style={{ '--j': j } as React.CSSProperties}>
                      <Poster title={t.title} src={t.posterUrl} seed={t.id} size="sm" sizes="96px" />
                    </span>
                  ))}
                </span>
                <span className={styles.listName}>{l.name}</span>
                <span className={styles.listDesc}>{l.description}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showcase && (nowPlaying.length > 0 || upcoming.length > 0) && (
        <div className={styles.releases}>
          <ReleaseColumn title="Em cartaz nos cinemas" items={nowPlaying.slice(0, 4)} note={(t) => (t.date ? `Estreou em ${formatLongDate(t.date)}` : MEDIA_LABEL[t.type])} />
          <ReleaseColumn title="Em breve nos cinemas" items={upcoming.slice(0, 4)} note={(t) => (t.date ? `Estreia em ${formatLongDate(t.date)}` : 'Data a confirmar')} />
        </div>
      )}

      <section id="catalogo" className={styles.catalog} aria-labelledby="catalogo-h">
        <h2 id="catalogo-h" className={styles.h2}>
          {list ? 'Títulos da lista' : 'Todo o catálogo'}
        </h2>
        <FilterBar filters={filters} total={catalog.totalResults} />
        <CatalogGrid page={catalog} query={filtersToSearch(filters).toString()} emptyFilters={filters} />
      </section>
    </div>
  );
}

function ReleaseColumn({ title, items, note }: { title: string; items: TitleSummary[]; note: (t: TitleSummary) => string }) {
  if (items.length === 0) return null;
  return (
    <section>
      <SectionHeader title={title} />
      <ul className={styles.releaseList}>
        {items.map((t) => (
          <li key={t.id}>
            <Link href={t.href} className={styles.release}>
              <span className={styles.releaseThumb}>
                <Poster title={t.title} src={t.posterUrl} seed={t.id} size="sm" sizes="52px" />
              </span>
              <span className={styles.releaseText}>
                <span className={styles.releaseTitle}>{t.title}</span>
                <span className={styles.releaseNote}>{note(t)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CatalogGrid({ page, query, emptyFilters }: { page: Page<TitleSummary>; query: string; emptyFilters?: CatalogFilters }) {
  if (page.results.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Nada no cofre com esses filtros.</p>
        <p className={styles.emptyText}>
          {emptyFilters?.genero && (emptyFilters.tipo === 'serie' || emptyFilters.tipo === 'anime' || emptyFilters.tipo === 'dorama')
            ? 'Alguns gêneros só existem para filmes. Troque o tipo para “Tudo” ou remova o gênero.'
            : 'Remova um dos filtros para ver mais títulos.'}
        </p>
        <Link href="/explorar#catalogo" scroll={false} className={styles.emptyLink}>
          Limpar filtros
        </Link>
      </div>
    );
  }
  return (
    <>
      <div className={styles.grid}>
        {page.results.map((t, i) => (
          <PosterCard key={`${t.kind}-${t.id}`} item={t} priority={i < 6} />
        ))}
      </div>
      <LoadMore key={query} query={query} totalPages={page.totalPages} seen={page.results.map((t) => `${t.kind}-${t.id}`)} />
    </>
  );
}

async function SearchResultsView({ query }: { query: string }) {
  const results = await search(query);
  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.listHeader}>
        <Link href="/explorar" className={styles.back}>
          Explorar
        </Link>
        <h1 className={styles.h1}>Resultados para “{query}”</h1>
        <p className={styles.lead}>
          {results.totalResults > 0 ? `${results.totalResults.toLocaleString('pt-BR')} resultados entre títulos e pessoas.` : 'Nenhum resultado.'}
        </p>
      </header>

      {results.people.length > 0 && (
        <section aria-labelledby="pessoas">
          <SectionHeader id="pessoas" title="Pessoas" />
          <ul className={styles.people}>
            {results.people.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link href={p.href} className={styles.personCard}>
                  <span className={styles.personPhoto}>
                    {p.profileUrl ? <Image src={p.profileUrl} alt="" fill sizes="56px" /> : p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </span>
                  <span>
                    <span className={styles.personName}>{p.name}</span>
                    <span className={styles.personMeta}>{[p.department, p.knownFor].filter(Boolean).join(' · ')}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="titulos">
        <SectionHeader id="titulos" title="Títulos" />
        {results.results.length > 0 ? (
          <>
            <div className={styles.grid}>
              {results.results.map((t, i) => (
                <PosterCard key={`${t.kind}-${t.id}`} item={t} priority={i < 6} />
              ))}
            </div>
            <LoadMore key={query} query={`q=${encodeURIComponent(query)}`} totalPages={results.totalPages} seen={results.results.map((t) => `${t.kind}-${t.id}`)} />
          </>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Nada no cofre com “{query}”.</p>
            <p className={styles.emptyText}>Confira a grafia, tente o título original ou um nome mais curto.</p>
            <div className={styles.emptyLinks}>
              <Link href="/explorar?ordem=populares#catalogo">Ver o que está em alta</Link>
              <Link href="/explorar/surpresa" prefetch={false}>
                Surpreenda-me
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
