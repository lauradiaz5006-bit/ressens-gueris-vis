-- Genesolia · demandes du site (prénom sans fiche, ville introuvable)
-- À lancer une fois dans Supabase : SQL Editor, coller, Run.
-- Les visiteurs peuvent seulement AJOUTER une demande (type, mot demandé, pays, page) : ils ne peuvent ni lire, ni modifier, ni effacer.
-- Aucune donnée personnelle : ni e-mail, ni compte. La tâche « Demandes du site » lit et traite la table toutes les heures.

create table if not exists public.demandes_site (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('prenom', 'lieu')),
  valeur text not null check (char_length(valeur) between 1 and 120 and valeur !~ '[<>{}]'),
  pays text check (pays is null or (char_length(pays) <= 60 and pays !~ '[<>{}]')),
  page text check (page is null or char_length(page) <= 80),
  statut text not null default 'nouveau' check (statut in ('nouveau', 'fait', 'refuse', 'deja')),
  note text,
  cree_le timestamptz not null default now(),
  traite_le timestamptz
);

alter table public.demandes_site enable row level security;

drop policy if exists "demandes_site ajout" on public.demandes_site;
create policy "demandes_site ajout" on public.demandes_site
  for insert to anon, authenticated
  with check (statut = 'nouveau' and note is null and traite_le is null);

revoke all on public.demandes_site from anon, authenticated;
grant insert (type, valeur, pays, page) on public.demandes_site to anon, authenticated;

create index if not exists demandes_site_statut on public.demandes_site (statut, cree_le);
