/**
 * Converte as respostas do TMDB para os tipos do CineVault.
 * Tudo que é regra de negócio sobre o catálogo (o que é anime, o que é
 * dorama, qual vídeo é o trailer) mora aqui, num lugar só.
 */
import type {
  CastMember, CrewCredit, Episode, MediaType, PersonCredit, PersonDetail, PersonSummary,
  Provider, SeasonDetail, TitleDetail, TitleSummary, TmdbKind, Video, WatchProviders,
} from '@/types';
import { personHref, titleHref, tmdbImage, yearOf } from '@/lib/media';
import type { RawCollection, RawListItem, RawPerson, RawPersonCredit, RawProvider, RawSeason, RawTitleDetail } from './raw';

const ANIMATION = 16;
const DORAMA_COUNTRIES = new Set(['KR', 'CN', 'TW', 'TH', 'JP', 'HK']);
const DORAMA_LANGS = new Set(['ko', 'zh', 'cn', 'th', 'ja']);

/**
 * Filme → filme. Série animada japonesa → anime.
 * Série asiática com atores (Coreia, Japão, China, Tailândia) → dorama.
 * Resto → série.
 */
export function classify(kind: TmdbKind, raw: Pick<RawListItem, 'genre_ids' | 'origin_country' | 'original_language'> & { genres?: Array<{ id: number }> }): MediaType {
  if (kind === 'movie') return 'filme';
  const genres = raw.genre_ids ?? raw.genres?.map((g) => g.id) ?? [];
  const countries = raw.origin_country ?? [];
  const lang = raw.original_language ?? '';
  const animated = genres.includes(ANIMATION);
  if (animated && (countries.includes('JP') || lang === 'ja')) return 'anime';
  if (!animated && (countries.some((c) => DORAMA_COUNTRIES.has(c)) || DORAMA_LANGS.has(lang))) return 'dorama';
  return 'serie';
}

function kindOf(raw: RawListItem, fallback?: TmdbKind): TmdbKind | null {
  if (raw.media_type === 'movie' || raw.media_type === 'tv') return raw.media_type;
  if (raw.media_type === 'person') return null;
  if (fallback) return fallback;
  return raw.title !== undefined ? 'movie' : 'tv';
}

/** Item de lista/busca → TitleSummary. Devolve null para pessoas. */
export function toSummary(raw: RawListItem, fallbackKind?: TmdbKind): TitleSummary | null {
  const kind = kindOf(raw, fallbackKind);
  if (!kind) return null;
  const title = (kind === 'movie' ? raw.title : raw.name) ?? raw.title ?? raw.name ?? 'Sem título';
  const date = (kind === 'movie' ? raw.release_date : raw.first_air_date) || undefined;
  const type = classify(kind, raw as RawTitleDetail);
  return {
    id: raw.id,
    kind,
    type,
    title,
    year: yearOf(date),
    date,
    posterUrl: tmdbImage(raw.poster_path, 'w500'),
    backdropUrl: tmdbImage(raw.backdrop_path, 'w1280'),
    score: raw.vote_count ? raw.vote_average : undefined,
    voteCount: raw.vote_count,
    overview: raw.overview || undefined,
    genreIds: raw.genre_ids ?? (raw as RawTitleDetail).genres?.map((g) => g.id) ?? [],
    popularity: raw.popularity,
    href: titleHref(type, raw.id, title),
  };
}

export function toSummaries(items: RawListItem[] | undefined, fallbackKind?: TmdbKind): TitleSummary[] {
  return (items ?? []).map((i) => toSummary(i, fallbackKind)).filter((t): t is TitleSummary => t !== null);
}

export function toPersonSummary(raw: RawListItem): PersonSummary {
  const known = raw.known_for?.map((k) => k.title ?? k.name).filter(Boolean).slice(0, 2).join(', ');
  return {
    id: raw.id,
    name: raw.name ?? '',
    department: departmentName(raw.known_for_department),
    profileUrl: tmdbImage(raw.profile_path, 'w185'),
    knownFor: known || undefined,
    href: personHref(raw.id, raw.name ?? ''),
  };
}

