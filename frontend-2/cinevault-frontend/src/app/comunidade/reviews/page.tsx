'use client';

import React, { useState, useEffect } from 'react'; // 1. Adicionado useEffect
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/Header';
import { 
  FaStar, FaHeart, FaComment, FaShareAlt, FaFilter, 
  FaCalendarAlt, FaSearch, FaTrophy, FaQuoteLeft, 
  FaPlay, FaReply, FaTimes, FaChartBar
} from 'react-icons/fa';
import '../../../styles/community-reviews.css';

// --- MOCK DATA ---
const users = [
  { id: 1, name: 'Cinephile_X', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60', badge: 'Crítico de Ouro', reviews: 142, avg: 8.5 },
  { id: 2, name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', badge: 'Top Comentarista', reviews: 89, avg: 7.8 },
  { id: 3, name: 'Neo Anderson', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60', badge: 'Novo Talento', reviews: 12, avg: 9.0 },
];

const reviews = [
  {
    id: 1,
    user: users[0],
    movie: { title: 'Duna: Parte Dois', poster: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&auto=format&fit=crop&q=60', year: 2024, trailer: 'Way9Dexny3w' },
    rating: 10,
    date: 'Há 2 horas',
    text: 'Denis Villeneuve fez de novo. Uma experiência cinematográfica visceral que exige ser vista na maior tela possível. A trilha sonora de Hans Zimmer é de outro mundo.',
    likes: 1240,
    commentsCount: 45,
    highlight: true 
  },
  {
    id: 2,
    user: users[1],
    movie: { title: 'O Urso (The Bear)', poster: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&auto=format&fit=crop&q=60', year: 2023, trailer: 'yBqM23d86vI' },
    rating: 9.5,
    date: 'Ontem',
    text: 'A tensão na cozinha nunca foi tão palpável. Jeremy Allen White entrega uma performance digna de todos os prêmios. Stress puro, mas impossível parar de assistir.',
    likes: 856,
    commentsCount: 120,
    highlight: true
  },
  {
    id: 3,
    user: users[2],
    movie: { title: 'Vidas Passadas', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=60', year: 2023, trailer: 'kA244xewjcI' },
    rating: 8.0,
    date: '3 dias atrás',
    text: 'Uma história de amor sutil e devastadora sobre o que poderia ter sido. O conceito de In-Yun é explorado de forma belíssima.',
    likes: 430,
    commentsCount: 22,
    highlight: false
  },
  {
    id: 4,
    user: users[0],
    movie: { title: 'Godzilla Minus One', poster: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=300&auto=format&fit=crop&q=60', year: 2023, trailer: 'VvSrHIX5a-0' },
    rating: 9.0,
    date: '1 semana atrás',
    text: 'Finalmente um filme de monstro onde os humanos importam. Efeitos visuais impressionantes para o orçamento.',
    likes: 2100,
    commentsCount: 300,
    highlight: true
  },
  {
    id: 5,
    user: users[1],
    movie: { title: 'Pobres Criaturas', poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=60', year: 2023, trailer: 'RlbR5BNLLx8' },
    rating: 7.5,
    date: '2 semanas atrás',
    text: 'Visualmente deslumbrante, mas a narrativa se perde um pouco no terceiro ato. Ainda assim, Emma Stone está fantástica.',
    likes: 150,
    commentsCount: 15,
    highlight: false
  },
];

const stats = {
  totalReviews: '15.4K',
  newToday: '+120',
  avgCommunity: 8.2,
  trendingType: 'Séries'
};

const commentsThread = [
  { id: 101, user: 'MovieBuff99', avatar: users[2].avatar, text: 'Concordo totalmente! A fotografia é incrível.', time: '1h atrás', likes: 5 },
  { id: 102, user: 'SeriesFan', avatar: users[1].avatar, text: 'Achei o ritmo um pouco lento no começo, mas compensa.', time: '30m atrás', likes: 2, replies: [
    { id: 103, user: 'Cinephile_X', avatar: users[0].avatar, text: 'É uma construção de mundo necessária.', time: '10m atrás', likes: 1 }
  ]}
];

// --- COMPONENTES ---

const CommunityReviewsPage = () => {
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [filterText, setFilterText] = useState('');

  // 2. CORREÇÃO: useEffect para controlar o scroll do body
  // Isso garante que o scroll seja destravado se o usuário sair da página
  useEffect(() => {
    if (selectedReview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Função de limpeza: roda quando o componente é desmontado (ex: ao mudar de página)
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedReview]);

  // Ordenação automática por likes
  const highlights = [...reviews].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const feed = reviews; 

  const openModal = (review: any) => {
    // Removido o document.body.style daqui, o useEffect cuida disso
    setSelectedReview(review);
  };

  const closeModal = () => {
    // Removido o document.body.style daqui, o useEffect cuida disso
    setSelectedReview(null);
  };

  return (
    <div className="community-layout">
      <Header />
      
      <div className="community-container">
        
        {/* 1. CABEÇALHO */}
        <header className="community-header">
          <h1>Reviews da Comunidade</h1>
          <p>Descubra o que os cinéfilos estão assistindo, amando (ou odiando) agora.</p>
        </header>

        {/* 6. ESTATÍSTICAS GERAIS (Dashboard) */}
        <section className="stats-dashboard">
          <div className="stat-card">
            <FaComment className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{stats.totalReviews}</span>
              <span className="stat-label">Reviews Totais</span>
            </div>
          </div>
          <div className="stat-card">
            <FaChartBar className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value accent">{stats.newToday}</span>
              <span className="stat-label">Novas Hoje</span>
            </div>
          </div>
          <div className="stat-card">
            <FaStar className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{stats.avgCommunity}</span>
              <span className="stat-label">Média Geral</span>
            </div>
          </div>
          <div className="stat-card">
            <FaHeart className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{stats.trendingType}</span>
              <span className="stat-label">Em Alta</span>
            </div>
          </div>
        </section>

        {/* 4. DESTAQUES DA SEMANA */}
        <section className="highlights-section">
          <h2 className="section-title"><FaTrophy /> Destaques da Semana</h2>
          <div className="highlights-grid">
            {highlights.map(review => (
              <div key={review.id} className="highlight-card" onClick={() => openModal(review)}>
                <div className="hl-backdrop">
                  <Image src={review.movie.poster} alt={review.movie.title} fill className="hl-bg-img" unoptimized />
                  <div className="hl-overlay"></div>
                </div>
                <div className="hl-content">
                  {/* --- LINK DE USUÁRIO (COM STOP PROPAGATION) --- */}
                  <div className="hl-user">
                    <Link 
                      href="/perfil" 
                      className="user-profile-link" 
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <Image src={review.user.avatar} alt={review.user.name} width={40} height={40} className="user-avatar" unoptimized />
                      <span>{review.user.name}</span>
                    </Link>
                  </div>
                  {/* --------------------------------------------- */}
                  <h3>{review.movie.title}</h3>
                  <div className="hl-rating">
                    <FaStar /> {review.rating}/10
                  </div>
                  <p className="hl-excerpt">"{review.text.substring(0, 80)}..."</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="main-content-area">
          
          {/* ESQUERDA: FEED E FILTROS */}
          <div className="feed-column">
            
            {/* 3. FILTROS AVANÇADOS */}
            <div className="filters-bar">
              <div className="search-box">
                <FaSearch />
                <input 
                  type="text" 
                  placeholder="Buscar filme ou série..." 
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              <div className="filters-actions">
                <div className="custom-select">
                  <select>
                    <option>Todas as Notas</option>
                    <option>9 - 10 (Excelentes)</option>
                    <option>7 - 8 (Bons)</option>
                    <option>0 - 6 (Medianos/Ruins)</option>
                  </select>
                </div>
                <div className="custom-select">
                  <select>
                    <option>Todos os Tipos</option>
                    <option>Filmes</option>
                    <option>Séries</option>
                    <option>Animes</option>
                  </select>
                </div>
                <div className="custom-select">
                  <select>
                    <option>Qualquer Data</option>
                    <option>Últimas 24h</option>
                    <option>Esta Semana</option>
                    <option>Este Mês</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. FEED PRINCIPAL */}
            <div className="reviews-feed">
              {feed.map(review => (
                <div key={review.id} className="feed-card">
                  <div className="feed-poster-col">
                    <Image src={review.movie.poster} alt={review.movie.title} width={100} height={150} className="feed-poster" unoptimized />
                  </div>
                  <div className="feed-content-col">
                    <div className="feed-header">
                      
                      {/* --- LINK DE USUÁRIO NO FEED --- */}
                      <Link href="/perfil" className="user-profile-link">
                        <div className="feed-user-info">
                          <Image src={review.user.avatar} alt={review.user.name} width={35} height={35} className="user-avatar-small" unoptimized />
                          <div>
                            <span className="feed-username">{review.user.name}</span>
                            <span className="feed-date">{review.date}</span>
                          </div>
                        </div>
                      </Link>
                      {/* ----------------------------- */}

                      <div className="feed-rating">
                        <FaStar /> <span>{review.rating}</span>
                      </div>
                    </div>
                    
                    <Link href="/detalhes" className="feed-movie-title">{review.movie.title} <span className="year">({review.movie.year})</span></Link>
                    
                    <div className="feed-text">
                      <p>{review.text}</p>
                    </div>
                    
                    <div className="feed-actions">
                      <button className="action-btn like"><FaHeart /> {review.likes}</button>
                      <button className="action-btn comment" onClick={() => openModal(review)}><FaComment /> {review.commentsCount}</button>
                      <button className="action-btn share"><FaShareAlt /></button>
                      <button className="read-more-btn" onClick={() => openModal(review)}>Ler review completo</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DIREITA: SIDEBAR (TOP USUÁRIOS E RECOMENDAÇÕES) */}
          <aside className="community-sidebar">
            
            {/* 5. USUÁRIOS DESTAQUE */}
            <div className="sidebar-widget">
              <h3>Críticos da Semana</h3>
              <div className="top-users-list">
                {users.map((u, i) => (
                  <div key={u.id} className="top-user-card">
                    <div className="rank-num">#{i + 1}</div>
                    
                    {/* --- LINK DE USUÁRIO NA SIDEBAR --- */}
                    <Link href="/perfil" className="user-profile-link" style={{ flex: 1 }}>
                      <Image src={u.avatar} alt={u.name} width={45} height={45} className="user-avatar" unoptimized />
                      <div className="top-user-info">
                        <span className="top-user-name">{u.name}</span>
                        <span className="top-user-badge">{u.badge}</span>
                      </div>
                    </Link>
                    {/* -------------------------------- */}

                    <div className="top-user-stats">
                      <span>⭐ {u.avg}</span>
                      <span>📝 {u.reviews}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 10. RECOMENDAÇÕES DA COMUNIDADE */}
            <div className="sidebar-widget">
              <h3>Em Alta na Comunidade</h3>
              <div className="community-recs-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="comm-rec-item">
                    <div className="comm-rec-placeholder"></div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>

      </div>

      {/* 7. MODAL DE REVIEW INDIVIDUAL */}
      {selectedReview && (
        <div className="review-modal-overlay" onClick={closeModal}>
          <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeModal}><FaTimes /></button>
            
            <div className="modal-scroll-area">
              {/* Cabeçalho do Modal (Filme) */}
              <div className="modal-movie-header">
                <div className="modal-backdrop-wrapper">
                  {/* Usando poster como backdrop simulado com blur */}
                  <Image src={selectedReview.movie.poster} alt="bg" fill className="modal-backdrop-img" unoptimized />
                  <div className="modal-backdrop-overlay"></div>
                </div>
                
                <div className="modal-movie-info">
                  <Image src={selectedReview.movie.poster} alt={selectedReview.movie.title} width={120} height={180} className="modal-poster" unoptimized />
                  <div className="modal-movie-text">
                    <h2>{selectedReview.movie.title}</h2>
                    <div className="modal-meta">
                      <span>{selectedReview.movie.year}</span>
                      <span className="modal-rating-badge">⭐ {selectedReview.rating}/10</span>
                    </div>
                    <div className="modal-actions">
                      <Link href="/detalhes" className="modal-btn-primary">Ver Detalhes da Obra</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-body">
                {/* Review do Usuário */}
                <div className="modal-review-section">
                  <div className="modal-user-header">
                    
                    {/* --- LINK DE USUÁRIO NO MODAL --- */}
                    <Link href="/perfil" className="user-profile-link">
                      <Image src={selectedReview.user.avatar} alt={selectedReview.user.name} width={50} height={50} className="user-avatar" unoptimized />
                      <div>
                        <span className="modal-username">{selectedReview.user.name}</span>
                        <span className="modal-date">{selectedReview.date}</span>
                      </div>
                    </Link>
                    {/* ------------------------------ */}

                  </div>
                  <div className="modal-review-text">
                    <FaQuoteLeft className="quote-mark" />
                    <p>{selectedReview.text}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  </div>
                  <div className="modal-review-actions">
                    <button><FaHeart /> {selectedReview.likes}</button>
                    <button><FaShareAlt /> Compartilhar</button>
                  </div>
                </div>

                {/* Trailer Incorporado */}
                <div className="modal-trailer">
                  <h3>Trailer Relacionado</h3>
                  <iframe 
                    width="100%" 
                    height="300" 
                    src={`https://www.youtube.com/embed/${selectedReview.movie.trailer}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Comentários em Thread */}
                <div className="modal-comments">
                  <h3>Comentários ({selectedReview.commentsCount})</h3>
                  <div className="modal-comment-list">
                    {commentsThread.map(comment => (
                      <div key={comment.id} className="thread-item">
                        <div className="thread-main">
                          <Image src={comment.avatar} alt={comment.user} width={35} height={35} className="user-avatar-small" unoptimized />
                          <div className="thread-content">
                            <div className="thread-header">
                              <span className="thread-user">{comment.user}</span>
                              <span className="thread-time">{comment.time}</span>
                            </div>
                            <p>{comment.text}</p>
                            <div className="thread-actions">
                              <button><FaHeart /> {comment.likes}</button>
                              <button><FaReply /> Responder</button>
                            </div>
                          </div>
                        </div>
                        {/* Respostas (Nested) */}
                        {comment.replies && comment.replies.map(reply => (
                          <div key={reply.id} className="thread-reply">
                            <Image src={reply.avatar} alt={reply.user} width={25} height={25} className="user-avatar-mini" unoptimized />
                            <div className="thread-content">
                              <div className="thread-header">
                                <span className="thread-user">{reply.user}</span>
                                <span className="thread-time">{reply.time}</span>
                              </div>
                              <p>{reply.text}</p>
                              <div className="thread-actions">
                                <button><FaHeart /> {reply.likes}</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunityReviewsPage;