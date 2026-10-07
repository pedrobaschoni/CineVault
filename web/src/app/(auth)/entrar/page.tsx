import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DemoForm } from '@/components/auth/DemoForm';
import styles from '../auth.module.css';

export const metadata: Metadata = { title: 'Entrar' };

export default function EntrarPage() {
  return (
    <>
      <div>
        <h1 className={styles.title}>Abra seu cofre</h1>
        <p className={styles.sub}>Entre para ver seu diário, listas e notas.</p>
      </div>

      {/* Fase 3: autenticação real. Por enquanto o formulário só valida e leva ao início. */}
      <DemoForm next="/inicio" className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>E-mail</span>
          <input type="email" name="email" autoComplete="email" required className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Senha</span>
          <input type="password" name="senha" autoComplete="current-password" required className={styles.input} />
        </label>
        <Button type="submit" variant="primary" className={styles.submit}>
          Entrar
        </Button>
      </DemoForm>

      <p className={styles.switch}>
        Ainda não tem conta? <Link href="/criar-conta">Criar meu cofre</Link>
      </p>
    </>
  );
}
