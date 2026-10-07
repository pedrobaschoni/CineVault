import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Icon, type IconName } from './Icon';
import styles from './Button.module.css';

type Variant = 'primary' | 'ghost' | 'text';
type Size = 'md' | 'sm';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  children?: ReactNode;
  className?: string;
}

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & { href?: undefined };

type LinkProps = BaseProps & { href: string; 'aria-label'?: string };

/**
 * Botão do CineVault. Com `href` vira um link (mesmo visual).
 * Sem texto, é um botão só de ícone e precisa de `aria-label`.
 */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'ghost', size = 'md', icon, children, className } = props;
  const iconOnly = !children;
  const classes = cx(styles.btn, styles[variant], styles[size], iconOnly && styles.iconOnly, className);
  const content = (
    <>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes} aria-label={props['aria-label']}>
        {content}
      </Link>
    );
  }

  const { variant: _v, size: _s, icon: _i, children: _c, className: _cn, type = 'button', ...rest } =
    props as ButtonProps;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
