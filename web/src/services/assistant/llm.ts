import 'server-only';

/**
 * Cliente mínimo para APIs de chat no formato da OpenAI (/chat/completions),
 * que Gemini, Groq, Ollama, OpenRouter e a própria Anthropic também aceitam.
 * Trocar de provedor é só mudar as três variáveis do .env.local.
 */
export const LLM = {
  baseUrl: (process.env.ASSISTANT_BASE_URL ?? '').replace(/\/+$/, ''),
  apiKey: process.env.ASSISTANT_API_KEY ?? '',
  model: process.env.ASSISTANT_MODEL ?? '',
};

/** Ollama roda local e não pede chave; os outros pedem. */
export const llmEnabled = Boolean(LLM.baseUrl && LLM.model && (LLM.apiKey || /localhost|127\.0\.0\.1/.test(LLM.baseUrl)));

export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

export type LlmMessage =
  | { role: 'system' | 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: ToolCall[] }
  | { role: 'tool'; tool_call_id: string; content: string };

interface CompletionResponse {
  choices?: Array<{ message?: { content?: string | null; tool_calls?: ToolCall[] } }>;
  error?: { message?: string };
}

export async function complete(messages: LlmMessage[], tools: readonly unknown[]) {
  const res = await fetch(`${LLM.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(LLM.apiKey ? { Authorization: `Bearer ${LLM.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: LLM.model,
      messages,
      ...(tools.length ? { tools, tool_choice: 'auto' } : {}),
      temperature: 0.7,
      max_tokens: 900,
    }),
    signal: AbortSignal.timeout(45_000),
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({}))) as CompletionResponse;
  if (!res.ok) throw new Error(`IA respondeu ${res.status}: ${data.error?.message ?? 'sem detalhes'}`);
  const message = data.choices?.[0]?.message;
  return { content: message?.content ?? '', toolCalls: message?.tool_calls ?? [] };
}
