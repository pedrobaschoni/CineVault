'use client';

import { useState } from 'react';
import styles from './review.module.css';

/** Texto de opinião; se marcado como spoiler, fica escondido até a pessoa pedir. */
export function SpoilerText({ text, spoiler }: { text: string; spoiler?: boolean }) {
  const [shown, setShown] = useState(!spoiler);
  if (shown) return <p className={styles.reviewText}>{text}</p>;
  return (
    <div className={styles.spoiler}>
      <p className={styles.spoilerBlur} aria-hidden="true">
        {text}
      </p>
      <button type="button" className={styles.spoilerButton} onClick={() => setShown(true)}>
        Contém spoiler. Mostrar opinião
      </button>
    </div>
  );
}
