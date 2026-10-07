import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

// Fontes servidas pelo próprio site (sem depender do Google Fonts).
import '@fontsource-variable/fraunces';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CineVault — seu cofre de filmes e séries',
    template: '%s · CineVault',
  },
  description:
    'Registre, avalie e organize tudo o que você assiste: filmes, séries, animes e doramas, num só lugar.',
};

export const viewport: Viewport = {
  themeColor: '#0d0e12',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
