import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComingSoon } from '@/components/ui/ComingSoon';
import { MEDIA_LABEL } from '@/lib/format';
import type { MediaType } from '@/types';

interface Props {
  params: Promise<{ tipo: string; id: string }>;
}

function isMediaType(value: string): value is MediaType {
  return value in MEDIA_LABEL;
}

export const metadata: Metadata = { title: 'Título' };

/**
 * Rota de cada título: /titulo/filme/123, /titulo/serie/456...
 * A Fase 2 troca este conteúdo pela página completa com dados do TMDB.
 */
export default async function TituloPage({ params }: Props) {
  const { tipo, id } = await params;
  if (!isMediaType(tipo)) notFound();

  return (
    <ComingSoon
      phase={2}
      title={`${MEDIA_LABEL[tipo]}: ${id}`}
      description="Aqui entra a página completa do título, com pôster, nota da comunidade, sua nota, episódios, elenco, reviews e onde assistir."
    />
  );
}
