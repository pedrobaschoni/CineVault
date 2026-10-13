'use client';

/**
 * Dados do usuário: diário, opiniões, episódios vistos e listas.
 *
 * Dois modos, com a mesma interface para as telas:
 * - **Sem login** (ou sem Supabase configurado): tudo fica no navegador (localStorage).
 * - **Com login**: tudo fica no Supabase e aparece em qualquer aparelho. A tela
 *   muda na hora e a gravação na nuvem acontece em seguida; se falhar, os dados
 *   são recarregados da nuvem e um aviso aparece (evento SYNC_ERROR_EVENT).
 *
 * As telas só usam as funções e hooks deste arquivo.
 */
import { useSyncExternalStore } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase/client';
import { authEnabled } from '@/lib/supabase/config';
import type { DiaryEntry, EpisodeLog, ListKind, TitleRef } from '@/types';
import { importAll, loadAll, toDiaryRow, toEpisodeRow, toListRow, type UserData } from './cloud';

export type { UserData };

const STORAGE_KEY = 'cinevault:v1';
const DISMISS_KEY = 'cinevault:import-dispensado';

/** Disparado na janela quando uma gravação na nuvem falha. */
export const SYNC_ERROR_EVENT = 'cinevault:sync-error';

const EMPTY: UserData = { diary: [], episodes: [], lists: { 'quero-ver': [], favoritos: [] } };

export interface Account {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

interface State {
  /** local: dados no navegador · loading: buscando na nuvem · cloud: dados da conta. */
  status: 'local' | 'loading' | 'cloud';
  account: Account | null;
  data: UserData;
  /** Quantos registros deste navegador ainda podem ser levados para a conta. */
  pendingImport: number;
  /** A conta entrou, mas os dados da nuvem não carregaram (ex.: tabelas não criadas). */
  cloudFailed: boolean;
}

const SERVER_STATE: State = { status: 'loading', account: null, data: EMPTY, pendingImport: 0, cloudFailed: false };

/* ---------- Navegador ---------- */

function readLocal(): UserData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<UserData>) : {};
    return {
      diary: parsed.diary ?? [],
      episodes: parsed.episodes ?? [],
      lists: { 'quero-ver': parsed.lists?.['quero-ver'] ?? [], favoritos: parsed.lists?.favoritos ?? [] },
    };
  } catch {
    return EMPTY;
  }
}

function writeLocal(data: UserData) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* Navegação privada ou armazenamento cheio: fica só na memória desta aba. */
  }
}

function countData(d: UserData): number {
  return d.diary.length + d.episodes.length + d.lists['quero-ver'].length + d.lists.favoritos.length;
}

function dismissed(userId: string): boolean {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === userId;
  } catch {
    return false;
  }
}

/* ---------- Estado reativo ---------- */

let state: State | null = null;
const listeners = new Set<() => void>();
let started = false;

function getState(): State {
  state ??= {
    status: authEnabled ? 'loading' : 'local',
    account: null,
    data: authEnabled ? EMPTY : readLocal(),
    pendingImport: 0,
    cloudFailed: false,
  };
  return state;
}

function set(patch: Partial<State>) {
  state = { ...getState(), ...patch };
  listeners.forEach((l) => l());
  if (state.status !== 'loading') flushQueue();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  start();
  return () => listeners.delete(listener);
}

/** Liga, uma vez por aba, a escuta de outras abas e do login. */
function start() {
  if (started) return;
  started = true;

  // Outra aba salvou algo no navegador.
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && getState().status === 'local') set({ data: readLocal() });
  });

  const db = getSupabase();
  if (!db) return;
  // O Supabase avisa a sessão inicial e cada entrada, saída ou renovação.
  // O setTimeout tira o trabalho de dentro do callback, como a documentação pede.
  db.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => void onSession(session?.user ?? null), 0);
  });
}

function toAccount(user: User): Account {
  const meta = user.user_metadata ?? {};
  const name = meta.full_name ?? meta.name ?? meta.username ?? user.email?.split('@')[0] ?? 'Você';
  return { id: user.id, name: String(name), email: user.email, avatarUrl: meta.avatar_url ?? meta.picture };
}

