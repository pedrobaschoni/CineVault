import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { authEnabled, SUPABASE_KEY, SUPABASE_URL } from '@/lib/supabase/config';

/**
 * Renova a sessão do Supabase a cada navegação, para o login não expirar
 * enquanto a pessoa usa o site. Sem Supabase configurado, não faz nada.
 */
export async function proxy(request: NextRequest) {
  if (!authEnabled) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(toSet, headers) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Não coloque código entre a criação do cliente e esta chamada.
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  // Páginas e rotas de API; arquivos estáticos e imagens ficam de fora.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)'],
};
