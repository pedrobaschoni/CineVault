'use client';

import { COMPOSE_EVENT } from '@/components/review/YourReview';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { toggleList, useUserData } from '@/services/user';
import type { TitleRef, Video } from '@/types';
import { TrailerTextButton } from './TrailerButton';
import styles from './TitleActions.module.css';

interface TitleActionsProps {
  title: TitleRef;
  trailer?: Video;
}

/** Ações do topo da página do título. */
export function TitleActions({ title, trailer }: TitleActionsProps) {
  const toast = useToast();
  const wants = useUserData((d) => d.lists['quero-ver'].some((t) => t.key === title.key));
  const favorite = useUserData((d) => d.lists.favoritos.some((t) => t.key === title.key));
  const sessions = useUserData((d) => d.diary.filter((e) => e.title.key === title.key).length);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${title.title} · CineVault`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.show('Link copiado.');
    } catch {
      /* A pessoa cancelou o compartilhamento: nada a fazer. */
    }
  }

  return (
    <div className={styles.actions}>
      <Button variant="primary" icon="plus" onClick={() => window.dispatchEvent(new Event(COMPOSE_EVENT))}>
        {sessions > 0 ? 'Registrar de novo' : 'Registrar no diário'}
      </Button>
      {trailer && <TrailerTextButton video={trailer} />}
      <Button
        aria-pressed={wants}
        className={wants ? styles.on : undefined}
        icon={wants ? 'check' : undefined}
        onClick={() => toast.show(toggleList('quero-ver', title) ? 'Adicionado ao Quero ver.' : 'Removido do Quero ver.')}
      >
        Quero ver
      </Button>
      <Button
        icon="heart"
        aria-label={favorite ? 'Remover dos favoritos' : 'Favoritar'}
        aria-pressed={favorite}
        className={favorite ? `${styles.on} ${styles.heart}` : undefined}
        onClick={() => toast.show(toggleList('favoritos', title) ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.')}
      />
      <Button icon="share" aria-label="Compartilhar" onClick={share} />
      {toast.node}
    </div>
  );
}
