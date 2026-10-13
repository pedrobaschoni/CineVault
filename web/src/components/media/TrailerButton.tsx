'use client';

import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/cx';
import type { Video } from '@/types';
import styles from './TrailerButton.module.css';

interface TrailerButtonProps {
  video: Video;
  /** Conteúdo do botão (texto ou miniatura). */
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Abre o vídeo num modal que se expande em íris a partir do ponto clicado,
 * a mesma linguagem da abertura das páginas de título.
 */
export function TrailerButton({ video, children, className, ...rest }: TrailerButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' });
  const [open, setOpen] = useState(false);

  function show(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: `${r.left + r.width / 2}px`, y: `${r.top + r.height / 2}px` });
    setOpen(true);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button type="button" className={className} onClick={show} aria-haspopup="dialog" {...rest}>
        {children}
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={video.name}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        style={{ '--x': origin.x, '--y': origin.y } as CSSProperties}
      >
        <div className={styles.stage} onClick={(e) => e.target === e.currentTarget && close()}>
          <div className={styles.frame}>
            {/* O iframe só existe com o modal aberto: fechar para o vídeo. */}
            {open && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0`}
                title={video.name}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}
          </div>
          <div className={styles.bar}>
            <span className={styles.name}>{video.name}</span>
            <button type="button" className={styles.close} onClick={close} aria-label="Fechar vídeo">
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

/** Botão de texto "Trailer" no estilo do site. */
export function TrailerTextButton({ video }: { video: Video }) {
  return (
    <TrailerButton video={video} className={cx(styles.textButton)}>
      <Icon name="play" size={16} />
      Trailer
    </TrailerButton>
  );
}
