'use client';

import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import '../styles/back-to-top.css';

interface BackToTopButtonProps {
  onClick?: () => void;
  threshold?: number; // px scrolled before showing
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ onClick, threshold = 300 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setVisible(y > threshold);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const handleClick = () => {
    if (onClick) return onClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className="back-to-top-btn"
      title="Voltar ao topo"
      aria-label="Voltar ao topo"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <FaArrowUp />
    </button>
  );
};

export default BackToTopButton;