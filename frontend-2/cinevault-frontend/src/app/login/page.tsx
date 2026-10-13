'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link'; 
import '../../styles/login.css'; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Senha:', password);

  };

  const goToCadastro = () => {
    router.push('/cadastro'); 
  };

  return (
    <main className="login-page">
      <div className="main-grid">
        <div className="logo-container">
          {/* Logo / imagem grande à esquerda, conforme layout */}  
        </div>

        <div className="form-container">
          <div className="form-wrapper">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
              {/* 'input-group' substitui 'ion-item' */}
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="seuemail@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* 'input-group' substitui 'ion-item' */}
              <div className="input-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="forgot-password">
                <Link href="/esqueci-senha">Esqueci minha senha?</Link>
              </div>

              {/* 'button' substitui 'ion-button' */}
              <button type="submit" className="login-button">
                Entrar
              </button>
            </form>

            <div className="separator">OU</div>

            <div className="signup-link">
              <p>
                Não possui conta?{' '}
                <Link href="/cadastro">Cadastre-se</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-credits">
        <p>Uma criação de programadores independentes: </p>
        <p>Isaque P. Lino & Pedro L. Baschoni</p>
      </div>
    </main>
  );
}