const DEPARTMENTS: Record<string, string> = {
  Acting: 'Atuação', Directing: 'Direção', Writing: 'Roteiro', Production: 'Produção',
  Sound: 'Som', Camera: 'Fotografia', Editing: 'Montagem', Art: 'Direção de arte',
  'Costume & Make-Up': 'Figurino e maquiagem', 'Visual Effects': 'Efeitos visuais', Crew: 'Equipe', Creator: 'Criação',
};

const JOBS: Record<string, string> = {
  Director: 'Direção', Screenplay: 'Roteiro', Writer: 'Roteiro', Novel: 'Livro', Story: 'Argumento',
  Producer: 'Produção', 'Executive Producer': 'Produção executiva', 'Original Music Composer': 'Música',
  'Director of Photography': 'Fotografia', Editor: 'Montagem', Creator: 'Criação', Teleplay: 'Roteiro',
};

export function departmentName(dep?: string): string | undefined {
  return dep ? DEPARTMENTS[dep] ?? dep : undefined;
}

function crew(id: number, name: string): CrewCredit {
  return { id, name, href: personHref(id, name) };
}

function uniqueById<T extends { id: number }>(list: T[]): T[] {
  const seen = new Set<number>();
  return list.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)));
}

function mapProviders(list?: RawProvider[]): Provider[] {
  return (list ?? [])
    .slice()
    .sort((a, b) => (a.display_priority ?? 99) - (b.display_priority ?? 99))
    .map((p) => ({ id: p.provider_id, name: p.provider_name, logoUrl: tmdbImage(p.logo_path, 'w92') }));
}

/** Trailer oficial primeiro, depois teasers, depois o resto (só YouTube). */
function mapVideos(raw?: RawTitleDetail['videos']): Video[] {
  const rank = (type: string) => ({ Trailer: 0, Teaser: 1, Clip: 2, Featurette: 3, 'Behind the Scenes': 4 })[type] ?? 5;
  return (raw?.results ?? [])
    .filter((v) => v.site === 'YouTube')
    .sort((a, b) => rank(a.type) - rank(b.type) || Number(b.official ?? false) - Number(a.official ?? false))
    .map((v) => ({ key: v.key, name: v.name, type: v.type }));
}

export function toDetail(raw: RawTitleDetail, kind: TmdbKind, collection?: RawCollection): TitleDetail {
  const summary = toSummary({ ...raw, genre_ids: raw.genres?.map((g) => g.id) }, kind)!;
  const credits = kind === 'tv' ? raw.aggregate_credits ?? raw.credits : raw.credits;

  const cast: CastMember[] = (credits?.cast ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .slice(0, 12)
    .map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character || c.roles?.[0]?.character || undefined,
      profileUrl: tmdbImage(c.profile_path, 'w185'),
      href: personHref(c.id, c.name),
    }));

  const jobOf = (c: { job?: string; jobs?: Array<{ job: string }> }) => [c.job, ...(c.jobs ?? []).map((j) => j.job)].filter(Boolean) as string[];
  const allCrew = credits?.crew ?? [];
  const directors = kind === 'tv'
    ? (raw.created_by ?? []).map((c) => crew(c.id, c.name))
    : uniqueById(allCrew.filter((c) => jobOf(c).includes('Director')).map((c) => crew(c.id, c.name)));
  const writers = uniqueById(
    allCrew.filter((c) => jobOf(c).some((j) => ['Screenplay', 'Writer', 'Teleplay'].includes(j))).map((c) => crew(c.id, c.name)),
  ).slice(0, 4);

  const br = raw['watch/providers']?.results?.BR;
  const providers: WatchProviders = {
    link: br?.link,
    flatrate: mapProviders([...(br?.flatrate ?? []), ...(br?.free ?? []), ...(br?.ads ?? [])]),
    rent: mapProviders(br?.rent),
    buy: mapProviders(br?.buy),
  };

  const certification =
    kind === 'movie'
      ? raw.release_dates?.results.find((r) => r.iso_3166_1 === 'BR')?.release_dates.find((d) => d.certification)?.certification
      : raw.content_ratings?.results.find((r) => r.iso_3166_1 === 'BR')?.rating;

  const recs = toSummaries(raw.recommendations?.results, kind);
  const recommendations = (recs.length ? recs : toSummaries(raw.similar?.results, kind)).slice(0, 10);

  return {
    ...summary,
    overview: raw.overview || undefined,
    originalTitle: (kind === 'movie' ? raw.original_title : raw.original_name) || undefined,
    tagline: raw.tagline || undefined,
    genres: (raw.genres ?? []).map((g) => ({ id: g.id, name: g.name })),
    runtime: (kind === 'movie' ? raw.runtime : raw.episode_run_time?.[0]) ?? undefined,
    certification: certification || undefined,
    countries: (raw.production_countries ?? []).map((c) => c.name),
    languages: (raw.spoken_languages ?? []).map((l) => l.name || l.english_name || l.iso_639_1),
    studios: (raw.production_companies ?? []).slice(0, 3).map((c) => c.name),
    directors,
    writers,
    cast,
    videos: mapVideos(raw.videos),
    recommendations,
    providers,
    collection: collection && collection.parts.length > 1
      ? {
          id: collection.id,
          name: collection.name,
          parts: toSummaries(collection.parts, 'movie').sort((a, b) => (a.date ?? '9').localeCompare(b.date ?? '9')),
        }
      : undefined,
    seasons: (raw.seasons ?? [])
      .filter((s) => s.season_number > 0 && s.episode_count > 0)
      .map((s) => ({
        number: s.season_number,
        name: s.name,
        episodeCount: s.episode_count,
        year: yearOf(s.air_date),
        posterUrl: tmdbImage(s.poster_path, 'w185'),
      })),
    seasonCount: raw.number_of_seasons,
    episodeCount: raw.number_of_episodes,
    endYear: raw.status === 'Ended' || raw.status === 'Canceled' ? yearOf(raw.last_air_date) : undefined,
  };
}

export function toSeason(raw: RawSeason): SeasonDetail {
  return {
    number: raw.season_number,
    name: raw.name,
    episodes: raw.episodes.map(
      (e): Episode => ({
        number: e.episode_number,
        name: e.name,
        runtime: e.runtime ?? undefined,
        date: e.air_date ?? undefined,
        stillUrl: tmdbImage(e.still_path, 'w342'),
        score: e.vote_average || undefined,
        overview: e.overview || undefined,
      }),
    ),
  };
}

export function toPerson(raw: RawPerson): PersonDetail {
  const byTitle = new Map<string, PersonCredit>();
  const add = (c: RawPersonCredit, role: string) => {
    const title = toSummary(c);
    if (!title) return;
    const key = `${title.kind}-${title.id}`;
    const existing = byTitle.get(key);
    if (existing) {
      if (!existing.roles.includes(role)) existing.roles.push(role);
      if (role === 'Atuação' && c.character && !existing.character) existing.character = c.character;
    } else {
      byTitle.set(key, { title, roles: [role], character: role === 'Atuação' ? c.character || undefined : undefined });
    }
  };

  // Participações como "ele mesmo" em programas de entrevista poluem a filmografia.
  const isSelf = (c: RawPersonCredit) => /^(self|himself|herself|ele mesmo|ela mesma)/i.test(c.character ?? '') || c.genre_ids?.some((g) => g === 10767 || g === 10763);
  for (const c of raw.combined_credits?.cast ?? []) if (!isSelf(c)) add(c, 'Atuação');
  for (const c of raw.combined_credits?.crew ?? []) add(c, JOBS[c.job ?? ''] ?? departmentName(c.department) ?? 'Equipe');

  const credits = [...byTitle.values()].sort((a, b) => (b.title.date ?? '0').localeCompare(a.title.date ?? '0'));

  const department = departmentName(raw.known_for_department);
  const relevant = credits.filter((c) => !department || c.roles.includes(department) || department === 'Atuação');
  const knownFor = [...(relevant.length ? relevant : credits)]
    .sort((a, b) => (b.title.voteCount ?? 0) - (a.title.voteCount ?? 0))
    .slice(0, 6)
    .map((c) => c.title);

  return {
    id: raw.id,
    name: raw.name,
    department,
    birthday: raw.birthday ?? undefined,
    deathday: raw.deathday ?? undefined,
    placeOfBirth: raw.place_of_birth ?? undefined,
    biography: raw.biography || undefined,
    profileUrl: tmdbImage(raw.profile_path, 'h632'),
    knownFor,
    credits,
  };
}
