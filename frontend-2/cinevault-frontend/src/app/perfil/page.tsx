'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header'; // Seu header existente
import { FaStar, FaFilm, FaPoll, FaRegClock, FaPencilAlt } from 'react-icons/fa';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../../styles/profile.css'; // Vamos criar este CSS

// --- DADOS FICTÍCIOS (MOCK DATA) ---
// Substitua por dados reais do seu backend
const userData = {
  name: 'Ana "CineGourmet" Silva',
  username: '@anagourmet',
  avatarUrl: 'https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=400',
  bio: 'Exploradora de narrativas e caçadora de pérolas escondidas. Acredito que todo filme tem algo a dizer, mesmo que seja "não perca seu tempo". Aqui catalogo minha jornada.'
};

const userStats = {
  totalReviews: 284,
  avgRating: 8.7,
  favoriteGenres: ['Ficção Científica', 'Drama', 'Suspense']
};

const radarData = [
  { subject: 'Ação', value: 75 },
  { subject: 'Comédia', value: 60 },
  { subject: 'Drama', value: 95 },
  { subject: 'Terror', value: 40 },
  { subject: 'Ficção-Cient.', value: 100 },
  { subject: 'Romance', value: 30 },
  { subject: 'Animação', value: 70 },
];

const timelineData = [
  {
    id: 1,
    title: 'Duna: Parte Dois',
    posterUrl: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=100&h=150&fit=crop',
    rating: 9.5,
    date: '10 de Nov, 2025',
    comment: 'Uma obra-prima visual e sonora. Villeneuve expande o universo de forma magistral. Cada frame é uma pintura.'
  },
  {
    id: 2,
    title: 'O Problema dos 3 Corpos',
    posterUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=100&h=150&fit=crop',
    rating: 8.0,
    date: '08 de Nov, 2025',
    comment: 'Começo lento, mas o final da temporada é explosivo. Conceitos de física que dão um nó na cabeça. Ansiosa pela S2.'
  },
  {
    id: 3,
    title: 'Pobres Criaturas',
    posterUrl: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?w=100&h=150&fit=crop',
    rating: 9.0,
    date: '05 de Nov, 2025',
    comment: 'Bizarro, lindo e hilário. Emma Stone em sua melhor atuação. Yorgos Lanthimos no seu auge criativo.'
  },
  {
    id: 4,
    title: 'Guerra Civil',
    posterUrl: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=100&h=150&fit=crop',
    rating: 7.5,
    date: '02 de Nov, 2025',
    comment: 'Tenso e visceral. A fotografia é incrível, mas o roteiro deixa algumas pontas soltas sobre a política do conflito.'
  },
];
// --- FIM DOS DADOS FICTÍCIOS ---


// Componente do Gráfico de Radar (precisa ser 'use client')
const ProfileRadarChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
      <PolarGrid stroke="var(--border-hover)" />
      <PolarAngleAxis 
        dataKey="subject" 
        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
      />
      <Tooltip
        contentStyle={{
          backgroundColor: 'var(--bg-tertiary)',
          borderColor: 'var(--border-color)',
          borderRadius: '8px'
        }}
      />
      <Radar 
        name={userData.name} 
        dataKey="value" 
        stroke="var(--accent-color)" 
        fill="var(--accent-color)" 
        fillOpacity={0.6} 
      />
    </RadarChart>
  </ResponsiveContainer>
);

// Componente da Página de Perfil
const UserProfilePage = () => {
  return (
    <div className="profile-layout">
      <Header />
      <div className="profile-container">

        {/* === COLUNA DA ESQUERDA (SIDEBAR) === */}
        <aside className="profile-sidebar">
          
          {/* Card 1: Informações do Usuário */}
          <section className="profile-card user-info">
            <Image
              src={userData.avatarUrl}
              alt="Avatar do usuário"
              width={120}
              height={120}
              className="profile-avatar"
              unoptimized
            />
            <h2 className="profile-name">{userData.name}</h2>
            <span className="profile-username">{userData.username}</span>
            <p className="profile-bio">{userData.bio}</p>
            <Link href="/perfil/editar" className="edit-profile-btn">
              <FaPencilAlt /> Editar Perfil
            </Link>
          </section>

          {/* Card 2: Estatísticas */}
          <section className="profile-card stats-card">
            <h3 className="card-title">Estatísticas</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <FaFilm className="stat-icon" />
                <span className="stat-value">{userStats.totalReviews}</span>
                <span className="stat-label">Obras Avaliadas</span>
              </div>
              <div className="stat-item">
                <FaStar className="stat-icon" />
                <span className="stat-value">{userStats.avgRating}</span>
                <span className="stat-label">Média de Notas</span>
              </div>
              <div className="stat-item">
                <FaPoll className="stat-icon" />
                <span className="stat-label">Gêneros Favoritos</span>
                <span className="stat-genres">
                  {userStats.favoriteGenres.join(' • ')}
                </span>
              </div>
            </div>
          </section>

          {/* Card 3: Gráfico de Radar */}
          <section className="profile-card chart-card">
            <h3 className="card-title">Preferências por Gênero</h3>
            <div className="chart-container">
              <ProfileRadarChart />
            </div>
          </section>

        </aside>

        {/* === COLUNA DA DIREITA (CONTEÚDO) === */}
        <main className="profile-content">
          
          {/* Seção da Linha do Tempo */}
          <section className="timeline-section">
            <h2 className="profile-section-title">
              <FaRegClock /> Atividade Recente
            </h2>
            <div className="timeline">
              {timelineData.map((item) => (
                <div className="timeline-item" key={item.id}>
                  <Image 
                    src={item.posterUrl} 
                    alt={item.title} 
                    width={80} 
                    height={120} 
                    className="timeline-poster"
                    unoptimized
                  />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4 className="timeline-title">{item.title}</h4>
                      <span className="timeline-date">{item.date}</span>
                    </div>
                    <div className="timeline-rating">
                      <FaStar /> {item.rating.toFixed(1)}
                    </div>
                    {item.comment && (
                      <p className="timeline-comment">{item.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;