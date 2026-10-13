/**
 * Vocabulário do catálogo: gêneros, países, streamings e listas do cofre.
 * Filmes e séries usam IDs de gênero diferentes no TMDB; aqui cada gênero
 * tem um nome só e os dois IDs. Pode ser importado no servidor e no navegador.
 */
import type { MediaType } from '@/types';

export interface GenreDef {
  slug: string;
  name: string;
  movie: number | null;
  tv: number | null;
}

export const GENRES: GenreDef[] = [
  { slug: 'acao', name: 'Ação', movie: 28, tv: 10759 },
  { slug: 'animacao', name: 'Animação', movie: 16, tv: 16 },
  { slug: 'aventura', name: 'Aventura', movie: 12, tv: 10759 },
  { slug: 'comedia', name: 'Comédia', movie: 35, tv: 35 },
  { slug: 'crime', name: 'Crime', movie: 80, tv: 80 },
  { slug: 'documentario', name: 'Documentário', movie: 99, tv: 99 },
  { slug: 'drama', name: 'Drama', movie: 18, tv: 18 },
  { slug: 'familia', name: 'Família', movie: 10751, tv: 10751 },
  { slug: 'fantasia', name: 'Fantasia', movie: 14, tv: 10765 },
  { slug: 'ficcao', name: 'Ficção científica', movie: 878, tv: 10765 },
  { slug: 'guerra', name: 'Guerra', movie: 10752, tv: 10768 },
  { slug: 'misterio', name: 'Mistério', movie: 9648, tv: 9648 },
  { slug: 'romance', name: 'Romance', movie: 10749, tv: null },
  { slug: 'suspense', name: 'Suspense', movie: 53, tv: null },
  { slug: 'terror', name: 'Terror', movie: 27, tv: null },
  { slug: 'faroeste', name: 'Faroeste', movie: 37, tv: 37 },
];

/** Nome em português para qualquer ID de gênero do TMDB (filme ou série). */
export const GENRE_NAME: Record<number, string> = {
  28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia', 80: 'Crime', 99: 'Documentário',
  18: 'Drama', 10751: 'Família', 14: 'Fantasia', 36: 'História', 27: 'Terror', 10402: 'Música',
  9648: 'Mistério', 10749: 'Romance', 878: 'Ficção científica', 10770: 'Filme para TV', 53: 'Suspense',
  10752: 'Guerra', 37: 'Faroeste', 10759: 'Ação e aventura', 10762: 'Infantil', 10763: 'Jornalismo',
  10764: 'Reality', 10765: 'Ficção e fantasia', 10766: 'Novela', 10767: 'Talk show', 10768: 'Guerra e política',
};

export const COUNTRIES = [
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'KR', name: 'Coreia do Sul' },
  { code: 'JP', name: 'Japão' },
  { code: 'FR', name: 'França' },
  { code: 'ES', name: 'Espanha' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'IN', name: 'Índia' },
  { code: 'CN', name: 'China' },
  { code: 'DE', name: 'Alemanha' },
] as const;

/** Streamings mais comuns no Brasil (IDs de provedor do TMDB/JustWatch). */
export const PROVIDERS = [
  { id: 8, name: 'Netflix' },
  { id: 119, name: 'Prime Video' },
  { id: 337, name: 'Disney+' },
  { id: 1899, name: 'Max' },
  { id: 350, name: 'Apple TV+' },
  { id: 307, name: 'Globoplay' },
  { id: 531, name: 'Paramount+' },
  { id: 283, name: 'Crunchyroll' },
] as const;

export const YEAR_RANGES = [
  { slug: 'recentes', name: 'Últimos 12 meses' },
  { slug: '2020s', name: 'Anos 2020', from: '2020-01-01', to: '2029-12-31' },
  { slug: '2010s', name: 'Anos 2010', from: '2010-01-01', to: '2019-12-31' },
  { slug: '2000s', name: 'Anos 2000', from: '2000-01-01', to: '2009-12-31' },
  { slug: '1990s', name: 'Anos 1990', from: '1990-01-01', to: '1999-12-31' },
  { slug: 'classicos', name: 'Antes de 1990', from: '1900-01-01', to: '1989-12-31' },
] as const;

export const SORTS = [
  { slug: 'populares', name: 'Mais populares' },
  { slug: 'nota', name: 'Mais bem avaliados' },
  { slug: 'recentes', name: 'Mais recentes' },
] as const;

export const MIN_SCORES = [6, 7, 8] as const;

export type TypeFilter = MediaType | 'tudo';

