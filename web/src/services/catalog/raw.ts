/**
 * Formato das respostas da API v3 do TMDB (só os campos que usamos).
 * Referência: https://developer.themoviedb.org/reference
 */

export interface RawGenre { id: number; name: string }

export interface RawListItem {
  id: number;
  media_type?: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  original_language?: string;
  origin_country?: string[];
  poster_path?: string | null;
  backdrop_path?: string | null;
  profile_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  overview?: string;
  genre_ids?: number[];
  release_date?: string;
  first_air_date?: string;
  known_for_department?: string;
  known_for?: RawListItem[];
}

export interface RawPage<T = RawListItem> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface RawCast {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
  /** aggregate_credits (séries) usa roles[] no lugar de character. */
  roles?: Array<{ character: string; episode_count: number }>;
  total_episode_count?: number;
}

export interface RawCrew {
  id: number;
  name: string;
  job?: string;
  department?: string;
  jobs?: Array<{ job: string; episode_count: number }>;
}

export interface RawVideo { key: string; name: string; site: string; type: string; official?: boolean; iso_639_1?: string }

export interface RawProvider { provider_id: number; provider_name: string; logo_path?: string | null; display_priority?: number }

export interface RawProvidersForRegion {
  link?: string;
  flatrate?: RawProvider[];
  rent?: RawProvider[];
  buy?: RawProvider[];
  free?: RawProvider[];
  ads?: RawProvider[];
}

export interface RawTitleDetail extends RawListItem {
  genres?: RawGenre[];
  tagline?: string;
  runtime?: number | null;
  episode_run_time?: number[];
  production_countries?: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages?: Array<{ iso_639_1: string; name: string; english_name?: string }>;
  production_companies?: Array<{ id: number; name: string }>;
  created_by?: Array<{ id: number; name: string }>;
  number_of_seasons?: number;
  number_of_episodes?: number;
  last_air_date?: string | null;
  status?: string;
  seasons?: Array<{ season_number: number; name: string; episode_count: number; air_date?: string | null; poster_path?: string | null }>;
  belongs_to_collection?: { id: number; name: string } | null;
  credits?: { cast: RawCast[]; crew: RawCrew[] };
  aggregate_credits?: { cast: RawCast[]; crew: RawCrew[] };
  videos?: { results: RawVideo[] };
  recommendations?: RawPage;
  similar?: RawPage;
  release_dates?: { results: Array<{ iso_3166_1: string; release_dates: Array<{ certification: string; type: number }> }> };
  content_ratings?: { results: Array<{ iso_3166_1: string; rating: string }> };
  'watch/providers'?: { results: Record<string, RawProvidersForRegion> };
}

export interface RawSeason {
  season_number: number;
  name: string;
  episodes: Array<{
    episode_number: number;
    name: string;
    runtime?: number | null;
    air_date?: string | null;
    still_path?: string | null;
    vote_average?: number;
    overview?: string;
  }>;
}

export interface RawCollection { id: number; name: string; parts: RawListItem[] }

export interface RawPersonCredit extends RawListItem {
  character?: string;
  job?: string;
  department?: string;
}

export interface RawPerson {
  id: number;
  name: string;
  known_for_department?: string;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  biography?: string;
  profile_path?: string | null;
  combined_credits?: { cast: RawPersonCredit[]; crew: RawPersonCredit[] };
}
