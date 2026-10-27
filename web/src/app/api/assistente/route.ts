import { NextResponse, type NextRequest } from 'next/server';
import { runAssistant } from '@/services/assistant';
import { CHAT_LIMITS, type AssistantRequest, type ChatTurn, type TasteProfile } from '@/services/assistant/types';

/**
 * Chat do Curador. A chave da IA fica só no servidor; o navegador manda a
 * conversa e um resumo do diário, e recebe a resposta com os títulos sugeridos.
 */

// Limite simples por IP para ninguém gastar a cota da IA: 20 mensagens por minuto.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // não deixa o mapa crescer para sempre
  return recent.length > MAX_PER_WINDOW;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');

function parse(body: unknown): AssistantRequest | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as { messages?: unknown; profile?: unknown };
  if (!Array.isArray(b.messages)) return null;

  const messages: ChatTurn[] = b.messages
    .slice(-CHAT_LIMITS.history)
    .map((m) => ({ role: (m as ChatTurn)?.role === 'assistant' ? 'assistant' : 'user', text: str((m as ChatTurn)?.text, CHAT_LIMITS.messageChars * 2).trim() }) as ChatTurn)
    .filter((m) => m.text);
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user' || last.text.length > CHAT_LIMITS.messageChars) return null;

  const p = (b.profile ?? {}) as Partial<TasteProfile>;
  const profile: TasteProfile = {
    watched: (Array.isArray(p.watched) ? p.watched : []).slice(0, CHAT_LIMITS.watched).map((w) => ({
      key: str(w?.key, 30),
      title: str(w?.title, 120),
      type: w?.type,
      rating: typeof w?.rating === 'number' ? w.rating : undefined,
    })),
    favorites: (Array.isArray(p.favorites) ? p.favorites : []).slice(0, 20).map((t) => str(t, 120)),
    watchlist: (Array.isArray(p.watchlist) ? p.watchlist : []).slice(0, 20).map((t) => str(t, 120)),
  };
  return { messages, profile };
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json({ mensagem: 'Muitas mensagens seguidas. Espere um minuto.' }, { status: 429 });
  }

  const input = parse(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ mensagem: 'Mensagem inválida.' }, { status: 400 });

  try {
    return NextResponse.json(await runAssistant(input));
  } catch (error) {
    console.error('[assistente]', error);
    return NextResponse.json({ mensagem: 'O Curador não conseguiu responder agora.' }, { status: 500 });
  }
}
