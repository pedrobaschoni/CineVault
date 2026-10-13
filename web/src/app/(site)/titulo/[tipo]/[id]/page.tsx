import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Badge } from '@/components/ui/Chip';
import { ScoreDial } from '@/components/ui/ScoreDial';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { Poster } from '@/components/media/Poster';
import { PosterCard } from '@/components/media/PosterCard';
import { TitleActions } from '@/components/media/TitleActions';
import { TrailerButton } from '@/components/media/TrailerButton';
import { VaultHero } from '@/components/media/VaultHero';
import { WhereToWatch } from '@/components/media/WhereToWatch';
import { EpisodeList } from '@/components/review/EpisodeList';
import { YourReview } from '@/components/review/YourReview';
import { formatRating, MEDIA_LABEL } from '@/lib/format';
import { formatLongDate, formatRuntime, makeTitleRef, parseIdParam } from '@/lib/media';
import { getSeason, getTitle, isNotFound } from '@/services/catalog';
import type { MediaType, SeasonDetail, TitleDetail } from '@/types';
import styles from './titulo.module.css';

interface Props {
  params: Promise<{ tipo: string; id: string }>;
  searchParams: Promise<{ temporada?: string }>;
}

function isMediaType(value: string): value is MediaType {
  return value in MEDIA_LABEL;
}

async function load(tipo: string, idParam: string): Promise<TitleDetail> {
  const id = parseIdParam(idParam);
  if (!isMediaType(tipo) || id === null) notFound();
  try {
    return await getTitle(tipo === 'filme' ? 'movie' : 'tv', id);
  } catch (error) {
    if (isNotFound(error)) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo, id } = await params;
  try {
    const t = await load(tipo, id);
    return { title: t.title, description: t.overview?.slice(0, 160) };
  } catch {
    return { title: 'Título' };
  }
}

