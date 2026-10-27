'use client';

import Link from 'next/link';
import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Poster } from '@/components/media/Poster';
import { Icon } from '@/components/ui/Icon';
import { formatRating, MEDIA_LABEL } from '@/lib/format';
import { makeTitleRef } from '@/lib/media';
import { CHAT_LIMITS, type AssistantResponse, type SuggestedTitle, type TasteProfile } from '@/services/assistant/types';
import { sortDiary, toggleList, useUserData, type UserData } from '@/services/user';
import styles from './Curator.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  titles?: SuggestedTitle[];
  error?: boolean;
}

const STORAGE_KEY = 'cinevault:curador';
const SIMPLE_KEY = 'cinevault:curador-simples';

const STARTERS = [
  'Me indica um terror psicológico',
  'Vi Interestelar e amei. O que ver agora?',
  'Algo leve para hoje à noite',
  'Um anime para começar',
];

const newId = () => Math.random().toString(36).slice(2);

/** Resume o diário e as listas para o Curador personalizar as sugestões. */
function toProfile(d: UserData): TasteProfile {
  const watched = new Map<string, TasteProfile['watched'][number]>();
  for (const e of sortDiary(d.diary)) {
    if (!watched.has(e.title.key)) watched.set(e.title.key, { key: e.title.key, title: e.title.title, type: e.title.type, rating: e.rating });
  }
  for (const ep of d.episodes) {
    if (!watched.has(ep.title.key)) watched.set(ep.title.key, { key: ep.title.key, title: ep.title.title, type: ep.title.type });
  }
  return {
    watched: [...watched.values()].slice(0, CHAT_LIMITS.watched),
    favorites: d.lists.favoritos.map((t) => t.title),
    watchlist: d.lists['quero-ver'].map((t) => t.title),
  };
}

/** Markdown mínimo que a IA costuma usar: **negrito** e listas com "-" ou "1.". */
function Rich({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const inline = (line: string) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
    );
  const flush = () => {
    if (list.length) blocks.push(<ul key={`l${blocks.length}`}>{list.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>);
    list = [];
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const item = /^(?:[-*•]|\d+[.)])\s+(.*)$/.exec(line);
    if (item) {
      list.push(item[1]);
      continue;
    }
    flush();
    if (line) blocks.push(<p key={`p${blocks.length}`}>{inline(line)}</p>);
  }
  flush();
  return <>{blocks}</>;
}

function TitleCard({ title, onNavigate }: { title: SuggestedTitle; onNavigate: () => void }) {
  const wants = useUserData((d) => d.lists['quero-ver'].some((t) => t.key === title.key));
  const meta = [MEDIA_LABEL[title.type], title.year, title.score ? formatRating(title.score) : null].filter(Boolean).join(' · ');
  return (
    <li className={styles.card}>
      <Link href={title.href} className={styles.cardLink} onClick={onNavigate}>
        <Poster title={title.title} src={title.posterUrl} seed={title.id} size="sm" width="2.75rem" sizes="44px" />
        <span className={styles.cardText}>
          <span className={styles.cardTitle}>{title.title}</span>
          <span className={styles.cardMeta}>{meta}</span>
        </span>
      </Link>
      <button
        type="button"
        className={styles.cardSave}
        aria-pressed={wants}
        aria-label={wants ? `Tirar ${title.title} do Quero ver` : `Guardar ${title.title} no Quero ver`}
        title={wants ? 'Na sua lista Quero ver' : 'Quero ver'}
        onClick={() => toggleList('quero-ver', makeTitleRef(title))}
      >
        <Icon name={wants ? 'check' : 'list-plus'} size={16} />
      </button>
    </li>
  );
}

/**
 * Curador: o chat do canto da tela. Pede indicações, conta o que viu e recebe
 * títulos parecidos, com cartões que levam à página de cada um.
 */
