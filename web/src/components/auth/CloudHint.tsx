'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useHydrated } from '@/services/user';
import styles from './CloudHint.module.css';

/** Convite discreto para entrar, mostrado a quem usa o site sem conta. */
export function CloudHint() {
  const hydrated = useHydrated();
  const { account, enabled } = useAccount();
  const pathname = usePathname();
  if (!hydrated || !enabled || account) return null;

  return (
    <p className={styles.hint}>
      Seu diário está salvo só neste navegador.{' '}
      <Link href={`/entrar?next=${encodeURIComponent(pathname)}`}>Entre com o Google</Link> para guardá-lo na nuvem e ver em
      qualquer aparelho.
    </p>
  );
}
