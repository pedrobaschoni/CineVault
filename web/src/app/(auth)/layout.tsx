import type { ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import styles from '@/components/auth/auth.module.css';

/** Layout das telas de entrar e criar conta: um cartão centralizado. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <Logo href="/" />
        {children}
      </div>
    </main>
  );
}
