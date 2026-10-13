import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { Highlights, type Highlight } from '@/components/media/Highlights';
import { formatRating, MEDIA_LABEL } from '@/lib/format';
import { getTitle, getTrending } from '@/services/catalog';
import type { TitleSummary } from '@/types';
import { TrendingGrid } from './TrendingGrid';
import { ContinueWatching, RecentDiary } from './HomeUserSections';
import styles from './inicio.module.css';

export const metadata: Metadata = { title: 'Início' };

export default async function InicioPage() {
  // Se o catálogo falhar, a página abre mesmo assim, só sem as vitrines.
  const [week, day] = await Promise.all([
    getTrending('week').catch(() => [] as TitleSummary[]),
    getTrending('day').catch(() => [] as TitleSummary[]),
  ]);

  // Destaques: os cinco mais vistos da semana com imagem de fundo e sinopse
  // (sem imagens, no modo demonstração, os cinco primeiros com sinopse).
  const withArt = week.filter((t) => t.backdropUrl && t.overview);
  const picks = (withArt.length >= 3 ? withArt : week.filter((t) => t.overview)).slice(0, 5);
  const details = await Promise.all(picks.map((t) => getTitle(t.kind, t.id).catch(() => null)));
  const highlights: Highlight[] = picks.map((t, i) => {
    const d = details[i];
    const genres = d?.genres.slice(0, 2).map((g) => g.name) ?? [];
    return {
      key: `${t.kind}-${t.id}`,
      id: t.id,
      title: t.title,
      href: t.href,
      meta: [MEDIA_LABEL[t.type], t.year, ...genres].filter(Boolean).join(' · ') + (t.score ? ` · ${formatRating(t.score)}` : ''),
      overview: d?.overview || t.overview,
      posterUrl: t.posterUrl,
      backdropUrl: t.backdropUrl,
      video: d?.videos[0],
    };
  });

  // Ranking do dia, comparado com a posição na semana.
  const weekRank = new Map(week.map((t, i) => [`${t.kind}-${t.id}`, i]));
  const ranking = day.slice(0, 5).map((t, i) => {
    const before = weekRank.get(`${t.kind}-${t.id}`);
    return { title: t, trend: before === undefined ? null : before - i };
  });

  return (
    <>
      <h1 className="visually-hidden">Início</h1>
      <Highlights items={highlights} />

      <div className={`container ${styles.page}`}>
        <ContinueWatching />

        {week.length > 0 && <TrendingGrid titles={week} />}

        <div className={styles.split}>
          <RecentDiary />

          {ranking.length > 0 && <section aria-labelledby="ranking">
            <SectionHeader id="ranking" title="Mais vistos hoje" link={{ href: '/explorar', label: 'Explorar' }} />
            <ol className={styles.ranking}>
              {ranking.map(({ title, trend }, i) => (
                <RankRow key={`${title.kind}-${title.id}`} position={i + 1} title={title} trend={trend} />
              ))}
            </ol>
          </section>}
        </div>
      </div>
    </>
  );
}

function RankRow({ position, title, trend }: { position: number; title: TitleSummary; trend: number | null }) {
  return (
    <li className={styles.rankRow}>
      <span className={position === 1 ? `${styles.rankPos} ${styles.rankFirst}` : styles.rankPos}>{position}</span>
      <Link href={title.href} className={styles.rankTitle}>
        {title.title}
        <Tag>{[MEDIA_LABEL[title.type], title.year].filter(Boolean).join(' · ')}</Tag>
      </Link>
      <Trend value={trend} />
    </li>
  );
}

function Trend({ value }: { value: number | null }) {
  if (value === null) return <span className={`${styles.trend} ${styles.trendUp}`}>novo</span>;
  if (value === 0) return <span className={styles.trend} aria-label="Mesma posição da semana">—</span>;
  const up = value > 0;
  return (
    <span
      className={`${styles.trend} ${up ? styles.trendUp : ''}`}
      aria-label={up ? `${value} posições acima da semana` : `${-value} posições abaixo da semana`}
    >
      {up ? '▲' : '▼'} {Math.abs(value)}
    </span>
  );
}
