import type { Metadata } from 'next';
import { AuthPanel } from '@/components/auth/AuthPanel';

export const metadata: Metadata = { title: 'Criar conta' };

export default async function CriarContaPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <AuthPanel mode="criar" next={next} />;
}
