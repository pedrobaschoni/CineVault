'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent, ReactNode } from 'react';

interface DemoFormProps {
  children: ReactNode;
  className?: string;
  /** Para onde ir depois de "enviar". */
  next: string;
}

/**
 * Formulário provisório até a Fase 3: valida os campos no navegador e
 * apenas navega. Nada é enviado nem salvo (e a senha nunca vai para a URL).
 */
export function DemoForm({ children, className, next }: DemoFormProps) {
  const router = useRouter();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(next);
  }

  return (
    <form className={className} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
