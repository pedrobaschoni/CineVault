import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Chip';
import { Tag } from '@/components/ui/Tag';
import { Rating } from '@/components/ui/Rating';
import { RatingInput } from '@/components/ui/RatingInput';
import { ScoreDial } from '@/components/ui/ScoreDial';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Poster } from '@/components/media/Poster';
import { PosterCard } from '@/components/media/PosterCard';
import { TicketStub } from '@/components/media/TicketStub';
import styles from './design.module.css';

export const metadata: Metadata = { title: 'Componentes', robots: { index: false } };

const CORES = [
  ['Breu', '--cv-breu', 'fundo'],
  ['Grafite', '--cv-grafite', 'superfície'],
  ['Chumbo', '--cv-chumbo', 'cartões'],
  ['Linha', '--cv-linha', 'bordas'],
  ['Papel', '--cv-papel', 'texto'],
  ['Pó', '--cv-po', 'texto discreto'],
  ['Latão', '--cv-latao', 'destaque'],
  ['Brasa', '--cv-brasa', 'em alta'],
] as const;

/** Vitrine dos componentes. Não aparece no menu; serve de referência para o desenvolvimento. */
export default function DesignPage() {
  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Tag tone="accent">Referência interna</Tag>
        <h1 className={styles.title}>Componentes do CineVault</h1>
      </header>

      <section>
        <SectionHeader title="Cores" />
        <div className={styles.swatches}>
          {CORES.map(([nome, token, papel]) => (
            <div key={token} className={styles.swatch}>
              <span className={styles.chip} style={{ background: `var(${token})` }} />
              <strong>{nome}</strong>
              <Tag>
                {token} · {papel}
              </Tag>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Tipografia" />
        <div className={styles.type}>
          <p className={styles.display}>Arcane</p>
          <p>Manrope para a interface e os textos corridos.</p>
          <Tag tone="accent">CV-0427 · Série · 2021–2024 · 16+</Tag>
        </div>
      </section>

      <section>
        <SectionHeader title="Botões e filtros" />
        <div className={styles.row}>
          <Button variant="primary" icon="plus">
            Registrar no diário
          </Button>
          <Button icon="play">Trailer</Button>
          <Button>Quero ver</Button>
          <Button icon="heart" aria-label="Favoritar" />
          <Button variant="text">Ver tudo</Button>
          <Button size="sm">Pequeno</Button>
        </div>
        <div className={styles.row}>
          <Chip selected>Tudo</Chip>
          <Chip>Filmes</Chip>
          <Chip>Séries</Chip>
          <Badge>Animação</Badge>
          <Badge>Drama</Badge>
        </div>
      </section>

      <section>
        <SectionHeader title="Notas e progresso" />
        <div className={styles.row}>
          <Rating value={3.5} showValue />
          <RatingInput />
          <ScoreDial score={9.1} />
        </div>
        <div className={styles.progress}>
          <ProgressBar value={13} max={18} label="Episódios vistos" thick />
        </div>
      </section>

      <section>
        <SectionHeader title="Pôsteres e diário" />
        <div className={styles.media}>
          <Poster title="Arcane" meta="Série · 2021" color="#3a2b47" size="lg" width="14rem" />
          <div className={styles.cards}>
            <PosterCard item={{ id: 209867, kind: 'tv', type: 'anime', title: 'Frieren', year: 2023, score: 8.8, genreIds: [16], href: '/titulo/anime/209867-frieren-e-a-jornada-para-o-alem' }} />
            <PosterCard item={{ id: 693134, kind: 'movie', type: 'filme', title: 'Duna: Parte Dois', year: 2024, score: 8.1, genreIds: [878], href: '/titulo/filme/693134-duna-parte-dois' }} />
          </div>
          <div className={styles.stubs}>
            <TicketStub date="2026-10-05" title="Vidas Passadas" meta="Filme · 2023 · primeira vez" rating={4.5} />
            <TicketStub date="2026-09-28" title="Interestelar" meta="Filme · 2014 · reassistido" rating={5} />
          </div>
        </div>
      </section>
    </div>
  );
}
