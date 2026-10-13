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
  besoin text check (char_length(besoin) <= 200)
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

-- Le cycle (facultatif) n'est PAS enregistré ici : ses dates restent sur l'appareil de la personne (données de santé).

grant select, insert, update, delete on public.journal_emotions to authenticated;