export const TYPE_FILTERS: Array<{ value: TypeFilter; label: string }> = [
  { value: 'tudo', label: 'Tudo' },
  { value: 'filme', label: 'Filmes' },
  { value: 'serie', label: 'Séries' },
  { value: 'anime', label: 'Animes' },
  { value: 'dorama', label: 'Doramas' },
];

/** Filtros do Explorar, já validados (vêm da URL). */
export interface CatalogFilters {
  tipo: TypeFilter;
  genero?: string;
  pais?: string;
  ano?: string;
  onde?: number;
  nota?: number;
  brasil?: boolean;
  ordem: (typeof SORTS)[number]['slug'];
  lista?: string;
}

/** Listas do cofre: atalhos para combinações de filtros. */
export interface VaultList {
  slug: string;
  name: string;
  description: string;
  filters: Partial<CatalogFilters>;
  /** Palavra-chave do TMDB, buscada pelo nome na hora (ex.: "twist ending"). */
  keyword?: string;
  /** Mínimo de votos, para a lista não trazer títulos obscuros. */
  minVotes?: number;
}

export const VAULT_LISTS: VaultList[] = [
  {
    slug: 'plot-twists',
    name: 'Plot twists que mudam tudo',
    description: 'Filmes com aquela virada que faz você querer ver de novo.',
    filters: { tipo: 'filme', ordem: 'nota' },
    keyword: 'twist ending',
    minVotes: 500,
  },
  {
    slug: 'para-maratonar',
    name: 'Para maratonar no fim de semana',
    description: 'Séries muito bem avaliadas para começar hoje.',
    filters: { tipo: 'serie', nota: 8, ordem: 'populares' },
    minVotes: 500,
  },
  {
    slug: 'terror-psicologico',
    name: 'Terror psicológico',
    description: 'Terror com suspense, mais tensão do que susto.',
    filters: { tipo: 'filme', genero: 'terror', ordem: 'nota' },
    keyword: 'psychological horror',
    minVotes: 300,
  },
  {
    slug: 'animes-para-comecar',
    name: 'Animes para começar',
    description: 'Os animes mais bem avaliados por quem já assistiu muito.',
    filters: { tipo: 'anime', ordem: 'nota' },
    minVotes: 1000,
  },
];

const TYPE_VALUES = new Set<string>(TYPE_FILTERS.map((t) => t.value));

/** Lê os filtros da URL, ignorando qualquer valor inválido. */
export function parseFilters(params: Record<string, string | string[] | undefined>): CatalogFilters {
  const get = (k: string) => {
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const tipo = get('tipo');
  const genero = get('genero');
  const pais = get('pais');
  const ano = get('ano');
  const onde = Number(get('onde'));
  const nota = Number(get('nota'));
  const ordem = get('ordem');
  const lista = get('lista');

  // Uma lista do cofre preenche os filtros que a pessoa não escolheu na URL.
  const preset = VAULT_LISTS.find((l) => l.slug === lista)?.filters ?? {};

  return {
    tipo: tipo && TYPE_VALUES.has(tipo) ? (tipo as TypeFilter) : preset.tipo ?? 'tudo',
    genero: GENRES.some((g) => g.slug === genero) ? genero : preset.genero,
    pais: COUNTRIES.some((c) => c.code === pais) ? pais : preset.pais,
    ano: YEAR_RANGES.some((y) => y.slug === ano) ? ano : preset.ano,
    onde: PROVIDERS.some((p) => p.id === onde) ? onde : preset.onde,
    nota: (MIN_SCORES as readonly number[]).includes(nota) ? nota : preset.nota,
    brasil: get('brasil') === '1' || preset.brasil || undefined,
    ordem: SORTS.some((s) => s.slug === ordem) ? (ordem as CatalogFilters['ordem']) : preset.ordem ?? 'populares',
    lista: VAULT_LISTS.some((l) => l.slug === lista) ? lista : undefined,
  };
}

/** Converte filtros de volta para a URL (sem os valores padrão). */
export function filtersToSearch(f: Partial<CatalogFilters>): URLSearchParams {
  const p = new URLSearchParams();
  if (f.lista) p.set('lista', f.lista);
  if (f.tipo && f.tipo !== 'tudo') p.set('tipo', f.tipo);
  if (f.genero) p.set('genero', f.genero);
  if (f.pais) p.set('pais', f.pais);
  if (f.ano) p.set('ano', f.ano);
  if (f.onde) p.set('onde', String(f.onde));
  if (f.nota) p.set('nota', String(f.nota));
  if (f.brasil) p.set('brasil', '1');
  if (f.ordem && f.ordem !== 'populares') p.set('ordem', f.ordem);
  return p;
}
