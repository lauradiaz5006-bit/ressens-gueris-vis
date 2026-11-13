-- Genesolia · Le Cercle · « Mes séances » : 1 séance audio de plus par mois d'abonnement, dans chaque cycle autorisé.
-- À exécuter une fois dans Supabase (SQL Editor). Sans danger si on le relance.
--
-- Règles :
--   membres du Cercle : offres 'abonnement', 'offert', 'cercle', 'admin' → les deux cycles.
--   'pass' (Ma spirale), 'pro' et 'rapport' ne sont pas membres : aucune séance.
--   1 ouverture par cycle et par mois d'abonnement, comptés depuis le PLUS ANCIEN accès encore valide
--   (ainsi un mois offert en plus ne remet pas le parcours à zéro), paiement mensuel ou en une fois.
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
  v_cycle smallint;
  v_debut timestamptz;
  v_mois int;
  v_deja int;
begin
  if auth.uid() is null then return json_build_object('ok', false, 'erreur', 'connexion'); end if;
  if p_seance !~ '^c[12]-(0[1-9]|1[0-2])$' then return json_build_object('ok', false, 'erreur', 'seance'); end if;
  v_cycle := substr(p_seance, 2, 1)::smallint;

  -- Membre du Cercle : les mêmes offres que partout ailleurs sur le site (assets/site.js, chargerAcces).
  -- « pass » (Ma spirale), « pro » et « rapport » ne sont PAS membres et n'ouvrent aucune séance.
  if not exists (
    select 1 from acces_premium
      where user_id = auth.uid() and valide_jusqu > now()
        and offre in ('abonnement', 'offert', 'cercle', 'admin')
  ) then return json_build_object('ok', false, 'erreur', 'abonnement'); end if;

  -- Le parcours part du plus ancien accès de la période en cours : on remonte les accès qui se suivent
  -- (chacun fini il y a moins de 60 jours), pour qu'un mois offert en plus, ou un renouvellement en retard,
  -- n'efface pas les étapes déjà franchies. Un retour après une longue coupure repart bien de l'étape 1.
  select min(coalesce(cree_le, now())) into v_debut from acces_premium
    where user_id = auth.uid()
      and valide_jusqu > now() - interval '60 days'
      and offre in ('abonnement', 'offert', 'cercle', 'admin');
  v_debut := coalesce(v_debut, now());

  if exists (select 1 from seances_ouvertes where user_id = auth.uid() and seance = p_seance) then
    return json_build_object('ok', true, 'deja', true);
  end if;

  -- mois d'abonnement en cours : 1 le premier mois, 2 le deuxième…
  v_mois := (extract(year from age(now(), v_debut)) * 12 + extract(month from age(now(), v_debut)))::int + 1;
  select count(*) into v_deja from seances_ouvertes where user_id = auth.uid() and cycle = v_cycle;
  if v_deja >= v_mois then
    return json_build_object('ok', false, 'erreur', 'mois', 'prochaine', (v_debut + make_interval(months => v_mois))::date);
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

-- La date de début ne doit jamais manquer : sans elle, la page restait bloquée à l'étape 1
-- et le garde-fou du serveur ne se déclenchait plus (age(now(), null) vaut null).
alter table public.acces_premium alter column cree_le set default now();
update public.acces_premium set cree_le = now() where cree_le is null;

-- ─── À vérifier après avoir lancé ce script ───
-- 1) Des séances déjà ouvertes par des comptes qui ne sont pas membres du Cercle
--    (avant correction, « pass », « pro » et « rapport » passaient) :
--    select o.user_id, o.seance, o.ouverte_le, a.offre
--      from seances_ouvertes o
--      join acces_premium a on a.user_id = o.user_id
--     where a.offre not in ('abonnement', 'offert', 'cercle', 'admin')
--     order by o.ouverte_le desc;
--    S'il y en a, les retirer : delete from seances_ouvertes where user_id in (…);
--
-- 2) ATTENTION — la fonction « seance-audio » (déployée hors dépôt) sert le lien d'écoute.
--    Elle doit faire la MÊME vérification d'offre, sinon un compte non membre qui a déjà
--    une ligne dans seances_ouvertes peut encore écouter.
