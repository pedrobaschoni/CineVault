import 'server-only';
import { cache } from 'react';
import type { Page, PersonDetail, SearchResults, SeasonDetail, TitleDetail, TitleSummary, TmdbKind } from '@/types';
import { toDetail, toPerson, toPersonSummary, toSeason, toSummaries } from './mappers';
import type { RawCollection, RawListItem, RawPage, RawPerson, RawSeason, RawTitleDetail } from './raw';
import { GENRES, VAULT_LISTS, YEAR_RANGES, type CatalogFilters, type VaultList } from './taxonomy';
import { TmdbError, isNotFound } from './errors';
import { isDemoMode, tmdbGet } from './tmdb';

/**
 * Serviço de catálogo. As páginas só falam com estas funções;
 * nenhuma página chama o TMDB diretamente.
 */

export { TmdbError, isDemoMode, isNotFound };

/* ---------- Vitrines ---------- */

export async function getTrending(window: 'day' | 'week' = 'week'): Promise<TitleSummary[]> {
  const page = await tmdbGet<RawPage>(`/trending/all/${window}`);
  return toSummaries(page.results);
}

export async function getNowPlaying(): Promise<TitleSummary[]> {
  const page = await tmdbGet<RawPage>('/movie/now_playing', { region: 'BR' });
  return toSummaries(page.results, 'movie').sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

export async function getUpcoming(): Promise<TitleSummary[]> {
  const page = await tmdbGet<RawPage>('/movie/upcoming', { region: 'BR' });
  const today = new Date().toISOString().slice(0, 10);
  // "Em breve" só mostra estreias que ainda não aconteceram.
  return toSummaries(page.results, 'movie')
    .filter((t) => (t.date ?? '') >= today)
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
}

/* ---------- Título ---------- */

export const getTitle = cache(async (kind: TmdbKind, id: number): Promise<TitleDetail> => {
  const append = kind === 'movie'
    ? 'credits,videos,recommendations,similar,release_dates,watch/providers'
    : 'aggregate_credits,credits,videos,recommendations,similar,content_ratings,watch/providers';
  const raw = await tmdbGet<RawTitleDetail>(`/${kind}/${id}`, {
    append_to_response: append,
    include_video_language: 'pt,en,null',
  });

  // Sem sinopse em português, usa a em inglês.
  if (!raw.overview) {
    const en = await tmdbGet<RawTitleDetail>(`/${kind}/${id}`, { language: 'en-US' }).catch(() => null);
    if (en?.overview) raw.overview = en.overview;
  }

  let collection: RawCollection | undefined;
  if (kind === 'movie' && raw.belongs_to_collection) {
    collection = await tmdbGet<RawCollection>(`/collection/${raw.belongs_to_collection.id}`).catch(() => undefined);
  }
  return toDetail(raw, kind, collection);
});

export async function getSeason(id: number, number: number): Promise<SeasonDetail> {
  return toSeason(await tmdbGet<RawSeason>(`/tv/${id}/season/${number}`));
}

/* ---------- Pessoa ---------- */

export const getPerson = cache(async (id: number): Promise<PersonDetail> => {
  const raw = await tmdbGet<RawPerson>(`/person/${id}`, { append_to_response: 'combined_credits' });
  if (!raw.biography) {
    const en = await tmdbGet<RawPerson>(`/person/${id}`, { language: 'en-US' }).catch(() => null);
    if (en?.biography) raw.biography = en.biography;
  }
  return toPerson(raw);
});

/* ---------- Busca ---------- */

export async function search(query: string, page = 1): Promise<Page<TitleSummary> & { people: SearchResults['people'] }> {
  const raw = await tmdbGet<RawPage>('/search/multi', { query, page, include_adult: false }, { revalidate: 600 });
  return {
    results: toSummaries(raw.results),
    people: raw.results.filter((r) => r.media_type === 'person').map(toPersonSummary),
    page: raw.page,
    totalPages: raw.total_pages,
    totalResults: raw.total_results,
  };
}

/** Sugestões da busca do cabeçalho: até 4 títulos e 1 pessoa. */
export async function suggest(query: string): Promise<SearchResults> {
  const { results, people } = await search(query);
  return { titles: results.slice(0, 4), people: people.slice(0, 1) };
}

/* ---------- Explorar ---------- */

const keywordIds = new Map<string, number | null>();

async function keywordId(name: string): Promise<number | null> {
  if (keywordIds.has(name)) return keywordIds.get(name)!;
  const page = await tmdbGet<RawPage<{ id: number; name: string }>>('/search/keyword', { query: name }, { revalidate: 86400 }).catch(() => null);
  const id = page?.results.find((k) => k.name.toLowerCase() === name.toLowerCase())?.id ?? page?.results[0]?.id ?? null;
  keywordIds.set(name, id);
  return id;
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

/** Monta os parâmetros do /discover para filmes ou séries. Null = esse tipo não tem resultado. */
function discoverParams(kind: TmdbKind, f: CatalogFilters, page: number, extra: { keyword?: number | null; minVotes?: number }) {
  const dateField = kind === 'movie' ? 'primary_release_date' : 'first_air_date';
  const genres: number[] = [];
  const p: Record<string, string | number | boolean> = { page, include_adult: false };

  let minVotes = extra.minVotes ?? 0;
  if (f.ordem === 'nota') {
    p.sort_by = 'vote_average.desc';
    minVotes = Math.max(minVotes, 300);
  } else if (f.ordem === 'recentes') {
    p.sort_by = `${dateField}.desc`;
    p[`${dateField}.lte`] = new Date().toISOString().slice(0, 10);
    minVotes = Math.max(minVotes, 10);
  } else {
    p.sort_by = 'popularity.desc';
  }

  if (f.genero) {
    const g = GENRES.find((x) => x.slug === f.genero);
    const id = g?.[kind];
    if (!id) return null;
    genres.push(id);
  }

  if (kind === 'tv' && f.tipo === 'anime') {
    genres.push(16);
    p.with_origin_country = 'JP';
  }
  if (kind === 'tv' && f.tipo === 'dorama') {
    p.with_origin_country = 'KR|JP|CN|TW|TH';
    p.without_genres = 16;
  }
  if (f.pais) {
    if (p.with_origin_country && !String(p.with_origin_country).split('|').includes(f.pais)) return null;
    p.with_origin_country = f.pais;
  }
  if (genres.length) p.with_genres = [...new Set(genres)].join(',');

  if (f.ano) {
    const range = YEAR_RANGES.find((y) => y.slug === f.ano)!;
    if ('from' in range) {
      p[`${dateField}.gte`] = range.from;
      p[`${dateField}.lte`] = range.to;
    } else {
      p[`${dateField}.gte`] = isoDaysAgo(365);
      p[`${dateField}.lte`] = new Date().toISOString().slice(0, 10);
    }
  }

  if (f.onde) {
    p.with_watch_providers = f.onde;
    p.watch_region = 'BR';
  }
  if (f.brasil) {
    p.watch_region = 'BR';
    p.with_watch_monetization_types = 'flatrate|free|ads|rent|buy';
  }
  if (f.nota) {
    p['vote_average.gte'] = f.nota;
    minVotes = Math.max(minVotes, 50);
  }
  if (extra.keyword) p.with_keywords = extra.keyword;
  if (minVotes) p['vote_count.gte'] = minVotes;
  return p;
}

const sortValue = (f: CatalogFilters) => (t: TitleSummary) =>
  f.ordem === 'nota' ? t.score ?? 0 : f.ordem === 'recentes' ? Date.parse(t.date ?? '1900') : t.popularity ?? 0;

export async function discover(f: CatalogFilters, page = 1): Promise<Page<TitleSummary>> {
  const list = VAULT_LISTS.find((l) => l.slug === f.lista);
  const keyword = list?.keyword ? await keywordId(list.keyword) : undefined;

  const kinds: TmdbKind[] = f.tipo === 'tudo' ? ['movie', 'tv'] : f.tipo === 'filme' ? ['movie'] : ['tv'];
  const pages = await Promise.all(
    kinds.map(async (kind) => {
      const params = discoverParams(kind, f, page, { keyword, minVotes: list?.minVotes });
      if (!params) return { kind, raw: { page, results: [], total_pages: 0, total_results: 0 } as RawPage };
      return { kind, raw: await tmdbGet<RawPage>(`/discover/${kind}`, params) };
    }),
  );

  const value = sortValue(f);
  const results = pages
    .flatMap(({ kind, raw }) => toSummaries(raw.results, kind))
    .sort((a, b) => value(b) - value(a));

  return {
    results,
    page,
    totalPages: Math.min(500, Math.max(0, ...pages.map((p) => p.raw.total_pages))),
    totalResults: pages.reduce((sum, p) => sum + p.raw.total_results, 0),
  };
}

export async function getListPreview(list: VaultList): Promise<TitleSummary[]> {
  const f: CatalogFilters = { tipo: 'tudo', ordem: 'populares', ...list.filters, lista: list.slug };
  return (await discover(f).catch(() => ({ results: [] as TitleSummary[] }))).results.slice(0, 3);
}

/** Um título bem avaliado ao acaso, para o "Surpreenda-me". */
export async function getRandomTitle(): Promise<TitleSummary | null> {
  const kind: TmdbKind = Math.random() < 0.5 ? 'movie' : 'tv';
  const params = { sort_by: 'popularity.desc', 'vote_average.gte': 7, 'vote_count.gte': 500 };
  let raw = await tmdbGet<RawPage>(`/discover/${kind}`, { ...params, page: 1 + Math.floor(Math.random() * 10) }, { revalidate: 86400 });
  if (raw.results.length === 0) raw = await tmdbGet<RawPage>(`/discover/${kind}`, { ...params, page: 1 }, { revalidate: 86400 });
  const titles = toSummaries(raw.results as RawListItem[], kind);
  return titles[Math.floor(Math.random() * titles.length)] ?? null;
}
