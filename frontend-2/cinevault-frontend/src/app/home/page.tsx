// src/app/home/page.tsx
'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MovieCard from '../../components/MovieCard';
import '../../styles/home.css'; // Importa o CSS da home
// Importe os outros CSS no RootLayout ou aqui, se não estiverem globais
import '../../styles/header.css'; 
import '../../styles/sidebar.css';
import '../../styles/moviecards.css';

const HomePage = () => {
    // Estado que controla se a sidebar está aberta ou fechada
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Função para inverter o estado
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Novas capas (placeholders temáticos)
    const recentMovies = [
        { id: 1, title: 'Duna: Parte Dois', posterUrl: 'https://placehold.co/300x450/e50914/ffffff?text=Duna+2', type: 'filme', rating: 8.5 },
        { id: 2, title: 'O Problema dos 3 Corpos', posterUrl: 'https://placehold.co/300x450/e50914/ffffff?text=3+Corpos', type: 'série', rating: 7.8 },
        { id: 3, title: 'Jujutsu Kaisen', posterUrl: 'https://placehold.co/300x450/e50914/ffffff?text=Jujutsu', type: 'anime', rating: 9.2 },
        { id: 4, title: 'Mad Max: Estrada da Fúria', posterUrl: 'https://placehold.co/300x450/e50914/ffffff?text=Mad+Max', type: 'filme', rating: 7.9 },
        { id: 5, title: 'Stranger Things', posterUrl: 'https://placehold.co/300x450/e50914/ffffff?text=Stranger', type: 'série', rating: 8.1 },
        { id: 6, title: 'Attack on Titan', posterUrl: 'https://placehold.co/300x450/e50914/ffffff?text=AOT', type: 'anime', rating: 8.7 },
    ];

    return (
        <div className="home-layout">
            {/* Passa a função de toggle para o Header */}
            <Header onToggleClick={toggleSidebar} />

            <div className="home-container">
                {/* Passa o estado (aberta/fechada) para a Sidebar */}
                <Sidebar isOpen={sidebarOpen} />

                {/* O main não precisa mais das classes dinâmicas */}
                <main className="home-content">
                    <section className="home-section">
                        <h2 className="section-title">Últimas Atualizações</h2>
                        <div className="movie-grid">
                            {recentMovies.map(movie => (
                                <MovieCard 
                                    key={movie.id} 
                                    title={movie.title} 
                                    posterUrl={movie.posterUrl}
                                    type={movie.type}
                                    rating={movie.rating}
                                />
                            ))}
                        </div>
                    </section>
                </main>

                <aside className="home-ranking">
                    <div className="ranking-card">
                        <h3>Ranking</h3>
                        <div className="ranking-tabs">
                            <button className="ranking-tab active">Hoje</button>
                            <button className="ranking-tab">Semana</button>
                            <button className="ranking-tab">Mês</button>
                            <button className="ranking-tab">Geral</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HomePage;