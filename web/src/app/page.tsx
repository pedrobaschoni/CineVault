import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Rating } from '@/components/ui/Rating';
import { ScoreDial } from '@/components/ui/ScoreDial';
import { Poster } from '@/components/media/Poster';
import { TicketStub } from '@/components/media/TicketStub';
import { Footer } from '@/components/layout/Footer';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { MEDIA_LABEL } from '@/lib/format';
import { getTrending } from '@/services/catalog';
import type { TitleSummary } from '@/types';
import styles from './landing.module.css';

/**
 * Página de entrada para quem ainda não tem conta.
 * Substitui o antigo modal "Sobre" e o redirecionamento direto para o login.
 */
export default async function LandingPage() {
  // Os pôsteres da colagem são os títulos mais vistos da semana.
  const trending = await getTrending('week').catch(() => [] as TitleSummary[]);
  const withPoster = trending.filter((t) => t.posterUrl);
  const picks = (withPoster.length >= 3 ? withPoster : trending).slice(0, 3);
  const fallback = [
    { title: 'Arcane', meta: 'Série · 2021', color: '#3a2b47' },
    { title: 'Frieren', meta: 'Anime · 2023', color: '#2c3f45' },
    { title: 'Duna: Parte Dois', meta: 'Filme · 2024', color: '#4a3622' },
  ];
  const collage = fallback.map((f, i) => {
    const t = picks[i];
    return t ? { title: t.title, meta: [MEDIA_LABEL[t.type], t.year].filter(Boolean).join(' · '), src: t.posterUrl, seed: t.id } : { ...f, src: undefined, seed: f.title };
  });

  return (
    <>
      <DemoBanner />
      <header className={`container ${styles.top}`}>
        <Logo href="/" />
        <nav aria-label="Conta" className={styles.topNav}>
          <Link href="/sobre" className={styles.topLink}>
            Sobre
          </Link>
          <Button href="/entrar" size="sm">
            Entrar
          </Button>
          <Button href="/criar-conta" size="sm" variant="primary">
            Criar conta
          </Button>
        </nav>
      </header>

      <main>
        <section className={`container ${styles.hero}`}>
          <div className={styles.heroText}>
            <Tag tone="accent">Filmes · séries · animes · doramas</Tag>
            <h1 className={styles.title}>Seu cofre de tudo que você já assistiu.</h1>
            <p className={styles.lead}>
              Registre o que viu, dê sua nota, acompanhe os episódios e descubra o que assistir a seguir, sem
              pular de app em app.
            </p>
            <div className={styles.actions}>
              <Button href="/criar-conta" variant="primary">
                Criar meu cofre
              </Button>
              <Button href="/inicio">Dar uma olhada</Button>
            </div>
          </div>

          <div className={styles.collage} aria-hidden="true">
            <div className={styles.posterA}>
              <Poster title={collage[0].title} meta={collage[0].meta} src={collage[0].src} seed={collage[0].seed} sizes="208px" priority />
            </div>
            <div className={styles.posterB}>
              <Poster title={collage[1].title} meta={collage[1].meta} src={collage[1].src} seed={collage[1].seed} sizes="208px" priority />
            </div>
            <div className={styles.posterC}>
              <Poster title={collage[2].title} meta={collage[2].meta} src={collage[2].src} seed={collage[2].seed} sizes="208px" priority />
            </div>
            <div className={styles.stub}>
              <TicketStub date="2026-10-05" title="Vidas Passadas" meta="Filme · primeira vez" rating={4.5} />
            </div>
            <div className={styles.dial}>
              <ScoreDial score={9.1} size={104} animated delay={600} />
            </div>
          </div>
        </section>

        <section className={`container ${styles.features}`} aria-label="O que dá para fazer">
          <article className={styles.feature}>
            <span className={styles.featureNum}>01</span>
            <h2 className={styles.featureTitle}>Registre</h2>
            <p>Um diário com tudo o que você assistiu, por data, com nota e reassistidas.</p>
            <TicketStub date="2026-10-02" title="Arcane · T2 E3" meta="Série · episódio" rating={5} />
          </article>
          <article className={styles.feature}>
            <span className={styles.featureNum}>02</span>
            <h2 className={styles.featureTitle}>Avalie</h2>
            <p>Notas de 0,5 a 5 e reviews com proteção de spoiler para quem ainda não viu.</p>
            <Rating value={4.5} size={26} showValue />
          </article>
          <article className={styles.feature}>
            <span className={styles.featureNum}>03</span>
            <h2 className={styles.featureTitle}>Descubra</h2>
            <p>O que está em alta, onde assistir no Brasil e listas feitas pela comunidade.</p>
            <div className={styles.chips}>
              <span>Em alta</span>
              <span>Onde assistir</span>
              <span>Listas</span>
            </div>
          </article>
        </section>

        <section className={`container ${styles.closing}`}>
          <h2 className={styles.closingTitle}>Chega de 40 minutos escolhendo o que ver.</h2>
          <div className={styles.actions}>
            <Button href="/criar-conta" variant="primary">
              Criar meu cofre
            </Button>
            <Button href="/sobre" variant="text">
              Conhecer a história do CineVault
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
