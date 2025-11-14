"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../../styles/login.css';

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (!name || !email || !password || password !== confirmPassword) {
        setError('Preencha corretamente todos os campos');
        setLoading(false);
        return;
      }

      // Simulate successful sign up
      router.push('/');
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-overlay" />
      <div className="login-inner">
        <div className="login-hero">
          <div className="hero-logo">
            <Image src="/images/iconeescuro.png" alt="CineVault" width={120} height={120} />
            <div className="logo-text">CINEVAULT</div>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-form-wrapper">
            <div className="login-header">
              <Image
                src="/images/iconeescuro.png"
                alt="CineVault Icon"
                width={44}
                height={44}
                className="login-icon"
              />
              <h1>Criar Conta</h1>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Seu nome completo" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="seuemail@email.com" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Crie uma senha forte" />
              </div>

              <div className="form-group">
                <label htmlFor="confirm">Confirmar Senha</label>
                <input id="confirm" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Repita a senha" />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" disabled={loading} className="login-btn">{loading ? 'Cadastrando...' : 'CADASTRAR'}</button>
            </form>

            <div className="login-footer">
              <p>OU</p>
              <p>Já possui uma conta? <a href="/login">Faça Login</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
