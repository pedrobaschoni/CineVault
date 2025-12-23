'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/Header';
import { 
  FaCrown, FaMedal, FaFire, FaChartLine, FaTrophy, 
  FaCommentDots, FaHeart, FaUserAstronaut, FaGamepad, 
  FaCode, FaPenNib, FaSearch, FaBolt
} from 'react-icons/fa';
import '../../../styles/ranked-users.css';

// --- MOCK DATA ---
const userOfMonth = {
  id: 99,
  name: 'Cinephile_X',
  username: '@cine_x',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60',
  level: 42,
  xp: 8500,
  nextLevelXp: 10000,
  role: 'Crítico Lendário',
  bio: 'Viciado em cinema noir e sci-fi. Escrevo reviews diários e organizo maratonas.',
  badges: ['top_reviewer', 'trendsetter', 'vip'],
  stats: { reviews: 342, likes: 15000, help: 450 }
};

const hallOfFame = [
  { id: 101, title: 'Maior Streak', user: 'Sarah Connor', value: '365 dias', icon: <FaFire />, color: '#ff4f4f' },
  { id: 102, title: 'Mais Curtido', user: 'Neo Anderson', value: '50k Likes', icon: <FaHeart />, color: '#e91e63' },
  { id: 103, title: 'Mestre das Reviews', user: 'Tarantino_Jr', value: '500 Reviews', icon: <FaPenNib />, color: '#ffd700' },
];

