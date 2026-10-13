-- Genesolia · Journal des émotions (espace client et roue des émotions)
-- À lancer une fois dans Supabase : projet GENETIQUE > SQL Editor > New query > coller > Run.
-- Chaque personne ne voit, n'ajoute, ne modifie et n'efface que ses propres lignes (RLS).
-- Quand le compte est supprimé, ses lignes partent avec (on delete cascade).

-- 1. Les émotions notées
create table if not exists public.journal_emotions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  jour date not null default current_date,
  cree_le timestamptz not null default now(),
  emotion text not null check (char_length(emotion) <= 20),          -- clé de la roue : 'joie', 'joie|1', 'joie|1|0'
  intensite smallint check (intensite between 1 and 10),
  zones text[] not null default '{}',                                -- Tête, Gorge, Poitrine…
  note text check (char_length(note) <= 600),
  besoin text check (char_length(besoin) <= 200),
  jour_cycle smallint check (jour_cycle between 1 and 60),           -- facultatif : seulement si la personne suit son cycle
  saison text check (saison in ('hiver', 'printemps', 'ete', 'automne'))
);
create index if not exists journal_emotions_user_jour on public.journal_emotions (user_id, jour desc);

alter table public.journal_emotions enable row level security;
drop policy if exists "journal : lire le sien" on public.journal_emotions;
drop policy if exists "journal : ajouter le sien" on public.journal_emotions;
drop policy if exists "journal : modifier le sien" on public.journal_emotions;
drop policy if exists "journal : effacer le sien" on public.journal_emotions;
create policy "journal : lire le sien" on public.journal_emotions for select to authenticated using (user_id = auth.uid());
create policy "journal : ajouter le sien" on public.journal_emotions for insert to authenticated with check (user_id = auth.uid());
create policy "journal : modifier le sien" on public.journal_emotions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "journal : effacer le sien" on public.journal_emotions for delete to authenticated using (user_id = auth.uid());

-- 2. Les réglages du cycle (facultatif, avec accord explicite de la personne)
create table if not exists public.journal_cycle (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  suivre boolean not null default false,
  accord_le timestamptz,                                             -- date à laquelle la personne a accepté l'enregistrement de son cycle
  debut date,                                                        -- premier jour des dernières règles
  duree smallint not null default 28 check (duree between 18 and 45),
  regles smallint not null default 5 check (regles between 1 and 10),
  debuts date[] not null default '{}',                               -- les derniers débuts notés, pour la moyenne
  maj timestamptz not null default now()
);

alter table public.journal_cycle enable row level security;
drop policy if exists "cycle : lire le sien" on public.journal_cycle;
drop policy if exists "cycle : ajouter le sien" on public.journal_cycle;
drop policy if exists "cycle : modifier le sien" on public.journal_cycle;
drop policy if exists "cycle : effacer le sien" on public.journal_cycle;
create policy "cycle : lire le sien" on public.journal_cycle for select to authenticated using (user_id = auth.uid());
create policy "cycle : ajouter le sien" on public.journal_cycle for insert to authenticated with check (user_id = auth.uid());
create policy "cycle : modifier le sien" on public.journal_cycle for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cycle : effacer le sien" on public.journal_cycle for delete to authenticated using (user_id = auth.uid());

grant select, insert, update, delete on public.journal_emotions to authenticated;
grant select, insert, update, delete on public.journal_cycle to authenticated;
