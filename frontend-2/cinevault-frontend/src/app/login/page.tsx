// app/login/page.tsx
'use client'; // Necessário para componentes com interatividade (hooks)

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para navegação programática
import Link from 'next/link'; // Para navegação entre páginas
import '../../styles/login.css'; // Importa o CSS

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Lógica de login
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o recarregamento da página
    console.log('Email:', email);
    console.log('Senha:', password);
    // Adicione sua lógica de autenticação aqui
  };

  // Função para navegar para o cadastro (se necessário)
  const goToCadastro = () => {
    router.push('/cadastro'); // Rota de exemplo
  };

  return (
    // 'login-page' substitui o 'ion-content' para aplicar o fundo
    <main className="login-page">
      <div className="main-grid">
        <div className="logo-container">
          {/* Você pode adicionar seu logo aqui */}
          {/* <Image src="/logo.svg" alt="Logo" width={80} height={80} className="logo-icon" /> */}
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
            {/* Botão de login com Google removido conforme solicitado */}

            <div className="signup-link">
              <p>
                Não possui conta?{' '}
                {/* 'Link' do Next.js substitui a âncora com (click) */}
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