export function Curator() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [simple, setSimple] = useState(false);
  const data = useUserData((d) => d);
  const panelId = useId();
  const titleId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  // A conversa vale para a aba aberta (some ao fechar o navegador).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
      setSimple(sessionStorage.getItem(SIMPLE_KEY) === '1');
    } catch {
      /* sem armazenamento: começa do zero */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* sem armazenamento: a conversa fica só na memória */
    }
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Rola até a mensagem mais nova.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, busy, open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  async function send(text: string, base = messages) {
    const clean = text.trim().slice(0, CHAT_LIMITS.messageChars);
    if (!clean || busy) return;
    const next: Message[] = [...base.filter((m) => !m.error), { id: newId(), role: 'user', text: clean }];
    setMessages(next);
    setDraft('');
    setBusy(true);
    try {
      const res = await fetch('/api/assistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.slice(-CHAT_LIMITS.history).map((m) => ({ role: m.role, text: m.text })),
          profile: toProfile(data),
        }),
      });
      const body = (await res.json()) as AssistantResponse & { mensagem?: string };
      if (!res.ok) throw new Error(body.mensagem ?? 'Falhou');
      setMessages((m) => [...m, { id: newId(), role: 'assistant', text: body.reply, titles: body.titles }]);
      if (body.mode === 'simples' && !simple) {
        setSimple(true);
        try {
          sessionStorage.setItem(SIMPLE_KEY, '1');
        } catch {
          /* ok */
        }
      }
    } catch (error) {
      const text = error instanceof Error && error.message !== 'Falhou' && !/fetch|json/i.test(error.message)
        ? error.message
        : 'Não consegui responder agora. Verifique sua conexão e tente de novo.';
      setMessages((m) => [...m, { id: newId(), role: 'assistant', text, error: true }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(draft);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(draft);
    }
  }

  function retry() {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    const idx = messages.lastIndexOf(lastUser);
    void send(lastUser.text, messages.slice(0, idx));
  }

  // No celular o painel cobre a tela: ao abrir um título, ele fecha.
  function onNavigate() {
    if (window.matchMedia('(max-width: 560px)').matches) setOpen(false);
  }

  return (
    <>
      {open && (
        <section
          id={panelId}
          className={styles.panel}
          role="dialog"
          aria-labelledby={titleId}
          onKeyDown={(e) => e.key === 'Escape' && close()}
        >
          <header className={styles.head}>
            <CuratorMark className={styles.headMark} />
            <div className={styles.headText}>
              <h2 id={titleId} className={styles.headTitle}>Curador</h2>
              <p className={styles.headSub}>Pergunte o que ver</p>
            </div>
            {messages.length > 0 && (
              <button type="button" className={styles.headButton} onClick={() => setMessages([])} disabled={busy}>
                Nova conversa
              </button>
            )}
            <button type="button" className={styles.iconButton} onClick={close} aria-label="Fechar o Curador">
              <Icon name="close" />
            </button>
          </header>

          <div className={styles.log} ref={logRef} role="log" aria-live="polite" aria-busy={busy}>
            <div className={`${styles.msg} ${styles.bot}`}>
              <p>
                Oi! Eu sou o <strong>Curador</strong>. Me conta o que você está a fim de ver, ou um título que você amou, que eu encontro
                parecidos.
              </p>
            </div>

            {messages.length === 0 && (
              <div className={styles.starters}>
                {STARTERS.map((s) => (
                  <button key={s} type="button" className={styles.starter} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`${styles.msg} ${m.role === 'user' ? styles.me : styles.bot} ${m.error ? styles.error : ''}`}>
                {m.role === 'user' ? <p>{m.text}</p> : <Rich text={m.text} />}
                {m.titles && m.titles.length > 0 && (
                  <ul className={styles.cards}>
                    {m.titles.map((t) => (
                      <TitleCard key={t.key} title={t} onNavigate={onNavigate} />
                    ))}
                  </ul>
                )}
                {m.error && (
                  <button type="button" className={styles.retry} onClick={retry} disabled={busy}>
                    Tentar de novo
                  </button>
                )}
              </div>
            ))}

            {busy && (
              <div className={`${styles.msg} ${styles.bot} ${styles.typing}`}>
                <CuratorMark className={styles.typingMark} spinning />
                <span>Procurando no cofre…</span>
              </div>
            )}
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <label htmlFor={`${panelId}-input`} className="visually-hidden">
              Mensagem para o Curador
            </label>
            <textarea
              id={`${panelId}-input`}
              ref={inputRef}
              className={styles.input}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ex.: um suspense com reviravolta"
              rows={1}
              maxLength={CHAT_LIMITS.messageChars}
            />
            <button type="submit" className={styles.send} disabled={busy || !draft.trim()} aria-label="Enviar">
              <SendIcon />
            </button>
          </form>
          {simple && (
            <p className={styles.note}>Modo simples: o Curador entende pedidos curtos, como gênero, tipo ou &quot;parecido com…&quot;.</p>
          )}
        </section>
      )}

      <button
        ref={buttonRef}
        type="button"
        className={styles.fab}
        data-open={open || undefined}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? 'Fechar o Curador' : 'Abrir o Curador: pergunte o que ver'}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? <Icon name="close" size={22} /> : <CuratorMark className={styles.fabMark} />}
        {!open && <span className={styles.fabLabel}>O que ver?</span>}
      </button>
    </>
  );
}

/** O mostrador do cofre com um balão: a marca do Curador. */
function CuratorMark({ className, spinning }: { className?: string; spinning?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false" data-spinning={spinning || undefined}>
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <g data-wheel="">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="16" y1="5.5" x2="16" y2={i % 2 ? 8 : 9.5} stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i * 45} 16 16)`} />
        ))}
      </g>
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}
