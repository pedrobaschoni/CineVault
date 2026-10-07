import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Comunidade' };

export default function ComunidadePage() {
  return (
    <ComingSoon
      phase={4}
      title="Comunidade"
      description="Discussões, reviews e o ranking de usuários. As telas chegam antes; os dados de outras pessoas dependem do backend."
    />
  );
}
