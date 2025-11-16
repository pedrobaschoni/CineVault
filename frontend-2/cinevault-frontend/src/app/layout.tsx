import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata = {
  title: 'CineVault', // (Exemplo)
  description: 'Seu cofre de filmes e séries.', // (Exemplo)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      {/* O <body> será controlado pelo ThemeProvider (adicionando 'dark' ou 'light'),
        mas o Provedor em si fica aqui, envolvendo os 'children'.
      */}
      <body>
        <ThemeProvider> {/* 2. Envolva os children */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}