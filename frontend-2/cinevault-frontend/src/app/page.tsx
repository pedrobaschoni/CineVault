"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MovieCard from '../components/MovieCard';
import '../styles/home.css';

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const recentMovies = [
    { id: 1, title: 'The Mandalorian', type: 'série', rating: 8.5 },
    { id: 2, title: 'Dune', type: 'filme', rating: 8.0 },
    { id: 3, title: 'Attack on Titan', type: 'anime', rating: 9.0 },
    { id: 4, title: 'Stranger Things', type: 'série', rating: 8.7 },
    { id: 5, title: 'Oppenheimer', type: 'filme', rating: 8.4 },
    { id: 6, title: 'Death Note', type: 'anime', rating: 8.6 },
    { id: 7, title: 'Breaking Bad', type: 'série', rating: 9.5 },
    { id: 8, title: 'Inception', type: 'filme', rating: 8.8 },
  ];

  return (
    <div className="home-container">
      <Sidebar onToggle={setSidebarOpen} />
      <main className={`home-main ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <header className="home-header">
          <h1>CineVault</h1>
          <div className="header-search">
            <input 
              type="text" 
              placeholder="Buscar filmes, séries, animes..." 
              className="search-input"
            />
          </div>
          <div className="header-actions">
            <button className="profile-btn">Perfil</button>
          </div>
        </header>

        <section className="content-section">
          <div className="section-header">
            <h2>Adicionados Recentemente</h2>
          </div>
          <div className="movies-grid">
            {recentMovies.map(movie => (
              <MovieCard 
                key={movie.id} 
                title={movie.title} 
                type={movie.type}
                rating={movie.rating}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;