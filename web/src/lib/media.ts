import type { MediaType, TitleRef, TitleSummary } from '@/types';

/** Referência compacta a um título, guardada junto com o diário e as listas. */
export function makeTitleRef(t: Pick<TitleSummary, 'id' | 'kind' | 'type' | 'title' | 'year' | 'posterUrl' | 'href'>): TitleRef {
  return { key: `${t.kind}:${t.id}`, id: t.id, kind: t.kind, type: t.type, title: t.title, year: t.year, posterUrl: t.posterUrl, href: t.href };
}

/** "Duna: Parte Dois" → "duna-parte-dois" */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function titleHref(type: MediaType, id: number, title: string): string {
  const slug = slugify(title);
  return `/titulo/${type}/${id}${slug ? `-${slug}` : ''}`;
}

export function personHref(id: number, name: string): string {
  const slug = slugify(name);
  return `/pessoa/${id}${slug ? `-${slug}` : ''}`;
}

/** "693134-duna-parte-dois" → 693134 (ou null se não começar com número). */
export function parseIdParam(param: string): number | null {
  const match = /^(\d+)/.exec(param);
  return match ? Number(match[1]) : null;
}

const TMDB_IMG = 'https://image.tmdb.org/t/p';

export function tmdbImage(path: string | null | undefined, size: 'w92' | 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' | 'h632'): string | undefined {
  return path ? `${TMDB_IMG}/${size}${path}` : undefined;
}

/**
 * Cor escura e estável para quando não há pôster: o mesmo título
 * sempre ganha a mesma cor, escolhida de uma paleta que combina com o site.
 */
const POSTER_TINTS = ['#3a2b47', '#2c3f45', '#4a2a33', '#23304d', '#4a3622', '#2b2440', '#1f2a26', '#3b1f1f', '#3d2e1f', '#1f2a3d'];

export function posterColor(seed: number | string): string {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return POSTER_TINTS[h % POSTER_TINTS.length];
}

/** 166 → "2h 46min" */
export function formatRuntime(minutes?: number): string | undefined {
  if (!minutes) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h${m ? ` ${String(m).padStart(2, '0')}min` : ''}` : `${m}min`;
}

const MESES_LONGOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** "1967-10-03" → "3 out 1967" (lendo a string, sem fuso horário). */
export function formatLongDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y) return undefined;
  if (!m || !d) return String(y);
  return `${d} ${MESES_LONGOS[m - 1]} ${y}`;
}

export function yearOf(iso?: string | null): number | undefined {
  const y = iso ? Number(iso.slice(0, 4)) : NaN;
  return Number.isFinite(y) && y > 1800 ? y : undefined;
}
