/**
 * Configuração do Supabase (login e dados na nuvem).
 *
 * As duas variáveis são públicas por natureza: a chave "publishable" (ou a
 * antiga "anon") só dá acesso ao que as regras de segurança (RLS) do banco
 * permitem, ou seja, cada pessoa só vê e altera os próprios dados.
 * Sem elas, o site funciona do mesmo jeito, com os dados salvos no navegador.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const authEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

/** Só aceita caminhos internos ("/diario"), nunca outro site ("//x.com", "https://…"). */
export function safeNext(value: string | null | undefined, fallback = '/inicio'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
  return value;
}
