import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  id?: string;
  /** Link "ver tudo" à direita. */
  link?: { href: string; label: string };
  /** Conteúdo extra à direita, como filtros. */
  aside?: ReactNode;
}

export function SectionHeader({ title, id, link, aside }: SectionHeaderProps) {
  return (
    <div className={styles.head}>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {aside}
      {link && (
        <Link href={link.href} className={styles.link}>
          {link.label}
        </Link>
      )}
    </div>
  );
}
