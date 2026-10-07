import Link from 'next/link';
import { VaultDial } from '@/components/ui/Logo';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.mark}>
            <VaultDial size={22} />
          </span>
          <span>Seu cofre de tudo que você já assistiu.</span>
        </div>
        <nav aria-label="Rodapé" className={styles.links}>
          <Link href="/sobre">Sobre</Link>
          <Link href="/explorar">Explorar</Link>
          <Link href="/comunidade">Comunidade</Link>
        </nav>
        <p className={styles.credit}>
          Dados de filmes e séries fornecidos pelo{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TMDB
          </a>
          . Este produto usa a API do TMDB, mas não é endossado ou certificado por ele.
        </p>
      </div>
    </footer>
  );
}
