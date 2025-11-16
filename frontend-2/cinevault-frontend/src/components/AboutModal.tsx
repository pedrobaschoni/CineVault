'use client';

import React, { useEffect } from 'react';
import {
  FaTimes,
  FaSearch,
  FaBookmark,
  FaPencilAlt,
  FaRegFolderOpen,
  FaBolt,
  FaEyeSlash,
  FaDatabase,
  FaTicketAlt,
  FaBoxOpen,
  FaChartLine,
  FaBrain,
  FaTrophy,
  FaMobileAlt,
  FaBook,
  FaYoutube
} from 'react-icons/fa';
import Image from 'next/image';

// Props: A função 'onClose' será passada pelo Header
interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {

  // Efeito para travar o scroll do 'body' enquanto o modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Função de limpeza: devolve o scroll quando o componente for "desmontado"
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Função para fechar o modal se o usuário clicar no fundo (overlay)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <p className="modal-quote">
          "A magia do cinema não está em assistir, mas em descobrir."
        </p>

        <hr />

        <div className="modal-header">
          <Image
            src="/images/iconeescuro.png" // Mude o tamanho aqui se quiser
            alt="CineVault Logo"
            width={100}
            height={80}
          />
          <h2>Bem-vindo ao CineVault!</h2>
          <p className="modal-slogan">
            Mais do que um catálogo. O seu cofre de entretenimento.
          </p>
        </div>

        <div className="modal-body">
          
          {/* --- NOSSA HISTÓRIA --- */}
          <h3>Nossa História: A Frustração que Virou Solução</h3>
          <p className="modal-intro">
            Quantas vezes você já abriu um streaming... depois outro... e mais um...
            e 40 minutos depois, desistiu sem assistir nada?
          </p>
          <p className="modal-intro">
            O CineVault nasceu exatamente dessa frustração. Cansamos de nos sentir perdidos no
            oceano de conteúdo. Decidimos criar o "mapa" que sempre quisemos: um lugar
            único, rápido e elegante para descobrir, organizar e <strong>realmente</strong> decidir
            o que assistir.
          </p>

          {/* --- NOSSO OBJETIVO --- */}
          <h3>Nosso Objetivo: Clareza no Caos</h3>
          <p className="modal-intro">
            Nossa missão é simples: <strong>devolver a você o controle do seu tempo.</strong>
            Não somos uma plataforma de streaming; somos a ferramenta definitiva de 
            consulta que ajuda você a tomar a melhor decisão antes de apertar o play.
          </p>

          {/* --- COMO FUNCIONA --- */}
          <h3>Como Funciona?</h3>
          <ol className="how-it-works-list">
            <li>
              <div>
                <strong>PESQUISE E DESCUBRA</strong>
                <span>Use nossa busca ou explore os rankings para encontrar uma obra.</span>
              </div>
            </li>
            <li>
              <div>
                <strong>ENTRE NO "COFRE"</strong>
                <span>Veja tudo sobre ela: notas (gerais e por temporada!), reviews, elenco e, o mais importante, <strong>onde assistir</strong>.</span>
              </div>
            </li>
            <li>
              <div>
                <strong>ORGANIZE SUAS LISTAS</strong>
                <span>Gostou? Adicione ao "Quero Ver". Já assistiu? Mova para "Já Visto" e acompanhe seu progresso.</span>
              </div>
            </li>
            <li>
              <div>
                <strong>DEIXE SUA MARCA</strong>
                <span>Avalie o que assistiu e ajude outros membros da comunidade a fazerem a escolha certa.</span>
              </div>
            </li>
          </ol>

          {/* --- POR QUE USAR? --- */}
          <h3>Por que usar o CineVault?</h3>
          <ul className="modal-features-list">
            <li>
              <FaBolt className="icon" />
              <div>
                <strong>Interface Rápida e Intuitiva</strong>
                <span>Feito para você achar o que precisa em segundos, sem distrações.</span>
              </div>
            </li>
            <li>
              <FaEyeSlash className="icon" />
              <div>
                <strong>Sem Anúncios Invasivos</strong>
                <span>Sua experiência é nossa prioridade. Foco total no conteúdo.</span>
              </div>
            </li>
            <li>
              <FaTicketAlt className="icon" />
              <div>
                <strong>Onde Assistir (Atualizado!)</strong>
                <span>Paramos sua busca. Dizemos exatamente em qual streaming o título está.</span>
              </div>
            </li>
            <li>
              <FaBoxOpen className="icon" />
              <div>
                <strong>Seu Cofre Pessoal</strong>
                <span>Suas listas são o coração do site. Organize o que viu e o que verá.</span>
              </div>
            </li>
            <li>
              <FaChartLine className="icon" />
              <div>
                <strong>Rankings Relevantes</strong>
                <span>Saiba o que está em alta <i>agora</i> na comunidade e no mundo.</span>
              </div>
            </li>
          </ul>

          {/* --- COMUNIDADE & ESTATÍSTICAS --- */}
          <h3>Movido pela Comunidade</h3>
          <p className="modal-intro">
            No CineVault, sua opinião importa. Junte-se a milhares de fãs, 
            leia reviews detalhados e descubra recomendações de pessoas reais.
          </p>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Estatística (Fictício)</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Obras no Catálogo</td>
                <td>+150.000</td>
              </tr>
              <tr>
                <td>Usuários Ativos</td>
                <td>+20.000</td>
              </tr>
              <tr>
                <td>Atualizações Diárias</td>
                <td>+500</td>
              </tr>
            </tbody>
          </table>

          {/* --- FUTURO & TRANSPARÊNCIA --- */}
          <h3>Nosso Futuro & Transparência</h3>
          
          <h4>O que vem por aí (Roadmap):</h4>
          <ul className="roadmap-list">
            <li><FaBrain /> Recomendações inteligentes (IA) baseadas no seu gosto.</li>
            <li><FaTrophy /> Badges e conquistas por atividade.</li>
            <li><FaMobileAlt /> App mobile dedicado (iOS e Android).</li>
            <li><FaBook /> Mais categorias (livros, podcasts e games).</li>
            <li><FaYoutube /> Integração nativa com trailers.</li>
          </ul>

          <h4>Nossa Transparência:</h4>
          <p className="transparency-note">
            O CineVault é um catálogo e uma ferramenta de organização. 
            <strong>Nós não hospedamos nenhum filme ou série.</strong> Nosso serviço é 
            100% focado em fornecer informações e links para as plataformas de 
            streaming oficiais.
          </p>

          <hr />

          <button className="modal-cta-btn" onClick={onClose}>
            Começar a explorar!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;