async function onSession(user: User | null) {
  const current = getState();
  if (!user) {
    if (current.status !== 'local' || current.account) {
      set({ status: 'local', account: null, data: readLocal(), pendingImport: 0, cloudFailed: false });
    }
    return;
  }

  const account = toAccount(user);
  // Só renovou o token, ou atualizou o perfil: os dados continuam os mesmos.
  if (current.account?.id === account.id && current.status !== 'local') {
    set({ account });
    return;
  }

  set({ status: 'loading', account, cloudFailed: false });
  await reloadCloud(account.id);
}

async function reloadCloud(userId: string) {
  const db = getSupabase();
  if (!db) return;
  try {
    const data = await loadAll(db);
    if (getState().account?.id !== userId) return; // saiu enquanto carregava
    const local = countData(readLocal());
    set({ status: 'cloud', data, pendingImport: local && !dismissed(userId) ? local : 0 });
  } catch (error) {
    console.error('[CineVault] Não foi possível carregar os dados da conta.', error);
    // Melhor seguir com os dados do navegador do que travar o site.
    set({ status: 'local', data: readLocal(), cloudFailed: true });
  }
}

/** Lê os dados do usuário e re-renderiza quando mudam. No servidor, devolve vazio. */
export function useUserData<T>(select: (data: UserData) => T): T {
  // O snapshot é o estado inteiro (estável entre leituras); o recorte é feito depois.
  const s = useSyncExternalStore(subscribe, getState, () => SERVER_STATE);
  return select(s.data);
}

/**
 * True quando os dados já podem ser mostrados: está no navegador e, se a
 * pessoa entrou, os dados da conta já chegaram. Antes disso, as telas não
 * devem dizer "seu diário está vazio".
 */
export function useHydrated(): boolean {
  const s = useSyncExternalStore(subscribe, getState, () => SERVER_STATE);
  return s.status !== 'loading';
}

/** Quem está logado (ou null) e o estado da sincronização. */
export function useAccount() {
  const s = useSyncExternalStore(subscribe, getState, () => SERVER_STATE);
  return {
    account: s.account,
    /** O Supabase está configurado (dá para entrar). */
    enabled: authEnabled,
    /** Ainda descobrindo se há sessão. */
    checking: s.status === 'loading' && !s.account,
    synced: s.status === 'cloud',
    pendingImport: s.pendingImport,
    cloudFailed: s.cloudFailed,
  };
}

/* ---------- Conta ---------- */

export async function signOut() {
  await getSupabase()?.auth.signOut();
}

/** Leva o que está salvo neste navegador para a conta e limpa o navegador. */
export async function importLocalData(): Promise<number> {
  const db = getSupabase();
  const { account, status } = getState();
  if (!db || !account || status !== 'cloud') return 0;
  const local = readLocal();
  await importAll(db, account.id, local);
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* sem armazenamento: nada a limpar */
  }
  set({ pendingImport: 0 });
  await reloadCloud(account.id);
  return countData(local);
}

/** "Agora não": não pergunta de novo neste navegador para esta conta. */
export function dismissImport() {
  const { account } = getState();
  if (account) {
    try {
      window.localStorage.setItem(DISMISS_KEY, account.id);
    } catch {
      /* tudo bem: pergunta de novo na próxima visita */
    }
  }
  set({ pendingImport: 0 });
}

/* ---------- Gravação ---------- */

type Remote = (db: NonNullable<ReturnType<typeof getSupabase>>, userId: string) => PromiseLike<{ error: unknown }>;
type Change = (data: UserData) => { next: UserData; remote: Remote };

// Mudanças feitas enquanto os dados da conta ainda carregam esperam aqui.
const queue: Change[] = [];

function flushQueue() {
  while (queue.length) apply(queue.shift()!);
}

function commit(change: Change) {
  if (getState().status === 'loading') queue.push(change);
  else apply(change);
}

function apply(change: Change) {
  const s = getState();
  const { next, remote } = change(s.data);

  if (s.status !== 'cloud' || !s.account) {
    writeLocal(next);
    set({ data: next });
    return;
  }

  set({ data: next });
  const db = getSupabase()!;
  const userId = s.account.id;
  Promise.resolve(remote(db, userId))
    .then(({ error }) => {
      if (error) throw error;
    })
    .catch((error) => {
      console.error('[CineVault] Falha ao salvar na nuvem.', error);
      window.dispatchEvent(new Event(SYNC_ERROR_EVENT));
      void reloadCloud(userId);
    });
}

