import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Listas' };

export default function ListasPage() {
  return (
    <ComingSoon
      phase={3}
      title="Listas"
      description="Seus favoritos, o que você quer ver e listas personalizadas para organizar e compartilhar."
    />
  );
}
