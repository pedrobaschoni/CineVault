'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '../../../components/Header';
import { 
  FaHeart, FaStar, FaQuoteRight, FaHistory, 
  FaFilter, FaSortAmountDown 
} from 'react-icons/fa';
import '../../../styles/favorites.css';

// --- DADOS MOCKADOS ---

const favoritesData = [
  { id: 1, title: 'Duna: Parte Dois', poster: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=300&h=450&fit=crop', type: 'Filme', userRating: 9.5, globalRating: 9.2 },
  { id: 2, title: 'Succession', poster: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=300&h=450&fit=crop', type: 'Série', userRating: 10, globalRating: 9.0 },
  { id: 3, title: 'O Menino e a Garça', poster: 'https://images.pexels.com/photos/3760522/pexels-photo-3760522.jpeg?w=300&h=450&fit=crop', type: 'Filme', userRating: null, globalRating: 8.5 },
  { id: 4, title: 'Ruptura (Severance)', poster: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=300&h=450&fit=crop', type: 'Série', userRating: 9.0, globalRating: 8.8 },
  { id: 5, title: 'Barbie', poster: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=300&h=450&fit=crop', type: 'Filme', userRating: 8.5, globalRating: 8.2 },
  { id: 6, title: 'Oppenheimer', poster: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=300&h=450&fit=crop', type: 'Filme', userRating: 9.2, globalRating: 8.9 },
  { id: 7, title: 'The Bear (T2)', poster: 'https://images.pexels.com/photos/3814517/pexels-photo-3814517.jpeg?w=300&h=450&fit=crop', type: 'Série', userRating: 10, globalRating: 9.3 },
  { id: 8, title: 'Godzilla Minus One', poster: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=300&h=450&fit=crop', type: 'Filme', userRating: 8.8, globalRating: 8.7 },
  { id: 9, title: 'Ahsoka', poster: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=300&h=450&fit=crop', type: 'Série', userRating: 7.5, globalRating: 7.2 },
  { id: 10, title: 'Pobres Criaturas', poster: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?w=300&h=450&fit=crop', type: 'Filme', userRating: 9.0, globalRating: 8.6 },
  { id: 11, title: 'Shogun', poster: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=300&h=450&fit=crop', type: 'Série', userRating: 9.3, globalRating: 9.1 },
  { id: 12, title: 'Vidas Passadas', poster: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=300&h=450&fit=crop', type: 'Filme', userRating: 8.7, globalRating: 8.4 },
];

const ratingsData = [
  { id: 1, title: 'Barbie', poster: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=300&h=450&fit=crop', type: 'Filme', rating: 8.0, date: 'Ontem' },
  { id: 2, title: 'Oppenheimer', poster: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=300&h=450&fit=crop', type: 'Filme', rating: 9.5, date: '3 dias atrás' },
  { id: 3, title: 'The Bear (T2)', poster: 'https://images.pexels.com/photos/3814517/pexels-photo-3814517.jpeg?w=300&h=450&fit=crop', type: 'Temporada', rating: 10, date: 'Semana passada' },
  { id: 4, title: 'Godzilla Minus One', poster: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=300&h=450&fit=crop', type: 'Filme', rating: 9.0, date: '2 semanas atrás' },
  { id: 5, title: 'Ahsoka', poster: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=300&h=450&fit=crop', type: 'Série', rating: 6.5, date: '1 mês atrás' },
];

const reviewsData = [
  { 
    id: 1, 
    title: 'Pobres Criaturas', 
    poster: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?w=100&h=150&fit=crop', 
    excerpt: 'Uma viagem visual alucinante. Emma Stone entrega a performance da vida...', 
    date: '12 Nov 2025', 
    likes: 42 
  },
  { 
    id: 2, 
    title: 'Guerra Civil', 
    poster: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=100&h=150&fit=crop', 
    excerpt: 'Tenso do início ao fim, mas senti falta de um aprofundamento político maior...', 
    date: '05 Out 2025', 
    likes: 15 
  },
];

const historyData = [
  { id: 1, action: 'Avaliou', item: 'Godzilla Minus One', date: '2 horas atrás', icon: <FaStar /> },
  { id: 2, action: 'Adicionou aos Favoritos', item: 'Shogun', date: '5 horas atrás', icon: <FaHeart /> },
  { id: 3, action: 'Escreveu Review', item: 'Vidas Passadas', date: 'Ontem', icon: <FaQuoteRight /> },
  { id: 4, action: 'Avaliou', item: 'Fallout (T1)', date: '2 dias atrás', icon: <FaStar /> },
];

const FavoritosPage = () => {
  const [activeTab, setActiveTab] = useState('favoritos');
  
  // ESTADOS DE FILTRO E ORDENAÇÃO
  const [filterType, setFilterType] = useState('todos');
  const [sortOrder, setSortOrder] = useState('recentes'); // recentes, maior_nota, menor_nota, az

  // Lógica de filtragem e ordenação REAL
  const getFilteredRatings = () => {
    let items = [...ratingsData];

    // 1. Filtrar
    if (filterType === 'filme') {
      items = items.filter(i => i.type === 'Filme');
    } else if (filterType === 'serie') {
      // Inclui Séries e Temporadas
      items = items.filter(i => i.type === 'Série' || i.type === 'Temporada');
    }

    // 2. Ordenar
    items.sort((a, b) => {
      switch (sortOrder) {
        case 'maior_nota': return b.rating - a.rating;
        case 'menor_nota': return a.rating - b.rating;
        case 'az': return a.title.localeCompare(b.title);
        default: return 0; // "recentes" mantém a ordem original do array (mock)
      }
    });

    return items;
  };

  const displayedRatings = getFilteredRatings();

  const renderContent = () => {
    switch (activeTab) {
      
      case 'favoritos':
        return (
          <div className="fav-grid fade-in">
            {favoritesData.map(item => (
              <div key={item.id} className="fav-card">
                <div className="fav-poster-wrapper">
                  <Image src={item.poster} alt={item.title} fill className="fav-poster" unoptimized />
                  <div className="fav-overlay">
                    <button className="remove-fav-btn" title="Remover dos favoritos">
                      <FaHeart />
                    </button>
                  </div>
                  <span className="fav-type-tag">{item.type}</span>
                </div>
                <div className="fav-info">
                  <h3 className="fav-title">{item.title}</h3>
                  <div className="fav-ratings">
                    {item.userRating && (
                      <span className="user-rate"><FaStar /> {item.userRating}</span>
                    )}
                    <span className="global-rate"><span className="globe-icon">🌍</span> {item.globalRating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'avaliacoes':
        return (
          <div className="ratings-section fade-in">
            {/* BARRA DE FILTROS REDESENHADA */}
            <div className="ratings-toolbar-clean">
              
              {/* Botões de Filtro (Pills) */}
              <div className="filter-pills">
                <button 
                  className={`pill-btn ${filterType === 'todos' ? 'active' : ''}`} 
                  onClick={() => setFilterType('todos')}
                >
                  Todos
                </button>
                <button 
                  className={`pill-btn ${filterType === 'filme' ? 'active' : ''}`} 
                  onClick={() => setFilterType('filme')}
                >
                  Filmes
                </button>
                <button 
                  className={`pill-btn ${filterType === 'serie' ? 'active' : ''}`} 
                  onClick={() => setFilterType('serie')}
                >
                  Séries
                </button>
              </div>

              {/* Dropdown de Ordenação Clean */}
              <div className="sort-dropdown-clean">
                <FaSortAmountDown className="sort-icon" />
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="recentes">Mais Recentes</option>
                  <option value="maior_nota">Maior Nota</option>
                  <option value="menor_nota">Menor Nota</option>
                  <option value="az">A-Z</option>
                </select>
              </div>
            </div>

            {/* Lista de Avaliações */}
            <div className="ratings-grid">
              {displayedRatings.length > 0 ? (
                displayedRatings.map(item => (
                  <div key={item.id} className="rating-card">
                    <div className="rating-poster">
                      <Image src={item.poster} alt={item.title} width={60} height={90} unoptimized />
                    </div>
                    <div className="rating-info">
                      <h4 className="rating-title">{item.title}</h4>
                      <span className="rating-type">{item.type}</span>
                      <span className="rating-date">{item.date}</span>
                    </div>
                    <div className="rating-score">
                      <FaStar /> {item.rating}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results">Nenhuma avaliação encontrada com este filtro.</p>
              )}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="reviews-list fade-in">
            {reviewsData.map(item => (
              <div key={item.id} className="review-card">
                <div className="review-header">
                  <Image src={item.poster} alt={item.title} width={50} height={75} className="review-thumb" unoptimized />
                  <div className="review-meta">
                    <h4>{item.title}</h4>
                    <span className="review-date">{item.date}</span>
                  </div>
                </div>
                <div className="review-body">
                  <FaQuoteRight className="quote-icon" />
                  <p>"{item.excerpt}"</p>
                </div>
                <div className="review-footer">
                  <span className="review-likes">❤️ {item.likes} likes</span>
                  <button className="read-more-btn">Ver review completo</button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'historico':
        return (
          <div className="history-list fade-in">
            {historyData.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-icon-box">{item.icon}</div>
                <div className="history-details">
                  <p><span className="history-action">{item.action}</span> <strong className="history-target"> {item.item}</strong></p>
                  <span className="history-time">{item.date}</span>
                </div>
              </div>
            ))}
            <button className="load-more-history">Carregar mais atividade</button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="favorites-layout">
      <Header />
      <div className="favorites-container">
        <header className="favorites-header">
          <h1>Seus Favoritos</h1>
          <p>Todos os filmes, séries, notas e reviews que você guardou no seu cofre.</p>
        </header>

        <div className="tabs-container">
          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === 'favoritos' ? 'active' : ''}`} onClick={() => setActiveTab('favoritos')}><FaHeart /> Favoritos</button>
            <button className={`tab-btn ${activeTab === 'avaliacoes' ? 'active' : ''}`} onClick={() => setActiveTab('avaliacoes')}><FaStar /> Avaliações</button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}><FaQuoteRight /> Reviews</button>
            <button className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`} onClick={() => setActiveTab('historico')}><FaHistory /> Histórico</button>
          </div>
          <div className="tab-content-area">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritosPage;