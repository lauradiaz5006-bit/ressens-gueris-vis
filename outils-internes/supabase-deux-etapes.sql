-- Connexion en deux étapes (appliqué le 24 octobre 2026, migration « deux_etapes_aal2_si_activee »)
-- Pour un compte qui l'a activée, ses données ne s'ouvrent qu'avec une session confirmée par le code (aal2).
-- Sans double étape, rien ne change. TOTP : gratuit sur Supabase (Authentication > Multi-Factor : TOTP activé).
create or replace function public.aal_attendus()
returns text[] language sql stable security definer set search_path to '' as $$
  select case when exists (select 1 from auth.mfa_factors f where f.user_id = (select auth.uid()) and f.status = 'verified')
              then array['aal2'] else array['aal1', 'aal2'] end;
$$;
revoke all on function public.aal_attendus() from public, anon;
grant execute on function public.aal_attendus() to authenticated;

do $$
declare t text;
begin
  foreach t in array array['arbres_supp', 'carnets', 'questionnaires_client', 'partages_arbre', 'praticiens'] loop
    if to_regclass('public.' || t) is not null then
      execute format('drop policy if exists "deux etapes si activee" on public.%I', t);
      execute format('create policy "deux etapes si activee" on public.%I as restrictive for all to authenticated using (array[(select auth.jwt()->>''aal'')] <@ (select public.aal_attendus())) with check (array[(select auth.jwt()->>''aal'')] <@ (select public.aal_attendus()))', t);
    end if;
  end loop;
end $$;

-- Complément (migration « deux_etapes_complet ») : la même règle sur arbres_supp_versions, arbres_versions, arbres, parcours,
-- annuaire_praticiens ; et carnet_lire, carnet_ecrire, parcours_lire, parcours_ecrire refusent une session non confirmée
-- (raise exception 'deux etapes') pour un compte qui a activé la double étape.
