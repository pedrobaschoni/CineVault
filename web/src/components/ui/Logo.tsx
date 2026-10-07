import Link from 'next/link';
import styles from './Logo.module.css';

/** Mostrador de cofre: o símbolo do CineVault. */
export function VaultDial({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="14" cy="14" r="12" />
      <circle cx="14" cy="14" r="5" />
      <path d="M14 2v3M14 23v3M2 14h3M23 14h3M5.5 5.5l2 2M20.5 20.5l2 2M22.5 5.5l-2 2M7.5 20.5l-2 2" />
    </svg>
  );
}

export function Logo({ href = '/inicio' }: { href?: string }) {
  return (
    <Link href={href} className={styles.logo} aria-label="CineVault, página inicial">
      <span className={styles.mark}>
        <VaultDial />
      </span>
      <span className={styles.word}>CineVault</span>
    </Link>
  );
}
