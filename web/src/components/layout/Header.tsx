import { Logo } from '@/components/ui/Logo';
import { MainNav } from './MainNav';
import { SearchField } from './SearchField';
import { UserMenu } from './UserMenu';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />
        <MainNav />
        <div className={styles.search}>
          <SearchField />
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
