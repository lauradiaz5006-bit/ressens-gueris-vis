-- Questionnaire avant séance (appliqué le 24 octobre 2026, migration « questionnaires_avant_seance »)
-- La praticienne crée un lien (questionnaire.html?q=<jeton>), sa cliente le remplit sans compte,
-- les réponses arrivent dans le dossier. Rien de payant : une table et deux fonctions.
create table if not exists public.questionnaires_client (
  jeton uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  arbre_id uuid not null references public.arbres_supp(id) on delete cascade,
  expire_le timestamptz not null,
  cree_le timestamptz not null default now(),
  reponses jsonb,
  rempli_le timestamptz,
  importe_le timestamptz
);
create index if not exists questionnaires_client_arbre on public.questionnaires_client (arbre_id);
create index if not exists questionnaires_client_user on public.questionnaires_client (user_id);
alter table public.questionnaires_client enable row level security;

create policy "questionnaires de la praticienne" on public.questionnaires_client
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.arbres_supp s where s.id = arbre_id and s.user_id = (select auth.uid()))
  );
create policy "creer seulement avec un espace actif" on public.questionnaires_client
  as restrictive for insert to authenticated
  with check (public.praticien_actif(null) and expire_le <= now() + interval '31 days');

create or replace function public.questionnaire_ouvrir(p_jeton uuid)
returns jsonb language plpgsql stable security definer set search_path to '' as $$
declare q public.questionnaires_client; cab text;
begin
  select * into q from public.questionnaires_client where jeton = p_jeton;
  if not found or q.expire_le < now() then return jsonb_build_object('erreur', 'lien'); end if;
  select cabinet into cab from public.praticiens where user_id = q.user_id;
  return jsonb_build_object('cabinet', cab, 'rempli', q.rempli_le is not null, 'expire_le', q.expire_le);
end $$;

create or replace function public.questionnaire_envoyer(p_jeton uuid, p_reponses jsonb)
returns jsonb language plpgsql volatile security definer set search_path to '' as $$
declare q public.questionnaires_client;
begin
  if p_reponses is null or jsonb_typeof(p_reponses) <> 'object' then return jsonb_build_object('erreur', 'vide'); end if;
  if pg_column_size(p_reponses) > 150000 then return jsonb_build_object('erreur', 'trop-long'); end if;
  select * into q from public.questionnaires_client where jeton = p_jeton for update;
  if not found or q.expire_le < now() then return jsonb_build_object('erreur', 'lien'); end if;
  if q.rempli_le is not null then return jsonb_build_object('erreur', 'deja'); end if;
  update public.questionnaires_client set reponses = p_reponses, rempli_le = now() where jeton = p_jeton;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.questionnaire_ouvrir(uuid) from public;
revoke all on function public.questionnaire_envoyer(uuid, jsonb) from public;
grant execute on function public.questionnaire_ouvrir(uuid) to anon, authenticated;
grant execute on function public.questionnaire_envoyer(uuid, jsonb) to anon, authenticated;
