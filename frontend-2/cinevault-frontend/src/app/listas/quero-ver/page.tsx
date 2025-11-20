'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/Header';
import { 
  FaFilter, FaSortAmountDown, FaThLarge, FaList, 
  FaCheck, FaTrash, FaEllipsisV, FaPlay, FaStar, FaFire, FaEye, FaBed, FaClock, FaCalendarAlt,
  FaHeart, FaShareAlt, FaLink, FaInfoCircle
} from 'react-icons/fa';
import '../../../styles/watchlist.css';

// --- TIPOS ---
type Priority = 'alta' | 'media' | 'baixa';
type MediaType = 'filme' | 'serie' | 'anime';
type Status = 'released' | 'coming_soon';

interface WatchlistItem {
  id: number;
  title: string;
  poster: string;
  backdrop: string;
  rating: number; 
  type: MediaType;
  genres: string[];
  platform: string;
  platformLogo: string;
  priority: Priority;
  year: number;
  addedAt: string;
  status: Status; 
}

// --- DADOS MOCKADOS ---
const initialData: WatchlistItem[] = [
  { 
    id: 1, title: 'Furiosa: Uma Saga Mad Max', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 7.9, type: 'filme', genres: ['Ação', 'Sci-Fi'], platform: 'HBO Max', platformLogo: 'H', priority: 'alta', year: 2024, addedAt: '2025-10-01', status: 'released' 
  },
  { 
    id: 2, title: 'O Urso (The Bear) - T3', poster: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 8.8, type: 'serie', genres: ['Drama', 'Comédia'], platform: 'Disney+', platformLogo: 'D', priority: 'alta', year: 2024, addedAt: '2025-09-15', status: 'released' 
  },
  { 
    id: 3, title: 'Spy x Family Code: White', poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 7.5, type: 'anime', genres: ['Animação', 'Comédia'], platform: 'Crunchyroll', platformLogo: 'C', priority: 'media', year: 2023, addedAt: '2025-08-20', status: 'released'
  },
  { 
    id: 4, title: 'Napoleão', poster: 'https://images.unsplash.com/photo-1550100136-e074fa714891?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 6.4, type: 'filme', genres: ['Histórico', 'Drama'], platform: 'Apple TV+', platformLogo: 'A', priority: 'baixa', year: 2023, addedAt: '2025-01-10', status: 'released' 
  },
  { 
    id: 5, title: 'True Detective: Terra Noturna', poster: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 7.0, type: 'serie', genres: ['Crime', 'Drama'], platform: 'HBO Max', platformLogo: 'H', priority: 'media', year: 2024, addedAt: '2025-02-28', status: 'released' 
  },
  { 
    id: 6, title: 'Duna: Parte Dois', poster: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 9.0, type: 'filme', genres: ['Sci-Fi', 'Aventura'], platform: 'HBO Max', platformLogo: 'H', priority: 'alta', year: 2024, addedAt: '2025-11-05', status: 'released' 
  },
  { 
    id: 7, title: 'Deadpool & Wolverine', poster: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 8.2, type: 'filme', genres: ['Ação', 'Comédia'], platform: 'Disney+', platformLogo: 'D', priority: 'alta', year: 2024, addedAt: '2025-11-10', status: 'released' 
  },
  { 
    id: 8, title: 'Stranger Things - T5', poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 0, type: 'serie', genres: ['Terror', 'Sci-Fi'], platform: 'Netflix', platformLogo: 'N', priority: 'alta', year: 2025, addedAt: '2025-11-12', status: 'coming_soon' 
  },
  { 
    id: 9, title: 'Chainsaw Man - O Filme', poster: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 0, type: 'anime', genres: ['Ação', 'Terror'], platform: 'Crunchyroll', platformLogo: 'C', priority: 'media', year: 2025, addedAt: '2025-10-25', status: 'coming_soon' 
  },
  { 
    id: 10, title: 'Coringa: Delírio a Dois', poster: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 7.8, type: 'filme', genres: ['Drama', 'Musical'], platform: 'HBO Max', platformLogo: 'H', priority: 'baixa', year: 2024, addedAt: '2025-10-05', status: 'released' 
  },
  { 
    id: 11, title: 'Avatar: O Último Mestre do Ar', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 7.4, type: 'serie', genres: ['Fantasia', 'Aventura'], platform: 'Netflix', platformLogo: 'N', priority: 'media', year: 2024, addedAt: '2025-03-15', status: 'released' 
  },
  { 
    id: 12, title: 'Homem-Aranha: Além do Aranhaverso', poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=300&q=80', backdrop: '', 
    rating: 0, type: 'anime', genres: ['Ação', 'Aventura'], platform: 'Prime Video', platformLogo: 'P', priority: 'alta', year: 2026, addedAt: '2025-11-18', status: 'coming_soon' 
  },
];

