'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaRandom, FaPlay, FaInfoCircle, FaYoutube } from 'react-icons/fa';

const randomPool = [
  {
    id: 101,
    title: 'Interestelar',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    curiosity: 'O roteiro original previa que a humanidade encontraria alienígenas vivos, não apenas seus vestígios.',
    trailerId: 'zSWdZVtXT7E' 
  },
  {
    id: 102,
    title: 'Clube da Luta',
    poster: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?w=300&h=450&fit=crop',
    curiosity: 'Brad Pitt e Edward Norton realmente aprenderam a fazer sabão para o filme.',
    trailerId: 'qtRKdVHc-cE'
  },
  {
    id: 103,
    title: 'Matrix',
    poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    curiosity: 'O código verde da Matrix é composto por receitas de sushi japonesas digitalizadas.',
    trailerId: 'm8e-FF8MsqU'
  }
];

const RandomDiscovery = () => {
  const [movie, setMovie] = useState(randomPool[0]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const random = randomPool[Math.floor(Math.random() * randomPool.length)];
    setMovie(random);
  }, []);

  const shuffleNew = () => {
    let newRandom;
    do {
      newRandom = randomPool[Math.floor(Math.random() * randomPool.length)];
    } while (newRandom.id === movie.id && randomPool.length > 1);
    setMovie(newRandom);
  };

  if (!isClient) return null;

  return (
    <section className="home-section random-discovery-section">
      <div className="rd-header">
        <h2 className="section-title"><FaRandom /> Descubra Algo Aleatório</h2>
        <button onClick={shuffleNew} className="shuffle-btn">
          <FaRandom /> Girar Roleta
        </button>
      </div>

      <div className="rd-card">
        <div className="rd-backdrop">
          <Image src={movie.poster} alt={movie.title} fill className="rd-bg-img" unoptimized />
          <div className="rd-overlay"></div>
        </div>

        <div className="rd-content">
          <div className="rd-media">
            <div className="rd-poster-wrapper">
              <Image src={movie.poster} alt={movie.title} width={180} height={270} className="rd-poster" unoptimized />
            </div>
            <div className="rd-trailer-preview">
               <div className="play-icon-overlay">
                 <FaYoutube />
               </div>
               {/* Imagem estática simulando player */}
               <div className="trailer-thumb" style={{backgroundImage: `url('https://img.youtube.com/vi/${movie.trailerId}/hqdefault.jpg')`}}></div>
            </div>
          </div>

          <div className="rd-info">
            <h3>{movie.title}</h3>
            <div className="rd-curiosity">
              <FaInfoCircle />
              <p>"{movie.curiosity}"</p>
            </div>
            <Link href="/detalhes" className="rd-cta-btn">
              Ver Detalhes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RandomDiscovery;