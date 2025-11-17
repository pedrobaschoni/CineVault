'use client';

import React, { useState } from 'react';
import Header from '../../components/Header'; // Ajuste o caminho
import { 
  FaUserCog, 
  FaPalette, 
  FaBell, 
  FaShieldAlt, 
  FaTrashAlt 
} from 'react-icons/fa';
import '../../styles/settings-page.css'; // Vamos criar este CSS

// --- Componente Reutilizável: Toggle Switch "Gourmet" ---
// (Criamos ele aqui mesmo para facilitar)
interface ToggleSwitchProps {
  label: string;
  description: string;
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, description }) => (
  <div className="toggle-item">
    <div className="toggle-info">
      <span className="toggle-label">{label}</span>
      <span className="toggle-description">{description}</span>
    </div>
    <label className="toggle-switch">
      <input type="checkbox" />
      <span className="slider"></span>
    </label>
  </div>
);
// --- Fim do Toggle Switch ---


const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('conta');

  const renderContent = () => {
    switch (activeTab) {
      case 'conta':
        return (
          <div className="settings-section">
            <h3>Conta</h3>
            <p>Gerencie as informações da sua conta.</p>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                defaultValue="ana.silva@email.com" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Alterar Senha</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••••••" 
              />
            </div>

            <div className="danger-zone">
              <h4>Zona de Perigo</h4>
              <p>Esta ação é irreversível. Todos os seus dados, listas e avaliações serão perdidos.</p>
              <button className="delete-btn">
                <FaTrashAlt /> Deletar minha conta
              </button>
            </div>
          </div>
        );
      
      case 'preferencias':
        return (
          <div className="settings-section">
            <h3>Preferências</h3>
            <p>Personalize a aparência e o conteúdo do CineVault.</p>
            
            <div className="form-group">
              <label htmlFor="theme">Tema</label>
              <select id="theme" defaultValue="dark">
                <option value="dark">Escuro (Padrão)</option>
                <option value="light">Claro</option>
                <option value="system">Sincronizar com o Sistema</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="language">Idioma</label>
              <select id="language" defaultValue="pt-br">
                <option value="pt-br">Português (Brasil)</option>
                <option value="en-us">Inglês (EUA)</option>
              </select>
            </div>
          </div>
        );

      case 'notificacoes':
        return (
          <div className="settings-section">
            <h3>Notificações</h3>
            <p>Escolha como você quer ser comunicado.</p>
            
            <ToggleSwitch 
              label="Newsletter Semanal"
              description="Receba um resumo do que está em alta."
            />
            <ToggleSwitch 
              label="Novos Seguidores"
              description="Receber um email quando alguém seguir você."
            />
            <ToggleSwitch 
              label="Comentários"
              description="Alguém respondeu a uma de suas reviews."
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-layout">
      <Header />
      <div className="settings-page-container">
        <h1 className="settings-page-title">Configurações</h1>
        
        <div className="settings-layout">
          
          {/* --- Menu Lateral de Navegação --- */}
          <aside className="settings-nav">
            <button 
              className={`nav-link ${activeTab === 'conta' ? 'active' : ''}`}
              onClick={() => setActiveTab('conta')}
            >
              <FaUserCog /> Conta
            </button>
            <button 
              className={`nav-link ${activeTab === 'preferencias' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferencias')}
            >
              <FaPalette /> Preferências
            </button>
            <button 
              className={`nav-link ${activeTab === 'notificacoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notificacoes')}
            >
              <FaBell /> Notificações
            </button>
            <button 
              className={`nav-link ${activeTab === 'seguranca' ? 'active' : ''}`}
              onClick={() => setActiveTab('seguranca')}
            >
              <FaShieldAlt /> Segurança
            </button>
          </aside>

          {/* --- Conteúdo Principal --- */}
          <main className="settings-content">
            {/* Reutiliza o card do perfil para manter o estilo */}
            <div className="profile-card"> 
              {renderContent()}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;