import { isDemoMode } from '@/services/catalog';
import styles from './DemoBanner.module.css';

/** Faixa no topo quando o site roda sem token do TMDB. */
export function DemoBanner() {
  if (!isDemoMode()) return null;
  return (
    <p className={styles.banner} role="note">
      Modo demonstração: o catálogo usa dados de exemplo. Coloque seu <code>TMDB_API_TOKEN</code> no{' '}
      <code>.env.local</code> para ver filmes e séries reais.
    </p>
  );
}
