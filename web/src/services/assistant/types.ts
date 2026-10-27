/**
 * Formatos trocados entre o chat (navegador) e a rota /api/assistente.
 * Sem código de servidor aqui, para o navegador poder importar.
 */
import type { MediaType, TmdbKind } from '@/types';

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

/** Um título sugerido, pronto para virar cartão no chat. */
export interface SuggestedTitle {
  key: string;
  id: number;
  kind: TmdbKind;
  type: MediaType;
  title: string;
  year?: number;
  posterUrl?: string;
  score?: number;
  href: string;
}

/** O que a pessoa já registrou, para o assistente personalizar (resumido no navegador). */
export interface TasteProfile {
  watched: Array<{ key: string; title: string; type: MediaType; rating?: number }>;
  favorites: string[];
  watchlist: string[];
}

export interface AssistantRequest {
  messages: ChatTurn[];
  profile?: TasteProfile;
}

export interface AssistantResponse {
  reply: string;
  titles: SuggestedTitle[];
  /** "ia": conversa completa · "simples": respostas por palavras-chave, sem chave de IA. */
  mode: 'ia' | 'simples';
}

/** Limites que o navegador e o servidor respeitam. */
export const CHAT_LIMITS = { messageChars: 600, history: 12, watched: 40 } as const;
