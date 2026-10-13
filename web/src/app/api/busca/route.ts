import { NextResponse, type NextRequest } from 'next/server';
import { suggest } from '@/services/catalog';

/** Sugestões da busca do cabeçalho: GET /api/busca?q=duna */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json({ titles: [], people: [] });

  try {
    return NextResponse.json(await suggest(q.slice(0, 80)), {
      headers: { 'cache-control': 'public, max-age=60, s-maxage=600' },
    });
  } catch {
    return NextResponse.json({ error: 'O catálogo não respondeu.' }, { status: 502 });
  }
}
