import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { PosterCard } from '@/components/media/PosterCard';
import { formatLongDate, parseIdParam, personHref } from '@/lib/media';
import { getPerson, isNotFound } from '@/services/catalog';
import { GENRE_NAME } from '@/services/catalog/taxonomy';
import type { PersonDetail } from '@/types';
import { Filmography } from './Filmography';
import styles from './pessoa.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

async function load(idParam: string): Promise<PersonDetail> {
  const id = parseIdParam(idParam);
  if (id === null) notFound();
  try {
    return await getPerson(id);
  } catch (error) {
    if (isNotFound(error)) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const p = await load((await params).id);
    return { title: p.name, description: p.biography?.slice(0, 160) };
  } catch {
    return { title: 'Pessoa' };
  }
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

export default async function PessoaPage({ params }: Props) {
  const { id } = await params;
  const p = await load(id);
  const canonical = personHref(p.id, p.name);
  if (`/pessoa/${id}` !== canonical) redirect(canonical);

  // Em números
  const genreCount = new Map<number, number>();
  for (const c of p.credits) for (const g of c.title.genreIds) genreCount.set(g, (genreCount.get(g) ?? 0) + 1);
  const topGenre = [...genreCount.entries()].sort((a, b) => b[1] - a[1])[0];
  const best = p.credits
    .filter((c) => (c.title.voteCount ?? 0) >= 200 && c.title.score)
    .sort((a, b) => (b.title.score ?? 0) - (a.title.score ?? 0))[0];

  const born = [formatLongDate(p.birthday) && `Nasceu em ${formatLongDate(p.birthday)}`, p.placeOfBirth].filter(Boolean).join(' · ');
  const paragraphs = p.biography?.split(/\n+/).filter(Boolean) ?? [];

  return (
    <div className={`container ${styles.page}`}>
      <section className={styles.hero}>
        <div className={styles.photo}>
          {p.profileUrl ? <Image src={p.profileUrl} alt={`Foto de ${p.name}`} fill sizes="240px" priority /> : <span aria-hidden="true">{initials(p.name)}</span>}
        </div>
        <div className={styles.heroText}>
          {p.department && <p className={styles.department}>{p.department}</p>}
          <h1 className={styles.name}>{p.name}</h1>
          {born && <p className={styles.born}>{born}</p>}
          {paragraphs.length > 0 &&
            (paragraphs.join(' ').length > 520 ? (
              <details className={styles.bio}>
                <summary>
                  <span className={styles.bioPreview}>{paragraphs[0]}</span>
                  <span className={styles.bioToggle}>Ler biografia completa</span>
                </summary>
                {paragraphs.slice(1).map((par, i) => (
                  <p key={i}>{par}</p>
                ))}
              </details>
            ) : (
              <div className={styles.bio}>
                {paragraphs.map((par, i) => (
                  <p key={i}>{par}</p>
                ))}
              </div>
            ))}
        </div>
      </section>

      {p.knownFor.length > 0 && (
        <section aria-labelledby="conhecido">
          <h2 id="conhecido" className={styles.h2}>
            Conhecido por
          </h2>
          <div className={styles.knownFor}>
            {p.knownFor.map((t) => (
              <PosterCard key={`${t.kind}-${t.id}`} item={t} />
            ))}
          </div>
        </section>
      )}

      {p.credits.length > 0 && (
        <div className={styles.split}>
          <Filmography credits={p.credits} />
          <aside className={styles.numbers} aria-label="Em números">
            <dl>
              <div>
                <dt>Trabalhos no catálogo</dt>
                <dd className={styles.big}>{p.credits.length}</dd>
              </div>
              {topGenre && GENRE_NAME[topGenre[0]] && (
                <div>
                  <dt>Gênero mais frequente</dt>
                  <dd>{GENRE_NAME[topGenre[0]]}</dd>
                </div>
              )}
              {best && (
                <div>
                  <dt>Mais bem avaliado</dt>
                  <dd>{best.title.title}</dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
