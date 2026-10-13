'use client';

/**
 * Tradução entre os dados do site e as tabelas do Supabase
 * (veja supabase/schema.sql). Só o index.ts deste serviço usa este arquivo.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DiaryEntry, EpisodeLog, ListKind, TitleRef } from '@/types';

export interface UserData {
  diary: DiaryEntry[];
  episodes: EpisodeLog[];
  lists: Record<ListKind, TitleRef[]>;
}

interface DiaryRow {
  id: string;
  title: TitleRef;
  watched_on: string;
  rewatch: boolean;
  rating: number | null;
  review: string | null;
  spoiler: boolean | null;
  created_at: string;
  updated_at: string | null;
}

interface EpisodeRow {
  key: string;
  title: TitleRef;
  season: number;
  episode: number;
  episode_name: string | null;
  watched_on: string;
  rating: number | null;
  review: string | null;
  spoiler: boolean | null;
}

interface ListRow {
  list: ListKind;
  title_key: string;
  title: TitleRef;
  added_at: string;
}

const opt = <T,>(v: T | null): T | undefined => (v === null ? undefined : v);

/* ---------- Linhas → site ---------- */

function fromDiary(r: DiaryRow): DiaryEntry {
  return {
    id: r.id,
    title: r.title,
    watchedOn: r.watched_on,
    rewatch: r.rewatch,
    rating: r.rating === null ? undefined : Number(r.rating),
    review: opt(r.review),
    spoiler: opt(r.spoiler),
    createdAt: r.created_at,
    updatedAt: opt(r.updated_at),
  };
}

function fromEpisode(r: EpisodeRow): EpisodeLog {
  return {
    key: r.key,
    title: r.title,
    season: r.season,
    episode: r.episode,
    episodeName: opt(r.episode_name),
    watchedOn: r.watched_on,
    rating: r.rating === null ? undefined : Number(r.rating),
    review: opt(r.review),
    spoiler: opt(r.spoiler),
  };
}

/* ---------- Site → linhas (o RLS confere se o user_id é mesmo de quem está logado) ---------- */

export function toDiaryRow(userId: string, e: DiaryEntry) {
  return {
    user_id: userId,
    id: e.id,
    title: e.title,
    watched_on: e.watchedOn,
    rewatch: e.rewatch,
    rating: e.rating ?? null,
    review: e.review ?? null,
    spoiler: e.spoiler ?? null,
    created_at: e.createdAt,
    updated_at: e.updatedAt ?? null,
  };
}

export function toEpisodeRow(userId: string, l: EpisodeLog) {
  return {
    user_id: userId,
    key: l.key,
    title: l.title,
    season: l.season,
    episode: l.episode,
    episode_name: l.episodeName ?? null,
    watched_on: l.watchedOn,
    rating: l.rating ?? null,
    review: l.review ?? null,
    spoiler: l.spoiler ?? null,
    updated_at: new Date().toISOString(),
  };
}

export function toListRow(userId: string, list: ListKind, title: TitleRef, addedAt = new Date().toISOString()) {
  return { user_id: userId, list, title_key: title.key, title, added_at: addedAt };
}

/* ---------- Leitura de tudo ---------- */

export async function loadAll(db: SupabaseClient): Promise<UserData> {
  const [diary, episodes, lists] = await Promise.all([
    db.from('diary_entries').select('*').order('watched_on', { ascending: false }).returns<DiaryRow[]>(),
    db.from('episode_logs').select('*').order('updated_at', { ascending: false }).returns<EpisodeRow[]>(),
    db.from('list_items').select('*').order('added_at', { ascending: false }).returns<ListRow[]>(),
  ]);
  const error = diary.error ?? episodes.error ?? lists.error;
  if (error) throw error;

  const byList = (kind: ListKind) => (lists.data ?? []).filter((r) => r.list === kind).map((r) => r.title);
  return {
    diary: (diary.data ?? []).map(fromDiary),
    episodes: (episodes.data ?? []).map(fromEpisode),
    lists: { 'quero-ver': byList('quero-ver'), favoritos: byList('favoritos') },
  };
}

/** Leva os dados salvos no navegador para a conta, sem duplicar o que já está lá. */
export async function importAll(db: SupabaseClient, userId: string, data: UserData) {
  const ops = [];
  if (data.diary.length) ops.push(db.from('diary_entries').upsert(data.diary.map((e) => toDiaryRow(userId, e)), { onConflict: 'user_id,id' }));
  if (data.episodes.length) ops.push(db.from('episode_logs').upsert(data.episodes.map((l) => toEpisodeRow(userId, l)), { onConflict: 'user_id,key' }));
  const listRows = (Object.keys(data.lists) as ListKind[]).flatMap((kind) => data.lists[kind].map((t) => toListRow(userId, kind, t)));
  if (listRows.length) ops.push(db.from('list_items').upsert(listRows, { onConflict: 'user_id,list,title_key', ignoreDuplicates: true }));

  const results = await Promise.all(ops);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}
