// src/components/MovieCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { FaPlay, FaStar, FaRegImage } from 'react-icons/fa'; // Ícones
import '../styles/moviecards.css'; // Importa o CSS do card

// Props do Card
interface MovieCardProps {
  title: string;
  posterUrl: string;
  type: string;
  rating: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, posterUrl, type, rating }) => {
  return (
    <div className="movie-card">
      <div className="movie-poster-container">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`Poster de ${title}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 20vw, 15vw"
            className="movie-poster"
          />
        ) : (
          <div className="movie-placeholder">
            <FaRegImage className="placeholder-icon" />
          </div>
        )}

        <div className="movie-overlay">
          <button className="play-button">
            <FaPlay />
          </button>
        </div>

        <span className="movie-type">{type}</span>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <div className="movie-rating">
          <span className="stars">
            <FaStar />
          </span>
          <span className="rating-value">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;