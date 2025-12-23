'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/Header';
import { 
  FaFire, FaSearch, FaPlus, FaFilter, FaComments, FaArrowUp, FaArrowDown, 
  FaCheckCircle, FaExclamationCircle, FaClock, FaTimes, FaExpand, FaCompress,
  FaBullhorn, FaLightbulb, FaTrophy, FaReply, FaUserCircle, FaBalanceScale,
  FaBolt, FaPen, FaVoteYea, FaEyeSlash, FaExclamationTriangle, FaShieldAlt
} from 'react-icons/fa';
import { MdOutlineForum, MdMovie, MdTv, MdCatchingPokemon, MdQuestionAnswer } from 'react-icons/md';
import '../../../styles/discussions.css';

// --- TIPOS ---
type TopicStatus = 'solved' | 'discussing' | 'waiting';
type TopicType = 'normal' | 'debate' | 'question';

interface Topic {
  id: number;
  title: string;
  author: { name: string; avatar: string };
  category: string;
  type: TopicType;
  status: TopicStatus;
  votes: number;
  repliesCount: number;
  views: number;
  createdAt: string;
  isTrending: boolean;
  tags: string[];
  content: string;
  participants: string[];
  debate?: {
    sideA: string;
    sideB: string;
    votesA: number;
    votesB: number;
  };
}

// --- MOCK DATA ---
const categories = [
  { id: 'all', label: 'Geral', icon: <MdOutlineForum />, color: '#999' },
  { id: 'filmes', label: 'Filmes', icon: <MdMovie />, color: '#e50914' },
  { id: 'series', label: 'Séries', icon: <MdTv />, color: '#4caf50' },
  { id: 'animes', label: 'Animes', icon: <MdCatchingPokemon />, color: '#ff9800' },
  { id: 'teorias', label: 'Teorias', icon: <FaLightbulb />, color: '#ffd700' },
];

const initialTopics: Topic[] = [
  {
    id: 999,
    title: 'A morte daquele personagem no final de Arcane T2...',
    author: { name: 'JinxMain', avatar: 'https://i.pravatar.cc/150?u=66' },
    category: 'animes',
    type: 'normal',
    status: 'discussing',
    votes: 500,
    repliesCount: 80,
    views: 5000,
    createdAt: '10m atrás',
    isTrending: true,
    tags: ['Spoiler', 'Arcane', 'Teoria'],
    content: 'Eu não acredito que fizeram aquilo no último episódio! Vamos discutir as consequências.',
    participants: [],
  },
  {
    id: 101,
    title: 'O impacto da IA na produção de roteiros: O fim da criatividade?',
    author: { name: 'ScreenWriter_X', avatar: 'https://i.pravatar.cc/150?u=99' },
    category: 'filmes',
    type: 'debate',
    status: 'discussing',
    votes: 2500,
    repliesCount: 450,
    views: 30000,
    createdAt: '1 dia atrás',
    isTrending: true,
    tags: ['IA', 'Cinema', 'Futuro'],
    content: 'Com o avanço do Sora e ChatGPT, estamos vendo o fim dos roteiristas humanos ou apenas uma nova ferramenta? Vamos debater.',
    participants: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2'],
    debate: { sideA: 'A IA vai substituir roteiristas', sideB: 'A IA será apenas uma ferramenta', votesA: 30, votesB: 70 }
  },
  {
    id: 102,
    title: 'Como calibrar sua TV para filmes HDR da forma correta?',
    author: { name: 'TechWizard', avatar: 'https://i.pravatar.cc/150?u=88' },
    category: 'filmes',
    type: 'question',
    status: 'solved',
    votes: 1800,
    repliesCount: 50,
    views: 12000,
    createdAt: '3 dias atrás',
    isTrending: false,
    tags: ['Tutorial', 'Tech', '4K'],
    content: 'Comprei uma OLED nova e sinto que as cores estão lavadas. Alguém tem um guia definitivo?',
    participants: [],
  },
  {
    id: 103,
    title: 'Explicação completa da cronologia de Dark (Com Gráficos)',
    author: { name: 'TimeTraveler', avatar: 'https://i.pravatar.cc/150?u=77' },
    category: 'series',
    type: 'normal',
    status: 'solved',
    votes: 5000,
    repliesCount: 120,
    views: 50000,
    createdAt: '1 semana atrás',
    isTrending: true,
    tags: ['Dark', 'Netflix', 'Teoria'],
    content: 'Demorei 3 meses, mas mapeei todas as viagens no tempo de Jonas e Martha. Segue o fio...',
    participants: ['https://i.pravatar.cc/150?u=3'],
  },
  {
    id: 1,
    title: 'O final de "A Origem" (Inception): O pião caiu ou não?',
    author: { name: 'NolanFan_99', avatar: 'https://i.pravatar.cc/150?u=1' },
    category: 'filmes',
    type: 'debate',
    status: 'discussing',
    votes: 1240,
    repliesCount: 342,
    views: 15000,
    createdAt: '2h atrás',
    isTrending: true,
    tags: ['Christopher Nolan', 'Mindblowing', 'Final Explicado'],
    content: 'Anos se passaram e ainda não chegamos a um consenso. A aliança dele é o totem real? Vamos decidir isso agora.',
    participants: ['https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3', 'https://i.pravatar.cc/150?u=4'],
    debate: {
      sideA: 'Caiu (Realidade)',
      sideB: 'Não Caiu (Sonho)',
      votesA: 65,
      votesB: 35
    }
  },
  {
    id: 2,
    title: 'Qual a melhor ordem para assistir Monogatari Series?',
    author: { name: 'SenjougaharaLover', avatar: 'https://i.pravatar.cc/150?u=5' },
    category: 'animes',
    type: 'question',
    status: 'solved',
    votes: 450,
    repliesCount: 12,
    views: 3200,
    createdAt: '5h atrás',
    isTrending: false,
    tags: ['Guia', 'Anime', 'Monogatari'],
    content: 'Estou perdido com tantas temporadas. Devo seguir a ordem de lançamento ou a cronológica da novel?',
    participants: ['https://i.pravatar.cc/150?u=6', 'https://i.pravatar.cc/150?u=7'],
  },
];

