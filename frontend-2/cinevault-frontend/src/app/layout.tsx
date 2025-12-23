// src/app/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
// 1. IMPORTAR O CHAT
import ChatAssistant from '../components/ChatAssistant'; 

export const metadata = {
  title: 'CineVault',
  description: 'Seu cofre de filmes e séries.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <ThemeProvider>
          {children}
          
          {/* 2. ADICIONAR O CHAT AQUI, FORA DO CHILDREN */}
          <ChatAssistant />
          
        </ThemeProvider>
      </body>
    </html>
  );
}