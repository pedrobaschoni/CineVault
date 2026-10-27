import 'server-only';
import { MEDIA_LABEL } from '@/lib/format';
import { fallbackReply } from './fallback';
import { complete, llmEnabled, type LlmMessage } from './llm';
import { runTool, TOOL_DEFS, type Seen } from './tools';
import { CHAT_LIMITS, type AssistantRequest, type AssistantResponse, type TasteProfile } from './types';

export { llmEnabled };

const MAX_TOOL_ROUNDS = 4;

const SYSTEM = `Você é o Curador, o assistente do CineVault, um diário de filmes, séries, animes e doramas.
Ajude a pessoa a decidir o que assistir: indique títulos, sugira parecidos com algo que ela viu e responda dúvidas sobre títulos.

Regras:
- Responda sempre em português do Brasil, com tom próximo e direto, em até 120 palavras.
- Nunca invente títulos. Use as ferramentas para encontrar títulos reais e só indique os que vieram delas.
- Quando a pessoa citar um título, use buscar_titulos para achá-lo e depois parecidos ou detalhes.
- Indique de 3 a 5 títulos, cada um com uma frase curta dizendo por que combina. Não conte reviravoltas nem finais.
- Use o histórico da pessoa, se houver: evite o que ela já viu (a não ser que peça) e leve em conta as notas que ela deu.
- Se o pedido não tiver a ver com filmes ou séries, diga com gentileza que você só ajuda com isso.
- Na última linha, escreva exatamente "TITULOS:" seguido das chaves dos títulos que você indicou, na ordem, separadas por vírgula (ex.: TITULOS: movie:157336, tv:1396). Se não indicou nenhum, escreva "TITULOS:" vazio.`;

function profileText(p?: TasteProfile): string | null {
  if (!p || (!p.watched.length && !p.favorites.length && !p.watchlist.length)) return null;
  const lines: string[] = ['Histórico da pessoa no CineVault (use para personalizar):'];
  if (p.watched.length) {
    lines.push(
      'Já viu: ' +
        p.watched
          .slice(0, CHAT_LIMITS.watched)
          .map((w) => `${w.title} (${MEDIA_LABEL[w.type] ?? w.type}${w.rating ? `, nota ${w.rating}/5` : ''}, ${w.key})`)
          .join('; '),
    );
  }
  if (p.favorites.length) lines.push('Favoritos: ' + p.favorites.slice(0, 20).join('; '));
  if (p.watchlist.length) lines.push('Quer ver: ' + p.watchlist.slice(0, 20).join('; '));
  return lines.join('\n');
}

/** Separa o texto da linha final "TITULOS: …" e monta os cartões só com títulos que vieram das ferramentas. */
function finish(content: string, seen: Seen): AssistantResponse {
  const match = /\n?\s*TITULOS:\s*(.*)\s*$/i.exec(content);
  const reply = (match ? content.slice(0, match.index) : content).trim();
  const keys = match ? match[1].split(/[,\s]+/).map((k) => k.trim()).filter(Boolean) : [];
  const titles = [...new Set(keys)].map((k) => seen.get(k)).filter((t) => t !== undefined).slice(0, 6);
  return { reply: reply || 'Aqui estão algumas ideias:', titles, mode: 'ia' };
}

export async function runAssistant({ messages, profile }: AssistantRequest): Promise<AssistantResponse> {
  const last = messages[messages.length - 1];
  if (!llmEnabled) return fallbackReply(last.text, profile);

  const seen: Seen = new Map();
  // Uma só mensagem de sistema: alguns provedores não aceitam mais de uma.
  const taste = profileText(profile);
  const history: LlmMessage[] = [{ role: 'system', content: taste ? `${SYSTEM}\n\n${taste}` : SYSTEM }];
  for (const m of messages) history.push({ role: m.role, content: m.text });

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      // Na última volta, sem ferramentas: a IA tem que responder com o que já tem.
      const { content, toolCalls } = await complete(history, round < MAX_TOOL_ROUNDS ? TOOL_DEFS : []);
      if (!toolCalls.length) return finish(content ?? '', seen);

      history.push({ role: 'assistant', content: content || null, tool_calls: toolCalls });
      const results = await Promise.all(
        toolCalls.map(async (call) => {
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(call.function.arguments || '{}');
          } catch {
            /* argumentos inválidos: a ferramenta responde com erro */
          }
          return { role: 'tool' as const, tool_call_id: call.id, content: await runTool(call.function.name, args, seen) };
        }),
      );
      history.push(...results);
    }
  } catch (error) {
    console.error('[assistente] falha na IA, usando o modo simples', error);
  }
  // A IA falhou ou não fechou a resposta: o modo simples garante uma resposta útil.
  return fallbackReply(last.text, profile);
}
