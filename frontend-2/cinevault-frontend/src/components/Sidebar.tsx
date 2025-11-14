// src/components/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaFilm, FaTv, FaRegClock, FaBookmark, FaStar } from 'react-icons/fa';
import '../styles/sidebar.css';

// Props que a Sidebar vai receber
interface SidebarProps {
  isOpen: boolean; // Estado (aberta ou fechada)
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    // Aplica a classe 'closed' se 'isOpen' for falso
    <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
      <div className="sidebar-header">
        <Image
          src="/iconeescuro.png" // Seu ícone
          alt="Logo"
          width={40}
          height={40}
          className="sidebar-logo"
        />
        {/* Título removido, conforme pedido */}
        {/* <span className="sidebar-title">CineVault</span> */}
      </div>

      <nav className="sidebar-nav">
        <Link href="/home" className="nav-link">
          <FaHome className="nav-icon" />
          <span className="nav-text">Início</span>
        </Link>
        <Link href="/filmes" className="nav-link">
          <FaFilm className="nav-icon" />
          <span className="nav-text">Filmes</span>
        </Link>
        <Link href="/series" className="nav-link">
          <FaTv className="nav-icon" />
          <span className="nav-text">Séries</span>
        </Link>
        <Link href="/recentes" className="nav-link">
          <FaRegClock className="nav-icon" />
          <span className="nav-text">Recentes</span>
        </Link>
        <Link href="/favoritos" className="nav-link">
          <FaBookmark className="nav-icon" />
          <span className="nav-text">Favoritos</span>
        </Link>
        <Link href="/top-avaliados" className="nav-link">
          <FaStar className="nav-icon" />
          <span className="nav-text">Top Avaliados</span>
        </Link>
      </nav>

      {/* O botão de toggle foi removido daqui */}
    </aside>
  );
};

export default Sidebar;