import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { SyncNotice } from '@/components/layout/SyncNotice';

/** Layout das páginas internas: cabeçalho, conteúdo e rodapé. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <DemoBanner />
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <SyncNotice />
    </>
  );
}
