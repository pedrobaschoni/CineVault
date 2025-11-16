'use client';

import React, { useRef, useState } from 'react';
import Header from '../../components/Header';
import MovieCard from '../../components/MovieCard';
import RankingSection from '../../components/RankingSection';
import BackToTopButton from '../../components/BackToTopButton';
import Image from 'next/image'; // Importa o Image para os avatares e posters
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaStar, 
  FaComment, 
  FaHeart 
} from 'react-icons/fa'; // Ícones para o carrossel e feed
import '../../styles/home.css';
import '../../styles/header.css';
import '../../styles/moviecards.css';
import '../../styles/ranking.css';
import ImdbCarousel from '../../components/ImdbCarousel'; // (Verifique o caminho)
import '../../styles/imdb-carousel.css'; // (Verifique o caminho)
import '../../styles/back-to-top.css';

// Componente do Carrossel (Últimas Atualizações / Em Destaques)

const HorizontalCarousel = ({ title, movies }: { title: string, movies: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="home-section carousel-section">
      <h2 className="section-title">{title}</h2>
      <div className="carousel-container">
        <button className="carousel-btn prev" onClick={() => scroll('left')}>
          <FaChevronLeft />
        </button>
        <div className="carousel-wrapper" ref={scrollRef}>
          {movies.map(movie => (
            <div className="carousel-item" key={movie.id}>
              <MovieCard
                title={movie.title}
                posterUrl={movie.posterUrl}
                type={movie.type}
                rating={movie.rating}
              />
            </div>
          ))}
        </div>
        <button className="carousel-btn next" onClick={() => scroll('right')}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

const HomePage = () => {

  // --- DADOS EXPANDIDOS ---

  // NO SEU 'src/app/home/page.tsx'

  // APAGUE a sua const 'recentMovies' antiga
  // E ADICIONE ESTA NO LUGAR:
  const ultimasAtualizacoesVideos = [
    {
      id: 1,
      heroImage: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=300&h=450&fit=crop', // Imagem de fundo
      posterUrl: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=300&h=450&fit=crop', // Poster do filme
      videoTitle: "'Fallout' Returns Dec. 17",
      videoDescription: 'Watch the Season 2 Trailer',
      duration: '2:38',
      likes: 1100,
      comments: 774,
    },
    {
      id: 2,
      heroImage: 'https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      posterUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=300&h=450&fit=crop',
      videoTitle: 'Wuthering Heights',
      videoDescription: 'Watch the Trailer',
      duration: '2:44',
      likes: 206,
      comments: 87,
    },
    {
      id: 3,
      heroImage: 'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      posterUrl: 'https://images.pexels.com/photos/3760522/pexels-photo-3760522.jpeg?w=300&h=450&fit=crop',
      videoTitle: 'Glen Powell and Lee Pace Worship Edgar Wright',
      videoDescription: 'Watch Our Running Man Interview',
      duration: '3:40',
      likes: 30,
      comments: 22,
    },
    {
      id: 4,
      heroImage: 'https://images.pexels.com/photos/2691459/pexels-photo-2691459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      posterUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=300&h=450&fit=crop',
      videoTitle: "Timothée Chalamet Stars in 'Marty Supreme'",
      videoDescription: 'Watch the Trailer',
      duration: '2:27',
      likes: 260,
      comments: 122,
    },
  ];

  const todayHighlights = [
    { id: 'h1', title: 'A Casa do Dragão', posterUrl: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?w=300&h=450&fit=crop', type: 'série', rating: 8.5 },
    { id: 'h2', title: 'Mad Max: Estrada da Fúria', posterUrl: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=300&h=450&fit=crop', type: 'filme', rating: 8.7 },
    { id: 'h3', title: 'Oppenheimer', posterUrl: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=300&h=450&fit=crop', type: 'filme', rating: 8.9 },
    { id: 'h4', title: 'Breaking Bad', posterUrl: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=300&h=450&fit=crop', type: 'série', rating: 9.7 },
    { id: 'h5', title: 'Planeta Terra II', posterUrl: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?w=300&h=450&fit=crop', type: 'série', rating: 9.8 },
    { id: 'h6', title: 'Jujutsu Kaisen', posterUrl: 'https://images.pexels.com/photos/3760522/pexels-photo-3760522.jpeg?w=300&h=450&fit=crop', type: 'anime', rating: 9.2 },
    { id: 'h7', title: 'Barbie', posterUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=300&h=450&fit=crop', type: 'filme', rating: 7.9 },
    { id: 'h8', title: 'One Piece (Anime)', posterUrl: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=300&h=450&fit=crop', type: 'anime', rating: 8.9 },
    { id: 'h9', title: 'Duna: Parte Dois', posterUrl: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=300&h=450&fit=crop', type: 'filme', rating: 8.5 },
    { id: 'h10', title: 'O Problema dos 3 Corpos', posterUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=300&h=450&fit=crop', type: 'série', rating: 7.8 },
    { id: 'h11', title: 'Stranger Things', posterUrl: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=300&h=450&fit=crop', type: 'série', rating: 8.1 },
    { id: 'h12', title: 'Attack on Titan', posterUrl: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=300&h=450&fit=crop', type: 'anime', rating: 8.7 },
    { id: 'h13', title: 'Pobres Criaturas', posterUrl: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?w=300&h=450&fit=crop', type: 'filme', rating: 7.5 },
    { id: 'h14', title: 'One Piece (Live Action)', posterUrl: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=300&h=450&fit=crop', type: 'série', rating: 8.4 },
    { id: 'h15', title: 'O Urso', posterUrl: 'https://images.pexels.com/photos/3814517/pexels-photo-3814517.jpeg?w=300&h=450&fit=crop', type: 'série', rating: 8.8 },
  ];
  
  const recentLaunches = {
    cinema: [
      { id: 'c1', title: 'Filme no Cinema 1', posterUrl: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=150&h=225&fit=crop', date: '25 DEZ', score: 92 },
      { id: 'c2', title: 'Filme no Cinema 2', posterUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=150&h=225&fit=crop', date: '20 DEZ', score: 81 },
      { id: 'c3', title: 'Filme no Cinema 3', posterUrl: 'https://images.pexels.com/photos/3760522/pexels-photo-3760522.jpeg?w=150&h=225&fit=crop', date: '18 DEZ', score: 65 },
      { id: 'c4', title: 'Filme no Cinema 4', posterUrl: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=150&h=225&fit=crop', date: '15 DEZ', score: 78 },
      { id: 'c5', title: 'Filme no Cinema 5', posterUrl: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=150&h=225&fit=crop', date: '12 DEZ', score: 82 },
      { id: 'c6', title: 'Filme no Cinema 6', posterUrl: 'https://images.pexels.com/photos/3814517/pexels-photo-3814517.jpeg?w=150&h=225&fit=crop', date: '10 DEZ', score: 71 },
    ],
    streaming: [
      { id: 's1', title: 'Série no Streaming 1', posterUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=150&h=225&fit=crop', date: '22 DEZ', score: 88 },
      { id: 's2', title: 'Série no Streaming 2', posterUrl: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=150&h=225&fit=crop', date: '21 DEZ', score: 74 },
      { id: 's3', title: 'Série no Streaming 3', posterUrl: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?w=150&h=225&fit=crop', date: '19 DEZ', score: 90 },
      { id: 's4', title: 'Série no Streaming 4', posterUrl: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=150&h=225&fit=crop', date: '17 DEZ', score: 85 },
      { id: 's5', title: 'Série no Streaming 5', posterUrl: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?w=150&h=225&fit=crop', date: '15 DEZ', score: 79 },
      { id: 's6', title: 'Série no Streaming 6', posterUrl: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=150&h=225&fit=crop', date: '14 DEZ', score: 83 },
    ]
  };

  const topRatedWeek = {
    filmes: [
      { id: 'tf1', pos: 1, title: 'Duna 2', posterUrl: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=60&h=90&fit=crop' },
      { id: 'tf2', pos: 2, title: 'Barbie', posterUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=60&h=90&fit=crop' },
      { id: 'tf3', pos: 3, title: 'Oppenheimer', posterUrl: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=60&h=90&fit=crop' },
      { id: 'tf4', pos: 4, title: 'Pobres Criaturas', posterUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=60&h=90&fit=crop' },
      { id: 'tf5', pos: 5, title: 'Mad Max', posterUrl: 'https://images.pexels.com/photos/3760522/pexels-photo-3760522.jpeg?w=60&h=90&fit=crop' },
    ],
    series: [
      { id: 'ts1', pos: 1, title: '3 Corpos', posterUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=60&h=90&fit=crop' },
      { id: 'ts2', pos: 2, title: 'Stranger T.', posterUrl: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=60&h=90&fit=crop' },
      { id: 'ts3', pos: 3, title: 'Casa do Dragão', posterUrl: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?w=60&h=90&fit=crop' },
      { id: 'ts4', pos: 4, title: 'O Urso', posterUrl: 'https://images.pexels.com/photos/3814517/pexels-photo-3814517.jpeg?w=60&h=90&fit=crop' },
      { id: 'ts5', pos: 5, title: 'Gen V', posterUrl: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=60&h=90&fit=crop' },
    ],
    animes: [
      { id: 'ta1', pos: 1, title: 'Jujutsu K.', posterUrl: 'https://images.pexels.com/photos/3760522/pexels-photo-3760522.jpeg?w=60&h=90&fit=crop' },
      { id: 'ta2', pos: 2, title: 'AOT', posterUrl: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=60&h=90&fit=crop' },
      { id: 'ta3', pos: 3, title: 'One Piece', posterUrl: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=60&h=90&fit=crop' },
      { id: 'ta4', pos: 4, title: 'Frieren', posterUrl: 'https://images.pexels.com/photos/3814517/pexels-photo-3814517.jpeg?w=60&h=90&fit=crop' },
      { id: 'ta5', pos: 5, title: 'Vinland Saga', posterUrl: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=60&h=90&fit=crop' },
    ],
    // --- CATEGORIAS ADICIONADAS ---
    documentarios: [
      { id: 'td1', pos: 1, title: 'Planeta Terra II', posterUrl: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?w=60&h=90&fit=crop' },
      { id: 'td2', pos: 2, title: 'Cosmos', posterUrl: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=60&h=90&fit=crop' },
      { id: 'td3', pos: 3, title: 'Free Solo', posterUrl: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=60&h=90&fit=crop' },
      { id: 'td4', pos: 4, title: 'O Golpista do Tinder', posterUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=60&h=90&fit=crop' },
      { id: 'td5', pos: 5, title: 'A Caverna', posterUrl: 'https://images.pexels.com/photos/3760522/pexels-photo-3760522.jpeg?w=60&h=90&fit=crop' },
    ],
    animacoes: [
      { id: 'tan1', pos: 1, title: 'Homem-Aranha: Aranhaverso', posterUrl: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=60&h=90&fit=crop' },
      { id: 'tan2', pos: 2, title: 'Divertidamente 2', posterUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=60&h=90&fit=crop' },
      { id: 'tan3', pos: 3, title: 'Toy Story', posterUrl: 'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?w=60&h=90&fit=crop' },
      { id: 'tan4', pos: 4, title: 'Gato de Botas 2', posterUrl: 'https://images.pexels.com/photos/3814517/pexels-photo-3814517.jpeg?w=60&h=90&fit=crop' },
      { id: 'tan5', pos: 5, title: 'Up - Altas Aventuras', posterUrl: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=60&h=90&fit=crop' },
    ]
  };
  
  const recommendations = [
    { id: 'r1', genre: 'Terror', title: 'Hereditário', posterUrl: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=400&h=225&fit=crop', desc: 'Uma noite arrepiante espera por você...' },
    { id: 'r2', genre: 'Comédia', title: 'Superbad', posterUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=400&h=225&fit=crop', desc: 'Garantia de boas risadas para sua sexta!' },
    { id: 'r3', genre: 'Romance', title: 'Questão de Tempo', posterUrl: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=400&h=225&fit=crop', desc: 'Para aquecer o coração.' },
    { id: 'r4', genre: 'Suspense', title: 'Os Suspeitos', posterUrl: 'https://images.pexels.com/photos/3814517/pexels-photo-3814517.jpeg?w=400&h=225&fit=crop', desc: 'Um final de tirar o fôlego.' },
  ];

  const awards = [
    { id: 'aw1', name: 'Oscar', img: 'https://images.pexels.com/photos/3814517/pexels-photo-3814517.jpeg?w=200&h=200&fit=crop&auto=compress' },
    { id: 'aw2', name: 'Emmy', img: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?w=200&h=200&fit=crop&auto=compress' },
    { id: 'aw3', name: 'Globo de Ouro', img: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?w=200&h=200&fit=crop&auto=compress' },
    { id: 'aw4', name: 'Crunchyroll', img: 'https://images.pexels.com/photos/2531912/pexels-photo-2531912.jpeg?w=200&h=200&fit=crop&auto=compress' },
    { id: 'aw5', name: 'Cannes', img: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=200&h=200&fit=crop&auto=compress' },
    { id: 'aw6', name: 'BAFTA', img: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=200&h=200&fit=crop&auto=compress' },
  ];

  const socialFeed = [
    { id: 'sf1', user: 'cinefilo_22', avatar: 'https://images.pexels.com/photos/1210243/pexels-photo-1210243.jpeg?w=50&h=50&fit=crop&auto=compress', rating: 9, comment: 'Duna 2 é uma obra-prima absoluta!' },
    { id: 'sf2', user: 'series_lover', avatar: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=50&h=50&fit=crop&auto=compress', rating: 7, comment: '3 Corpos começa lento, mas engrena!' },
    { id: 'sf3', user: 'otaku_br', avatar: 'https://images.pexels.com/photos/3760522/pexels-photo-3760522.jpeg?w=50&h=50&fit=crop&auto=compress', rating: 10, comment: 'Gojo Satoru é o melhor, sem mais.' },
    { id: 'sf4', user: 'terrorFan', avatar: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?w=50&h=50&fit=crop&auto=compress', rating: 8, comment: 'Hereditário é assustador demais! 😱' },
    { id: 'sf5', user: 'ana_luiza', avatar: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=50&h=50&fit=crop&auto=compress', rating: 5, comment: 'Não entendi a graça de Barbie... 😐' },
    { id: 'sf6', user: 'pedro_reviews', avatar: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=50&h=50&fit=crop&auto=compress', rating: 9, comment: 'Revendo Mad Max. Que filmaço!' },
  ];

  return (
    <div className="home-layout">
      <Header />
      <div className="home-container">
        <main className="home-content">
          
          {/* --- 1. Atualizações em Destaque e Ranking ao lado --- */}
          <div className="updates-rank-row">
            <div className="updates-column">
              <ImdbCarousel title="Últimas Atualizações" videos={ultimasAtualizacoesVideos} />
            </div>
            <div className="ranking-column">
              <RankingSection />
            </div>
          </div>

          {/* --- 2. Carrossel Em Destaques Hoje --- */}
          <HorizontalCarousel title="Em Destaques Hoje" movies={todayHighlights} />

          {/* --- 3. Lançamentos Recentes --- */}
          <section className="home-section">
            <h2 className="section-title">Lançamentos Recentes</h2>
            <div className="launch-section">
              <div className="launch-subsection">
                <h3 className="subsection-title">Nos Cinemas</h3>
                <div className="launch-grid">
                  {recentLaunches.cinema.map(item => (
                    <div className="launch-card" key={item.id}>
                      <Image src={item.posterUrl} alt={item.title} width={100} height={150} unoptimized />
                      <div className="launch-info">
                        <span className="launch-date">{item.date}</span>
                        <div className={`critic-score ${item.score >= 80 ? 'good' : item.score >= 60 ? 'medium' : 'bad'}`}>
                          {item.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="launch-subsection">
                <h3 className="subsection-title">No Streaming</h3>
                <div className="launch-grid">
                  {recentLaunches.streaming.map(item => (
                    <div className="launch-card" key={item.id}>
                      <Image src={item.posterUrl} alt={item.title} width={100} height={150} unoptimized />
                      <div className="launch-info">
                        <span className="launch-date">{item.date}</span>
                        <div className={`critic-score ${item.score >= 80 ? 'good' : item.score >= 60 ? 'medium' : 'bad'}`}>
                          {item.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* --- 4. Top Avaliados da Semana --- */}
        <section className="home-section">
          <h2 className="section-title">Top Avaliados da Semana</h2>
          <div className="top-rated-container">
            {/* Bloco 1 (Filmes) */}
            <div className="top-rated-list">
              <h3 className="subsection-title">Top 5 Filmes</h3>
              {topRatedWeek.filmes.map(item => (
                <div className="top-rated-item" key={item.id}>
                  <span className="top-rated-pos">{item.pos}</span>
                  <Image src={item.posterUrl} alt={item.title} width={40} height={60} unoptimized />
                  <span className="top-rated-title">{item.title}</span>
                </div>
              ))}
            </div>
            {/* Bloco 2 (Séries) */}
            <div className="top-rated-list">
              <h3 className="subsection-title">Top 5 Séries</h3>
              {topRatedWeek.series.map(item => (
                <div className="top-rated-item" key={item.id}>
                  <span className="top-rated-pos">{item.pos}</span>
                  <Image src={item.posterUrl} alt={item.title} width={40} height={60} unoptimized />
                  <span className="top-rated-title">{item.title}</span>
                </div>
              ))}
            </div>
            {/* Bloco 3 (Animes) */}
            <div className="top-rated-list">
              <h3 className="subsection-title">Top 5 Animes</h3>
              {topRatedWeek.animes.map(item => (
                <div className="top-rated-item" key={item.id}>
                  <span className="top-rated-pos">{item.pos}</span>
                  <Image src={item.posterUrl} alt={item.title} width={40} height={60} unoptimized />
                  <span className="top-rated-title">{item.title}</span>
                </div>
              ))}
            </div>

            {/* --- BLOCOS ADICIONADOS --- */}
            <div className="top-rated-list">
              <h3 className="subsection-title">Top 5 Docs</h3>
              {topRatedWeek.documentarios.map(item => (
                <div className="top-rated-item" key={item.id}>
                  <span className="top-rated-pos">{item.pos}</span>
                  <Image src={item.posterUrl} alt={item.title} width={40} height={60} unoptimized />
                  <span className="top-rated-title">{item.title}</span>
                </div>
              ))}
            </div>

            <div className="top-rated-list">
              <h3 className="subsection-title">Top 5 Animações</h3>
              {topRatedWeek.animacoes.map(item => (
                <div className="top-rated-item" key={item.id}>
                  <span className="top-rated-pos">{item.pos}</span>
                  <Image src={item.posterUrl} alt={item.title} width={40} height={60} unoptimized />
                  <span className="top-rated-title">{item.title}</span>
                </div>
              ))}
            </div>
            {/* --- FIM DOS BLOCOS ADICIONADOS --- */}

          </div>
        </section>
          
          {/* --- 5. Recomendações do Dia --- */}
          <section className="home-section">
            <h2 className="section-title">Recomendações do Dia</h2>
            <div className="reco-grid">
              {recommendations.map(item => (
                <div className="reco-card" key={item.id}>
                  <Image src={item.posterUrl} alt={item.title} width={400} height={225} unoptimized className="reco-img" />
                  <div className="reco-info">
                    <span className="reco-genre">{item.genre}</span>
                    <h3 className="reco-title">{item.title}</h3>
                    <p className="reco-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- 6. Premiados --- */}
          <section className="home-section">
            <h2 className="section-title">Premiados</h2>
            <div className="awards-grid">
              {awards.map(item => (
                <div className="award-card" key={item.id}>
                  <Image src={item.img} alt={item.name} width={200} height={200} unoptimized className="award-img" />
                  <span className="award-name">{item.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* --- 7. Roda de Reações --- */}
          <section className="home-section">
            <h2 className="section-title">Roda de Reações do CineVault</h2>
            <div className="social-feed">
              {socialFeed.map(item => (
                <div className="feed-item" key={item.id}>
                  <Image src={item.avatar} alt={item.user} width={40} height={40} unoptimized className="feed-avatar" />
                  <div className="feed-content">
                    <div className="feed-header">
                      <span className="feed-user">{item.user}</span>
                      <span className="feed-rating"><FaStar /> {item.rating}</span>
                    </div>
                    <p className="feed-comment">{item.comment}</p>
                    <div className="feed-actions">
                      <FaHeart /> <span>Curtir</span> <FaComment /> <span>Comentar</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default HomePage;