// --- COMPONENTES HELPER ---
const PriorityBadge = ({ level }: { level: Priority }) => {
  const config = {
    alta: { icon: <FaFire />, label: 'Alta', class: 'p-high' },
    media: { icon: <FaEye />, label: 'Média', class: 'p-med' },
    baixa: { icon: <FaBed />, label: 'Baixa', class: 'p-low' }
  };
  const { icon, label, class: className } = config[level];
  return <span className={`priority-badge ${className}`}>{icon} {label}</span>;
};

// Componente de Notificação Toast Interno
const Toast = ({ message, visible }: { message: string, visible: boolean }) => {
  if (!visible) return null;
  return (
    <div className="toast-notification">
      <span className="toast-icon"><FaCheck /></span>
      <span>{message}</span>
    </div>
  );
};

const QueroVerPage = () => {
  const [items, setItems] = useState<WatchlistItem[]>(initialData);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [exitingItems, setExitingItems] = useState<number[]>([]);
  
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  
  // --- ESTADO DA NOTIFICAÇÃO ---
  const [toast, setToast] = useState<{ msg: string, show: boolean }>({ msg: '', show: false });

  // Filtros
  const [filterType, setFilterType] = useState('todos');
  const [filterPlatform, setFilterPlatform] = useState('todas');
  const [filterPriority, setFilterPriority] = useState('todas');
  const [sortBy, setSortBy] = useState('recente_add');

  // Fechar menu ao clicar fora
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // Helper para mostrar Toast
  const showToast = (message: string) => {
    setToast({ msg: message, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // Lógica de Filtro e Ordenação
  const getFilteredItems = () => {
    let result = [...items];
    if (filterType !== 'todos') result = result.filter(i => i.type === filterType);
    if (filterPlatform !== 'todas') result = result.filter(i => i.platform === filterPlatform);
    if (filterPriority !== 'todas') result = result.filter(i => i.priority === filterPriority);

    result.sort((a, b) => {
      switch (sortBy) {
        case 'recente_add': return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'antigo_add': return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'maior_nota': return b.rating - a.rating;
        case 'menor_nota': return a.rating - b.rating;
        case 'ano_novo': return b.year - a.year;
        case 'ano_velho': return a.year - b.year;
        case 'prioridade': 
          const pMap = { alta: 3, media: 2, baixa: 1 };
          return pMap[b.priority] - pMap[a.priority];
        default: return 0;
      }
    });
    return result;
  };

  const displayItems = getFilteredItems();

  // Ações
  const handleMarkWatched = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setExitingItems(prev => [...prev, id]);
    
    showToast("Marcado como assistido!");

    setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== id));
      setExitingItems(prev => prev.filter(itemId => itemId !== id));
    }, 500);
  };

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setExitingItems(prev => [...prev, id]);
    setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== id));
      setExitingItems(prev => prev.filter(itemId => itemId !== id));
    }, 300);
  };

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // --- AÇÃO: MUDAR PRIORIDADE (Atualiza a lista em tempo real) ---
  const changePriority = (e: React.MouseEvent, id: number, newPriority: Priority) => {
    e.preventDefault();
    e.stopPropagation();
    
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, priority: newPriority } : item
    ));
    
    setOpenMenuId(null);
    showToast(`Prioridade alterada para ${newPriority.charAt(0).toUpperCase() + newPriority.slice(1)}`);
  };

  // --- AÇÃO: FAVORITAR (Mock) ---
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(null);
    showToast("Adicionado aos Favoritos!");
  };

  // --- AÇÃO: COMPARTILHAR (Copia Link) ---
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href); // Copia URL atual
    setOpenMenuId(null);
    showToast("Link copiado para a área de transferência!");
  };

  return (
    <div className="watchlist-layout">
      <Header />
      
      <div className="watchlist-container">
        <header className="watchlist-header">
          <div className="header-text">
            <h1>Quero Ver</h1>
            <p>Organize tudo o que você ainda pretende assistir.</p>
          </div>
          <div className="header-stats">
            <span><strong>{items.length}</strong> títulos na lista</span>
          </div>
        </header>

        <div className="watchlist-toolbar">
           <div className="filters-row">
            <div className="filter-group">
              <label><FaFilter /> Tipo:</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="filme">Filmes</option>
                <option value="serie">Séries</option>
                <option value="anime">Animes</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Plataforma:</label>
              <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="Netflix">Netflix</option>
                <option value="HBO Max">HBO Max</option>
                <option value="Prime Video">Prime Video</option>
                <option value="Disney+">Disney+</option>
                <option value="Crunchyroll">Crunchyroll</option>
                <option value="Apple TV+">Apple TV+</option>
                <option value="Cinemas">Cinemas</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Prioridade:</label>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
          <div className="controls-row">
            <div className="sort-control">
              <FaSortAmountDown />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recente_add">Adicionado: Mais Recente</option>
                <option value="antigo_add">Adicionado: Mais Antigo</option>
                <option value="prioridade">Maior Prioridade</option>
                <option value="maior_nota">Maior Nota Global</option>
                <option value="menor_nota">Menor Nota Global</option>
                <option value="ano_novo">Lançamento: Novo</option>
                <option value="ano_velho">Lançamento: Antigo</option>
              </select>
            </div>
            <div className="layout-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><FaThLarge /></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><FaList /></button>
            </div>
          </div>
        </div>

        <div className={`watchlist-content ${viewMode}`}>
          {displayItems.length > 0 ? (
            displayItems.map(item => (
              <Link 
                key={item.id} 
                href="/detalhes" 
                className={`wl-item ${exitingItems.includes(item.id) ? 'exiting' : ''}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="wl-poster-wrapper">
                  <Image src={item.poster} alt={item.title} fill className="wl-poster" unoptimized />
                  <div className="wl-type-tag">{item.type}</div>
                </div>

                <div className="wl-info">
                  <div className="wl-header">
                    <h3 className="wl-title">{item.title}</h3>
                    <div className="wl-meta">
                      <span className="wl-year">{item.year}</span>
                      {item.status === 'coming_soon' ? (
                        <span className="wl-rating" style={{color: '#aaa', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px'}}>
                          <FaClock /> Em breve
                        </span>
                      ) : (
                        <span className="wl-rating"><FaStar /> {item.rating}</span>
                      )}
                    </div>
                  </div>

                  <div className="wl-details">
                    <span className="wl-genre">{item.genres.join(', ')}</span>
                    <div className="wl-badges">
                      <span className="wl-platform">{item.platform}</span>
                      <PriorityBadge level={item.priority} />
                    </div>
                  </div>

                  <div className="wl-actions">
                    {/* Botão Assistido / Em Breve */}
                    {item.status === 'released' ? (
                      <button 
                        className="action-btn watched-btn" 
                        onClick={(e) => handleMarkWatched(e, item.id)}
                        title="Marcar como Visto"
                      >
                        <FaCheck /> <span className="btn-text">Já Vi</span>
                      </button>
                    ) : (
                      <button 
                        className="action-btn watched-btn disabled" 
                        disabled
                        style={{ opacity: 0.4, cursor: 'not-allowed', background: '#333', border: '1px solid #555' }}
                        onClick={(e) => { e.preventDefault(); }}
                        title="Ainda não lançado"
                      >
                         <FaCalendarAlt /> <span className="btn-text">Em Breve</span>
                      </button>
                    )}

                    <div className="secondary-actions">
                      <button 
                        className="icon-btn" 
                        title="Remover"
                        onClick={(e) => handleRemove(e, item.id)}
                      >
                          <FaTrash />
                      </button>
                      
                      {/* MENU SUSPENSO */}
                      <div className="actions-menu-wrapper">
                        <button 
                          className="icon-btn" 
                          title="Mais opções"
                          onClick={(e) => toggleMenu(e, item.id)}
                        >
                            <FaEllipsisV />
                        </button>

                        {openMenuId === item.id && (
                          <div className="actions-dropdown" onClick={(e) => e.stopPropagation()}>
                            <button className="menu-option" onClick={(e) => changePriority(e, item.id, 'alta')}>
                              <span style={{color: '#ff4f4f'}}><FaFire /></span> Prioridade Alta
                            </button>
                            <button className="menu-option" onClick={(e) => changePriority(e, item.id, 'media')}>
                              <span style={{color: '#ffc107'}}><FaEye /></span> Prioridade Média
                            </button>
                            <button className="menu-option" onClick={(e) => changePriority(e, item.id, 'baixa')}>
                              <span style={{color: '#aaa'}}><FaBed /></span> Prioridade Baixa
                            </button>
                            
                            <div className="menu-divider"></div>
                            
                            <button className="menu-option" onClick={handleFavorite}>
                              <span style={{color: '#e50914'}}><FaHeart /></span> Favoritar
                            </button>
                            <button className="menu-option" onClick={handleShare}>
                              <span><FaLink /></span> Copiar Link
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <p>Nenhum item encontrado com estes filtros.</p>
              <button onClick={() => {setFilterType('todos'); setFilterPlatform('todas'); setFilterPriority('todas')}}>Limpar Filtros</button>
            </div>
          )}
        </div>

        <section className="recommendations-block">
          <h2>Recomendados para você</h2>
          <div className="rec-list-row">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rec-mini-card">
                 <div className="rec-img-placeholder"></div>
                 <div className="rec-info">
                    <span className="rec-title">Sugestão {i}</span>
                    <span className="rec-rate"><FaStar /> 8.{i}</span>
                 </div>
                 <button className="add-rec-btn"><FaPlay /></button>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* COMPONENTE TOAST */}
      <Toast message={toast.msg} visible={toast.show} />
    </div>
  );
};

export default QueroVerPage;