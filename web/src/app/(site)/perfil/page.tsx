import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Perfil' };

export default function PerfilPage() {
  return (
    <ComingSoon
      phase={3}
      title="Perfil"
      description="Os quatro do cofre, suas estatísticas, o diário do mês e a compatibilidade com amigos."
    />
  );
}
