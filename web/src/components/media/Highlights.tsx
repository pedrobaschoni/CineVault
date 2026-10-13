'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { cx } from '@/lib/cx';
import { posterColor } from '@/lib/media';
import type { Video } from '@/types';
import { Poster } from './Poster';
import { TrailerTextButton } from './TrailerButton';
import styles from './Highlights.module.css';

export interface Highlight {
  key: string;
  id: number;
  title: string;
  href: string;
  /** Linha de catálogo: "Série · 2024 · Drama · 8,4". */
  meta: string;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  video?: Video;
}

/** Quanto tempo cada destaque fica na tela antes de girar para o próximo. */
const INTERVAL_MS = 8000;

/**
 * Destaques da semana: vários títulos que giram como as posições de um cofre.
 *
 * Feito para ser leve: as imagens de fundo ficam empilhadas e só mudam de
 * opacidade, e todo o resto anima por transform/opacity (nada de clip-path ou
 * filtros sobre imagens grandes). O tempo de cada slide é a própria animação
 * do aro do mostrador: pausar a animação pausa o carrossel, sem timers.
 */
export function Highlights({ items }: { items: Highlight[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const baseId = useId();

  const count = items.length;
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  // "Reduzir movimento" desliga a rotação automática; aba escondida pausa.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    const vis = () => setHidden(document.hidden);
    sync();
    mq.addEventListener('change', sync);
    document.addEventListener('visibilitychange', vis);
    return () => {
      mq.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  if (count === 0) return null;
  const current = items[index];
  const autoplay = count > 1 && !reduced && !stopped;
  const paused = !autoplay || hovered || focused || hidden;

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    const target = e.key === 'Home' ? 0 : e.key === 'End' ? count - 1 : delta ? (index + delta + count) % count : null;
    if (target === null) return;
    e.preventDefault();
    go(target);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[target]?.focus();
  }

  const step = 360 / count;

  return (
    <section
      className={styles.hero}
      aria-roledescription="carrossel"
      aria-label="Destaques da semana"
      style={{ '--tint': posterColor(current.id) } as CSSProperties}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      {/* Fundos empilhados: só a opacidade muda. */}
      <div className={styles.backdrops} aria-hidden="true">
        {items.map((item, i) => (
          <div
            key={item.key}
            className={cx(styles.layer, i === index && styles.layerActive)}
            style={{ '--layer-tint': posterColor(item.id) } as CSSProperties}
          >
            {item.backdropUrl && (
              <Image
                src={item.backdropUrl}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                fetchPriority={i === 0 ? 'high' : 'low'}
                className={styles.image}
              />
            )}
          </div>
        ))}
        <div className={styles.scrim} />
      </div>

      <div className={`container ${styles.grid}`}>
        {/* A key troca a cada slide e refaz a entrada (só opacity/transform). */}
        <div
          key={current.key}
          className={styles.text}
          id={`${baseId}-slide`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} de ${count}: ${current.title}`}
          aria-live={paused ? 'polite' : 'off'}
        >
          <div className={styles.enter} style={{ '--i': 0 } as CSSProperties}>
            <Tag tone="accent">{index === 0 ? 'Mais visto da semana' : `Nº ${index + 1} da semana`}</Tag>
          </div>
          <h2 className={styles.title}>
            <span className={styles.titleInner}>{current.title}</span>
          </h2>
          <p className={cx(styles.meta, styles.enter)} style={{ '--i': 1 } as CSSProperties}>
            {current.meta}
          </p>
          {current.overview && (
            <p className={cx(styles.synopsis, styles.enter)} style={{ '--i': 2 } as CSSProperties}>
              {current.overview}
            </p>
          )}
          <div className={cx(styles.actions, styles.enter)} style={{ '--i': 3 } as CSSProperties}>
            <Button href={current.href} variant="primary">
              Ver detalhes
            </Button>
            {current.video && <TrailerTextButton video={current.video} />}
          </div>
        </div>

        <div key={`${current.key}-poster`} className={styles.poster}>
          <Poster title={current.title} src={current.posterUrl} seed={current.id} size="lg" sizes="280px" priority={index === 0} />
        </div>
      </div>

      {count > 1 && (
        <div className={`container ${styles.controls}`}>
          {/* Mostrador: o ponteiro gira até a posição do destaque atual. */}
          <div className={styles.dial} aria-hidden="true">
            <svg viewBox="-24 -24 48 48" className={styles.dialFace}>
              <circle r="20" className={styles.dialRing} />
              {/* O aro se preenche durante o tempo do destaque: é o relógio do carrossel. */}
              <circle
                key={current.key}
                r="20"
                pathLength={1}
                className={styles.dialTimer}
                data-static={!autoplay || undefined}
                style={{ animationDuration: `${INTERVAL_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                onAnimationEnd={() => go(index + 1)}
              />
              {items.map((item, i) => (
                <line
                  key={item.key}
                  x1="0"
                  y1="-20"
                  x2="0"
                  y2="-15"
                  transform={`rotate(${i * step})`}
                  className={cx(styles.dialTick, i === index && styles.dialTickOn)}
                />
              ))}
              <g className={styles.dialNeedle} style={{ rotate: `${index * step}deg` } as CSSProperties}>
                <line x1="0" y1="2" x2="0" y2="-12" />
                <circle r="3" />
              </g>
            </svg>
            <span className={styles.counter}>
              {String(index + 1).padStart(2, '0')}
              <span className={styles.counterTotal}>/{String(count).padStart(2, '0')}</span>
            </span>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Escolher destaque" ref={tabsRef} onKeyDown={onTabKey}>
            {items.map((item, i) => {
              const active = i === index;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${baseId}-slide`}
                  tabIndex={active ? 0 : -1}
                  className={cx(styles.tab, active && styles.tabActive)}
                  onClick={() => go(i)}
                >
                  <Poster title={item.title} src={item.posterUrl} seed={item.id} size="sm" sizes="56px" />
                  <span className={styles.tabLabel}>{item.title}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.buttons}>
            <button type="button" className={styles.iconButton} onClick={() => go(index - 1)} aria-label="Destaque anterior">
              <Icon name="chevron-left" />
            </button>
            {!reduced && (
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setStopped((v) => !v)}
                aria-label={stopped ? 'Retomar a troca automática' : 'Pausar a troca automática'}
                aria-pressed={stopped}
              >
                <Icon name={stopped ? 'play' : 'pause'} size={16} />
              </button>
            )}
            <button type="button" className={styles.iconButton} onClick={() => go(index + 1)} aria-label="Próximo destaque">
              <Icon name="chevron-right" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
