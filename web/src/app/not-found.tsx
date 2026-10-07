import { VaultDial } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        textAlign: 'center',
        padding: 'var(--gutter)',
      }}
    >
      <span style={{ color: 'var(--color-accent)' }}>
        <VaultDial size={64} />
      </span>
      <Tag tone="accent">Erro 404</Tag>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', lineHeight: 1 }}>
        Esse cofre está vazio
      </h1>
      <p style={{ color: 'var(--color-text-2)', maxWidth: '28rem' }}>
        A página que você procurou não existe ou mudou de lugar.
      </p>
      <Button href="/inicio" variant="primary">
        Voltar para o início
      </Button>
    </main>
  );
}
