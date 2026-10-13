import 'server-only';
import { demoGet } from './demo';
import { TmdbError } from './errors';

export { TmdbError };

/**
 * Cliente da API v3 do TMDB. Só roda no servidor: o token nunca chega ao navegador.
 *
 * Aceita as duas credenciais que o TMDB oferece em Configurações › API:
 *  - TMDB_API_TOKEN: "token de leitura da API" (recomendado, vai no cabeçalho)
 *  - TMDB_API_KEY:   "chave da API" (v3, vai na URL)
 * Sem nenhuma das duas, o site entra no modo demonstração (dados locais).
 */

const BASE = 'https://api.themoviedb.org/3';

export function isDemoMode(): boolean {
  return !process.env.TMDB_API_TOKEN && !process.env.TMDB_API_KEY;
}

type Params = Record<string, string | number | boolean | undefined>;

interface GetOptions {
  /** Segundos que a resposta fica em cache. Padrão: 1 hora. */
  revalidate?: number;
}

export async function tmdbGet<T>(path: string, params: Params = {}, { revalidate = 3600 }: GetOptions = {}): Promise<T> {
  const query: Record<string, string> = { language: 'pt-BR' };
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') query[k] = String(v);

  if (isDemoMode()) return demoGet(path, query) as T;

  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);

  const headers: Record<string, string> = { accept: 'application/json' };
  if (process.env.TMDB_API_TOKEN) headers.authorization = `Bearer ${process.env.TMDB_API_TOKEN}`;
  else url.searchParams.set('api_key', process.env.TMDB_API_KEY!);

  let res: Response;
  try {
    res = await fetch(url, { headers, next: { revalidate } });
  } catch {
    throw new TmdbError(503, 'O catálogo não respondeu.');
  }

  if (res.status === 404) throw new TmdbError(404, 'Não encontrado no catálogo.');
  if (res.status === 401) throw new TmdbError(401, 'O token do TMDB foi recusado. Confira TMDB_API_TOKEN no .env.local.');
  if (!res.ok) throw new TmdbError(res.status, `O catálogo respondeu com erro ${res.status}.`);
  return (await res.json()) as T;
}
