'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';

// Define o tipo de dado que o contexto irá fornecer
interface ThemeContextData {
  theme: string;
  toggleTheme: () => void;
}

// Cria o Contexto
const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

// Cria o Provedor (o componente que vai "envolver" a aplicação)
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('dark'); // Padrão é 'dark'

  useEffect(() => {
    // Tenta carregar o tema do localStorage ao iniciar
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme; // Aplica a classe no body
    } else {
      // Se não houver tema salvo, aplica o padrão 'dark'
      document.body.className = 'dark';
    }
  }, []);

  // Função que o botão no Header vai chamar
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Salva a preferência
    document.body.className = newTheme; // Muda a classe no body
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook customizado (exatamente o que seu Header está usando)
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};