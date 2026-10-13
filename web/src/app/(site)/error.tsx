'use client';

import { Button } from '@/components/ui/Button';
import styles from './error.module.css';

/** Quando o catálogo falha: diz o que houve e oferece tentar de novo. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const tokenProblem = /token do TMDB/i.test(error.message);
  return (
    <section className={`container ${styles.wrap}`} role="alert">
      <svg width="72" height="72" viewBox="0 0 28 28" fill="none" aria-hidden="true" className={styles.icon}>
        <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M14 2v3M14 23v3M2 14h3M23 14h3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M11.5 11.5l5 5M16.5 11.5l-5 5" stroke="var(--color-hot)" strokeWidth="1.6" />
      </svg>
      <h1 className={styles.title}>O cofre não abriu agora</h1>
      <p className={styles.text}>
        {tokenProblem
          ? 'O TMDB recusou o token configurado. Confira o valor de TMDB_API_TOKEN no arquivo .env.local e reinicie o servidor.'
          : 'O catálogo demorou para responder. Suas listas e seu diário não foram afetados; só os dados desta página não carregaram.'}
      </p>
      <div className={styles.actions}>
        <Button variant="primary" onClick={reset}>
          Tentar de novo
        </Button>
        <Button href="/inicio">Voltar para o início</Button>
      </div>
    </section>
  );
}
