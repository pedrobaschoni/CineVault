import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Configurações' };

export default function ConfiguracoesPage() {
  return (
    <ComingSoon
      phase={3}
      title="Configurações"
      description="Dados da conta, privacidade do perfil e importação do Letterboxd e do MyAnimeList."
    />
  );
}
