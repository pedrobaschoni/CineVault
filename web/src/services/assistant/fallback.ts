import 'server-only';
import { discover, getTitle, getTrending, search } from '@/services/catalog';
import { GENRES, type CatalogFilters, type TypeFilter } from '@/services/catalog/taxonomy';
import type { TitleSummary } from '@/types';
import { toSuggested } from './tools';
import type { AssistantResponse, TasteProfile } from './types';

/**
 * Modo simples: funciona sem chave de IA, entendendo alguns pedidos comuns por
 * palavras-chave. Bom o bastante para testar o chat e para o site nunca ficar
 * sem resposta; a conversa de verdade vem com a IA configurada.
 */

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const GENRE_WORDS: Array<[RegExp, string]> = [
  [/terror|horror|medo|assustador/, 'terror'],
  [/comedia|engracad|rir|leve|divertid/, 'comedia'],
  [/acao|tiro|luta|adrenalina/, 'acao'],
  [/romance|romantic|apaixon|amor/, 'romance'],
  [/ficcao|sci.?fi|espaco|futur|alien/, 'ficcao'],
  [/suspense|tensao|thriller/, 'suspense'],
  [/drama|chorar|emocionante/, 'drama'],
  [/documentario/, 'documentario'],
  [/misterio|investigac|detetive/, 'misterio'],
  [/fantasia|magia|dragao/, 'fantasia'],
  [/crime|policial|mafia/, 'crime'],
  [/guerra/, 'guerra'],
  [/faroeste|velho oeste/, 'faroeste'],
  [/famil|crianca|infantil/, 'familia'],
  [/aventura/, 'aventura'],
];

const TYPE_WORDS: Array<[RegExp, TypeFilter]> = [
  [/\banimes?\b/, 'anime'],
  [/\bdoramas?\b|k-?drama/, 'dorama'],
  [/\bseries?\b|temporada|maratonar/, 'serie'],
  [/\bfilmes?\b/, 'filme'],
];

/** Trechos que costumam vir antes do nome de um título: "parecido com X", "vi X". */
const TITLE_CUES = /\b(?:parecid[oa]s? com|igual a|no estilo de|tipo|como|semelhantes? a|gostei de|gostei muito de|amei|adorei|curti|assisti|terminei|vi)\s+(?:o |a |os |as )?["“]?([^"”?!.]+)/i;

const TYPE_NAME: Record<TypeFilter, string> = { tudo: 'títulos', filme: 'filmes', serie: 'séries', anime: 'animes', dorama: 'doramas' };

function unseen(list: TitleSummary[], profile?: TasteProfile) {
  const seen = new Set(profile?.watched.map((w) => w.key));
  return list.filter((t) => !seen.has(`${t.kind}:${t.id}`));
}

async function similarTo(name: string, profile?: TasteProfile): Promise<AssistantResponse | null> {
  const { results } = await search(name.trim().slice(0, 80));
  const base = results[0];
  if (!base) return null;
  const detail = await getTitle(base.kind, base.id);
  const picks = unseen(detail.recommendations, profile).slice(0, 5);
  if (!picks.length) return null;
  return {
    mode: 'simples',
    reply: `Se você curtiu **${detail.title}**, estes têm muito a ver:`,
    titles: picks.map(toSuggested),
  };
}

export async function fallbackReply(text: string, profile?: TasteProfile): Promise<AssistantResponse> {
  const q = norm(text);

  // 1. "Parecido com X", "vi X e amei"
  const cue = TITLE_CUES.exec(text);
  // "vi Interestelar e quero algo parecido" → "Interestelar"
  const cited = cue?.[1].split(/\s+(?:e|mas|que|porque|pois|só que)\s+|,/i)[0].trim();
  const isGenre = cited && [...GENRE_WORDS, ...TYPE_WORDS].some(([re]) => re.test(norm(cited)));
  if (cited && cited.length >= 2 && !isGenre) {
    const found = await similarTo(cited, profile).catch(() => null);
    if (found) return found;
  }

  // 2. Gênero e/ou tipo: "um terror bom", "anime para começar"
  const genre = GENRE_WORDS.find(([re]) => re.test(q))?.[1];
  const tipo = TYPE_WORDS.find(([re]) => re.test(q))?.[1] ?? 'tudo';
  if (genre || tipo !== 'tudo') {
    const filters: CatalogFilters = { tipo, genero: genre, nota: 7, ordem: /recente|novo|lancamento/.test(q) ? 'recentes' : 'nota' };
    const { results } = await discover(filters).catch(() => ({ results: [] as TitleSummary[] }));
    const picks = unseen(results, profile).slice(0, 5);
    if (picks.length) {
      const genreName = GENRES.find((g) => g.slug === genre)?.name.toLowerCase();
      return {
        mode: 'simples',
        reply: `Separei ${TYPE_NAME[tipo]}${genreName ? ` de ${genreName}` : ''} bem avaliados para você:`,
        titles: picks.map(toSuggested),
      };
    }
  }

  // 3. A mensagem inteira pode ser só o nome de um título.
  if (q.length <= 60 && !/em alta|popular|todo mundo|hype/.test(q)) {
    const found = await similarTo(text, profile).catch(() => null);
    if (found) return found;
  }

  // 4. O que está em alta.
  const week = await getTrending('week').catch(() => [] as TitleSummary[]);
  return {
    mode: 'simples',
    reply: /em alta|popular|todo mundo|hype/.test(q)
      ? 'Isto é o que mais está sendo visto nesta semana:'
      : 'Não entendi bem. Tente algo como "um terror psicológico", "anime para começar" ou "parecido com Interestelar". Enquanto isso, o que está em alta:',
    titles: unseen(week, profile).slice(0, 5).map(toSuggested),
  };
}
