import { VaultDial } from './Logo';
import { Button } from './Button';
import { Tag } from './Tag';
import styles from './ComingSoon.module.css';

interface ComingSoonProps {
  title: string;
  description: string;
  phase: number;
}

/** Página ainda em construção: diz o que vai ter aqui e em qual fase chega. */
export function ComingSoon({ title, description, phase }: ComingSoonProps) {
  return (
    <section className={`container ${styles.wrap}`}>
      <span className={styles.dial}>
        <VaultDial size={56} />
      </span>
      <Tag tone="accent">Fase {phase} do roadmap</Tag>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>{description}</p>
      <Button href="/inicio" variant="ghost">
        Voltar para o início
      </Button>
    </section>
  );
}
