'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import '../styles/ranking.css';

// --- DADOS MOCKADOS ATUALIZADOS ---
// Agora é um array único com propriedades 'type' e 'genre'
const allMockItems = [
  // Filmes
  { id: 'f1', pos: 1, title: 'Duna: Parte Dois', poster: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=60&h=90&fit=crop', rating: 9.2, reviews: 15420, trend: 'up', type: 'filme', genre: 'ficcao' },
  { id: 'f2', pos: 2, title: 'Oppenheimer', poster: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=60&h=90&fit=crop', rating: 8.9, reviews: 12100, trend: 'neutral', type: 'filme', genre: 'drama' },
  { id: 'f3', pos: 3, title: 'Barbie', poster: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=60&h=90&fit=crop', rating: 8.1, reviews: 9500, trend: 'down', type: 'filme', genre: 'comedia' },
  { id: 'f4', pos: 4, title: 'Mad Max: Estrada da Fúria', poster: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=60&h=90&fit=crop', rating: 8.5, reviews: 11500, trend: 'up', type: 'filme', genre: 'acao' },

  // Séries
  { id: 's1', pos: 1, title: 'O Problema dos 3 Corpos', poster: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=60&h=90&fit=crop', rating: 8.8, reviews: 11200, trend: 'up', type: 'serie', genre: 'ficcao' },
  { id: 's2', pos: 2, title: 'Stranger Things', poster: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=60&h=90&fit=crop', rating: 8.7, reviews: 25300, trend: 'up', type: 'serie', genre: 'terror' },
  { id: 's3', pos: 3, title: 'A Casa do Dragão', poster: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?w=60&h=90&fit=crop', rating: 8.5, reviews: 19800, trend: 'neutral', type: 'serie', genre: 'fantasia' },

  // Animes
  { id: 'a1', pos: 1, title: 'Jujutsu Kaisen', poster: 'https://images.pexels.com/photos/3760522/pexels-photo-3760522.jpeg?w=60&h=90&fit=crop', rating: 9.1, reviews: 13400, trend: 'neutral', type: 'anime', genre: 'acao' },
  { id: 'a2', pos: 2, title: 'Attack on Titan', poster: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=60&h=90&fit=crop', rating: 9.0, reviews: 30100, trend: 'down', type: 'anime', genre: 'fantasia' },
  { id: 'a3', pos: 3, title: 'One Piece', poster: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=60&h=90&fit=crop', rating: 8.9, reviews: 22000, trend: 'up', type: 'anime', genre: 'acao' },
];
// ------------------------------------------------

// Componente para um item individual do ranking (Sem alterações)
const RankingItem = ({ item }: { item: any }) => {
  const TrendIcon = () => {
    if (item.trend === 'up') return <FaArrowUp className="trend-up" />;
    if (item.trend === 'down') return <FaArrowDown className="trend-down" />;
    return <FaMinus className="trend-neutral" />;
  };

  return (
    <div className={`ranking-item ${item.pos === 1 ? 'is-top-one' : ''}`}>
      <span className="rank-pos">#{item.pos}</span>
      <div className="rank-poster">
        <Image src={item.poster} alt={item.title} width={40} height={60} unoptimized />
      </div>
      <div className="rank-info">
        <span className="rank-title">{item.title}</span>
        <div className="rank-stats">
          <FaStar className="star-icon" />
          <span className="rating-value">{item.rating.toFixed(1)}</span>
          <span className="review-count">({(item.reviews / 1000).toFixed(1)}k)</span>
        </div>
      </div>
      <div className="rank-trend">
        <TrendIcon />
      </div>
    </div>
  );
};

// Componente principal da Seção de Ranking
const RankingSection = () => {
  // --- NOVOS ESTADOS PARA OS FILTROS ---
  const [time, setTime] = useState('semana'); // 'semana', 'mes', 'geral'
  const [type, setType] = useState('filme');  // 'filme', 'serie', 'anime'
  const [genre, setGenre] = useState('geral'); // 'geral', 'acao', 'comedia', etc.
  
  // --- NOVA LÓGICA DE FILTRAGEM ---
  const filteredData = allMockItems
    .filter(item => {
      // Filtro de Tipo (filme, serie, anime)
      return item.type === type;
    })
    .filter(item => {
      // Filtro de Gênero
      if (genre === 'geral') return true; // 'geral' mostra todos os gêneros
      return item.genre === genre;
    });
    // O filtro de 'time' (semana, mes) não está sendo aplicado
    // nos dados mockados, mas a UI está pronta para isso.

  return (
    <aside className="ranking-container">
      <div className="ranking-header">
        {/* --- TÍTULO ATUALIZADO --- */}
        <h3>Ranking Semanal</h3>
      </div>

      {/* --- NOVOS FILTROS --- */}
      <div className="ranking-filters">
        <div className="filter-group">
          <label htmlFor="filter-time">Período</label>
          <select id="filter-time" value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="semana">Semana</option>
            <option value="mes">Mês</option>
            <option value="geral">All-Time</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="filter-type">Tipo</label>
          <select id="filter-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="filme">Filmes</option>
            <option value="serie">Séries</option>
            <option value="anime">Animes</option>
          </select>
        </div>
        
        <div className="filter-group filter-group-full">
          <label htmlFor="filter-genre">Gênero</label>
          <select id="filter-genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="geral">Todos os Gêneros</option>
            <option value="acao">Ação</option>
            <option value="comedia">Comédia</option>
            <option value="drama">Drama</option>
            <option value="ficcao">Ficção Científica</option>
            <option value="fantasia">Fantasia</option>
            <option value="terror">Terror</option>
            <option value="suspense">Suspense</option>
          </select>
        </div>
      </div>

      <div className="ranking-list">
        {filteredData.length > 0 ? (
          filteredData.slice(0, 3).map((item) => (
            <RankingItem key={item.id} item={item} />
          ))
        ) : (
          // Mensagem para quando nenhum item for encontrado
          <p className="no-results-message">
            Nenhum item encontrado para esta combinação de filtros.
          </p>
        )}
      </div>
    </aside>
  );
};

export default RankingSection;