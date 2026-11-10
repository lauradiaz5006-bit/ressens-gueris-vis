-- Mon Espace Pro (mon-espace-pro.html) : stockage privé de Laura + chiffres du site (comptages seulement).
-- À coller dans Supabase > SQL Editor si la table n'existe pas encore. Sans danger à relancer.

create table if not exists public.qg_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  data jsonb not null default '{}'::jsonb,
  cree_le timestamptz not null default now(),
  maj timestamptz not null default now()
);
comment on table public.qg_items is 'Mon Espace Pro (mon-espace-pro.html) : cases cochées, tâches, chiffres, posts, URL indexées. Réservé à Laura (contact@genesolia.fr, lauradiaz5006@gmail.com).';
create index if not exists qg_items_kind_idx on public.qg_items(kind);
alter table public.qg_items enable row level security;

create or replace function public.qg_est_laura() returns boolean
language sql stable set search_path = '' as $$
  select lower(coalesce((select auth.jwt()->>'email'),'')) in ('contact@genesolia.fr','lauradiaz5006@gmail.com')
$$;

drop policy if exists qg_select on public.qg_items;
drop policy if exists qg_insert on public.qg_items;
drop policy if exists qg_update on public.qg_items;
drop policy if exists qg_delete on public.qg_items;
create policy qg_select on public.qg_items for select to authenticated using ((select public.qg_est_laura()));
create policy qg_insert on public.qg_items for insert to authenticated with check ((select public.qg_est_laura()));
create policy qg_update on public.qg_items for update to authenticated using ((select public.qg_est_laura())) with check ((select public.qg_est_laura()));
create policy qg_delete on public.qg_items for delete to authenticated using ((select public.qg_est_laura()));

-- Comptages seulement (total, 7 derniers jours, 30 derniers jours) : aucune donnée personnelle ne sort.
create or replace function public.qg_stats() returns json
language plpgsql stable security definer set search_path = '' as $$
declare r json;
begin
  if not public.qg_est_laura() then raise exception 'acces refuse'; end if;
  select json_build_object(
    'comptes', (select json_build_object('total',count(*),'j7',count(*) filter (where created_at > now()-interval '7 days'),'j30',count(*) filter (where created_at > now()-interval '30 days')) from auth.users),
    'cercle_actifs', (select json_build_object('total',count(*) filter (where offre in ('cercle','abonnement') and valide_jusqu > now()),'j7',count(*) filter (where offre in ('cercle','abonnement') and cree_le > now()-interval '7 days'),'j30',count(*) filter (where offre in ('cercle','abonnement') and cree_le > now()-interval '30 days')) from public.acces_premium),
    'spirale_actifs', (select json_build_object('total',count(*) filter (where offre = 'pass' and valide_jusqu > now()),'j7',count(*) filter (where offre = 'pass' and cree_le > now()-interval '7 days'),'j30',count(*) filter (where offre = 'pass' and cree_le > now()-interval '30 days')) from public.acces_premium),
    'achats', (select json_build_object('total',count(*),'j7',count(*) filter (where cree_le > now()-interval '7 days'),'j30',count(*) filter (where cree_le > now()-interval '30 days')) from public.achats),
    'commandes_boutique', (select json_build_object('total',count(*) filter (where paye_le is not null),'j7',count(*) filter (where paye_le > now()-interval '7 days'),'j30',count(*) filter (where paye_le > now()-interval '30 days')) from public.commandes_boutique),
    'cartes_cadeaux', (select json_build_object('total',count(*) filter (where paye_le is not null),'j7',count(*) filter (where paye_le > now()-interval '7 days'),'j30',count(*) filter (where paye_le > now()-interval '30 days')) from public.cartes_cadeaux),
    'newsletter', (select json_build_object('total',count(*) filter (where newsletter and not coalesce(desinscrit,false)),'j7',count(*) filter (where newsletter and cree_le > now()-interval '7 days'),'j30',count(*) filter (where newsletter and cree_le > now()-interval '30 days')) from public.contacts),
    'contacts', (select json_build_object('total',count(*),'j7',count(*) filter (where cree_le > now()-interval '7 days'),'j30',count(*) filter (where cree_le > now()-interval '30 days')) from public.contacts),
    'demandes', (select json_build_object('total',count(*),'j7',count(*) filter (where cree_le > now()-interval '7 days'),'j30',count(*) filter (where cree_le > now()-interval '30 days'),'non_lues',count(*) filter (where not coalesce(lu,false))) from public.demandes),
    'essais_cercle', (select json_build_object('total',count(*),'j7',count(*) filter (where cree_le > now()-interval '7 days'),'j30',count(*) filter (where cree_le > now()-interval '30 days')) from public.demandes where formulaire ilike 'Essai%'),
    'tests_faits', (select json_build_object('total',count(*),'j7',count(*) filter (where cree_le > now()-interval '7 days'),'j30',count(*) filter (where cree_le > now()-interval '30 days')) from public.resultats),
    'carnets', (select json_build_object('total',count(*),'j7',count(*) filter (where maj > now()-interval '7 days'),'j30',count(*) filter (where maj > now()-interval '30 days')) from public.carnets),
    'arbres', (select json_build_object('total',count(*),'j7',count(*) filter (where updated_at > now()-interval '7 days'),'j30',count(*) filter (where updated_at > now()-interval '30 days')) from public.arbres),
    'formation', (select json_build_object('total',count(*),'j7',count(*) filter (where cree_le > now()-interval '7 days'),'j30',count(*) filter (where cree_le > now()-interval '30 days')) from public.formation_inscrites),
    'notifications', (select json_build_object('total',count(*),'j7',count(*) filter (where cree_le > now()-interval '7 days'),'j30',count(*) filter (where cree_le > now()-interval '30 days')) from public.notifs_abonnements),
    'praticiens', (select json_build_object('total',count(*),'j7',count(*) filter (where cree_le > now()-interval '7 days'),'j30',count(*) filter (where cree_le > now()-interval '30 days')) from public.praticiens),
    'le', now()
  ) into r;
  return r;
end $$;

revoke all on function public.qg_stats() from public, anon;
grant execute on function public.qg_stats() to authenticated;
revoke all on function public.qg_est_laura() from public, anon;
grant execute on function public.qg_est_laura() to authenticated;
revoke all on public.qg_items from anon;
grant select, insert, update, delete on public.qg_items to authenticated;
