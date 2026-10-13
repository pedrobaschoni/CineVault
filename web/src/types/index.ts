/**
 * Tipos de domínio do CineVault.
 * O catálogo (TitleSummary, TitleDetail, PersonDetail) vem do TMDB via
 * src/services/catalog. Os dados do usuário (Rating, DiaryEntry, UserList)
 * chegam na Fase 3.
 */

/** Como o CineVault classifica um título. */
export type MediaType = 'filme' | 'serie' | 'anime' | 'dorama';

/** Como o TMDB guarda o título: filme ou programa de TV. */
export type TmdbKind = 'movie' | 'tv';

/** O mínimo para mostrar um título num card, numa lista ou na busca. */
export interface TitleSummary {
  id: number;
  kind: TmdbKind;
  type: MediaType;
  title: string;
  year?: number;
  posterUrl?: string;
  backdropUrl?: string;
  /** Nota do público no TMDB, de 0 a 10. */
  score?: number;
  voteCount?: number;
  overview?: string;
  genreIds: number[];
  popularity?: number;
  /** Data de lançamento (filme) ou de estreia (série), AAAA-MM-DD. */
  date?: string;
  /** Link interno: /titulo/{type}/{id}-{slug}. */
  href: string;
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profileUrl?: string;
  href: string;
}

export interface CrewCredit {
  id: number;
  name: string;
  href: string;
}

export interface Video {
  key: string;
  name: string;
  type: string;
}

export interface Provider {
  id: number;
  name: string;
  logoUrl?: string;
}

export interface WatchProviders {
  /** Página do JustWatch/TMDB com os links de cada serviço. */
  link?: string;
  flatrate: Provider[];
  rent: Provider[];
  buy: Provider[];
}

export interface SeasonSummary {
  number: number;
  name: string;
  episodeCount: number;
  year?: number;
  posterUrl?: string;
}

export interface Episode {
  number: number;
  name: string;
  runtime?: number;
  date?: string;
  stillUrl?: string;
  score?: number;
  overview?: string;
}

export interface SeasonDetail {
  number: number;
  name: string;
  episodes: Episode[];
}

export interface TitleDetail extends TitleSummary {
  originalTitle?: string;
  tagline?: string;
  genres: Array<{ id: number; name: string }>;
  /** Filme: duração em minutos. Série: duração típica do episódio. */
  runtime?: number;
  /** Classificação indicativa no Brasil, ex.: "14". */
  certification?: string;
  countries: string[];
  languages: string[];
  studios: string[];
  /** Direção (filme) ou criação (série). */
  directors: CrewCredit[];
  writers: CrewCredit[];
  cast: CastMember[];
  videos: Video[];
  recommendations: TitleSummary[];
  providers: WatchProviders;
  collection?: { id: number; name: string; parts: TitleSummary[] };
  seasons: SeasonSummary[];
  seasonCount?: number;
  episodeCount?: number;
  /** Ano final da série, se ela terminou. */
  endYear?: number;
}

export interface PersonCredit {
  title: TitleSummary;
  /** Funções nesse título: "Atuação", "Direção", "Roteiro"... */
  roles: string[];
  character?: string;
}

export interface PersonDetail {
  id: number;
  name: string;
  /** Área mais conhecida: "Atuação", "Direção"... */
  department?: string;
  birthday?: string;
  deathday?: string;
  placeOfBirth?: string;
  biography?: string;
  profileUrl?: string;
  knownFor: TitleSummary[];
  credits: PersonCredit[];
}

export interface PersonSummary {
  id: number;
  name: string;
  department?: string;
  profileUrl?: string;
  knownFor?: string;
  href: string;
}

export interface SearchResults {
  titles: TitleSummary[];
  people: PersonSummary[];
}

export interface Page<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

/* ---------- Dados do usuário ---------- */

/** Referência a um título guardada junto com os dados do usuário (para mostrar sem buscar de novo). */
export interface TitleRef {
  /** "movie:693134" ou "tv:94605". */
  key: string;
  id: number;
  kind: TmdbKind;
  type: MediaType;
  title: string;
  year?: number;
  posterUrl?: string;
  href: string;
}

/** Uma sessão no diário: quando assistiu, nota e opinião. */
export interface DiaryEntry {
  id: string;
  title: TitleRef;
  /** AAAA-MM-DD */
  watchedOn: string;
  rewatch: boolean;
  /** De 0,5 a 5. */
  rating?: number;
  review?: string;
  spoiler?: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** Registro de um episódio: visto, com nota e opinião opcionais. */
export interface EpisodeLog {
  /** "tv:94605:s2e4" */
  key: string;
  title: TitleRef;
  season: number;
  episode: number;
  episodeName?: string;
  watchedOn: string;
  rating?: number;
  review?: string;
  spoiler?: boolean;
}

export type ListKind = 'quero-ver' | 'favoritos';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}
