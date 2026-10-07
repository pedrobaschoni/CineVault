import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Diário' };

export default function DiarioPage() {
  return (
    <ComingSoon
      phase={3}
      title="Diário"
      description="Tudo o que você assistiu, organizado por data, com nota, reassistidas e episódios."
    />
  );
}
