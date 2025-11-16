'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FaPlay, 
  FaHeart, 
  FaComment, 
  FaChevronLeft, 
  FaChevronRight,
  FaPlus
} from 'react-icons/fa';
import '../styles/imdb-carousel.css'; // Vamos criar este CSS

// Tipo para os dados do vídeo
interface VideoData {
  id: number;
  heroImage: string;
  posterUrl: string;
  videoTitle: string;
  videoDescription: string;
  duration: string;
  likes: number;
  comments: number;
}

// Props do componente
interface ImdbCarouselProps {
  title: string;
  videos: VideoData[];
}

// Helper para formatar números (1100 -> 1.1k)
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num;
};

const ImdbCarousel: React.FC<ImdbCarouselProps> = ({ title, videos }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedVideo = videos[selectedIndex];

  const nextVideo = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevVideo = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  return (
    <section className="home-section">
      <h2 className="section-title">{title}</h2>
      
      <div className="imdb-carousel-container">
        
        {/* Painel Principal (Hero) */}
        <div className="hero-panel">
          <Image
            src={selectedVideo.heroImage}
            alt="Hero Background"
            fill
            unoptimized
            className="hero-background-image"
          />
          <div className="hero-overlay-gradient"></div>

          {/* Botões de Navegação do Hero */}
          <button className="hero-nav-btn prev" onClick={prevVideo}>
            <FaChevronLeft />
          </button>
          <button className="hero-nav-btn next" onClick={nextVideo}>
            <FaChevronRight />
          </button>

          {/* Poster "Colado" */}
          <div className="hero-poster">
            <Image
              src={selectedVideo.posterUrl}
              alt={selectedVideo.videoTitle}
              width={150}
              height={225}
              unoptimized
            />
            <button className="hero-poster-add-btn">
              <FaPlus />
            </button>
          </div>

          {/* Conteúdo do Hero */}
          <div className="hero-content">
            <button className="hero-play-btn">
              <FaPlay />
            </button>
            <div className="hero-info">
              <span className="hero-video-duration">{selectedVideo.duration}</span>
              <h3 className="hero-video-title">{selectedVideo.videoTitle}</h3>
              <p className="hero-video-description">{selectedVideo.videoDescription}</p>
              <div className="hero-social-stats">
                <span><FaHeart /> {formatNumber(selectedVideo.likes)}</span>
                <span><FaComment /> {formatNumber(selectedVideo.comments)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Painel da Lista (Playlist) */}
        <div className="playlist-panel">
          <h4 className="playlist-title">A seguir</h4>
          <div className="playlist-items">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`playlist-item ${index === selectedIndex ? 'active' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                <div className="playlist-thumbnail">
                  <Image
                    src={video.posterUrl} // Usando poster como thumb
                    alt={video.videoTitle}
                    width={100}
                    height={150}
                    unoptimized
                  />
                  <div className="playlist-thumb-overlay">
                    <FaPlay />
                  </div>
                  <span className="playlist-duration">{video.duration}</span>
                </div>
                <div className="playlist-info">
                  <h5 className="playlist-video-title">{video.videoTitle}</h5>
                  <p className="playlist-video-description">{video.videoDescription}</p>
                  <div className="playlist-social-stats">
                    <span><FaHeart /> {formatNumber(video.likes)}</span>
                    <span><FaComment /> {formatNumber(video.comments)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="playlist-explore">Explorar trailers &rsaquo;</a>
        </div>
        
      </div>
    </section>
  );
};

export default ImdbCarousel;