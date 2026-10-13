import { NextResponse, type NextRequest } from 'next/server';
import { authEnabled, safeNext } from '@/lib/supabase/config';
import { createSupabaseServer } from '@/lib/supabase/server';

/**
 * Volta do login com o Google (e da confirmação de e-mail): troca o código
 * pela sessão, grava nos cookies e segue para a página pedida.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get('next'));
  const code = searchParams.get('code');

  if (authEnabled && code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }

  // Cancelou no Google, link vencido ou já usado.
  const fail = new URL('/entrar', origin);
  fail.searchParams.set('erro', searchParams.get('error_description') ? 'cancelado' : 'link');
  return NextResponse.redirect(fail);
}
