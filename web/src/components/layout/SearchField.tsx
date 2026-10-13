'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { formatRating, MEDIA_LABEL } from '@/lib/format';
import { posterColor } from '@/lib/media';
import type { PersonSummary, SearchResults, TitleSummary } from '@/types';
import styles from './SearchField.module.css';

type Option = { kind: 'title'; item: TitleSummary } | { kind: 'person'; item: PersonSummary } | { kind: 'all' };

/** Destaca o trecho buscado dentro do nome. */
function Highlight({ text, query }: { text: string; query: string }) {
  const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const at = plain(text).indexOf(plain(query));
  if (!query || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className={styles.mark}>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

/**
 * Busca global com sugestões enquanto digita (a partir de 2 letras).
 * Setas navegam, Enter abre, Esc fecha. Enter sem nada selecionado leva ao
 * Explorar com a busca aplicada. Sem JavaScript, o formulário funciona igual.
 */
export function SearchField({ autoFocus }: { autoFocus?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    setOpen(false);
    setQuery('');
    setResults(null);
  }, [pathname]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/busca?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (res.ok) {
          setResults(await res.json());
          setActive(-1);
        }
      } catch {
        /* Busca cancelada por uma tecla nova. */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  const options: Option[] = results
    ? [
        ...results.titles.map((item) => ({ kind: 'title' as const, item })),
        ...results.people.map((item) => ({ kind: 'person' as const, item })),
        { kind: 'all' as const },
      ]
    : [];

  const showPanel = open && query.trim().length >= 2 && results !== null;
  const fullSearch = `/explorar?q=${encodeURIComponent(query.trim())}`;

  function go(option: Option | undefined) {
    if (!option || option.kind === 'all') router.push(fullSearch);
    else router.push(option.item.href);
    setOpen(false);
    inputRef.current?.blur();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!showPanel) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a <= 0 ? options.length - 1 : a - 1));
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      go(options[active]);
    }
  }

  const optionId = (i: number) => `${listId}-opt-${i}`;
  let index = -1;

  return (
    <form
      action="/explorar"
      role="search"
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) go(undefined);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <label className={styles.field}>
        <Icon name="search" size={16} className={styles.icon} />
        <span className="visually-hidden">Buscar filmes, séries, animes e doramas</span>
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Buscar filmes, séries, animes e doramas"
          autoComplete="off"
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && active >= 0 ? optionId(active) : undefined}
          className={styles.input}
        />
        {loading && <span className={styles.spinner} aria-hidden="true" />}
      </label>

      {showPanel && (
        <div className={styles.panel}>
          <ul id={listId} role="listbox" aria-label={`Sugestões para ${query}`} className={styles.list}>
            {results.titles.length > 0 && <li role="presentation" className={styles.group}>Títulos</li>}
            {results.titles.map((t) => {
              index++;
              const i = index;
              return (
                <li key={`t-${t.kind}-${t.id}`} role="presentation">
                  <Link
                    id={optionId(i)}
                    role="option"
                    aria-selected={active === i}
                    href={t.href}
                    className={styles.option}
                    style={{ '--i': i } as React.CSSProperties}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.thumb} style={{ background: t.posterUrl ? undefined : posterColor(t.id) }}>
                      {t.posterUrl && <Image src={t.posterUrl} alt="" fill sizes="40px" />}
                    </span>
                    <span className={styles.text}>
                      <span className={styles.name}>
                        <Highlight text={t.title} query={query.trim()} />
                      </span>
                      <span className={styles.meta}>{[MEDIA_LABEL[t.type], t.year].filter(Boolean).join(' · ')}</span>
                    </span>
                    {t.score ? <span className={styles.score}>{formatRating(t.score)}</span> : null}
                  </Link>
                </li>
              );
            })}

            {results.people.length > 0 && <li role="presentation" className={styles.group}>Pessoas</li>}
            {results.people.map((p) => {
              index++;
              const i = index;
              return (
                <li key={`p-${p.id}`} role="presentation">
                  <Link
                    id={optionId(i)}
                    role="option"
                    aria-selected={active === i}
                    href={p.href}
                    className={styles.option}
                    style={{ '--i': i } as React.CSSProperties}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setOpen(false)}
                  >
                    <span className={`${styles.thumb} ${styles.round}`}>
                      {p.profileUrl ? <Image src={p.profileUrl} alt="" fill sizes="40px" /> : p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </span>
                    <span className={styles.text}>
                      <span className={styles.name}>
                        <Highlight text={p.name} query={query.trim()} />
                      </span>
                      <span className={styles.meta}>{[p.department, p.knownFor].filter(Boolean).join(' · ')}</span>
                    </span>
                  </Link>
                </li>
              );
            })}

            {results.titles.length === 0 && results.people.length === 0 && (
              <li role="presentation" className={styles.none}>
                Nada no cofre com “{query.trim()}”. Confira a grafia ou tente um nome mais curto.
              </li>
            )}

            <li role="presentation">
              <Link
                id={optionId(++index)}
                role="option"
                aria-selected={active === index}
                href={fullSearch}
                className={`${styles.option} ${styles.all}`}
                onMouseEnter={() => setActive(options.length - 1)}
                onClick={() => setOpen(false)}
              >
                Ver todos os resultados no Explorar
                <kbd className={styles.kbd}>Enter</kbd>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </form>
  );
}
