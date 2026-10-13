-- CineVault: tabelas dos dados do usuário no Supabase.
-- Rode uma vez em Supabase › SQL Editor › New query › Run.
-- Pode rodar de novo sem problema: nada é apagado.
--
-- Segurança: o RLS (Row Level Security) garante que cada pessoa só lê e
-- altera as próprias linhas, mesmo com a chave pública no navegador.

-- Diário: cada vez que alguém assistiu a um título, com nota e opinião.
create table if not exists public.diary_entries (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id         text not null,
  title      jsonb not null,               -- TitleRef: key, id, kind, type, title, year, posterUrl, href
  watched_on date not null,
  rewatch    boolean not null default false,
  rating     numeric(2, 1) check (rating between 0.5 and 5),
  review     text check (char_length(review) <= 10000),
  spoiler    boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  primary key (user_id, id)
);

-- Episódios vistos, com nota e opinião de cada um.
create table if not exists public.episode_logs (
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  key          text not null,              -- "tv:94605:s2e4"
  title        jsonb not null,
  season       int not null,
  episode      int not null,
  episode_name text,
  watched_on   date not null,
  rating       numeric(2, 1) check (rating between 0.5 and 5),
  review       text check (char_length(review) <= 10000),
  spoiler      boolean,
  updated_at   timestamptz not null default now(),
  primary key (user_id, key)
);

-- Listas "Quero ver" e "Favoritos".
create table if not exists public.list_items (
  user_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  list      text not null check (list in ('quero-ver', 'favoritos')),
  title_key text not null,                 -- "movie:693134"
  title     jsonb not null,
  added_at  timestamptz not null default now(),
  primary key (user_id, list, title_key)
);

-- Só usuários logados acessam, e cada um só as próprias linhas.
alter table public.diary_entries enable row level security;
alter table public.episode_logs  enable row level security;
alter table public.list_items    enable row level security;

revoke all on public.diary_entries, public.episode_logs, public.list_items from anon;
grant select, insert, update, delete on public.diary_entries, public.episode_logs, public.list_items to authenticated;

do $$
declare t text;
begin
  foreach t in array array['diary_entries', 'episode_logs', 'list_items'] loop
    execute format('drop policy if exists "dono le" on public.%I', t);
    execute format('drop policy if exists "dono cria" on public.%I', t);
    execute format('drop policy if exists "dono altera" on public.%I', t);
    execute format('drop policy if exists "dono apaga" on public.%I', t);
    execute format('create policy "dono le" on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t);
    execute format('create policy "dono cria" on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t);
    execute format('create policy "dono altera" on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t);
    execute format('create policy "dono apaga" on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t);
  end loop;
end $$;
