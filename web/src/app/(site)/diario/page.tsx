import type { Metadata } from 'next';
import { CloudHint } from '@/components/auth/CloudHint';
import { DiaryView } from '@/components/review/DiaryView';
import styles from './diario.module.css';

export const metadata: Metadata = { title: 'Diário' };

export default function DiarioPage() {
  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Diário</h1>
        <p className={styles.lead}>Tudo o que você registrou, do mais recente para o mais antigo.</p>
        <CloudHint />
      </header>
      <DiaryView />
    </div>
  );
}
