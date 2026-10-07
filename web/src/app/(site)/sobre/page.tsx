import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { VaultDial } from '@/components/ui/Logo';
import styles from './sobre.module.css';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'O que é o CineVault, por que ele existe e para onde vai.',
};

const PASSOS = [
  { titulo: 'Descubra', texto: 'Busque ou explore os rankings para encontrar um filme, série, anime ou dorama.' },
  { titulo: 'Abra o cofre', texto: 'Veja tudo sobre a obra: notas, reviews, elenco, temporadas e onde assistir.' },
  { titulo: 'Organize', texto: 'Guarde no "Quero ver", registre no diário quando assistir e acompanhe os episódios.' },
  { titulo: 'Deixe sua marca', texto: 'Avalie o que viu e ajude outras pessoas a escolherem melhor.' },
];

const MOTIVOS = [
  { titulo: 'Rápido e sem distrações', texto: 'Feito para você achar o que precisa em segundos.' },
  { titulo: 'Onde assistir', texto: 'Mostramos em qual streaming cada título está disponível no Brasil.' },
  { titulo: 'Seu acervo pessoal', texto: 'Listas e diário são o coração do site: o que você viu e o que vai ver.' },
  { titulo: 'Tudo num só lugar', texto: 'Filmes, séries, animes e doramas, sem precisar de um app para cada um.' },
  { titulo: 'Rankings que importam', texto: 'O que está em alta agora, na comunidade e no mundo.' },
];

const FUTURO = [
  'Recomendações a partir do seu histórico',
  'Retrospectiva anual: o Cofre do ano',
  'Compatibilidade de gosto com amigos',
  'Importação do Letterboxd e do MyAnimeList',
  'Conquistas por atividade',
];

export default function SobrePage() {
  return (
    <div className={styles.page}>
      <header className={`container ${styles.hero}`}>
        <span className={styles.dial}>
          <VaultDial size={56} />
        </span>
        <Tag tone="accent">Sobre o CineVault</Tag>
        <h1 className={styles.title}>Mais do que um catálogo. O seu cofre de entretenimento.</h1>
        <blockquote className={styles.quote}>
          “A magia do cinema não está em assistir, mas em descobrir.”
        </blockquote>
      </header>

      <div className={`container ${styles.body}`}>
        <section className={styles.block} aria-labelledby="historia">
          <h2 id="historia" className={styles.h2}>
            A frustração que virou solução
          </h2>
          <div className={styles.prose}>
            <p>
              Quantas vezes você já abriu um streaming, depois outro, e mais um, e quarenta minutos depois
              desistiu sem assistir nada?
            </p>
            <p>
              O CineVault nasceu dessa frustração. A ideia é ser o mapa que sempre quisemos: um lugar único, rápido
              e elegante para descobrir, organizar e <strong>realmente</strong> decidir o que assistir.
            </p>
            <p>
              Não somos uma plataforma de streaming. Somos a ferramenta que ajuda você a tomar a melhor decisão antes
              de apertar o play, e a guardar a memória de tudo o que já viu.
            </p>
          </div>
        </section>

        <section className={styles.block} aria-labelledby="como">
          <h2 id="como" className={styles.h2}>
            Como funciona
          </h2>
          <ol className={styles.steps}>
            {PASSOS.map((p, i) => (
              <li key={p.titulo} className={styles.step}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.stepTitle}>{p.titulo}</span>
                <span className={styles.stepText}>{p.texto}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.block} aria-labelledby="porque">
          <h2 id="porque" className={styles.h2}>
            Por que usar
          </h2>
          <ul className={styles.reasons}>
            {MOTIVOS.map((m) => (
              <li key={m.titulo}>
                <span className={styles.reasonTitle}>{m.titulo}</span>
                <span className={styles.reasonText}>{m.texto}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="futuro">
          <h2 id="futuro" className={styles.h2}>
            O que vem por aí
          </h2>
          <ul className={styles.future}>
            {FUTURO.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.note}>
            Os dados de filmes e séries vêm do TMDB. O CineVault é um projeto independente e em construção.
          </p>
        </section>

        <div className={styles.cta}>
          <Button href="/inicio" variant="primary">
            Abrir meu cofre
          </Button>
          <Button href="/explorar">Explorar o catálogo</Button>
        </div>
      </div>
    </div>
  );
}
