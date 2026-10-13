'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { USER_NAV } from '@/lib/navigation';
import { signOut, useAccount } from '@/services/user';
import styles from './UserMenu.module.css';

/**
 * Sem login: botão "Entrar". Com login: a foto (ou a inicial) abre o menu
 * pessoal com Perfil, Configurações, Sobre e Sair.
 */
export function UserMenu() {
  const { account, checking, synced } = useAccount();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Enquanto descobre se há sessão, um círculo vazio guarda o lugar (sem pular o layout).
  if (checking) return <div className={styles.wrap}><span className={styles.placeholder} aria-hidden="true" /></div>;

  if (!account) {
    return (
      <div className={styles.wrap}>
        <Link href={`/entrar?next=${encodeURIComponent(pathname)}`} className={styles.signIn}>
          Entrar
        </Link>
      </div>
    );
  }

  async function onSignOut() {
    setOpen(false);
    await signOut();
    router.refresh();
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.avatar}
        aria-label={`Menu de ${account.name}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {account.avatarUrl ? (
          <Image src={account.avatarUrl} alt="" width={42} height={42} className={styles.photo} unoptimized referrerPolicy="no-referrer" />
        ) : (
          account.name.charAt(0).toUpperCase()
        )}
      </button>

      {open && (
        <div id={menuId} className={styles.menu}>
          <div className={styles.who}>
            <span className={styles.name}>{account.name}</span>
            {account.email && <span className={styles.email}>{account.email}</span>}
            <span className={styles.sync} data-on={synced || undefined}>
              {synced ? 'Diário salvo na nuvem' : 'Salvando neste navegador'}
            </span>
          </div>
          <ul className={styles.list}>
            {USER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.item}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className={styles.sep}>
              <button type="button" className={styles.item} onClick={onSignOut}>
                Sair
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
