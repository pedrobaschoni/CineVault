import { Icon } from '@/components/ui/Icon';
import styles from './SearchField.module.css';

/**
 * Busca global. Envia para /explorar?q=… — funciona mesmo sem JavaScript.
 * Na Fase 2 ganha sugestões enquanto a pessoa digita.
 */
export function SearchField() {
  return (
    <form action="/explorar" role="search" className={styles.form}>
      <label className={styles.field}>
        <Icon name="search" size={16} className={styles.icon} />
        <span className="visually-hidden">Buscar</span>
        <input
          type="search"
          name="q"
          placeholder="Buscar filmes, séries, animes e doramas"
          autoComplete="off"
          className={styles.input}
        />
      </label>
    </form>
  );
}
