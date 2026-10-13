import styles from './VaultLoader.module.css';

/**
 * Carregamento do CineVault: a roda do cofre gira para um lado e para o
 * outro, como quem digita a combinação. Usado nos loading.tsx das rotas.
 */
export function VaultLoader({ label = 'Abrindo o cofre…' }: { label?: string }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true" className={styles.svg}>
        <circle cx="44" cy="44" r="41" className={styles.rim} />
        <g className={styles.wheel}>
          <circle cx="44" cy="44" r="30" className={styles.ring} />
          {Array.from({ length: 24 }, (_, i) => (
            <line
              key={i}
              x1="44"
              y1={i % 6 === 0 ? 16 : 18}
              x2="44"
              y2="22"
              transform={`rotate(${i * 15} 44 44)`}
              className={i % 6 === 0 ? styles.tickMajor : styles.tick}
            />
          ))}
          <circle cx="44" cy="44" r="9" className={styles.hub} />
        </g>
        <path d="M44 1.5l3.5 6h-7z" className={styles.index} />
      </svg>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