/* ---------- Utilidades ---------- */

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ---------- Diário e opiniões ---------- */

export interface DiaryInput {
  watchedOn: string;
  rewatch: boolean;
  rating?: number;
  review?: string;
  spoiler?: boolean;
}

function clean(input: DiaryInput): DiaryInput {
  const review = input.review?.trim();
  return { ...input, review: review || undefined, spoiler: review ? input.spoiler : undefined };
}

export function addDiaryEntry(title: TitleRef, input: DiaryInput): DiaryEntry {
  const entry: DiaryEntry = { id: newId(), title, createdAt: new Date().toISOString(), ...clean(input) };
  commit((data) => ({
    next: { ...data, diary: [entry, ...data.diary] },
    remote: (db, uid) => db.from('diary_entries').insert(toDiaryRow(uid, entry)),
  }));
  return entry;
}

export function updateDiaryEntry(id: string, input: DiaryInput) {
  commit((data) => {
    const diary = data.diary.map((e) => (e.id === id ? { ...e, ...clean(input), updatedAt: new Date().toISOString() } : e));
    const updated = diary.find((e) => e.id === id);
    return {
      next: { ...data, diary },
      remote: (db, uid) =>
        updated ? db.from('diary_entries').upsert(toDiaryRow(uid, updated), { onConflict: 'user_id,id' }) : Promise.resolve({ error: null }),
    };
  });
}

export function removeDiaryEntry(id: string) {
  commit((data) => ({
    next: { ...data, diary: data.diary.filter((e) => e.id !== id) },
    remote: (db, uid) => db.from('diary_entries').delete().eq('user_id', uid).eq('id', id),
  }));
}

/** Mais recente primeiro (pela data em que assistiu, depois pela de registro). */
export function sortDiary(entries: DiaryEntry[]): DiaryEntry[] {
  return [...entries].sort((a, b) => b.watchedOn.localeCompare(a.watchedOn) || b.createdAt.localeCompare(a.createdAt));
}

/* ---------- Episódios ---------- */

export function episodeKey(titleKey: string, season: number, episode: number): string {
  return `${titleKey}:s${season}e${episode}`;
}

export function saveEpisode(log: Omit<EpisodeLog, 'key'>) {
  const key = episodeKey(log.title.key, log.season, log.episode);
  const review = log.review?.trim() || undefined;
  const next: EpisodeLog = { ...log, key, review, spoiler: review ? log.spoiler : undefined };
  commit((data) => ({
    next: { ...data, episodes: [next, ...data.episodes.filter((e) => e.key !== key)] },
    remote: (db, uid) => db.from('episode_logs').upsert(toEpisodeRow(uid, next), { onConflict: 'user_id,key' }),
  }));
}

export function removeEpisode(key: string) {
  commit((data) => ({
    next: { ...data, episodes: data.episodes.filter((e) => e.key !== key) },
    remote: (db, uid) => db.from('episode_logs').delete().eq('user_id', uid).eq('key', key),
  }));
}

/* ---------- Listas ---------- */

/** Coloca ou tira o título da lista. Devolve true se ficou na lista. */
export function toggleList(list: ListKind, title: TitleRef): boolean {
  const has = getState().data.lists[list].some((t) => t.key === title.key);
  commit((data) => {
    const current = data.lists[list];
    const inList = current.some((t) => t.key === title.key);
    return {
      next: { ...data, lists: { ...data.lists, [list]: inList ? current.filter((t) => t.key !== title.key) : [title, ...current] } },
      remote: (db, uid) =>
        inList
          ? db.from('list_items').delete().eq('user_id', uid).eq('list', list).eq('title_key', title.key)
          : db.from('list_items').upsert(toListRow(uid, list, title), { onConflict: 'user_id,list,title_key' }),
    };
  });
  return !has;
}

/* ---------- Texto de apoio para notas ---------- */

/** Uma palavra para cada faixa de nota, mostrada ao lado dos selos. */
export function ratingWord(value?: number): string {
  if (!value) return 'Sem nota';
  if (value <= 1) return 'Não gostei';
  if (value <= 2) return 'Fraco';
  if (value <= 3) return 'Ok';
  if (value <= 4) return 'Muito bom';
  if (value < 5) return 'Excelente';
  return 'Obra-prima';
}
