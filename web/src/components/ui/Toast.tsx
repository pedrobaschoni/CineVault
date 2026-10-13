'use client';

import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

/** Mensagem curta que some sozinha. Anunciada para leitores de tela. */
export function useToast(duration = 2800) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), duration);
    return () => clearTimeout(t);
  }, [message, duration]);

  const node = (
    <div className={styles.region} role="status" aria-live="polite">
      {message && <div className={styles.toast}>{message}</div>}
    </div>
  );
  return { show: setMessage, node };
}
