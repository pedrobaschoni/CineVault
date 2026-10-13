'use client';

/**
 * Dados do usuário: diário, opiniões, episódios vistos e listas.
 *
 * Por enquanto ficam no navegador (localStorage). As telas só usam as funções
 * e hooks deste arquivo; quando existir backend, só este arquivo muda.
 */
import { useSyncExternalStore } from 'react';
import type { DiaryEntry, EpisodeLog, ListKind, TitleRef } from '@/types';

const STORAGE_KEY = 'cinevault:v1';

interface UserData {
  diary: DiaryEntry[];
  episodes: EpisodeLog[];
  lists: Record<ListKind, TitleRef[]>;
}

const EMPTY: UserData = { diary: [], episodes: [], lists: { 'quero-ver': [], favoritos: [] } };

/* ---------- Armazenamento reativo ---------- */

let cache: UserData | null = null;
const listeners = new Set<() => void>();

function read(): UserData {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<UserData>) : {};
    cache = {
      diary: parsed.diary ?? [],
      episodes: parsed.episodes ?? [],
      lists: { 'quero-ver': parsed.lists?.['quero-ver'] ?? [], favoritos: parsed.lists?.favoritos ?? [] },
    };
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: UserData) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Navegação privada ou armazenamento cheio: mantém só na memória desta aba. */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Outra aba salvou algo: recarrega.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Lê os dados do usuário e re-renderiza quando mudam. No servidor, devolve vazio. */
export function useUserData<T>(select: (data: UserData) => T): T {
  // O snapshot é o objeto inteiro (estável entre leituras); o recorte é feito depois.
  const data = useSyncExternalStore(subscribe, read, () => EMPTY);
  return select(data);
}

/** True depois que o componente já está no navegador (os dados salvos só existem aí). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/* ---------- Referência a um título ---------- */

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
  const data = read();
  write({ ...data, diary: [entry, ...data.diary] });
  return entry;
}

export function updateDiaryEntry(id: string, input: DiaryInput) {
  const data = read();
  write({
    ...data,
    diary: data.diary.map((e) => (e.id === id ? { ...e, ...clean(input), updatedAt: new Date().toISOString() } : e)),
  });
}

export function removeDiaryEntry(id: string) {
  const data = read();
  write({ ...data, diary: data.diary.filter((e) => e.id !== id) });
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
  const data = read();
  write({ ...data, episodes: [next, ...data.episodes.filter((e) => e.key !== key)] });
}

export function removeEpisode(key: string) {
  const data = read();
  write({ ...data, episodes: data.episodes.filter((e) => e.key !== key) });
}

/* ---------- Listas ---------- */

export function toggleList(list: ListKind, title: TitleRef): boolean {
  const data = read();
  const current = data.lists[list];
  const has = current.some((t) => t.key === title.key);
  write({ ...data, lists: { ...data.lists, [list]: has ? current.filter((t) => t.key !== title.key) : [title, ...current] } });
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
