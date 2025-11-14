// src/components/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaSearch, FaMoon } from 'react-icons/fa'; // Ícones
import '../styles/header.css'; // Importa o CSS

// Definimos as props que o Header vai receber
interface HeaderProps {
  onToggleClick: () => void; // Função para o clique do "hambúrguer"
}

const Header: React.FC<HeaderProps> = ({ onToggleClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        {/* Botão Hambúrguer */}
        <button onClick={onToggleClick} className="theme-btn">
          <FaBars />
        </button>

        {/* Seu Logo */}
        <Image
          src="/iconeescuro.png" // Use seu ícone aqui
          alt="CineVault Logo"
          width={40}
          height={40}
          className="header-logo"
        />
        {/* Título removido, conforme pedido */}
        {/* <span className="header-title">CineVault</span> */}
      </div>

      <nav className="header-nav">
        <Link href="/home" className="nav-item">Início</Link>
        <Link href="/filmes" className="nav-item">Filmes</Link>
        <Link href="/series" className="nav-item">Séries</Link>
        <Link href="/animes" className="nav-item">Animes</Link>
      </nav>

      <div className="header-right">
        <button className="search-btn">
          <FaSearch />
        </button>
        <button className="theme-btn">
          <FaMoon />
        </button>
        <Link href="/login" className="login-btn">
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;