import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Explorar' };

export default function ExplorarPage() {
  return (
    <ComingSoon
      phase={2}
      title="Explorar"
      description="Busca e filtros por tipo, gênero, país, ano e o que está em cartaz, com listas temáticas e o botão Surpreenda-me."
    />
  );
}
