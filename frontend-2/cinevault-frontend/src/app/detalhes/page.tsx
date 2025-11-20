'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import { 
  FaStar, FaHeart, FaPlus, FaPlay, FaComment, FaFire, 
  FaShareAlt, FaImdb, FaChevronDown, FaChevronUp, 
  FaExclamationTriangle, FaCheckCircle, FaRegSmile
} from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts';
import '../../styles/details.css';

// --- DADOS MOCKADOS COMPLETOS (ARCANE) ---
const mediaData = {
  id: 1,
  type: 'serie',
  title: 'Arcane: League of Legends',
  originalTitle: 'Arcane',
  year: 2021,
  duration: '40m',
  rating: '16',
  genres: ['Animação', 'Ação', 'Aventura', 'Sci-Fi'],
  // Imagens estilo Steampunk/Neon
  posterUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=600&auto=format&fit=crop', 
  backdropUrl: 'https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=1600&auto=format&fit=crop',
  trailerId: 'fXmAurh012s',
  synopsis: 'Em meio ao conflito entre as cidades-gêmeas de Piltover e Zaun, duas irmãs lutam em lados opostos de uma guerra entre tecnologias mágicas e convicções conflitantes.',
  info: {
    country: 'EUA',
    language: 'Inglês',
    studio: 'Fortiche Production',
    status: 'Em lançamento'
  },
  scores: {
    global: 9.0,
    user: 0,
    technical: {
      roteiro: 9.5,
      direcao: 9.8,
      atuacao: 9.2,
      trilha: 9.9,
      fotografia: 10.0
    },
    distribution: [
      { note: '1', count: 20 }, { note: '2', count: 10 }, { note: '3', count: 30 },
      { note: '4', count: 50 }, { note: '5', count: 100 }, { note: '6', count: 200 },
      { note: '7', count: 500 }, { note: '8', count: 1200 }, { note: '9', count: 3500 },
      { note: '10', count: 5000 },
    ]
  },
  popularity: {
    rank: 1,
    trend: 'up'
  },
  streaming: [
    { name: 'Netflix', logo: '/images/netflix-logo.png', status: 'Incluso', quality: '4K HDR', lang: 'Leg/Dub' }
  ],
  cast: [
    { name: 'Hailee Steinfeld', character: 'Vi', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { name: 'Ella Purnell', character: 'Jinx', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80' },
    { name: 'Kevin Alejandro', character: 'Jayce', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Katie Leung', character: 'Caitlyn', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
  ],
  crew: [
    { role: 'Criador', name: 'Christian Linke' },
    { role: 'Criador', name: 'Alex Yee' },
    { role: 'Diretor', name: 'Pascal Charrue' },
  ],
  timeline: [
    { year: 2021, event: 'Lançamento da 1ª Temporada' },
    { year: 2022, event: 'Vencedor do Emmy de Melhor Animação' },
    { year: 2024, event: 'Lançamento da 2ª Temporada' },
  ],
  seasons: [
    {
      id: 1, number: 1, year: 2021, eps: 9, rating: 9.2, cover: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=200&q=80',
      episodes: [
        { num: 1, title: 'Welcome to the Playground', dur: '43m', rate: 8.9, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
        { num: 2, title: 'Some Mysteries Are Better Left Unsolved', dur: '41m', rate: 8.8, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
      ],
      comments: [
        { user: 'JinxFan99', text: 'O final dessa temporada me destruiu completamente. Perfeito.', date: '2 anos atrás' },
        { user: 'PiltoverGuard', text: 'A construção de mundo aqui é surreal.', date: '2 anos atrás' }
      ]
    },
    {
      id: 2, number: 2, year: 2024, eps: 9, rating: 9.4, cover: 'https://images.unsplash.com/photo-1614728853913-1e2468421b59?auto=format&fit=crop&w=200&q=80',
      episodes: [],
      comments: [
        { user: 'ViktorMain', text: 'A evolução da animação da T1 pra T2 é insana!', date: '2 dias atrás' }
      ]
    }
  ],
  trivia: [
    { text: 'A produção da primeira temporada levou 6 anos para ser concluída.', spoiler: false },
    { text: 'A cena final da temporada 1 mostra um míssil atingindo o conselho.', spoiler: true },
  ],
  reviews: [
    { user: 'CineMaster', rating: 10, text: 'Visualmente deslumbrante. A melhor adaptação de jogo já feita.', date: '2 dias atrás', likes: 45 },
    { user: 'SeriesLover', rating: 9, text: 'Roteiro impecável, mas o ritmo cai no meio.', date: '1 semana atrás', likes: 12 },
  ]
};

const DetailsPage = () => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [activeSeason, setActiveSeason] = useState(mediaData.seasons[0]);
  const [showSpoiler, setShowSpoiler] = useState<number | null>(null);
  const [userRate, setUserRate] = useState(0);

  const toggleTrailer = () => setIsTrailerOpen(!isTrailerOpen);

  return (
    <div className="details-layout">
      <Header />
      
      {/* --- 1. HERO SECTION --- */}
      <div className="hero-section">
        <div className="hero-backdrop">
          <Image src={mediaData.backdropUrl} alt="Backdrop" fill className="backdrop-img" priority />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content container">
          <div className="hero-left">
            <div className="main-poster-wrapper">
              <Image src={mediaData.posterUrl} alt={mediaData.title} width={300} height={450} className="main-poster" priority />
              <div className="poster-glow"></div>
            </div>
            <div className="hero-actions-grid">
              <button className="hero-btn primary" onClick={() => setUserRate(10)}>
                <FaStar /> Avaliar
              </button>
              <button className="hero-btn secondary"><FaHeart /> Favorito</button>
              <button className="hero-btn secondary"><FaPlus /> Quero Ver</button>
              <button className="hero-btn secondary"><FaShareAlt /> Compartilhar</button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-header">
              <div className="hero-meta-top">
                <span className="content-tag">{mediaData.type === 'serie' ? 'SÉRIE' : 'FILME'}</span>
                {mediaData.popularity.rank <= 10 && (
                  <span className="popularity-tag"><FaFire /> #{mediaData.popularity.rank} em Popularidade</span>
                )}
              </div>
              <h1 className="hero-title">{mediaData.title}</h1>
              <div className="hero-meta-data">
                <span className="meta-year">{mediaData.year}</span>
                <span className="meta-dot">•</span>
                <span className="meta-rating-age">{mediaData.rating}</span>
                <span className="meta-dot">•</span>
                <span className="meta-duration">{mediaData.duration}</span>
                <span className="meta-dot">•</span>
                <div className="meta-genres">
                  {mediaData.genres?.map(g => <span key={g}>{g}</span>)}
                </div>
              </div>
            </div>

            <div className="hero-trailer-area">
              <button className="play-trailer-btn" onClick={toggleTrailer}>
                <FaPlay className="play-icon" />
                <div className="play-text">
                  <span className="pt-title">Assistir Trailer</span>
                  <span className="pt-sub">Trailer Oficial 1</span>
                </div>
              </button>
            </div>

            <div className="rating-hub">
              <div className="global-score">
                <div className="score-circle">
                  <span className="sc-val">{mediaData.scores.global}</span>
                  <span className="sc-max">/10</span>
                </div>
                <span className="sc-label">CineVault Score</span>
              </div>
              <div className="tech-scores">
                <div className="tech-bar">
                  <span>Roteiro</span>
                  <div className="progress"><div style={{width: `${mediaData.scores.technical.roteiro * 10}%`}}></div></div>
                </div>
                <div className="tech-bar">
                  <span>Direção</span>
                  <div className="progress"><div style={{width: `${mediaData.scores.technical.direcao * 10}%`}}></div></div>
                </div>
                <div className="tech-bar">
                  <span>Atuações</span>
                  <div className="progress"><div style={{width: `${mediaData.scores.technical.atuacao * 10}%`}}></div></div>
                </div>
              </div>
            </div>

            <div className="streaming-section">
              <h4>Onde Assistir</h4>
              <div className="streaming-list">
                {mediaData.streaming?.map((st, i) => (
                  <div key={i} className="streaming-item">
                    <div className="streaming-logo-placeholder">{st.name[0]}</div>
                    <div className="streaming-info">
                      <span className="st-name">{st.name}</span>
                      <div className="st-badges">
                        <span className="badge-status">{st.status}</span>
                        <span className="badge-quality">{st.quality}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="details-body container">
        <div className="details-content-col">
          <section className="content-block">
            <h2 className="section-heading">Sinopse</h2>
            <p className="synopsis-text">{mediaData.synopsis}</p>
            <div className="info-grid">
              <div className="info-item"><strong>Título Original:</strong> {mediaData.originalTitle}</div>
              <div className="info-item"><strong>País:</strong> {mediaData.info.country}</div>
              <div className="info-item"><strong>Idioma Original:</strong> {mediaData.info.language}</div>
              <div className="info-item"><strong>Estúdio:</strong> {mediaData.info.studio}</div>
            </div>
          </section>

          <section className="content-block">
            <h2 className="section-heading">Elenco Principal</h2>
            <div className="cast-grid">
              {mediaData.cast?.map((actor, i) => (
                <div key={i} className="cast-card">
                  <Image src={actor.photo} alt={actor.name} width={80} height={80} className="cast-photo" unoptimized />
                  <div className="cast-info">
                    <span className="actor-name">{actor.name}</span>
                    <span className="char-name">{actor.character}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="crew-list">
              {mediaData.crew?.map((c, i) => (
                <div key={i} className="crew-item"><strong>{c.role}:</strong> {c.name}</div>
              ))}
            </div>
          </section>

          {mediaData.type === 'serie' && (
            <section className="content-block seasons-block">
              <div className="seasons-header">
                <h2 className="section-heading">Temporadas</h2>
                <div className="season-selector">
                  {mediaData.seasons?.map(s => (
                    <button 
                      key={s.id} 
                      className={`season-btn ${activeSeason?.id === s.id ? 'active' : ''}`}
                      onClick={() => setActiveSeason(s)}
                    >
                      T{s.number}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="active-season-display">
                <div className="season-meta">
                  {activeSeason && (
                    <>
                      <Image src={activeSeason.cover} alt="Capa" width={100} height={150} className="season-cover" unoptimized />
                      <div className="season-details">
                        <h3>Temporada {activeSeason.number} <span className="year">({activeSeason.year})</span></h3>
                        <div className="season-stats">
                          <span><FaStar className="gold" /> {activeSeason.rating}</span>
                          <span>• {activeSeason.eps} Episódios</span>
                        </div>
                        <div className="season-actions">
                          <button>Ver Lista de Episódios</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="season-discussion">
                  <h4><FaComment /> Discussão da Temporada {activeSeason?.number}</h4>
                  <div className="season-comment-input">
                    <input type="text" placeholder={`O que achou da T${activeSeason?.number}?`} />
                    <button><FaPlus /></button>
                  </div>
                  <div className="season-comments-list">
                    {activeSeason?.comments && activeSeason.comments.length > 0 ? (
                      activeSeason.comments.map((c: any, idx: number) => (
                        <div key={idx} className="sc-item">
                          <span className="sc-user">{c.user}:</span>
                          <span className="sc-text">{c.text}</span>
                          <span className="sc-date">{c.date}</span>
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">Seja o primeiro a comentar esta temporada!</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="content-block">
            <h2 className="section-heading">Curiosidades</h2>
            <div className="trivia-list">
              {mediaData.trivia?.map((t, i) => (
                <div key={i} className="trivia-item">
                  <div className="trivia-icon"><FaExclamationTriangle /></div>
                  <div className="trivia-content">
                    {t.spoiler && showSpoiler !== i ? (
                      <div className="spoiler-mask" onClick={() => setShowSpoiler(i)}>
                        <span>Alerta de Spoiler! Clique para ver.</span>
                      </div>
                    ) : (
                      <p>{t.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="content-block comments-block">
            <h2 className="section-heading">Comentários da Comunidade</h2>
            <div className="comment-input-area">
              <textarea placeholder="O que você achou desta obra?" rows={3}></textarea>
              <div className="comment-tools">
                <label><input type="checkbox" /> Contém Spoiler</label>
                <button className="post-btn">Publicar</button>
              </div>
            </div>
            <div className="comments-list">
              {mediaData.reviews?.map((review, i) => (
                <div key={i} className="comment-card">
                  <div className="comment-header">
                    <div className="user-badge">{review.user[0]}</div>
                    <div className="user-meta">
                      <span className="username">{review.user}</span>
                      <span className="date">{review.date}</span>
                    </div>
                    <span className="user-rating"><FaStar /> {review.rating}</span>
                  </div>
                  <p className="comment-text">{review.text}</p>
                  <div className="comment-footer">
                    <button><FaHeart /> {review.likes}</button>
                    <button>Responder</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="details-sidebar">
          <div className="sidebar-widget timeline-widget">
            <h3>Linha do Tempo</h3>
            <ul className="timeline-list">
              {mediaData.timeline?.map((t, i) => (
                <li key={i}>
                  <span className="tl-year">{t.year}</span>
                  <span className="tl-event">{t.event}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-widget stats-widget">
            <h3>Distribuição de Notas</h3>
            <div className="chart-container-box">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mediaData.scores.distribution || []}>
                  <XAxis dataKey="note" hide />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                    cursor={{fill: 'rgba(255,255,255,0.1)'}}
                  />
                  <Bar dataKey="count" fill="var(--accent-color)" radius={[4, 4, 0, 0]}>
                    {(mediaData.scores.distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index >= 7 ? 'var(--accent-color)' : '#444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="stats-note">A maioria dos usuários avaliou como Excelente.</p>
          </div>
        </aside>
      </div>

      <div className="recommendations-section container">
        <h2 className="section-heading">Você também pode gostar</h2>
        <div className="rec-grid">
           {[1,2,3,4,5].map(i => (
             <div key={i} className="rec-card">
                <div className="rec-placeholder"></div>
                <span>Título Similar {i}</span>
             </div>
           ))}
        </div>
      </div>

      {isTrailerOpen && (
        <div className="trailer-modal-overlay" onClick={toggleTrailer}>
          <div className="trailer-modal-content">
            <iframe 
              width="100%" height="100%" 
              src={`https://www.youtube.com/embed/${mediaData.trailerId}?autoplay=1`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;