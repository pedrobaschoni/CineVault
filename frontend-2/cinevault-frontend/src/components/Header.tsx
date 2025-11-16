// src/components/Header.tsx
'use client';

// 1. IMPORTE O 'useState' E OS NOVOS ITENS
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaSearch,
  FaMoon,
  FaUserCircle,
  FaChevronRight, // Adicionado para sub-menus
} from 'react-icons/fa';
import '../styles/header.css'; // Importa o CSS
import AboutModal from './AboutModal'; // 1. IMPORTE O MODAL (verifique o caminho)
import '../styles/about-modal.css'; // 1. IMPORTE O CSS DO MODAL (verifique o caminho)

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // 2. ADICIONE O ESTADO PARA O MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    // Adicionado style para garantir o contexto de empilhamento (z-index)
    <header className="header" style={{ position: 'relative', zIndex: 100 }}>
      <div className="header-left">
        <Image
          src={theme === 'dark' ? "/images/iconeescuro.png" : "/images/iconeclaro.png"}
          alt="CineVault Logo"
          width={100}
          height={100}
          className="header-logo"
        />
      </div>

      <nav className="header-nav">
        {/* 1. Início */}
        <Link href="/home" className="nav-item">
          Início
        </Link>

        {/* 3. ITEM ADICIONADO PARA ABRIR O MODAL */}
        <span 
          className="nav-item" 
          onClick={() => setIsModalOpen(true)} 
          style={{ cursor: 'pointer' }}
        >
          Sobre o CineVault
        </span>

        {/* 2. Descobrir (Novo) */}
        <div className="nav-item dropdown">
          <span>Descobrir</span>
          <div className="dropdown-content">
            <Link href="/descobrir/recomendacoes">Recomendações para você</Link>
            <Link href="/descobrir/surpresa">Surpreenda-me</Link>
            {/* Item com sub-menu */}
            <div className="submenu-item">
              <Link href="/descobrir/listas">
                Listas Temáticas <FaChevronRight className="submenu-chevron" />
              </Link>
              <div className="submenu-content">
                <Link href="/listas/plot-twist">Filmes de plot twist</Link>
                <Link href="/listas/maratonar">Para maratonar</Link>
                <Link href="/listas/terror-psicologico">Terror psicológico</Link>
              </div>
            </div>
            {/* Item com sub-menu */}
            <div className="submenu-item">
              <Link href="/descobrir/premios">
                Prêmios <FaChevronRight className="submenu-chevron" />
              </Link>
              <div className="submenu-content">
                <Link href="/premios/oscar">Oscar</Link>
                <Link href="/premios/emmy">Emmy</Link>
                <Link href="/premios/anime-awards">Anime Awards</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Em Alta (Novo) */}
        <div className="nav-item dropdown">
          <span>Em Alta</span>
          <div className="dropdown-content">
            <Link href="/trending/global">Top do Momento (Global)</Link>
            <Link href="/trending/semana">Mais avaliados da semana</Link>
            <Link href="/trending/hoje">Mais comentados hoje</Link>
            <Link href="/trending/brasil">Bombando no Brasil</Link>
          </div>
        </div>

        {/* 4. Categorias (Atualizado e com Sub-menus) */}
        <div className="nav-item dropdown">
          <span>Categorias</span>
          <div className="dropdown-content">
            {/* Sub-menu de Filmes */}
            <div className="submenu-item">
              <Link href="/filmes">
                Filmes por Gênero <FaChevronRight className="submenu-chevron" />
              </Link>
              <div className="submenu-content">
                <Link href="/filmes/genero/acao">Ação</Link>
                <Link href="/filmes/genero/comedia">Comédia</Link>
                <Link href="/filmes/genero/drama">Drama</Link>
                <Link href="/filmes/genero/terror">Terror</Link>
                <Link href="/filmes/genero/ficcao">Ficção Científica</Link>
              </div>
            </div>
            {/* Sub-menu de Séries */}
            <div className="submenu-item">
              <Link href="/series">
                Séries por Gênero <FaChevronRight className="submenu-chevron" />
              </Link>
              <div className="submenu-content">
                <Link href="/series/genero/thriller">Thriller</Link>
                <Link href="/series/genero/sitcom">Sitcom</Link>
                <Link href="/series/genero/documentario">Documentário</Link>
              </div>
            </div>
            {/* Sub-menu de Animes */}
            <div className="submenu-item">
              <Link href="/animes">
                Animes <FaChevronRight className="submenu-chevron" />
              </Link>
              <div className="submenu-content">
                <Link href="/animes/genero/shounen">Shounen</Link>
                <Link href="/animes/genero/seinen">Seinen</Link>
                <Link href="/animes/genero/isekai">Isekai</Link>
              </div>
            </div>
            {/* Sub-menu de Países */}
            <div className="submenu-item">
              <Link href="/paises">
                Por País <FaChevronRight className="submenu-chevron" />
              </Link>
              <div className="submenu-content">
                <Link href="/pais/eua">EUA</Link>
                <Link href="/pais/coreia">Coreia</Link>
                <Link href="/pais/japao">Japão</Link>
              </div>
            </div>
            {/* Sub-menu de Ano */}
            <div className="submenu-item">
              <Link href="/ano">
                Por Ano <FaChevronRight className="submenu-chevron" />
              </Link>
              <div className="submenu-content">
                <Link href="/ano/2025">Lançamentos 2025</Link>
                <Link href="/ano/2010s">Anos 2010</Link>
                <Link href="/ano/2000s">Anos 2000</Link>
                <Link href="/ano/classicos">Clássicos</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Lançamentos (Novo) */}
        <div className="nav-item dropdown">
          <span>Lançamentos</span>
          <div className="dropdown-content">
            <Link href="/lancamentos/cinema">Em cartaz (Cinema)</Link>
            <Link href="/lancamentos/streaming">Streaming</Link>
            <Link href="/lancamentos/proximos-filmes">Próximos Filmes</Link>
            <Link href="/lancamentos/proximas-series">Próximas Séries</Link>
          </div>
        </div>

        {/* 6. Minhas Listas (Atualizado) */}
        <div className="nav-item dropdown">
          <span>Minhas Listas</span>
          <div className="dropdown-content">
            <Link href="/listas/favoritos">Favoritos</Link>
            <Link href="/listas/quero-ver">Quero Ver</Link>
            <Link href="/listas/avaliados">Meus Avaliados</Link>
            <Link href="/listas/resenhas">Minhas Resenhas</Link>
            <Link href="/listas/atividade">Minha Atividade</Link>
          </div>
        </div>

        {/* 7. Comunidade (Novo) */}
        <div className="nav-item dropdown">
          <span>Comunidade</span>
          <div className="dropdown-content">
            <Link href="/comunidade/reviews">Reviews da Comunidade</Link>
            <Link href="/comunidade/usuarios">Usuários Bem Ranqueados</Link>
            <Link href="/comunidade/discussao">Discussões</Link>
          </div>
        </div>
      </nav>

      {/* --- Lado Direito (Usuário) --- */}
      <div className="header-right">
        <button className="search-btn">
          <FaSearch />
        </button>
        <button className="theme-btn" onClick={toggleTheme} title="Alternar tema">
          {theme === 'dark' ? <FaMoon /> : <span style={{fontSize:'1.2em'}}>☀️</span>}
        </button>

        {/* Menu de Usuário */}
        <div className="nav-item dropdown user-menu">
          <div className="user-profile">
            <FaUserCircle className="user-icon" />
            <span>Usuário</span> {/* Substitua pelo nome real */}
          </div>
          <div className="dropdown-content">
            <Link href="/perfil">Meu Perfil</Link>
            <Link href="/configuracoes">Configurações</Link>
            <Link href="/logout">Sair</Link>
          </div>
        </div>
      </div>

      {/* 4. RENDERIZAÇÃO CONDICIONAL DO MODAL */}
      {isModalOpen && <AboutModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
};

export default Header;