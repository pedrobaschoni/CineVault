import { NextResponse, type NextRequest } from 'next/server';
import { getRandomTitle } from '@/services/catalog';

export const dynamic = 'force-dynamic';

/** "Surpreenda-me": sorteia um título bem avaliado e abre a página dele. */
export async function GET(request: NextRequest) {
  const title = await getRandomTitle().catch(() => null);
  const target = title ? title.href : '/explorar';
  return NextResponse.redirect(new URL(target, request.url), 307);
}
