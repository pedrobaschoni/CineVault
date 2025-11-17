'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/Header'; // Ajuste o caminho se necessário
import '../../../styles/profile.css'; // Reutiliza estilos do perfil
import '../../../styles/edit-profile.css'; // Estilos específicos para este form

// Dados fictícios (mesmos da página de perfil para pré-popular)
const currentUserData = {
  name: 'Ana "CineGourmet" Silva',
  username: '@anagourmet',
  avatarUrl: 'https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=400',
  bio: 'Exploradora de narrativas e caçadora de pérolas escondidas. Acredito que todo filme tem algo a dizer, mesmo que seja "não perca seu tempo". Aqui catalogo minha jornada.'
};

const EditProfilePage = () => {
  // Estados para controlar os campos do formulário
  const [name, setName] = useState(currentUserData.name);
  const [username, setUsername] = useState(currentUserData.username);
  const [avatar, setAvatar] = useState(currentUserData.avatarUrl);
  const [bio, setBio] = useState(currentUserData.bio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para salvar os dados no backend
    console.log('Dados salvos:', { name, username, avatar, bio });
    // Idealmente, você redirecionaria o usuário de volta para /perfil
    // ou mostraria uma mensagem de "Salvo com sucesso!"
  };

  return (
    <div className="profile-layout">
      <Header />
      
      {/* Container para centralizar o formulário */}
      <div className="edit-profile-container">
        
        {/* Reutilizamos o .profile-card para manter a consistência */}
        <form className="profile-card edit-profile-form" onSubmit={handleSubmit}>
          
          <h2 className="edit-profile-title">Editar Perfil</h2>

          {/* Seção de Avatar */}
          <div className="avatar-edit-section">
            <Image
              src={avatar || '/images/default-avatar.png'} // Mostra o avatar atual
              alt="Avatar preview"
              width={100}
              height={100}
              className="avatar-preview"
              unoptimized
            />
            <div className="avatar-input-group">
              <label htmlFor="avatarUrl">URL da Imagem do Avatar</label>
              <input
                type="text"
                id="avatarUrl"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://exemplo.com/imagem.png"
              />
              <p>Cole a URL de uma imagem. (Recomendado: 1:1, ex: 400x400px)</p>
            </div>
          </div>

          {/* Seção de Informações */}
          <div className="form-group">
            <label htmlFor="name">Nome de Exibição</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biografia</label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte algo sobre você..."
            />
          </div>

          {/* Seção de Ações */}
          <div className="form-actions">
            {/* O Link "Cancelar" leva de volta à página de perfil */}
            <Link href="/perfil" className="cancel-btn">
              Cancelar
            </Link>
            <button type="submit" className="save-btn">
              Salvar Alterações
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;