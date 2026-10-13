'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { getSupabase } from '@/lib/supabase/client';
import { safeNext } from '@/lib/supabase/config';
import { useAccount } from '@/services/user';
import { GoogleButton } from './GoogleButton';
import styles from './auth.module.css';

interface AuthPanelProps {
  mode: 'entrar' | 'criar';
  /** Para onde voltar depois de entrar. */
  next?: string;
  /** Erro vindo do retorno do Google (?erro=…). */
  error?: string;
}

const RETURN_ERRORS: Record<string, string> = {
  cancelado: 'O login com o Google foi cancelado. Tente de novo quando quiser.',
  link: 'Esse link de acesso expirou ou já foi usado. Entre de novo.',
};

/** Traduz os erros do Supabase Auth para mensagens que a pessoa entende. */
function explain(error: { code?: string; message: string; status?: number }): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'E-mail ou senha incorretos.';
    case 'email_not_confirmed':
      return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
    case 'user_already_exists':
    case 'email_exists':
      return 'Já existe uma conta com esse e-mail. Tente entrar.';
    case 'weak_password':
      return 'Essa senha é fraca demais. Use pelo menos 8 caracteres, misturando letras e números.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Muitas tentativas seguidas. Espere um minuto e tente de novo.';
    case 'provider_disabled':
    case 'validation_failed':
      return 'O login com o Google ainda não foi ativado no Supabase.';
    default:
      return error.status === 0 ? 'Sem conexão com o servidor. Verifique sua internet.' : 'Algo deu errado. Tente de novo.';
  }
}

export function AuthPanel({ mode, next, error: returnError }: AuthPanelProps) {
  const router = useRouter();
  const { account, enabled } = useAccount();
  const [busy, setBusy] = useState<'google' | 'email' | null>(null);
  const [message, setMessage] = useState<string | null>(returnError ? RETURN_ERRORS[returnError] ?? RETURN_ERRORS.link : null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const target = safeNext(next);
  const creating = mode === 'criar';

  function callbackUrl() {
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(target)}`;
  }

  async function withGoogle() {
    const db = getSupabase();
    if (!db) return;
    setBusy('google');
    setMessage(null);
    const { error } = await db.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl(), queryParams: { prompt: 'select_account' } },
    });
    // Sem erro, o navegador já está indo para o Google.
    if (error) {
      setBusy(null);
      setMessage(explain(error));
    }
  }

  async function withEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const db = getSupabase();
    if (!db) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('senha') ?? '');
    setBusy('email');
    setMessage(null);

    if (creating) {
      const username = String(form.get('usuario') ?? '').trim();
      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: { data: { username, full_name: username }, emailRedirectTo: callbackUrl() },
      });
      setBusy(null);
      if (error) return setMessage(explain(error));
      // Com confirmação de e-mail ligada, a sessão só vem depois do link.
      if (!data.session) return setSentTo(email);
    } else {
      const { error } = await db.auth.signInWithPassword({ email, password });
      setBusy(null);
      if (error) return setMessage(explain(error));
    }
    router.replace(target);
    router.refresh();
  }

  if (sentTo) {
    return (
      <div className={styles.sent} role="status">
        <h1 className={styles.title}>Confira seu e-mail</h1>
        <p className={styles.sub}>
          Enviamos um link para <strong>{sentTo}</strong>. Abra-o neste aparelho para abrir seu cofre.
        </p>
        <button type="button" className={styles.linkButton} onClick={() => setSentTo(null)}>
          Usar outro e-mail
        </button>
      </div>
    );
  }

  if (account) {
    return (
      <>
        <div>
          <h1 className={styles.title}>Você já entrou</h1>
          <p className={styles.sub}>Conectado como {account.email ?? account.name}.</p>
        </div>
        <Button href={target} variant="primary" className={styles.submit}>
          Abrir meu cofre
        </Button>
      </>
    );
  }

  return (
    <>
      <div>
        <h1 className={styles.title}>{creating ? 'Crie seu cofre' : 'Abra seu cofre'}</h1>
        <p className={styles.sub}>
          {creating ? 'Seu diário salvo na nuvem, em qualquer aparelho.' : 'Entre para ver seu diário, listas e notas.'}
        </p>
      </div>

      <GoogleButton
        label={creating ? 'Inscrever-se com o Google' : 'Continuar com o Google'}
        onClick={withGoogle}
        disabled={!enabled || busy === 'email'}
        busy={busy === 'google'}
      />

      <div className={styles.divider}>
        <span>ou com e-mail</span>
      </div>

      <form className={styles.form} onSubmit={withEmail}>
        {creating && (
          <label className={styles.field}>
            <span className={styles.label}>Nome de usuário</span>
            <input type="text" name="usuario" autoComplete="username" required maxLength={30} className={styles.input} disabled={!enabled} />
          </label>
        )}
        <label className={styles.field}>
          <span className={styles.label}>E-mail</span>
          <input type="email" name="email" autoComplete="email" required className={styles.input} disabled={!enabled} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Senha</span>
          <input
            type="password"
            name="senha"
            autoComplete={creating ? 'new-password' : 'current-password'}
            minLength={creating ? 8 : undefined}
            required
            className={styles.input}
            disabled={!enabled}
          />
        </label>

        {message && (
          <p className={styles.error} role="alert">
            {message}
          </p>
        )}

        <Button type="submit" variant="primary" className={styles.submit} disabled={!enabled || busy !== null}>
          {busy === 'email' ? 'Um instante…' : creating ? 'Criar conta' : 'Entrar'}
        </Button>
      </form>

      {!enabled && (
        <p className={styles.notice}>
          O login ainda não foi configurado neste site. Você pode usar tudo sem conta: seu diário fica salvo neste navegador.{' '}
          <Link href={target}>Continuar sem conta</Link>
        </p>
      )}

      <p className={styles.switch}>
        {creating ? (
          <>
            Já tem conta? <Link href={`/entrar${next ? `?next=${encodeURIComponent(target)}` : ''}`}>Entrar</Link>
          </>
        ) : (
          <>
            Ainda não tem conta? <Link href={`/criar-conta${next ? `?next=${encodeURIComponent(target)}` : ''}`}>Criar meu cofre</Link>
          </>
        )}
      </p>
    </>
  );
}
