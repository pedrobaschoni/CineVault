'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { MAIN_NAV, isActive } from '@/lib/navigation';
import { cx } from '@/lib/cx';
import { SearchField } from './SearchField';
import styles from './MainNav.module.css';

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Fecha o menu do celular ao trocar de página.
  useEffect(() => setOpen(false), [pathname]);

  const links = MAIN_NAV.map((item) => {
    const active = isActive(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cx(styles.link, active && styles.active)}
        aria-current={active ? 'page' : undefined}
      >
        {item.label}
      </Link>
    );
  });

  return (
    <>
      <nav aria-label="Principal" className={styles.desktop}>
        {links}
      </nav>

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="menu-celular"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? 'close' : 'menu'} size={22} />
      </button>

      {open && (
        <div id="menu-celular" className={styles.mobile}>
          <SearchField />
          <nav aria-label="Principal" className={styles.mobileNav}>
            {links}
          </nav>
        </div>
      )}
    </>
  );
}