const highlightsData = [
  { id: 101, type: 'discussion', label: 'Discussão da Semana', title: 'O impacto da IA na produção de roteiros', user: 'ScreenWriter_X', icon: <FaFire /> },
  { id: 102, type: 'question', label: 'Pergunta Mais Útil', title: 'Como calibrar sua TV para filmes HDR?', user: 'TechWizard', icon: <FaLightbulb /> },
  { id: 103, type: 'answer', label: 'Resposta Lendária', title: 'Explicação completa da cronologia de Dark', user: 'TimeTraveler', icon: <FaTrophy /> },
];

const DiscussionsPage = () => {
  const [topics, setTopics] = useState(initialTopics);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterSort, setFilterSort] = useState('recent');
  const [focusedTopic, setFocusedTopic] = useState<Topic | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification('💬 3 novas respostas em "Breaking Bad..."');
      setTimeout(() => setNotification(null), 5000);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const openHighlight = (id: number) => {
    const topic = topics.find(t => t.id === id);
    if (topic) setFocusedTopic(topic);
  };

  const handleCreateTopic = (newTopic: any) => {
    const topic: Topic = {
      id: Date.now(),
      title: newTopic.title,
      content: newTopic.content,
      category: newTopic.category,
      type: newTopic.type,
      debate: newTopic.debate,
      author: { name: 'Você', avatar: 'https://i.pravatar.cc/150?u=me' },
      status: 'waiting',
      votes: 0,
      repliesCount: 0,
      views: 0,
      createdAt: 'Agora mesmo',
      isTrending: false,
      tags: newTopic.tags || [],
      participants: []
    };
    setTopics([topic, ...topics]);
    setIsCreateModalOpen(false);
  };

  const revealSpoiler = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setRevealedSpoilers([...revealedSpoilers, id]);
  };

  const filteredTopics = topics
    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
    .sort((a, b) => {
      if (filterSort === 'recent') return b.id - a.id; 
      if (filterSort === 'votes') return b.votes - a.votes;
      if (filterSort === 'replies') return b.repliesCount - a.repliesCount;
      return 0;
    });

  const handleVote = (id: number, delta: number) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, votes: t.votes + delta } : t));
  };

  return (
    <div className="discussions-layout">
      <Header />

      {notification && (
        <div className="live-notification" onClick={() => setNotification(null)}>
          <span className="pulse-dot"></span> {notification}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateTopicModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={handleCreateTopic} 
        />
      )}

      {focusedTopic && (
        <div className="focus-mode-overlay">
          <div className="focus-container">
            <div className="focus-top-bar">
              <button className="close-focus-btn" onClick={() => setFocusedTopic(null)}>
                <FaTimes /> Fechar Discussão
              </button>
            </div>

            <div className="focus-content">
              <div className="focus-header">
                <div className="topic-badges">
                  <span className={`badge-type ${focusedTopic.type}`}>
                    {focusedTopic.type.toUpperCase()}
                  </span>
                  <span className={`badge-status ${focusedTopic.status}`}>
                    {focusedTopic.status}
                  </span>
                  {focusedTopic.tags.map(tag => (
                    <span key={tag} className="modal-tag">#{tag}</span>
                  ))}
                </div>
                <h1>{focusedTopic.title}</h1>
                <div className="focus-meta">
                  <Image src={focusedTopic.author.avatar} alt={focusedTopic.author.name} width={30} height={30} className="avatar-small" unoptimized />
                  <span>{focusedTopic.author.name}</span>
                  <span className="dot">•</span>
                  <span>{focusedTopic.createdAt}</span>
                </div>
              </div>

              <div className="focus-body">
                <p>{focusedTopic.content}</p>
                {focusedTopic.type === 'debate' && focusedTopic.debate && (
                  <div className="debate-arena">
                    <div className="debate-side side-a">
                      <h4>Lado A</h4>
                      <p>{focusedTopic.debate.sideA}</p>
                      <div className="debate-bar"><div className="fill" style={{width: `${focusedTopic.debate.votesA}%`}}></div><span>{focusedTopic.debate.votesA}%</span></div>
                      <button>Votar A</button>
                    </div>
                    <div className="vs-divider">VS</div>
                    <div className="debate-side side-b">
                      <h4>Lado B</h4>
                      <p>{focusedTopic.debate.sideB}</p>
                      <div className="debate-bar"><div className="fill" style={{width: `${focusedTopic.debate.votesB}%`}}></div><span>{focusedTopic.debate.votesB}%</span></div>
                      <button>Votar B</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="focus-comments-placeholder">
                <h3>Respostas ({focusedTopic.repliesCount})</h3>
                <div className="comment-box">
                  <textarea placeholder="Adicione sua opinião a esta discussão..." />
                  <button>Responder</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="discussions-container" style={{ display: focusedTopic ? 'none' : 'block' }}>
        <section className="community-highlights">
          {highlightsData.map(h => (
            <div key={h.id} className={`highlight-card ${h.type}`} onClick={() => openHighlight(h.id)} style={{ cursor: 'pointer' }}>
              <div className="hl-icon">{h.icon}</div>
              <div className="hl-info">
                <span className="hl-label">{h.label}</span>
                <h3 className="hl-title">{h.title}</h3>
                <span className="hl-user">por <strong>{h.user}</strong></span>
              </div>
            </div>
          ))}
        </section>

        <div className="create-topic-box">
          <div className="create-avatar"><FaUserCircle /></div>
          <div className="create-input-wrapper">
            <input type="text" placeholder="O que você quer discutir, perguntar ou teorizar hoje?" onClick={() => setIsCreateModalOpen(true)} readOnly />
            <div className="create-actions">
              <button className="tag-btn" onClick={() => setIsCreateModalOpen(true)}><FaPlus /> Criar</button>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <aside className="left-sidebar">
            <div className="sidebar-menu">
              <h3>Categorias</h3>
              {categories.map(cat => (
                <button key={cat.id} className={`cat-btn ${selectedCategory === cat.id ? 'active' : ''}`} onClick={() => setSelectedCategory(cat.id)} style={{ borderLeftColor: cat.color }}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <div className="sidebar-menu">
              <h3>Filtros</h3>
              <button className={`filter-link ${filterSort === 'recent' ? 'active' : ''}`} onClick={() => setFilterSort('recent')}>Mais Recentes</button>
              <button className={`filter-link ${filterSort === 'replies' ? 'active' : ''}`} onClick={() => setFilterSort('replies')}>Mais Respondidas</button>
              <button className={`filter-link ${filterSort === 'votes' ? 'active' : ''}`} onClick={() => setFilterSort('votes')}>Mais Votadas</button>
            </div>
          </aside>

          <div className="topics-feed">
            <div className="feed-header">
              <h2>Discussões</h2>
              <span>{filteredTopics.length} tópicos encontrados</span>
            </div>

            {filteredTopics.map(topic => {
              const isSpoiler = topic.tags.some(t => t.toLowerCase() === 'spoiler');
              const isRevealed = revealedSpoilers.includes(topic.id);

              return (
                <div key={topic.id} className={`topic-card ${topic.isTrending ? 'trending-glow' : ''}`}>
                  <div className="vote-column">
                    <button onClick={() => handleVote(topic.id, 1)}><FaArrowUp /></button>
                    <span className="vote-count">{topic.votes}</span>
                    <button onClick={() => handleVote(topic.id, -1)}><FaArrowDown /></button>
                  </div>

                  <div className="topic-main">
                    <div className="topic-header">
                      <div className="topic-tags">
                        {topic.isTrending && <span className="badge-trending"><FaFire /> Em Alta</span>}
                        <span className={`badge-status ${topic.status}`}>
                          {topic.type === 'debate' ? 'Debate' : topic.type === 'question' ? 'Pergunta' : 'Tópico'}
                        </span>
                        {isSpoiler && <span className="badge-spoiler"><FaEyeSlash /> Spoiler</span>}
                      </div>
                      <span className="topic-time">{topic.createdAt}</span>
                    </div>

                    {/* LÓGICA DE SPOILER MASK */}
                    {isSpoiler && !isRevealed ? (
                      <div className="spoiler-mask-title" onClick={(e) => revealSpoiler(e, topic.id)}>
                        <FaExclamationTriangle /> Alerta de Spoiler! Clique para revelar o título.
                      </div>
                    ) : (
                      <h3 className="topic-title" onClick={() => setFocusedTopic(topic)}>
                        {topic.title}
                      </h3>
                    )}
                    
                    <p className="topic-preview">{topic.content.substring(0, 120)}...</p>

                    <div className="topic-footer">
                      <div className="author-info">
                        <Image src={topic.author.avatar} alt={topic.author.name} width={24} height={24} className="author-avatar" unoptimized />
                        <span>{topic.author.name}</span>
                      </div>
                      <div className="topic-stats">
                        <span><MdOutlineForum /> {topic.repliesCount}</span>
                        <span><FaExclamationCircle /> {topic.views}</span>
                      </div>
                      <button className="focus-btn" onClick={() => setFocusedTopic(topic)}>
                        <FaExpand /> Ver
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="right-sidebar">
            {/* --- 1. TÓPICOS RECOMENDADOS MELHORADOS --- */}
            <div className="widget-card">
              <h3><FaBolt /> Tópicos Recomendados</h3>
              <ul className="rec-list">
                <li>
                  <span className="rec-cat cat-anime">Animes</span>
                  <Link href="#">Por que o final de AOT dividiu tanto os fãs? (Análise sem spoilers)</Link>
                </li>
                <li>
                  <span className="rec-cat cat-movie">Filmes</span>
                  <Link href="#">Teorias sobre o vilão de The Batman Part II</Link>
                </li>
                <li>
                  <span className="rec-cat cat-tech">Off-Topic</span>
                  <Link href="#">Melhor setup de som custo-benefício para home theater</Link>
                </li>
                <li>
                  <span className="rec-cat cat-movie">Séries</span>
                  <Link href="#">O final de Succession explicado</Link>
                </li>
              </ul>
            </div>

            {/* --- 2. REGRAS DA COMUNIDADE (REINSERIDO) --- */}
            <div className="widget-card">
              <h3><FaShieldAlt /> Regras da Comunidade</h3>
              <ul className="rules-list">
                <li>
                  <span className="rule-num">1</span>
                  <span>Respeito e gentileza acima de tudo. Ofensas não são toleradas.</span>
                </li>
                <li>
                  <span className="rule-num">2</span>
                  <span>Use a tag de <strong>Spoiler</strong> sempre que revelar tramas importantes.</span>
                </li>
                <li>
                  <span className="rule-num">3</span>
                  <span>Sem spam ou autopromoção excessiva.</span>
                </li>
                <li>
                  <span className="rule-num">4</span>
                  <span>Mantenha as discussões nas categorias corretas.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// ... (CreateTopicModal permanece igual) ...
const CreateTopicModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) => {
  const [type, setType] = useState<TopicType>('normal');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('filmes');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Erros de validação
  const [errors, setErrors] = useState({ title: '', content: '' });

  // Debate fields
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');

  const handleAddTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação Manual
    const newErrors = { title: '', content: '' };
    let hasError = false;

    if (!title.trim()) {
      newErrors.title = 'Por favor, dê um título para sua discussão.';
      hasError = true;
    }
    if (!content.trim()) {
      newErrors.content = 'O conteúdo da discussão não pode ficar vazio.';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    onSubmit({ 
      title, 
      content, 
      category, 
      type, 
      tags,
      debate: type === 'debate' ? { sideA, sideB, votesA: 50, votesB: 50 } : undefined 
    });
  };

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="create-modal-header">
          <h2>Criar Nova Discussão</h2>
          <button onClick={onClose}><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="create-form" noValidate>
          
          <div className="form-row type-selector">
            <button type="button" className={`type-btn ${type === 'normal' ? 'active' : ''}`} onClick={() => setType('normal')}><FaComments /> Discussão</button>
            <button type="button" className={`type-btn ${type === 'question' ? 'active' : ''}`} onClick={() => setType('question')}><MdQuestionAnswer /> Pergunta</button>
            <button type="button" className={`type-btn ${type === 'debate' ? 'active' : ''}`} onClick={() => setType('debate')}><FaVoteYea /> Debate</button>
          </div>

          {type === 'debate' && (
            <div className="debate-inputs">
              <div className="form-group"><label>Lado A</label><input type="text" value={sideA} onChange={e => setSideA(e.target.value)} /></div>
              <div className="vs-badge">VS</div>
              <div className="form-group"><label>Lado B</label><input type="text" value={sideB} onChange={e => setSideB(e.target.value)} /></div>
            </div>
          )}

          <div className="form-group">
            <label>Título *</label>
            <input 
              type="text" 
              placeholder="Escreva um título chamativo..." 
              value={title} 
              onChange={(e) => { setTitle(e.target.value); setErrors({ ...errors, title: '' }); }} 
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && (
              <span className="error-msg">
                <FaExclamationTriangle /> {errors.title}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-container">
              {tags.map(tag => (
                <span key={tag} className="tag-chip">
                  #{tag} <FaTimes onClick={() => removeTag(tag)} />
                </span>
              ))}
              <input 
                type="text" 
                placeholder="Adicionar tag (ex: Spoiler) + Enter" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
              />
              <button type="button" onClick={handleAddTag} className="add-tag-btn"><FaPlus /></button>
            </div>
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="filmes">Filmes</option>
              <option value="series">Séries</option>
              <option value="animes">Animes</option>
              <option value="teorias">Teorias</option>
            </select>
          </div>

          <div className="form-group">
            <label>Conteúdo *</label>
            <textarea 
              placeholder="Desenvolva seu pensamento..." 
              rows={6} 
              value={content} 
              onChange={(e) => { setContent(e.target.value); setErrors({ ...errors, content: '' }); }}
              className={errors.content ? 'input-error' : ''}
            />
            {errors.content && (
              <span className="error-msg">
                <FaExclamationTriangle /> {errors.content}
              </span>
            )}
          </div>

          <div className="form-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="submit-btn">Publicar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscussionsPage;