-- Genesolia · Espace praticien (à coller une fois dans Supabase > SQL Editor, puis « Run »)
-- 1. Table praticiens : un praticien par compte, nom du cabinet, date de fin d'accès (essai de 30 jours, puis abonnement).
-- 2. praticien_commencer(cabinet) : crée l'espace praticien et ouvre l'essai de 30 jours (une seule fois par compte).
-- 3. Arbres illimités pour un praticien actif (limite_arbres_supp).
-- 4. Liens de partage en lecture pour le client (sans les notes du praticien), qui expirent.
-- Rien ici ne touche aux comptes existants, à l'arbre principal ni au Cercle.

create table if not exists public.praticiens (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  cabinet text not null check (char_length(cabinet) between 1 and 80),
  logo text,
  formule text not null default 'essai' check (formule in ('essai', 'mois', 'annee', 'fondateur', 'offert')),
  fondateur boolean not null default false,
  acces_jusqu timestamptz not null,
  cree_le timestamptz not null default now()
);
alter table public.praticiens enable row level security;
drop policy if exists "praticien lit sa fiche" on public.praticiens;
create policy "praticien lit sa fiche" on public.praticiens for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "praticien modifie sa fiche" on public.praticiens;
create policy "praticien modifie sa fiche" on public.praticiens for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- seuls le nom du cabinet et le logo se modifient depuis le site (la formule et la date d'accès : Laura, dans Supabase)
revoke update on public.praticiens from authenticated, anon;
grant update (cabinet, logo) on public.praticiens to authenticated;
grant select on public.praticiens to authenticated;

create or replace function public.praticien_commencer(p_cabinet text)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare r public.praticiens;
begin
  if auth.uid() is null then raise exception 'non connectée'; end if;
  if p_cabinet is null or char_length(trim(p_cabinet)) < 1 then raise exception 'cabinet'; end if;
  insert into public.praticiens (user_id, cabinet, acces_jusqu)
  values (auth.uid(), left(trim(p_cabinet), 80), now() + interval '30 days')
  on conflict (user_id) do update set cabinet = left(trim(excluded.cabinet), 80)
  returning * into r;
  return to_jsonb(r);
end $$;
revoke all on function public.praticien_commencer(text) from public, anon;
grant execute on function public.praticien_commencer(text) to authenticated;

create or replace function public.praticien_actif(uid uuid default null)
returns boolean language sql stable security definer set search_path to '' as $$
  select exists (select 1 from public.praticiens p where p.user_id = coalesce(uid, (select auth.uid())) and p.acces_jusqu > now());
$$;
grant execute on function public.praticien_actif(uuid) to authenticated;

-- Arbres illimités pour un praticien actif (le reste de la règle ne change pas)
create or replace function public.limite_arbres_supp(uid uuid)
returns integer language sql stable security definer set search_path to '' as $$
  select greatest(
    coalesce((
      select case when a.offre = 'pro' then 100000
                  when a.offre in ('cercle','abonnement','offert') then 2
                  else 0 end
      from public.acces_premium a
      where a.user_id = (select auth.uid()) and a.valide_jusqu > now()
    ), 0),
    case when public.praticien_actif(null) then 100000 else 0 end,
    case when now() < timestamptz '2026-11-01 00:00:00+01' then 2 else 0 end
  );
$$;

-- Liens de partage en lecture (pour le client du praticien)
create table if not exists public.partages_arbre (
  jeton uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  arbre_id uuid not null references public.arbres_supp(id) on delete cascade,
  expire_le timestamptz not null,
  cree_le timestamptz not null default now()
);
alter table public.partages_arbre enable row level security;
drop policy if exists "partages du praticien" on public.partages_arbre;
create policy "partages du praticien" on public.partages_arbre for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and exists (select 1 from public.arbres_supp s where s.id = arbre_id and s.user_id = (select auth.uid())));

-- Lecture publique d'un arbre partagé : sans les notes, sans « Ce que je repère », seulement tant que le lien est valable
create or replace function public.partage_lire(p_jeton uuid)
returns jsonb language plpgsql stable security definer set search_path to '' as $$
declare d jsonb; cab text; ppl jsonb;
begin
  select s.data, p.cabinet into d, cab
  from public.partages_arbre x
  join public.arbres_supp s on s.id = x.arbre_id
  left join public.praticiens p on p.user_id = x.user_id
  where x.jeton = p_jeton and x.expire_le > now();
  if d is null then return null; end if;
  select coalesce(jsonb_object_agg(k, (v - 'notes' - 'reperes')), '{}'::jsonb) into ppl
  from jsonb_each(case when jsonb_typeof(d->'people') = 'object' then d->'people' else '{}'::jsonb end) as e(k, v);
  return jsonb_build_object('people', ppl, 'rels', coalesce(d->'rels', '[]'::jsonb), 'cabinet', cab);
end $$;
revoke all on function public.partage_lire(uuid) from public;
grant execute on function public.partage_lire(uuid) to anon, authenticated;
