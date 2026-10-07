'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { USER_NAV } from '@/lib/navigation';
import styles from './UserMenu.module.css';

interface UserMenuProps {
  initial: string;
  name: string;
}

/** Avatar que abre o menu pessoal: Perfil, Configurações, Sobre e Sair. */
export function UserMenu({ initial, name }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();

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

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.avatar}
        aria-label={`Menu de ${name}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {initial}
      </button>

      {open && (
        <div id={menuId} className={styles.menu}>
          <div className={styles.who}>
            <span className={styles.name}>{name}</span>
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
              {/* Fase 3: encerra a sessão de verdade. */}
              <Link href="/entrar" className={styles.item}>
                Sair
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
