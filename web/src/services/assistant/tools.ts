import 'server-only';
import { formatRating, MEDIA_LABEL } from '@/lib/format';
import { discover, getTitle, getTrending, search } from '@/services/catalog';
import { COUNTRIES, GENRES, GENRE_NAME, PROVIDERS, YEAR_RANGES, type CatalogFilters, type TypeFilter } from '@/services/catalog/taxonomy';
import type { TitleSummary, TmdbKind } from '@/types';
import type { SuggestedTitle } from './types';

/**
 * Ferramentas que a IA pode chamar. Todas leem o catálogo real (TMDB ou o modo
 * demonstração), então os títulos sugeridos sempre existem e têm página no site.
 */

/** Títulos vistos nesta resposta, pela chave ("movie:693134"). Só eles viram cartões. */
export type Seen = Map<string, SuggestedTitle>;

export function toSuggested(t: TitleSummary): SuggestedTitle {
  return { key: `${t.kind}:${t.id}`, id: t.id, kind: t.kind, type: t.type, title: t.title, year: t.year, posterUrl: t.posterUrl, score: t.score, href: t.href };
}

/** Versão curta de um título para a IA ler (menos texto, resposta mais rápida e barata). */
function brief(t: TitleSummary, seen: Seen) {
  seen.set(`${t.kind}:${t.id}`, toSuggested(t));
  return {
    chave: `${t.kind}:${t.id}`,
    titulo: t.title,
    tipo: MEDIA_LABEL[t.type],
    ano: t.year,
    nota: t.score ? formatRating(t.score) : undefined,
    generos: t.genreIds.map((g) => GENRE_NAME[g]).filter(Boolean).slice(0, 3),
    sinopse: t.overview ? t.overview.slice(0, 220) : undefined,
  };
}

function parseKey(chave: unknown): { kind: TmdbKind; id: number } | null {
  const m = /^(movie|tv):(\d+)$/.exec(String(chave ?? ''));
  return m ? { kind: m[1] as TmdbKind, id: Number(m[2]) } : null;
}

const TYPES = ['tudo', 'filme', 'serie', 'anime', 'dorama'] as const;

/** Definições no formato de "tools" da API compatível com OpenAI. */
export const TOOL_DEFS = [
  {
    type: 'function',
    function: {
      name: 'buscar_titulos',
      description: 'Procura filmes, séries, animes e doramas pelo nome. Use para achar um título que a pessoa citou.',
      parameters: {
        type: 'object',
        properties: { consulta: { type: 'string', description: 'Nome do título, como a pessoa escreveu.' } },
        required: ['consulta'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'parecidos',
      description: 'Títulos recomendados para quem gostou de um título. Use a chave que veio de buscar_titulos.',
      parameters: {
        type: 'object',
        properties: { chave: { type: 'string', description: 'Ex.: "movie:157336" ou "tv:1396".' } },
        required: ['chave'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'descobrir',
      description: 'Lista títulos por tipo, gênero, país, década, streaming e nota mínima. Use para pedidos como "um terror bom", "anime curto", "algo na Netflix".',
      parameters: {
        type: 'object',
        properties: {
          tipo: { type: 'string', enum: TYPES },
          genero: { type: 'string', enum: GENRES.map((g) => g.slug) },
          pais: { type: 'string', enum: COUNTRIES.map((c) => c.code) },
          decada: { type: 'string', enum: YEAR_RANGES.map((y) => y.slug) },
          streaming: { type: 'string', enum: PROVIDERS.map((p) => p.name) },
          nota_minima: { type: 'number', enum: [6, 7, 8] },
          ordem: { type: 'string', enum: ['populares', 'nota', 'recentes'] },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'em_alta',
      description: 'O que está mais em alta nesta semana.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'detalhes',
      description: 'Detalhes de um título: sinopse, duração, temporadas e onde assistir no Brasil.',
      parameters: {
        type: 'object',
        properties: { chave: { type: 'string' } },
        required: ['chave'],
      },
    },
  },
] as const;

type Args = Record<string, unknown>;

/** Executa uma ferramenta e devolve o resultado em JSON (texto) para a IA. */
export async function runTool(name: string, args: Args, seen: Seen): Promise<string> {
  try {
    const result = await dispatch(name, args, seen);
    return JSON.stringify(result);
  } catch (error) {
    console.error(`[assistente] ferramenta ${name} falhou`, error);
    return JSON.stringify({ erro: 'Não foi possível consultar o catálogo agora.' });
  }
}

async function dispatch(name: string, args: Args, seen: Seen) {
  switch (name) {
    case 'buscar_titulos': {
      const q = String(args.consulta ?? '').slice(0, 100);
      if (!q) return { resultados: [] };
      const { results } = await search(q);
      return { resultados: results.slice(0, 6).map((t) => brief(t, seen)) };
    }
    case 'parecidos': {
      const ref = parseKey(args.chave);
      if (!ref) return { erro: 'Chave inválida. Use buscar_titulos antes.' };
      const d = await getTitle(ref.kind, ref.id);
      return { base: d.title, resultados: d.recommendations.slice(0, 8).map((t) => brief(t, seen)) };
    }
    case 'descobrir': {
      const tipo = TYPES.includes(args.tipo as TypeFilter) ? (args.tipo as TypeFilter) : 'tudo';
      const provider = PROVIDERS.find((p) => p.name === args.streaming);
      const filters: CatalogFilters = {
        tipo,
        genero: GENRES.some((g) => g.slug === args.genero) ? String(args.genero) : undefined,
        pais: COUNTRIES.some((c) => c.code === args.pais) ? String(args.pais) : undefined,
        ano: YEAR_RANGES.some((y) => y.slug === args.decada) ? String(args.decada) : undefined,
        onde: provider?.id,
        nota: [6, 7, 8].includes(Number(args.nota_minima)) ? Number(args.nota_minima) : undefined,
        ordem: (['populares', 'nota', 'recentes'] as const).find((o) => o === args.ordem) ?? 'populares',
      };
      const { results } = await discover(filters);
      return { resultados: results.slice(0, 8).map((t) => brief(t, seen)) };
    }
    case 'em_alta': {
      const week = await getTrending('week');
      return { resultados: week.slice(0, 10).map((t) => brief(t, seen)) };
    }
    case 'detalhes': {
      const ref = parseKey(args.chave);
      if (!ref) return { erro: 'Chave inválida.' };
      const d = await getTitle(ref.kind, ref.id);
      brief(d, seen);
      return {
        chave: `${d.kind}:${d.id}`,
        titulo: d.title,
        tipo: MEDIA_LABEL[d.type],
        ano: d.year,
        nota: d.score ? formatRating(d.score) : undefined,
        generos: d.genres.map((g) => g.name),
        duracao_min: d.runtime,
        temporadas: d.seasonCount,
        sinopse: d.overview?.slice(0, 500),
        onde_assistir: d.providers.flatrate.map((p) => p.name),
      };
    }
    default:
      return { erro: `Ferramenta desconhecida: ${name}` };
  }
}
