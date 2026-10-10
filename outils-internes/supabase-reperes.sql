-- Genesolia · repères de naissance du Cercle (à lancer une fois dans Supabase > SQL Editor)
-- La date, les prénoms et le nom de naissance ne peuvent plus être modifiés une fois enregistrés :
-- seuls l'heure et le lieu se complètent. Pas de suppression par la personne (le compte supprimé efface tout).
create table if not exists public.reperes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  prenoms text not null check (char_length(prenoms) between 1 and 200),
  nom text check (nom is null or char_length(nom) <= 120),
  date_naissance date not null check (date_naissance between date '1900-01-01' and date '2100-01-01'),
  heure text check (heure is null or heure ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  lieu text check (lieu is null or char_length(lieu) <= 160),
  lat double precision,
  lon double precision,
  tz text check (tz is null or char_length(tz) <= 60),
  cree_le timestamptz not null default now(),
  maj timestamptz not null default now()
);
alter table public.reperes enable row level security;
drop policy if exists "reperes : lire les siens" on public.reperes;
drop policy if exists "reperes : creer les siens" on public.reperes;
drop policy if exists "reperes : completer les siens" on public.reperes;
create policy "reperes : lire les siens" on public.reperes for select to authenticated using (auth.uid() = user_id);
create policy "reperes : creer les siens" on public.reperes for insert to authenticated with check (auth.uid() = user_id);
create policy "reperes : completer les siens" on public.reperes for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Droits par colonne : la date, les prénoms et le nom ne sont jamais modifiables
revoke all on public.reperes from anon, authenticated;
grant select, insert on public.reperes to authenticated;
grant update (heure, lieu, lat, lon, tz, maj) on public.reperes to authenticated;