export default async function TituloPage({ params, searchParams }: Props) {
  const { tipo, id } = await params;
  const { temporada } = await searchParams;
  const t = await load(tipo, id);

  // Link antigo ou com o tipo errado (ex.: um anime aberto como "série"): leva ao endereço certo.
  if (`/titulo/${tipo}/${id}` !== t.href) redirect(t.href + (temporada ? `?temporada=${temporada}` : ''));

  const isSeries = t.kind === 'tv';
  const selected = isSeries ? t.seasons.find((s) => String(s.number) === temporada) ?? t.seasons.at(-1) : undefined;
  const season: SeasonDetail | null = selected ? await getSeason(t.id, selected.number).catch(() => null) : null;

  const ref = makeTitleRef(t);
  const trailer = t.videos[0];
  const years = isSeries && t.year ? `${t.year}${t.endYear && t.endYear !== t.year ? `–${t.endYear}` : t.endYear ? '' : '–'}` : t.year;
  const meta = [
    years,
    isSeries && t.seasonCount ? `${t.seasonCount} ${t.seasonCount === 1 ? 'temporada' : 'temporadas'}` : null,
    isSeries && t.episodeCount ? `${t.episodeCount} episódios` : null,
    isSeries && t.runtime ? `~${t.runtime} min` : formatRuntime(t.runtime),
    t.certification ? (t.certification === 'L' ? 'Livre' : `${t.certification}+`) : null,
  ].filter(Boolean);
  const credits = t.directors.slice(0, 2);

  return (
    <>
      <VaultHero backdropUrl={t.backdropUrl} seed={t.id} className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.posterCol} data-reveal="poster">
            <Poster title={t.title} src={t.posterUrl} seed={t.id} meta={meta[0] ? `${MEDIA_LABEL[t.type]} · ${meta[0]}` : undefined} size="lg" sizes="280px" priority />
          </div>

          <div className={styles.info}>
            <div data-reveal style={{ '--i': 0 } as React.CSSProperties}>
              <Tag tone="accent">
                {[MEDIA_LABEL[t.type], ...t.genres.slice(0, 2).map((g) => g.name)].join(' · ')}
              </Tag>
            </div>
            <h1 className={styles.title} data-reveal="title">
              <span>{t.title}</span>
            </h1>
            {t.originalTitle && t.originalTitle !== t.title && (
              <p className={styles.original} data-reveal style={{ '--i': 1 } as React.CSSProperties}>
                {t.originalTitle}
              </p>
            )}
            <p className={styles.meta} data-reveal style={{ '--i': 2 } as React.CSSProperties}>
              {meta.join(' · ')}
            </p>
            {t.tagline && (
              <p className={styles.tagline} data-reveal style={{ '--i': 3 } as React.CSSProperties}>
                {t.tagline}
              </p>
            )}
            {t.overview && (
              <p className={styles.overview} data-reveal style={{ '--i': 3 } as React.CSSProperties}>
                {t.overview}
              </p>
            )}
            {credits.length > 0 && (
              <p className={styles.credits} data-reveal style={{ '--i': 4 } as React.CSSProperties}>
                {isSeries ? 'Criação' : 'Direção'}{' '}
                {credits.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && ', '}
                    <Link href={c.href}>{c.name}</Link>
                  </span>
                ))}
              </p>
            )}
            <div data-reveal style={{ '--i': 5 } as React.CSSProperties}>
              <TitleActions title={ref} trailer={trailer} />
            </div>
          </div>

          {t.score ? (
            <aside className={styles.scorePanel} data-reveal style={{ '--i': 2 } as React.CSSProperties}>
              <ScoreDial score={t.score} label="Nota do público · TMDB" animated delay={500} />
              <p className={styles.scoreNote}>
                {t.voteCount ? `${t.voteCount.toLocaleString('pt-BR')} votos. ` : ''}Vira o CineVault Score quando a comunidade começar a avaliar.
              </p>
            </aside>
          ) : null}
        </div>
      </VaultHero>

      <nav className={styles.tabs} aria-label="Seções do título">
        <div className={`container ${styles.tabsInner}`}>
          <a href="#opiniao">Sua opinião</a>
          {isSeries && t.seasons.length > 0 && <a href="#temporadas">Episódios</a>}
          {t.cast.length > 0 && <a href="#elenco">Elenco</a>}
          {t.videos.length > 0 && <a href="#videos">Vídeos</a>}
          <a href="#onde-assistir-secao">Onde assistir</a>
          {t.recommendations.length > 0 && <a href="#parecidos">Parecidos</a>}
        </div>
      </nav>

      <div className={`container ${styles.body}`}>
        <div className={styles.main}>
          <YourReview title={ref} />

          {isSeries && selected && (
            <section id="temporadas" className={styles.section} aria-labelledby="temporadas-h">
              <div className={styles.seasonHead}>
                <h2 id="temporadas-h" className={styles.h2}>
                  Episódios
                </h2>
                {t.seasons.length > 1 && (
                  <nav className={styles.seasonNav} aria-label="Temporadas">
                    {t.seasons.map((s) => (
                      <Link
                        key={s.number}
                        href={`${t.href}?temporada=${s.number}#temporadas`}
                        scroll={false}
                        replace
                        aria-current={s.number === selected.number ? 'true' : undefined}
                        className={styles.seasonLink}
                      >
                        T{s.number}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>
              <p className={styles.seasonInfo}>
                {selected.name} · {selected.episodeCount} episódios{selected.year ? ` · ${selected.year}` : ''}
              </p>
              {season ? (
                <EpisodeList title={ref} season={season} />
              ) : (
                <p className={styles.muted}>Não deu para carregar os episódios desta temporada agora.</p>
              )}
            </section>
          )}

          {t.cast.length > 0 && (
            <section id="elenco" className={styles.section} aria-labelledby="elenco-h">
              <h2 id="elenco-h" className={styles.h2}>
                {t.type === 'anime' ? 'Elenco de vozes' : 'Elenco principal'}
              </h2>
              <ul className={styles.cast}>
                {t.cast.slice(0, 12).map((c) => (
                  <li key={c.id}>
                    <Link href={c.href} className={styles.person}>
                      <span className={styles.avatar}>
                        {c.profileUrl ? (
                          <Image src={c.profileUrl} alt="" fill sizes="88px" />
                        ) : (
                          c.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
                        )}
                      </span>
                      <span className={styles.personName}>{c.name}</span>
                      {c.character && <span className={styles.character}>{c.character}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {t.videos.length > 0 && (
            <section id="videos" className={styles.section} aria-labelledby="videos-h">
              <h2 id="videos-h" className={styles.h2}>
                Vídeos
              </h2>
              <div className={styles.videos}>
                {t.videos.slice(0, 3).map((v, i) => (
                  <TrailerButton key={v.key} video={v} className={i === 0 ? `${styles.video} ${styles.videoMain}` : styles.video} aria-label={`Assistir: ${v.name}`}>
                    <Image src={`https://i.ytimg.com/vi/${v.key}/hqdefault.jpg`} alt="" fill sizes={i === 0 ? '(max-width: 860px) 100vw, 560px' : '280px'} className={styles.videoThumb} />
                    <span className={styles.play} aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z" /></svg>
                    </span>
                    <span className={styles.videoName}>{v.name}</span>
                  </TrailerButton>
                ))}
              </div>
            </section>
          )}

          {t.recommendations.length > 0 && (
            <section id="parecidos" className={styles.section}>
              <SectionHeader title="Se você gostou deste" />
              <div className={styles.recs}>
                {t.recommendations.slice(0, 5).map((r) => (
                  <PosterCard key={`${r.kind}-${r.id}`} item={r} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.aside}>
          <WhereToWatch providers={t.providers} />

          <section className={styles.panel} aria-labelledby="ficha-h">
            <h2 id="ficha-h" className={styles.panelTitle}>
              Ficha
            </h2>
            <dl className={styles.facts}>
              {t.originalTitle && (
                <>
                  <dt>Título original</dt>
                  <dd>{t.originalTitle}</dd>
                </>
              )}
              {t.directors.length > 0 && (
                <>
                  <dt>{isSeries ? 'Criação' : 'Direção'}</dt>
                  <dd>{t.directors.map((d) => d.name).join(', ')}</dd>
                </>
              )}
              {t.writers.length > 0 && (
                <>
                  <dt>Roteiro</dt>
                  <dd>{t.writers.map((d) => d.name).join(', ')}</dd>
                </>
              )}
              {t.date && (
                <>
                  <dt>{isSeries ? 'Estreia' : 'Lançamento'}</dt>
                  <dd>{formatLongDate(t.date)}</dd>
                </>
              )}
              {t.genres.length > 0 && (
                <>
                  <dt>Gêneros</dt>
                  <dd className={styles.badges}>
                    {t.genres.map((g) => (
                      <Badge key={g.id}>{g.name}</Badge>
                    ))}
                  </dd>
                </>
              )}
              {t.countries.length > 0 && (
                <>
                  <dt>País</dt>
                  <dd>{t.countries.join(', ')}</dd>
                </>
              )}
              {t.languages.length > 0 && (
                <>
                  <dt>Idioma</dt>
                  <dd>{t.languages.slice(0, 2).join(', ')}</dd>
                </>
              )}
              {t.studios.length > 0 && (
                <>
                  <dt>Estúdio</dt>
                  <dd>{t.studios.join(', ')}</dd>
                </>
              )}
            </dl>
          </section>

          {t.collection && (
            <section className={styles.panel} aria-labelledby="colecao-h">
              <h2 id="colecao-h" className={styles.panelTitle}>
                Coleção {t.collection.name.replace(/^Coleção\s+/i, '').replace(/\s*[-–:]?\s*Coleção$/i, '')}
              </h2>
              <ul className={styles.collection}>
                {t.collection.parts.map((p) => (
                  <li key={p.id}>
                    <Link href={p.href} className={styles.part} aria-current={p.id === t.id ? 'page' : undefined}>
                      <Poster title={p.title} src={p.posterUrl} seed={p.id} size="sm" width="3.25rem" sizes="52px" />
                      <span>
                        <span className={styles.partTitle}>{p.title}</span>
                        <span className={styles.partYear}>
                          {p.year}
                          {p.score ? ` · ${formatRating(p.score)}` : ''}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}
