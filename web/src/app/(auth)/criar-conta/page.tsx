import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DemoForm } from '@/components/auth/DemoForm';
import styles from '../auth.module.css';

export const metadata: Metadata = { title: 'Criar conta' };

export default function CriarContaPage() {
  return (
    <>
      <div>
        <h1 className={styles.title}>Crie seu cofre</h1>
        <p className={styles.sub}>Leva menos de um minuto.</p>
      </div>

      {/* Fase 3: cadastro real e primeiro acesso guiado. */}
      <DemoForm next="/inicio" className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Nome de usuário</span>
          <input type="text" name="usuario" autoComplete="username" required className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>E-mail</span>
          <input type="email" name="email" autoComplete="email" required className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Senha</span>
          <input type="password" name="senha" autoComplete="new-password" minLength={8} required className={styles.input} />
        </label>
        <Button type="submit" variant="primary" className={styles.submit}>
          Criar conta
        </Button>
      </DemoForm>

      <p className={styles.switch}>
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </>
  );
}