const risingStars = [
  { id: 201, name: 'Alice in Wonderland', growth: '+240%', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
  { id: 202, name: 'John Wick 4Ever', growth: '+180%', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60' },
  { id: 203, name: 'Barbie Girl', growth: '+150%', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60' },
];

const rankingData = [
  { id: 1, name: 'Cinephile_X', level: 42, xp: 95, category: 'Crítico', badges: ['gold', 'verified'], stats: { answers: 1200, approval: '99%', engagement: 'S+' } },
  { id: 2, name: 'Marty McFly', level: 40, xp: 92, category: 'Curador', badges: ['silver', 'mod'], stats: { answers: 980, approval: '95%', engagement: 'S' } },
  { id: 3, name: 'Ellen Ripley', level: 39, xp: 45, category: 'Teorista', badges: ['bronze'], stats: { answers: 850, approval: '92%', engagement: 'A+' } },
  { id: 4, name: 'Tyler Durden', level: 35, xp: 70, category: 'Debatedor', badges: [], stats: { answers: 600, approval: '88%', engagement: 'A' } },
  { id: 5, name: 'Amélie Poulain', level: 32, xp: 20, category: 'Designer', badges: ['art'], stats: { answers: 540, approval: '90%', engagement: 'A' } },
  { id: 6, name: 'Luke Skywalker', level: 28, xp: 60, category: 'Fã de Saga', badges: [], stats: { answers: 400, approval: '85%', engagement: 'B+' } },
];

const achievementsFeed = [
  { user: 'Han Solo', text: 'atingiu o nível 20!', icon: <FaBolt /> },
  { user: 'Leia Organa', text: 'ganhou a medalha "Maratonista"!', icon: <FaMedal /> },
  { user: 'Yoda', text: 'recebeu 100 curtidas em um review!', icon: <FaHeart /> },
];

const FaArrowUpCustom = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
    <path d="M12 19V5M5 12L12 5L19 12" stroke="#4caf50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RankedUsersPage = () => {
  const [filter, setFilter] = useState('xp');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTagIcon = (tag: string) => {
    switch(tag) {
      case 'Crítico': return <FaPenNib />;
      case 'Curador': return <FaUserAstronaut />;
      case 'Designer': return <FaCode />;
      case 'Debatedor': return <FaCommentDots />;
      default: return <FaGamepad />;
    }
  };

  if (!mounted) return null;

  return (
    <div className="ranked-users-layout">
      <Header />
      
      <div className="ranked-users-container">
        
        {/* Header */}
        <header className="ru-header">
          <h1>Hall da Fama & Rankings</h1>
          <p>Os membros mais lendários do CineVault. Suba de nível, ganhe badges e faça história.</p>
        </header>

        {/* Featured Grid */}
        <section className="ru-featured-grid">
          
          {/* User of Month Card */}
          <div className="ru-user-month-card">
            <div className="ru-um-label">
              <FaCrown /> Usuário do Mês
            </div>
            
            <div className="ru-um-content">
              <div className="ru-avatar-wrapper">
                <Image src={userOfMonth.avatar} alt={userOfMonth.name} width={120} height={120} className="ru-um-avatar" unoptimized />
                <div className="ru-um-level">{userOfMonth.level}</div>
              </div>

              <div className="ru-um-info">
                <Link href="/perfil" style={{textDecoration: 'none', color: 'inherit'}}>
                  <h2>
                    {userOfMonth.name}
                    <span>{userOfMonth.username}</span>
                  </h2>
                </Link>
                <span className="ru-um-role">{userOfMonth.role}</span>
                <p className="ru-um-bio">"{userOfMonth.bio}"</p>

                {/* XP Bar */}
                <div className="ru-xp-container">
                  <div className="ru-xp-labels">
                    <span>XP Atual</span>
                    <span>{userOfMonth.xp} / {userOfMonth.nextLevelXp}</span>
                  </div>
                  <div className="ru-xp-track">
                    <div className="ru-xp-fill" style={{ width: `${(userOfMonth.xp / userOfMonth.nextLevelXp) * 100}%` }}></div>
                  </div>
                </div>

                <div className="ru-um-stats">
                  <div><strong>{userOfMonth.stats.reviews}</strong><span>Reviews</span></div>
                  <div><strong>{userOfMonth.stats.likes}</strong><span>Curtidas</span></div>
                  <div><strong>{userOfMonth.stats.help}</strong><span>Ajudas</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Column */}
          <div className="ru-side-col">
            <div className="ru-hall-card">
              <h3><FaTrophy /> Recordistas</h3>
              <div className="ru-hall-list">
                {hallOfFame.map(record => (
                  <div key={record.id} className="ru-record-item" style={{ borderBottomColor: record.color }}>
                    <div style={{ color: record.color, fontSize: '1.5rem' }}>{record.icon}</div>
                    <span>{record.title}</span>
                    <strong>{record.user}</strong>
                    <span style={{ color: record.color, fontWeight: 700 }}>{record.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ru-feed-card">
              <h4><FaBolt /> Acontecendo Agora</h4>
              <div className="ru-feed-list">
                {achievementsFeed.map((item, i) => (
                  <div key={i} className="ru-feed-item">
                    <span>{item.icon}</span>
                    <span><strong>{item.user}</strong> {item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Ranking Area */}
        <div className="ru-main-area">
          
          {/* Leaderboard */}
          <div className="ru-leaderboard-col">
            {/* Filtros */}
            <div className="ru-filters">
              {[
                { key: 'xp', icon: <FaCrown />, label: 'Ranking Geral (XP)' },
                { key: 'likes', icon: <FaHeart />, label: 'Mais Curtidos' },
                { key: 'help', icon: <FaCommentDots />, label: 'Mais Ativos' }
              ].map(btn => (
                <button
                  key={btn.key}
                  onClick={() => setFilter(btn.key)}
                  className={`ru-filter-btn ${filter === btn.key ? 'active' : ''}`}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
              <div className="ru-search">
                <FaSearch />
                <input type="text" placeholder="Buscar usuário..." />
              </div>
            </div>

            {/* Ranking List */}
            <div className="ru-list">
              {rankingData.map((user, index) => (
                <div key={user.id} className="ru-rank-row">
                  <div className="ru-pos">
                    {index === 0 ? <FaMedal className="gold" /> : 
                     index === 1 ? <FaMedal className="silver" /> : 
                     index === 2 ? <FaMedal className="bronze" /> : 
                     `#${index + 1}`}
                  </div>
                  
                  {/* Célula do Usuário com TOOLTIP */}
                  <div className="ru-user-cell">
                    <div className="tooltip-container">
                      <img 
                        src={`https://i.pravatar.cc/150?u=${user.id}`} 
                        alt={user.name} 
                        className="ru-list-avatar"
                      />
                      
                      {/* --- O TOOLTIP MÁGICO --- */}
                      <div className="social-tooltip">
                        <div className="tooltip-header">
                          <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="" className="tooltip-avatar-mini" />
                          <div>
                            <strong className="tooltip-name">{user.name}</strong>
                            <span className="tooltip-lvl">Nível {user.level}</span>
                          </div>
                        </div>
                        
                        <div className="tooltip-stats-grid">
                          <div className="ts-item">
                            <span>Aprovação</span>
                            <strong>{user.stats.approval}</strong>
                          </div>
                          <div className="ts-item">
                            <span>Respostas</span>
                            <strong>{user.stats.answers}</strong>
                          </div>
                          <div className="ts-item">
                            <span>Rank</span>
                            <strong className="rank-s">{user.stats.engagement}</strong>
                          </div>
                        </div>

                        <div className="tooltip-badges">
                          {user.badges.map(b => (
                            <span key={b} className={`mini-badge ${b}`} title={b}></span>
                          ))}
                        </div>
                        
                        {/* Botão removido conforme pedido */}
                      </div>
                      {/* ------------------------- */}
                    </div>

                    <div className="ru-user-text">
                      <Link href="/perfil" className="ru-name-link">
                        <h4>
                          {user.name}
                          {user.badges.includes('verified') && <FaMedal className="verified" title="Verificado" />}
                        </h4>
                      </Link>
                      <span className="ru-tag">
                        {getTagIcon(user.category)} {user.category}
                      </span>
                    </div>
                  </div>

                  {/* XP e Nível */}
                  <div className="ru-xp-cell">
                    <div><small>LVL</small> <strong>{user.level}</strong></div>
                    <div className="ru-xp-mini-track">
                      <div className="ru-xp-mini-fill" style={{ width: `${user.xp}%` }}></div>
                    </div>
                  </div>

                  {/* Badges na Lista */}
                  <div className="ru-badges-cell">
                    {user.badges.map(b => (
                      <span key={b} className={`ru-mini-badge ${b}`} title={`Badge: ${b}`}></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar (Direita) */}
          <aside className="ru-sidebar-col">
            <div className="ru-sidebar-card">
              <h3><FaChartLine /> Usuários Ascendentes</h3>
              <p>Cresceram muito na última semana.</p>
              <div className="ru-rising-list">
                {risingStars.map((star) => (
                  <div key={star.id} className="ru-rising-item">
                    <Image src={star.avatar} alt={star.name} width={40} height={40} className="ru-rising-avatar" unoptimized />
                    <div className="ru-rising-info">
                      <strong>{star.name}</strong>
                      <div className="ru-growth">
                        <FaArrowUpCustom /> {star.growth}
                      </div>
                    </div>
                    <div className="ru-mini-graph">
                      {[30, 50, 40, 80].map((h, i) => (
                        <span key={i} style={{ height: `${h}%`, opacity: i === 3 ? 1 : 0.5 }}></span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ru-pro-card">
              <h3>Torne-se CineVault <span>PRO</span></h3>
              <p>Desbloqueie badges exclusivos, bordas animadas e destaque no ranking.</p>
              <button>Saber Mais</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RankedUsersPage;