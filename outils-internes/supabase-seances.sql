-- Genesolia · Le Cercle · « Mes séances » : 1 séance audio de plus par mois d'abonnement, dans chaque cycle autorisé.
-- À exécuter une fois dans Supabase (SQL Editor). Sans danger si on le relance.
--
-- Règles :
--   offre 'cycle1'                       : séances du cycle 1 seulement
--   offre 'cercle', 'abonnement', 'offert' : cycles 1 et 2
--   1 ouverture par cycle et par mois d'abonnement (comptés depuis acces_premium.cree_le), paiement mensuel ou en une fois.
--   Une séance ouverte reste ouverte tant que l'abonnement est actif (valide_jusqu dans le futur).

create table if not exists public.seances_ouvertes (
  user_id uuid not null references auth.users(id) on delete cascade,
  seance text not null check (seance ~ '^c[12]-(0[1-9]|1[0-2])$'),
  cycle smallint not null check (cycle in (1, 2)),
  ouverte_le timestamptz not null default now(),
  primary key (user_id, seance)
);
alter table public.seances_ouvertes enable row level security;
drop policy if exists "lire mes seances" on public.seances_ouvertes;
create policy "lire mes seances" on public.seances_ouvertes for select to authenticated using (auth.uid() = user_id);
-- Aucune écriture directe : on ouvre une séance seulement avec la fonction ci-dessous.

create or replace function public.ouvrir_seance(p_seance text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  a record;
  v_cycle smallint;
  v_mois int;
  v_deja int;
begin
  if auth.uid() is null then return json_build_object('ok', false, 'erreur', 'connexion'); end if;
  if p_seance !~ '^c[12]-(0[1-9]|1[0-2])$' then return json_build_object('ok', false, 'erreur', 'seance'); end if;
  v_cycle := substr(p_seance, 2, 1)::smallint;

  select offre, cree_le into a from acces_premium
    where user_id = auth.uid() and valide_jusqu > now()
    order by valide_jusqu desc limit 1;
  if not found then return json_build_object('ok', false, 'erreur', 'abonnement'); end if;
  if v_cycle = 2 and a.offre = 'cycle1' then return json_build_object('ok', false, 'erreur', 'offre'); end if;

  if exists (select 1 from seances_ouvertes where user_id = auth.uid() and seance = p_seance) then
    return json_build_object('ok', true, 'deja', true);
  end if;

  -- mois d'abonnement en cours : 1 le premier mois, 2 le deuxième…
  v_mois := (extract(year from age(now(), a.cree_le)) * 12 + extract(month from age(now(), a.cree_le)))::int + 1;
  select count(*) into v_deja from seances_ouvertes where user_id = auth.uid() and cycle = v_cycle;
  if v_deja >= v_mois then
    return json_build_object('ok', false, 'erreur', 'mois', 'prochaine', (a.cree_le + make_interval(months => v_mois))::date);
  end if;

  insert into seances_ouvertes (user_id, seance, cycle) values (auth.uid(), p_seance, v_cycle);
  return json_build_object('ok', true);
end;
$$;
revoke all on function public.ouvrir_seance(text) from public, anon;
grant execute on function public.ouvrir_seance(text) to authenticated;

-- Le dossier privé des fichiers audio (c1-10.mp3, c2-10.mp3…). Personne ne peut le lire directement :
-- la fonction « seance-audio » donne un lien d'écoute d'une heure, après vérification.
insert into storage.buckets (id, name, public) values ('seances', 'seances', false)
  on conflict (id) do update set public = false;
