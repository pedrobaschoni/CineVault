import { NextResponse, type NextRequest } from 'next/server';
import { discover, search } from '@/services/catalog';
import { parseFilters } from '@/services/catalog/taxonomy';

/** Próximas páginas do Explorar ("Carregar mais"): GET /api/catalogo?{filtros}&pagina=2 */
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const page = Math.min(500, Math.max(1, Number(params.pagina) || 1));
  const q = params.q?.trim();

  try {
    const data = q ? await search(q.slice(0, 80), page) : await discover(parseFilters(params), page);
    return NextResponse.json({ results: data.results, page: data.page, totalPages: data.totalPages });
  } catch {
    return NextResponse.json({ error: 'O catálogo não respondeu.' }, { status: 502 });
  }
}
