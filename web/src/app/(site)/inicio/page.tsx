import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Poster } from '@/components/media/Poster';
import { TicketStub } from '@/components/media/TicketStub';
import { MEDIA_LABEL } from '@/lib/format';
import {
  SAMPLE_CONTINUE,
  SAMPLE_DIARY,
  SAMPLE_FEATURED,
  SAMPLE_RANKING,
  SAMPLE_TITLES,
} from '@/lib/sample';
import { TrendingGrid } from './TrendingGrid';
import styles from './inicio.module.css';

export const metadata: Metadata = { title: 'Início' };

export default function InicioPage() {
  const f = SAMPLE_FEATURED;

  return (
    <div className={`container ${styles.page}`}>
      <section className={styles.hero} aria-labelledby="destaque">
        <div className={styles.heroText}>
          <Tag tone="accent">Destaque da semana</Tag>
          <h1 id="destaque" className={styles.heroTitle}>
            {f.title}
          </h1>
          <Tag className={styles.heroMeta}>{f.meta}</Tag>
          <p className={styles.heroSynopsis}>{f.synopsis}</p>
          <div className={styles.actions}>
            <Button variant="primary" icon="play">
              Ver trailer
            </Button>
            <Button>Quero ver</Button>
            <Button href={`/titulo/${f.type}/${f.id}`}>Detalhes</Button>
          </div>
        </div>
        <div className={styles.heroPoster}>
          <Poster title={f.title} meta={`${MEDIA_LABEL[f.type]} · ${f.year}`} color={f.color} size="lg" width="18.75rem" priority />
        </div>
      </section>

      <section aria-labelledby="continuar">
        <SectionHeader id="continuar" title="Continue de onde parou" link={{ href: '/diario', label: 'Ver tudo' }} />
        <div className={styles.continue}>
          {SAMPLE_CONTINUE.map((c) => (
            <Link key={c.id} href={`/titulo/serie/${c.id}`} className={styles.continueCard}>
              <Poster title={c.title} color={c.color} size="sm" width="4rem" />
              <span className={styles.continueInfo}>
                <span className={styles.continueTitle}>{c.title}</span>
                <Tag>{c.progress}</Tag>
                <ProgressBar value={c.done} max={c.total} label={`Progresso em ${c.title}`} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <TrendingGrid titles={SAMPLE_TITLES} />

      <div className={styles.split}>
        <section aria-labelledby="diario">
          <SectionHeader id="diario" title="Seu diário" link={{ href: '/diario', label: 'Abrir diário' }} />
          <div className={styles.stack}>
            {SAMPLE_DIARY.map((d) => (
              <TicketStub key={d.id} date={d.date} title={d.title} meta={d.meta} rating={d.rating} />
            ))}
          </div>
        </section>

        <section aria-labelledby="ranking">
          <SectionHeader id="ranking" title="Ranking da semana" link={{ href: '/explorar', label: 'Ver ranking' }} />
          <ol className={styles.ranking}>
            {SAMPLE_RANKING.map((r, i) => (
              <li key={r.id} className={styles.rankRow}>
                <span className={i === 0 ? `${styles.rankPos} ${styles.rankFirst}` : styles.rankPos}>{i + 1}</span>
                <Link href={`/titulo/${r.type}/${r.id}`} className={styles.rankTitle}>
                  {r.title}
                  <Tag>{MEDIA_LABEL[r.type]}</Tag>
                </Link>
                <Trend value={r.trend} />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function Trend({ value }: { value: number }) {
  if (value === 0) return <span className={styles.trend} aria-label="Sem mudança">—</span>;
  const up = value > 0;
  return (
    <span
      className={`${styles.trend} ${up ? styles.trendUp : ''}`}
      aria-label={up ? `Subiu ${value} posições` : `Caiu ${-value} posições`}
    >
      {up ? '▲' : '▼'} {Math.abs(value)}
    </span>
  );
}
