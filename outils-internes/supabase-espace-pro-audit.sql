-- Genesolia · Espace praticien, deux correctifs du 13/11/2026 (déjà appliqués en base)
--
-- 1. limite_arbres_supp faisait un sous-select scalaire sur acces_premium, dont la clé est
--    (user_id, offre). Un compte ayant deux offres valides en même temps — par exemple
--    « cercle » et « pass » — renvoyait l'erreur 21000 « more than one row returned by a
--    subquery used as an expression ». La création d'un arbre supplémentaire échouait alors
--    sur une erreur de base, sans message compréhensible. Un compte était concerné.
--    max() retient désormais l'offre la plus généreuse.
--    Au passage, le paramètre uid était déclaré puis jamais utilisé : la fonction répondait
--    toujours pour le compte connecté. Il est maintenant honoré (seul appelant : null).
--
-- 2. Le rôle anon gardait tous les droits, TRUNCATE compris, sur 24 tables, dont
--    partages_arbre, questionnaires_client, deontologies_client et praticiens. La RLS est
--    active sur les 24 et aucune politique ne vise anon : rien ne fonctionnait par ce biais,
--    donc retirer les droits ne casse rien. annuaire_praticiens et spirale_aime sont laissées
--    intactes : une politique les ouvre volontairement au public.

create or replace function public.limite_arbres_supp(uid uuid)
returns integer language sql stable security definer set search_path to '' as $$
  select greatest(
    coalesce((
      select max(case when a.offre = 'pro' then 100000
                      when a.offre in ('cercle','abonnement','offert') then 2
                      else 0 end)
      from public.acces_premium a
      where a.user_id = coalesce(uid, (select auth.uid())) and a.valide_jusqu > now()
    ), 0),
    case when public.praticien_actif(coalesce(uid, (select auth.uid()))) then 100000 else 0 end,
    case when now() < timestamptz '2026-11-01 00:00:00+01' then 2 else 0 end   -- clause échue, sans effet
  );
$$;

-- Règle générale, rejouable : anon ne garde des droits que là où une politique le prévoit.
do $$
declare r record;
begin
  for r in
    select c.relname,
           exists (select 1 from pg_policies p
                   where p.schemaname = 'public' and p.tablename = c.relname
                     and (p.roles @> array['anon']::name[] or p.roles @> array['public']::name[])) as public_voulu
    from pg_class c
    where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
  loop
    if not r.public_voulu then
      execute format('revoke all on public.%I from anon', r.relname);
    else
      execute format('revoke truncate, references, trigger on public.%I from anon', r.relname);
    end if;
    execute format('revoke truncate, references, trigger on public.%I from authenticated', r.relname);
  end loop;
end $$;
