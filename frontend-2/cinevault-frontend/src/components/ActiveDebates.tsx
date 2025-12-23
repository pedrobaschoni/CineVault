'use client';

import React from 'react';
import Link from 'next/link';
import { FaComments, FaFire, FaArrowRight } from 'react-icons/fa';

const debates = [
  {
    id: 1,
    title: 'O final de "A Origem": O pião caiu ou não?',
    comments: 342,
    related: 'Filme: A Origem',
    preview: 'Anos se passaram e ainda não chegamos a um consenso. A aliança dele é o totem real? Vamos decidir isso agora...',
    hot: true
  },
  {
    id: 2,
    title: 'Breaking Bad ainda é a melhor série de todos os tempos?',
    comments: 156,
    related: 'Série: Breaking Bad',
    preview: 'Com o fim de Better Call Saul e Succession, a coroa de Breaking Bad está ameaçada? O que vocês acham?',
    hot: true
  },
  {
    id: 3,
    title: 'Teorias sobre o próximo Batman',
    comments: 89,
    related: 'Filme: The Batman II',
    preview: 'O Coringa vai ser o vilão principal ou teremos a Corte das Corujas? Vazamentos indicam que...',
    hot: false
  }
];

const ActiveDebates = () => {
  return (
    <section className="home-section debates-section">
      <div className="debates-header">
        <h2 className="section-title"><FaComments /> Em Debate</h2>
        <Link href="/comunidade/discussao" className="view-all-link">
          Ver todos os debates <FaArrowRight />
        </Link>
      </div>

      <div className="debates-grid">
        {debates.map(debate => (
          <Link key={debate.id} href="/comunidade/discussao" className="debate-card">
            <div className="debate-top">
              <span className="debate-related">{debate.related}</span>
              {debate.hot && <span className="debate-hot"><FaFire /> Hot</span>}
            </div>
            <h4 className="debate-title">{debate.title}</h4>
            <p className="debate-preview">"{debate.preview}"</p>
            <div className="debate-footer">
              <span className="debate-comments"><FaComments /> {debate.comments} comentários</span>
              <span className="debate-read">Ler discussão</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ActiveDebates;